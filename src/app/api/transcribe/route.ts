import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface TranscriptEntry {
  timestamp: string;
  text: string;
}

function cleanVtt(vttContent: string): TranscriptEntry[] {
  const lines = vttContent.split('\n');
  const transcript: TranscriptEntry[] = [];
  let currentTimestamp = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('WEBVTT') || line.startsWith('Kind: captions') || line.length === 0) {
      continue;
    }

    if (line.includes('-->')) {
      currentTimestamp = line.split(' --> ')[0].split('.')[0];
      // Skip the timestamp line and process the text line(s) after it
      let textContent = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim().length > 0 && !lines[j].includes('-->')) {
        textContent += lines[j].trim().replace(/<[^>]*>/g, '') + ' ';
        j++;
      }
      i = j - 1; // Move the outer loop index forward

      if (textContent.length > 0 && !/\[.*\]/.test(textContent)) {
        // Check for and merge with the previous entry if timestamps are close
        if (transcript.length > 0 && transcript[transcript.length - 1].timestamp === currentTimestamp) {
          transcript[transcript.length - 1].text += textContent.trim();
        } else {
          transcript.push({
            timestamp: currentTimestamp,
            text: textContent.trim(),
          });
        }
      }
    }
  }

  // A final pass to merge lines that might have been split weirdly
  const mergedTranscript: TranscriptEntry[] = [];
  if (transcript.length > 0) {
    mergedTranscript.push(transcript[0]);
    for (let i = 1; i < transcript.length; i++) {
      const last = mergedTranscript[mergedTranscript.length - 1];
      const current = transcript[i];
      if (last.text.trim() === current.text.trim()) {
        continue; // Skip duplicate text entries
      }
      mergedTranscript.push(current);
    }
  }


  return mergedTranscript;
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
  let lang: string = 'en';
  try {
    const body = await req.json();
    const url = body.url;
    lang = body.lang || 'en';

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const videoId = uuidv4();
    const outputDir = path.join(process.cwd(), 'tmp');
    const outputTemplate = path.join(outputDir, videoId);
    const outputPath = `${outputTemplate}.${lang}.vtt`;

    await fs.mkdir(outputDir, { recursive: true });

    const args = [
      '--write-auto-sub',
      '--sub-lang', lang,
      '--skip-download',
      '-o', `${outputTemplate}.%(ext)s`,
      url
    ];

    console.log(`[TRANSCRIBE_LOG] Executing yt-dlp with args: ${args.join(' ')}`);
    const execution = () => new Promise((resolve, reject) => {
      execFile('yt-dlp', args, (error: Error | null, stdout: string, stderr: string) => {
        console.log('[TRANSCRIBE_LOG] yt-dlp stdout:', stdout);
        console.error('[TRANSCRIBE_LOG] yt-dlp stderr:', stderr);
        if (error) {
          return reject(new Error(`Error executing yt-dlp: ${stderr || error.message}`));
        }
        resolve(stdout);
      });
    });

    await execution();
    console.log('[TRANSCRIBE_LOG] yt-dlp execution finished. Waiting for file...');

    await waitForFile(outputPath);
    console.log(`[TRANSCRIBE_LOG] File found: ${outputPath}. Reading content...`);

    const vttContent = await fs.readFile(outputPath, 'utf-8');
    console.log('[TRANSCRIBE_LOG] VTT content length:', vttContent.length);
    await fs.unlink(outputPath);

    const transcriptEntries = cleanVtt(vttContent);
    console.log('[TRANSCRIBE_LOG] Parsed transcript entries:', transcriptEntries.length);
    const fullText = transcriptEntries.map(entry => entry.text).join(' ');

    return NextResponse.json({ transcript: fullText });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    if (errorMessage.includes('Unsupported URL')) {
      return NextResponse.json({ error: 'Неверный URL YouTube.' }, { status: 400 });
    }

    if (errorMessage.includes('subtitles not available')) {
      return NextResponse.json({ error: `Для этого видео нет субтитров на выбранном языке (${lang}).` }, { status: 404 });
    }

    return NextResponse.json({ error: 'Не удалось обработать запрос.' }, { status: 500 });
  }
}