// app/admin/manage/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminManagePage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Initial load
    const [loadingMore, setLoadingMore] = useState(false); // Pagination load
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Initial fetch
    useEffect(() => {
        fetchImages(1, true);
    }, []);

    const fetchImages = async (pageToFetch: number, reset = false) => {
        if (!reset) setLoadingMore(true);
        
        try {
            const res = await fetch(`/api/images?page=${pageToFetch}&limit=24`, { cache: 'no-store' });
            
            if (!res.ok) throw new Error(`Error: ${res.statusText}`);

            const { data, metadata } = await res.json();
            
            if (reset) {
                setImages(data || []);
            } else {
                setImages(prev => [...prev, ...(data || [])]);
            }
            
            setHasMore(metadata.hasMore);
            setPage(pageToFetch);

        } catch (e) { 
            console.error("Failed to load images:", e); 
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchImages(page + 1);
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to delete this image?")) return;
        
        try {
            const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setImages(prev => prev.filter(img => img.id !== id));
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    };

    return (
        <main className="min-h-screen p-6 sm:p-12 bg-gray-950 text-white">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
                        Manage Gallery
                    </h1>
                    <Link href="/admin/upload" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">
                        + New Upload
                    </Link>
                </header>

                {/* Main Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.length === 0 ? (
                                <p className="text-gray-400 col-span-full text-center py-10">No images found.</p>
                            ) : (
                                images.map((img) => (
                                    <div key={img.id} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-indigo-500/30 transition-all">
                                        <div className="relative h-48 w-full bg-black/50">
                                            <Image 
                                                src={img.url} 
                                                alt="admin preview" 
                                                fill 
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                style={{objectFit: 'cover'}} 
                                            />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <p className="text-sm text-gray-300 line-clamp-2 mb-4 flex-1 font-medium">{img.prompt}</p>
                                            <div className="flex gap-2 mt-auto">
                                                <Link 
                                                    href={`/admin/edit/${img.id}`}
                                                    className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition text-gray-200"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(img.id)}
                                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Load More Button */}
                        {hasMore && images.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {loadingMore ? 'Loading...' : 'Load More Images'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}