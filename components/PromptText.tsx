'use client';

import { useState } from 'react';

const MAX_VISIBLE_LENGTH = 250; // The maximum length of the prompt to show initially

export default function PromptText({ prompt }: { prompt: string }) {
  const [isExpanded, setIsExpanded] = useState(prompt.length <= MAX_VISIBLE_LENGTH);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText = prompt.substring(0, MAX_VISIBLE_LENGTH) + '...';
  const displayText = isExpanded ? prompt : truncatedText;

  const needsToggle = prompt.length > MAX_VISIBLE_LENGTH;

  return (
    <>
      <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-light">
        {displayText}
      </p>

      {needsToggle && (
        <button
          onClick={toggleExpansion}
          className="mt-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="full-prompt-text"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </>
  );
}