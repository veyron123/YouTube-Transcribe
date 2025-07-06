'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranscription } from '@/context/TranscriptionContext';

const YTInput = () => {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('en');

  // Set default language on mount
  useState(() => {
    setLang('en');
  });
  const { getTranscript, isLoading, error } = useTranscription();

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  const isValidUrl = youtubeRegex.test(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl) {
      await getTranscript(url, lang);
    }
  };

  const handleButtonClick = () => {
    if (!isValidUrl) {
      toast.error('Please enter a valid YouTube URL.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-lg p-2">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-grow w-full">
              <label htmlFor="youtube-url" className="sr-only">
                YouTube URL
              </label>
              <input
                id="youtube-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
                aria-label="YouTube URL"
                className="w-full px-4 py-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <label htmlFor="language-select" className="sr-only">
                  Select language
                </label>
                <select
                  id="language-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="appearance-none w-32 pl-4 pr-10 py-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow text-black dark:text-white"
                  aria-label="Select language"
                >
                  <option className="text-black" value="en">English</option>
                  <option className="text-black" value="ru">Русский</option>
                  <option className="text-black" value="de">Deutsch</option>
                  <option className="text-black" value="es">Español</option>
                  <option className="text-black" value="fr">Français</option>
                </select>
              </div>
              <button
                type="submit"
                onClick={handleButtonClick}
                disabled={isLoading || !isValidUrl}
                aria-label={isLoading ? 'Transcribing' : 'Transcribe'}
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 text-lg text-white font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  'Transcribe'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mt-4 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default YTInput;
