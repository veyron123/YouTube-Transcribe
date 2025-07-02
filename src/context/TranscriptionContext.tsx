'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface TranscriptionContextType {
  transcript: string;
  isLoading: boolean;
  error: string | null;
  getTranscript: (url: string, lang: string) => Promise<void>;
  clearTranscript: () => void;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(
  undefined
);

export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTranscript = async (url: string, lang: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript("");

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, lang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setTranscript(data.transcript);
      toast.success('Transcription successful!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setError(null);
  }

  return (
    <TranscriptionContext.Provider value={{ transcript, isLoading, error, getTranscript, clearTranscript }}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};