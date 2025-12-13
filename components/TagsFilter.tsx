// components/TagsFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type TagsFilterProps = {
  uniqueTags: string[];
  selectedTag?: string;
};

export default function TagsFilter({ uniqueTags, selectedTag }: TagsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Utility to create/update URL with new query parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleTagClick = (tag: string) => {
    // If the clicked tag is already selected, clear the filter (set tag to '')
    const newTag = tag === selectedTag ? '' : tag;
    
    // Navigate to the new URL with the updated 'tag' query parameter
    router.push(`/gallery?${createQueryString('tag', newTag)}`, { scroll: false });
  };

  const tagBaseClass = "px-4 py-2 text-sm rounded-full font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1";
  const activeClass = "bg-indigo-600 text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500";
  const inactiveClass = "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-white/10";
  const clearFilterClass = "px-4 py-2 text-sm rounded-full font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 border border-pink-500/20 flex items-center gap-1";


  if (uniqueTags.length === 0 && !selectedTag) {
    return <p className="text-gray-500 text-center">No tags available to filter.</p>;
  }

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner backdrop-blur-sm mx-0 sm:mx-0">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Filter by Tag</h3>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
        
        {/* Clear Filter Button */}
        {selectedTag && (
             <button
               onClick={() => handleTagClick(selectedTag)} // Clicking the active tag clears the filter
               className={clearFilterClass}
             >
               Clear Filter <span className="text-pink-400">❌</span>
             </button>
        )}

        {/* Tag Buttons */}
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
    </div>
  );
}