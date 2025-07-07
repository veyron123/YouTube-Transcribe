import { NextRequest, NextResponse } from 'next/server';
// import { anonymousRateLimiter } from "@/lib/rate-limiter"; // Временно отключено для локальной разработки
import YTDlpWrap from 'yt-dlp-wrap';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface TranscriptEntry {
  timestamp: string;
  text: string;
}

function cleanVtt(vttContent: string): TranscriptEntry[] {
  const lines = vttContent
    .split('\n')
    .filter(line => {
      const trimmedLine = line.trim();
      return (
        trimmedLine.length > 0 &&
        !trimmedLine.startsWith('WEBVTT') &&
        !trimmedLine.startsWith('Kind:') &&
        !trimmedLine.startsWith('Language:') &&
        !trimmedLine.includes('-->')
      );
    })
    .map(line => line.replace(/<[^>]*>/g, '').trim());

  const uniqueLines = [...new Set(lines)];
  const text = uniqueLines.join(' ');

  // Remove consecutive duplicate words
  const cleanedText = text.replace(/(\b\w+\b)( \1)+/g, '$1');

  return [{ timestamp: '', text: cleanedText }];
}

async function waitForFile(filePath: string, retries = 5, delay = 300): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.access(filePath);
      return;
    } catch (error) {
      if (i === retries - 1) {
        throw new Error(`File not found after ${retries} retries: ${filePath}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(req: NextRequest) {
  console.log('[TRANSCRIBE_LOG] === NEW REQUEST STARTED ===');
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  console.log('[TRANSCRIBE_LOG] Request IP:', ip);
  
  // Временно отключаем rate limiter для локальной разработки
  if (process.env.NODE_ENV === 'production') {
    // В продакшене нужно будет настроить переменные окружения для Redis
    console.log('[TRANSCRIBE_LOG] Rate limiting disabled in development mode');
    // const { success } = await anonymousRateLimiter.limit(ip);
    // if (!success) {
    //   console.log('[TRANSCRIBE_LOG] Rate limit exceeded for IP:', ip);
    //   return NextResponse.json(
    //     { error: "Too many requests. Please try again later." },
    //     { status: 429 }
    //   );
    // }
  } else {
    console.log('[TRANSCRIBE_LOG] Rate limiting disabled in development mode');
  }

  let lang: string = 'en';
  try {
    console.log('[TRANSCRIBE_LOG] Parsing request body...');
    const body = await req.json();
    const url = body.url;
    lang = body.lang || 'en';
    console.log('[TRANSCRIBE_LOG] Request data:', { url, lang });

    if (!url) {
      console.log('[TRANSCRIBE_LOG] ERROR: URL is missing');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      console.log('[TRANSCRIBE_LOG] ERROR: Invalid YouTube URL:', url);
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const videoId = uuidv4();
    const outputDir = '/tmp';
    const outputTemplate = path.join(outputDir, videoId);
    const outputPath = `${outputTemplate}.${lang}.vtt`;
    console.log('[TRANSCRIBE_LOG] Generated paths:', { videoId, outputDir, outputPath });

    console.log('[TRANSCRIBE_LOG] Creating output directory...');
    await fs.mkdir(outputDir, { recursive: true });

    const args = [
      '--write-auto-sub',
      '--sub-lang', lang,
      '--skip-download',
      '-o', `${outputTemplate}.%(ext)s`,
      url
    ];

    const ytDlpWrap = new YTDlpWrap();
    await ytDlpWrap.exec(args)
      .on('ytDlpEvent', (eventType: string, eventData: string) => console.log(`[yt-dlp-wrap] ${eventType}:`, eventData))
      .on('error', (error: Error) => console.error('[yt-dlp-wrap] error:', error))
      .on('close', (code: number | null) => console.log('[yt-dlp-wrap] exited with code', code));
    console.log('[TRANSCRIBE_LOG] yt-dlp execution finished. Waiting for file...');

    await waitForFile(outputPath);
    console.log(`[TRANSCRIBE_LOG] File found: ${outputPath}. Reading content...`);

    const vttContent = await fs.readFile(outputPath, 'utf-8');
    console.log('[TRANSCRIBE_LOG] VTT content length:', vttContent.length);
    console.log('[TRANSCRIBE_LOG] VTT content preview:', vttContent.substring(0, 200));
    
    console.log('[TRANSCRIBE_LOG] Cleaning up file...');
    await fs.unlink(outputPath);

    console.log('[TRANSCRIBE_LOG] Processing VTT content...');
    const transcriptEntries = cleanVtt(vttContent);
    console.log('[TRANSCRIBE_LOG] Parsed transcript entries:', transcriptEntries.length);
    const fullText = transcriptEntries.map(entry => entry.text).join(' ');
    console.log('[TRANSCRIBE_LOG] Final transcript length:', fullText.length);

    console.log('[TRANSCRIBE_LOG] === REQUEST COMPLETED SUCCESSFULLY ===');
    return NextResponse.json({ transcript: fullText });

  } catch (error) {
    console.error('[TRANSCRIBE_LOG] === ERROR OCCURRED ===');
    console.error('[TRANSCRIBE_LOG] Error details:', error);
    console.error('[TRANSCRIBE_LOG] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[TRANSCRIBE_LOG] Error message:', errorMessage);

    if (errorMessage.includes('Unsupported URL')) {
      console.log('[TRANSCRIBE_LOG] Returning unsupported URL error');
      return NextResponse.json({ error: 'Неверный URL YouTube.' }, { status: 400 });
    }

    if (errorMessage.includes('subtitles not available')) {
      console.log('[TRANSCRIBE_LOG] Returning no subtitles error');
      return NextResponse.json({ error: `Для этого видео нет субтитров на выбранном языке (${lang}).` }, { status: 404 });
    }

    console.log('[TRANSCRIBE_LOG] Returning generic 500 error');
    return NextResponse.json({ error: 'Не удалось обработать запрос.' }, { status: 500 });
  }
}