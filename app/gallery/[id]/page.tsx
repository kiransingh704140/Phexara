// app/gallery/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
// Ensure these components exist and are styled as previously defined
import PromptCopyButton from '../../../components/PromptCopyButton';
import ShareButton from '../../../components/ShareButton'; 
import GeminiButton from '../../../components/GeminiButton'; 
import PromptText from '../../../components/PromptText'; 
import Footer from '../../../components/Footer';

// --- Types ---
type ImageRow = {
  id: string;
  public_id: string;
  url: string;
  thumb_url: string | null;
  prompt: string;
  created_at: string;
  width?: number | null;
  height?: number | null;
};

export const revalidate = 60;

// --- Helper Components ---

/**
 * MODIFIED Header Component: Only includes the sticky title bar for branding context.
 */
const DetailHeader = () => (
  <header className="sticky top-0 z-20 w-full backdrop-blur-md bg-gray-950/70 border-b border-white/5 py-4">
    {/* Container respects max-width and center-aligns its children */}
    <div className="max-w-[1400px] mx-auto flex items-center justify-center sm:justify-between px-4 sm:px-12">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        Phexara 🎨
      </h1>
      {/* Spacer or optional secondary element (removed count for detail page) */}
      <div className="hidden sm:inline-block w-24"></div> 
    </div>
  </header>
);

const NotFoundState = ({ message }: { message: string }) => (
  <main className="min-h-screen flex items-center justify-center p-6 bg-gray-950 text-white">
    <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm shadow-2xl">
      <div className="text-4xl mb-4">🔍</div>
      <h1 className="text-xl font-bold text-white mb-2">Image Not Found</h1>
      <p className="text-gray-400 text-sm">{message}</p>
      <Link
        href="/gallery"
        className="mt-6 inline-block px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
      >
        Return to Gallery
      </Link>
    </div>
  </main>
);

const BackButton = () => (
  <Link
    href="/gallery"
    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    Back to gallery
  </Link>
);

// --- Main Page Component ---

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) return <NotFoundState message="No image ID provided in the URL." />;

  const { data, error } = await supabase.from('images').select('*').eq('id', id).single();

  if (error || !data) {
    console.error('Supabase fetch (image):', error);
    return <NotFoundState message={`Could not find image with ID: ${id}`} />;
  }

  const image = data as ImageRow;

  return (
    <>
      <DetailHeader /> {/* ADDED STICKY HEADER */}
      <main className="min-h-screen p-6 sm:p-12 bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
        <div className="max-w-[1400px] mx-auto">

          <BackButton />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* --- Left Column: The Image --- */}
            <div className="lg:col-span-2">
              <div className="relative w-full rounded-2xl bg-black/40 border border-white/10 overflow-hidden shadow-2xl">
                {/* Image Container */}
                <div className="relative h-[60vh] sm:h-[70vh] w-full">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* --- Right Column: The Details/Prompt --- */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">

                {/* Prompt Card */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                      Prompt Details
                    </h2>
                  </div>

                  <div className="relative bg-black/30 rounded-xl p-4 border border-white/5">
                    
                    {/* Prompt Text with Show More/Less functionality */}
                    <PromptText prompt={image.prompt} />

                    {/* Button Row: Copy, Share, Gemini (Consistent alignment) */}
                    <div className="mt-4 flex flex-wrap justify-end gap-3 pt-4 border-t border-white/10 -mx-4 px-4">
                      
                      {/* 1. Primary Action: Create with Gemini (Prominent styling) */}
                      <GeminiButton />
                      
                      {/* 2. Secondary Actions */}
                      <PromptCopyButton prompt={image.prompt} />
                      <ShareButton imageUrl={image.url} /> 
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-500">Created</span>
                      <span className="text-sm text-gray-300">
                        {new Date(image.created_at).toISOString().slice(0, 10)}
                      </span>
                    </div>
                    {/* Optional: If width/height exist in DB */}
                    {(image.width && image.height) && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-gray-500">Dimensions</span>
                        <span className="text-sm text-gray-300">{image.width} x {image.height}</span>
                      </div>
                    )}
                  </div>

                  {/* Pro Tip */}
                  <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs text-indigo-200/80 leading-relaxed">
                      <span className="font-semibold text-indigo-300">💡 Pro Tip:</span> Copy this prompt and try modifying the adjectives to create your own unique variation.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}