'use client';

import { Loader2 } from 'lucide-react';

const StickyCTA = () => {
  const scrollToTranscription = () => {
    const section = document.getElementById('transcription-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full px-4 md:w-auto md:left-auto md:right-8 md:bottom-8 md:translate-x-0">
      <div className="bg-white p-2 rounded-lg shadow-lg flex items-center justify-center">
        <button
          type="button"
          onClick={scrollToTranscription}
          className="flex items-center justify-center px-6 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 transition-transform"
        >
          Transcribe for free
        </button>
      </div>
    </div>
  );
};

export default StickyCTA;