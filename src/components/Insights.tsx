"use client";

import { useState } from "react";
import { useTranscription } from "@/context/TranscriptionContext";
import toast from "react-hot-toast";

const actionQueries: Record<string, string> = {
  "Key Quotes": "Extract the key quotes from the following transcript:",
  "Study Guide": "Create a comprehensive study guide based on the following transcript:",
  "Q&A": "Generate a list of questions and their answers based on the following transcript:",
  "Quiz": "Create a multiple-choice quiz with answers based on the following transcript:",
  "Flash Cards": "Create a set of flash cards (term and definition) from the following transcript:",
  "Highlights": "Provide the main highlights of the following transcript:",
};

export default function Insights() {
  const { transcript } = useTranscription();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleApiCall = async (apiQuery: string) => {
    if (!apiQuery.trim() || !transcript.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, query: apiQuery }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred.");
      }
      setResult(data.text);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      setResult(`An error occurred: ${errorMessage}`);
    }
    setLoading(false);
  };

  const handleActionClick = (action: string) => {
    const actionQuery = actionQueries[action];
    if (actionQuery) {
      handleApiCall(actionQuery);
    }
  };
  
  const handleSummarize = () => {
    handleApiCall("Summarize the following transcript.");
  };

  const handleChat = () => {
    handleApiCall(query);
  };

  const handleDownload = () => {
    if (!result.trim()) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
a.href = url;
    a.download = "insights.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Insights downloaded!");
  };

  const handleCopy = () => {
    if (!result.trim()) return;
    navigator.clipboard.writeText(result).then(() => {
      toast.success("Insights copied!");
    }, () => {
      toast.error("Failed to copy insights.");
    });
  };

  const isTranscriptEmpty = transcript.trim() === '';

  return (
    <div className="w-full mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Insights & Actions
        </h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chat with the transcript"
            className="flex-grow p-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isTranscriptEmpty || loading}
          />
          <button
            onClick={handleChat}
            className="px-4 py-2 text-white font-semibold rounded-r-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isTranscriptEmpty || loading || !query.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
        <div className="flex justify-start mb-4">
          <button
            onClick={handleSummarize}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isTranscriptEmpty || loading}
          >
            {loading ? "Summarizing..." : "Summarize Transcript"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {Object.keys(actionQueries).map((action) => (
            <button
              key={action}
              onClick={() => handleActionClick(action)}
              className="px-4 py-2 text-white font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all disabled:bg-gray-400"
              disabled={isTranscriptEmpty || loading}
            >
              {loading ? `...` : action}
            </button>
          ))}
        </div>
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">
              Result:
            </h3>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full h-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 whitespace-pre-wrap"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="mt-2 px-4 py-2 text-white font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                disabled={!result.trim()}
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                className="mt-2 px-4 py-2 text-white font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                disabled={!result.trim()}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}