// components/GeminiButton.tsx
import Link from 'next/link';

// We keep the prop for structural consistency, 
// though we aren't using it in the URL anymore.
type GeminiButtonProps = {
  prompt?: string; 
};

export default function GeminiButton({ prompt }: GeminiButtonProps) {
  // Direct link to the Gemini interface
  const geminiUrl = "https://gemini.google.com/app";

  return (
    <Link
      href={geminiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-colors duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M10.84 4.502a.75.75 0 0 0-1.298.583l.256 1.156A5.5 5.5 0 0 0 5 12a5.5 5.5 0 0 0 5.598 5.811l-.256 1.156a.75.75 0 0 0 1.298.583 10.5 10.5 0 0 0 11.16-11.75c-1.396-5.83-6.195-9.75-11.418-9.75ZM6 12a.75.75 0 0 1 1.5 0v.008a.75.75 0 0 1-1.5 0V12Zm4.5 0a.75.75 0 0 1 1.5 0v.008a.75.75 0 0 1-1.5 0V12Zm4.5 0a.75.75 0 0 1 1.5 0v.008a.75.75 0 0 1-1.5 0V12Z"
          clipRule="evenodd"
        />
      </svg>
      Go to Gemini
    </Link>
  );
}