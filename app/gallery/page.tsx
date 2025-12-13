// app/gallery/page.ts
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import TagsFilter from '../../components/TagsFilter';
import Footer from '../../components/Footer';
import TouchHearts from '../../components/TouchHearts';

// --- Types ---
type ImageRow = {
  id: string;
  public_id: string;
  url: string;
  thumb_url: string | null;
  prompt: string;
  created_at: string;
  tags: string[] | null;
};

// --- Isolated Components for Cleaner Structure ---
const ErrorState = () => (
  <main className="min-h-screen p-6 flex items-center justify-center bg-gray-950 text-white">
    <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-950/30 border border-red-900/50">
      <h1 className="text-3xl font-bold mb-4 text-red-400">PromptGallery</h1>
      <p className="text-red-200">
        🚨 Failed to load images from database. Please check connectivity or logs.
      </p>
    </div>
  </main>
);

const EmptyState = () => (
  <section className="rounded-2xl bg-white/5 p-12 sm:p-16 text-center shadow-2xl border border-white/10 backdrop-blur-sm">
    <div className="text-5xl mb-4">🎨</div>
    <h2 className="text-2xl font-bold text-white mb-3">
      Gallery Awaits Creation
    </h2>
    <p className="mt-2 text-base text-gray-300 max-w-md mx-auto">
      The gallery is empty. Generate your first masterpiece to begin populating this space!
    </p>
  </section>
);

const NoResultsState = ({ tag }: { tag: string }) => (
  <section className="rounded-2xl bg-white/5 p-12 text-center shadow-2xl border border-white/10 backdrop-blur-sm">
    <div className="text-4xl mb-4">🔍</div>
    <h2 className="text-xl font-bold text-white mb-2">No Images Found</h2>
    <p className="text-gray-300">
      We couldn't find any images tagged with <span className="font-semibold text-pink-400">"{tag}"</span>.
    </p>
  </section>
);

// --- New Explore Divider Component ---
const ExploreDivider = () => (
  <div className="flex items-center justify-center w-full py-8">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-gray-500 max-w-[150px] sm:max-w-xs opacity-50" />
    <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-[0.3em]">
      Explore
    </span>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-700 to-gray-500 max-w-[150px] sm:max-w-xs opacity-50" />
  </div>
);

// --- MODIFIED GalleryHeader Component (Fixed spacing) ---
const GalleryHeader = ({ count, selectedTag }: { count: number, selectedTag: string | undefined }) => (
  <>
    {/* 1. Sticky Title Header - Centering fixed, respecting page padding */}
    <header className="sticky top-0 z-20 w-full backdrop-blur-md bg-gray-950/70 border-b border-white/5 py-4">
      {/* Container respects max-width and center-aligns its children */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-center sm:justify-between px-4 sm:px-12">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          Phexara 🎨
        </h1>
        {/* Count Badge (Visible only on medium/larger screens) */}
        <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-gray-300 hidden sm:inline-block">
          {count.toLocaleString()} Total Generations
        </span>
      </div>
    </header>

    {/* 2. Description Card - Reduced mb-10 to mb-6 for smaller gap */}
    <section className="mt-8 mb-6 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm mx-4 sm:mx-auto max-w-4xl text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
        Discover the Creative Prompts
      </h2>
      <p className="text-sm sm:text-base text-gray-300">
        Browse a collection of 1000+ masterpieces and discover the creative prompts behind them.
      </p>
    </section>
  </>
);

// --- The Enhanced Image Card ---
const GalleryCard = ({ img }: { img: ImageRow }) => (
  <article
    className="
      group relative rounded-xl overflow-hidden 
      shadow-lg hover:shadow-2xl hover:shadow-purple-500/20
      bg-gray-900 border border-white/5
      transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
      hover:-translate-y-1
    "
  >
    <Link href={`/gallery/${img.id}`} className="block h-full">
      <div className="relative w-full aspect-square bg-gray-950 overflow-hidden">
        <Image
          src={img.thumb_url ?? img.url}
          alt={img.prompt ?? 'AI image'}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-700 ease-in-out group-hover:scale-110"
          priority={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10">
        <div className="text-left">
          <p
            title={img.prompt}
            className="text-sm font-medium text-white leading-snug"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {img.prompt}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
            <span>{new Date(img.created_at).toISOString().slice(0, 10)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-pink-400/70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  </article>
);

// --- Main Page Component ---
// Revalidate ISR
export const revalidate = 60; // ISR: revalidate every 60s

export default async function GalleryPage(props: { searchParams: Promise<{ tag?: string; page?: string; pageSize?: string }> }) {
  const searchParams = await props.searchParams;
  const selectedTag = searchParams.tag;

  // Pagination defaults
  const page = Math.max(Number(searchParams.page ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.pageSize ?? '60'), 12), 120); // clamp between 12 and 120
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Build the base query:
  // Single query returns requested rows + exact count for pagination UI
  let query = supabase
    .from('images')
    .select('id, public_id, url, thumb_url, prompt, created_at, tags', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (selectedTag) {
    // Use array contains operator for tag filtering
    query = query.contains('tags', [selectedTag]);
  }

  const res = await query;
  const images = (res.data as ImageRow[]) ?? [];
  const error = res.error;
  const totalCount = res.count ?? 0;

  if (error) {
    console.error('Supabase fetch error (gallery):', error);
    return <ErrorState />;
  }

  // Compute uniqueTags from the images we fetched (single pass)
  const uniqueTags = Array.from(
    new Set(
      images
        .flatMap((row) => row.tags ?? [])
        .filter(Boolean)
    )
  ).sort();

  const hasImages = images.length > 0;
  const displayCount = images.length;

  return (
    <>
      <TouchHearts />
      {/* Sticky Header is outside main for better fixed behavior */}
      <GalleryHeader count={totalCount} selectedTag={selectedTag} /> 

      {/* Main content area */}
      <main className="min-h-screen p-4 sm:p-12 bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950 pt-0">
        <div className="max-w-[1400px] mx-auto">
          {/* Spacer adjusted to ensure content starts below the description card (approx 90px total height) */}
          <div className="h-[8px] block" aria-hidden="true" />
          
          {/* Tags filter is placed after the description card and spacer */}
          <section className="mb-1">
            <TagsFilter uniqueTags={uniqueTags} selectedTag={selectedTag} />
          </section>

          {/* --- Divider --- */}
          <ExploreDivider />

          <section>
            {!hasImages ? (
              selectedTag ? (
                // State: Filter selected but no images found
                <NoResultsState tag={selectedTag} />
              ) : (
                // State: Database is completely empty
                <EmptyState />
              )
            ) : (
              <>
                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-8">
                  {images.map((img) => (
                    <GalleryCard key={img.id} img={img} />
                  ))}
                </div>

                {/* --- Simple Load More (server-side) --- */}
                <div className="mt-16 text-center w-full">
                  <div className="mx-auto max-w-md">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4 mx-auto" />

                    <p className="text-sm text-gray-300 mb-2">
                      Showing <span className="font-semibold text-white">{displayCount}</span> of{' '}
                      <span className="font-semibold text-white">{totalCount.toLocaleString()}</span> generations
                      {selectedTag && <span className="text-pink-400"> (filtered by "{selectedTag}")</span>}
                    </p>

                    <div className="flex items-center justify-center gap-3 mt-3">
                      {end + 1 < totalCount ? (
                        <Link
                          href={`/gallery?${new URLSearchParams(
                            Object.fromEntries(
                              [
                                selectedTag ? ['tag', selectedTag] : null,
                                ['page', String(page + 1)],
                                ['pageSize', String(pageSize)], // keep pageSize same (60 by default)
                              ].filter(Boolean) as string[][]
                            )
                          ).toString()}`}
                          className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-sm text-white"
                        >
                          Next
                        </Link>
                      ) : (
                        <button className="px-4 py-2 rounded bg-gray-800/40 text-sm cursor-not-allowed" disabled>
                          No more
                        </button>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      Page {page} · {pageSize} per page
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}