'use client';

import { useState } from 'react';

type ShareButtonProps = {
  imageUrl: string;
};

export default function ShareButton({ imageUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this AI image!',
      text: 'See the prompt behind this masterpiece!',
      url: window.location.href,
    };

    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share, or error occurred (fall back to copy)
        handleCopyLink();
      }
    } else {
      // Fallback: Copy link to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full 
        transition-all duration-300
        ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-white/10 text-gray-300 hover:bg-pink-500 hover:text-white border border-white/10 hover:border-pink-500'
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.28.688.28 1.093s-.1.77-.28 1.093m0-2.186l9.566-5.463m-9.566 10.926l9.566 5.463M16.22 9.475a2.25 2.25 0 1 0 0-4.438 2.25 2.25 0 0 0 0 4.438ZM16.22 19.912a2.25 2.25 0 1 0 0-4.438 2.25 2.25 0 0 0 0 4.438Z"
        />
      </svg>
      {copied ? 'Link Copied!' : 'Share'}
    </button>
  );
}