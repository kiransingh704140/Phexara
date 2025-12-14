// app/admin/edit/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function EditImagePage(props: { params: Promise<{ id: string }> }) {
    // Unwrap params in Next.js 15+
    const params = use(props.params);
    const id = params.id;
    
    const router = useRouter();

    const [imageUrl, setImageUrl] = useState('');
    const [prompt, setPrompt] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/images/${id}`);
                if (!res.ok) throw new Error('Failed to load image data');
                const data = await res.json();
                
                setImageUrl(data.url);
                setPrompt(data.prompt || '');
                // Convert array of tags back to comma string for input
                setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Prepare tags array
        const tagsArray = tags
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        try {
            const res = await fetch(`/api/images/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, tags: tagsArray })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Update failed');
            }

            // Redirect back to manage page on success
            router.push('/admin/manage');
            router.refresh(); // Refresh server components if any
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    const inputClass = "w-full mt-2 p-3 bg-black/20 text-white placeholder-gray-500 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
    const labelClass = "block text-sm font-medium text-gray-300";

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;

    return (
        <main className="min-h-screen p-6 sm:p-12 bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/admin/manage"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Management
                </Link>

                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                        Edit Metadata ✏️
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Preview Side */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl h-fit">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Original Image (Read Only)</label>
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/50">
                            {imageUrl && <Image src={imageUrl} alt="Edit preview" fill style={{ objectFit: 'contain' }} />}
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md h-fit">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            
                            {/* Prompt */}
                            <div>
                                <label className={labelClass}>Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className={inputClass}
                                    rows={8}
                                    required
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className={labelClass}>Tags (comma separated)</label>
                                <input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-800">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl
                                    ${saving ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-pink-500 to-indigo-500 hover:shadow-pink-500/50 active:scale-[0.98]'}
                                `}
                            >
                                {saving && <LoadingSpinner />}
                                {saving ? 'Saving...' : 'Update Details'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}