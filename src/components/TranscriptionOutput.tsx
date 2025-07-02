'use client';

import { Copy, Download, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranscription } from '@/context/TranscriptionContext';

const TranscriptionOutput = () => {
  const { transcript } = useTranscription();

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript).then(
      () => {
        toast.success('Transcript copied!');
      },
      (err) => {
        toast.error('Failed to copy transcript.');
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleDownloadTranscript = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Transcript downloaded!');
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={handleCopyTranscript}
            disabled={!transcript}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={16} />
            Copy Transcript
          </button>
          <button
            onClick={handleDownloadTranscript}
            disabled={!transcript}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Download
          </button>
        </div>
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 h-96 overflow-y-auto">
        {transcript ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        ) : (
          <p className="text-gray-500 text-center leading-relaxed">
            Ваша транскрипция появится здесь...
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptionOutput;