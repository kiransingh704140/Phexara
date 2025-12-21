'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';

type TagsFilterProps = {
  uniqueTags: string[];
  selectedTag?: string;
};

export default function TagsFilter({ uniqueTags, selectedTag }: TagsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const createQueryString = useCallback(
    (tagValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // ✅ Always reset pagination when changing tag
      params.delete('page');

      if (tagValue) {
        params.set('tag', tagValue);
      } else {
        params.delete('tag');
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleTagClick = (tag: string) => {
    const newTag = tag === selectedTag ? '' : tag;
    router.push(`/gallery?${createQueryString(newTag)}`, { scroll: false });
  };


  // Styles
  const tagBaseClass = "px-5 py-2 text-sm rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap border select-none";
  // Active: Glowy & distinct
  const activeClass = "bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] transform scale-105";
  // Inactive: Muted, blends in
  const inactiveClass = "bg-gray-900/50 text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-gray-800";

  if (uniqueTags.length === 0 && !selectedTag) return null;

  return (
    <div className="relative w-full max-w-[1400px] mx-auto group">

      {/* Left Fade Gradient (Visual cue) */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar Firefox/IE
      >
        {/* 'All' / Clear Filter Option (Always first) */}
        <button
          onClick={() => handleTagClick(selectedTag || '')}
          className={`${tagBaseClass} ${!selectedTag ? activeClass : inactiveClass}`}
        >
          ✨ All
        </button>

        {/* Dynamic Tags */}
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`${tagBaseClass} ${tag === selectedTag ? activeClass : inactiveClass}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right Fade Gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
    </div>
  );
}