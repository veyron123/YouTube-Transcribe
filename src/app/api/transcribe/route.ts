import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

function extractVideoId(url: string): string | null {
  const regexes = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
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

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang,
    });

    const fullText = transcript.map(entry => entry.text).join(' ');

    return NextResponse.json({ transcript: fullText });

  } catch (error) {
    console.error('[TRANSCRIBE_LOG] === ERROR OCCURRED ===');
    console.error('[TRANSCRIBE_LOG] Error details:', error);
    let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    if (errorMessage.includes('disabled on this video')) {
      errorMessage = 'Transcript is disabled for this video by the author.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}