import { NextRequest, NextResponse } from 'next/server';
// import { anonymousRateLimiter } from "@/lib/rate-limiter"; // Временно отключено для локальной разработки

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

export async function POST(req: NextRequest) {
  console.log('[TRANSCRIBE_LOG] === NEW REQUEST STARTED ===');
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  console.log('[TRANSCRIBE_LOG] Request IP:', ip);

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

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      console.log('[TRANSCRIBE_LOG] ERROR: Invalid YouTube URL:', url);
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const videoId = new URL(url).searchParams.get('v');
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const savesubsUrl = `https://savesubs.com/action/get_subtitle?video_id=${videoId}&language=${lang}&service=youtube`;
    const response = await fetch(savesubsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch subtitles from savesubs.com: ${response.statusText}`);
    }
    const vttContent = await response.text();

    const transcriptEntries = cleanVtt(vttContent);
    const fullText = transcriptEntries.map(entry => entry.text).join(' ');

    return NextResponse.json({ transcript: fullText });

  } catch (error) {
    console.error('[TRANSCRIBE_LOG] === ERROR OCCURRED ===');
    console.error('[TRANSCRIBE_LOG] Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}