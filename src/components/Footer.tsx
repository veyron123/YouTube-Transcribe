import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">YouTube Transcript</h3>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Resources</h3>
            <ul>
              <li className="mb-2"><Link href="/extract-from-channel" className="hover:text-white">Extract Transcripts from YouTube Channel</Link></li>
              <li className="mb-2"><Link href="/extract-from-playlists" className="hover:text-white">Extract Transcripts from Full Playlists</Link></li>
              <li className="mb-2"><Link href="/how-to-extract" className="hover:text-white">How to Extract</Link></li>
              <li className="mb-2"><Link href="/best-free-tools" className="hover:text-white">Best Free Tools</Link></li>
              <li><Link href="/step-by-step-guide" className="hover:text-white">Step-by-Step Guide</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
            <ul>
              <li className="mb-2"><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li className="mb-2"><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li className="mb-2"><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Get in Touch</h3>
            <p>contact@youtube-transcript.io</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>©2025 Ripple Consulting BV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;