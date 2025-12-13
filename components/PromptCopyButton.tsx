// components/PromptCopyButton.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function PromptCopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // clear timeout on unmount
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function doCopy() {
    // Clear any existing timeout
    if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
    }

    // 1. Try modern Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        timeoutRef.current = window.setTimeout(() => setCopied(false), 1600);
        return;
      } catch (err) {
        console.error('Clipboard API failed, falling back to execCommand:', err);
        // fall through to the textarea fallback
      }
    }

    // 2. Fallback using execCommand (for older / restricted browsers)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;

      // Ensure textarea is off-screen but accessible for selection
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.zIndex = '-1';
      // Set top position relative to viewport scroll for iOS compatibility
      textarea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`;

      document.body.appendChild(textarea);

      // Select and copy
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        setCopied(true);
        timeoutRef.current = window.setTimeout(() => setCopied(false), 1600);
        return;
      } else {
        throw new Error('execCommand returned false');
      }
    } catch (err) {
      console.error('Copy fallback failed:', err);
      // Fallback failed: simply let the copied state stay false and rely on user to manually copy the visible text.
    }
  }
  
  const baseClasses = 'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all duration-300';
  const defaultClasses = 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10';
  const copiedClasses = 'bg-green-600 text-white shadow-lg shadow-green-600/50';

  const Icon = copied ? (
      // Checkmark Icon
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ) : (
      // Copy Icon
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v.001A.75.75 0 0115 18a.75.75 0 01-.75-.75V15m3-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-5.25c-.966 0-1.75.784-1.75 1.75V16.5c0 .966.784 1.75 1.75 1.75h5.25A2.25 2.25 0 0015 15.75V14.25" />
      </svg>
  );

  return (
    <>
      <button
        type="button"
        onClick={doCopy}
        className={`${baseClasses} ${copied ? copiedClasses : defaultClasses}`}
        aria-label={copied ? 'Prompt copied' : 'Copy prompt'}
        title="Copy prompt to clipboard"
      >
        {Icon}
        {copied ? 'Copied!' : 'Copy'}
      </button>

      {/* Visually hidden live region for screen readers (announces when copied) */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {copied ? 'Prompt copied to clipboard' : ''}
      </span>
    </>
  );
}