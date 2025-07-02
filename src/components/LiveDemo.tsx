'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const YouTubePlayer = dynamic(() => import('react-youtube'), {
  ssr: false,
  loading: () => <div className="aspect-video w-full bg-gray-200 rounded-lg">Loading player...</div>,
});

const LiveDemo = () => {
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

  const toggleTranscript = () => {
    setIsTranscriptVisible(!isTranscriptVisible);
  };

  const videoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Интерактивное демо</h2>
      <div className="rounded-lg overflow-hidden shadow-2xl">
        <YouTubePlayer
          videoId={videoId}
          className="w-full aspect-video"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              origin: typeof window !== 'undefined' ? window.location.origin : '',
            },
          }}
        />
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={toggleTranscript}
          aria-expanded={isTranscriptVisible}
          aria-controls="transcript-panel"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isTranscriptVisible ? 'Скрыть транскрипт' : 'Посмотреть транскрипт'}
        </button>
      </div>
      <div
        id="transcript-panel"
        className={`transition-[max-height] duration-700 ease-in-out overflow-hidden ${
          isTranscriptVisible ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        <div className="mt-4 p-6 bg-gray-50 border rounded-lg">
          <p className="text-gray-600">
            We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinkin' of
You wouldn't get this from any other guy
I just wanna tell you how I'm feeling
Gotta make you understand
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;