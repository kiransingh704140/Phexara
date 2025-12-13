//app/admin/upload/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image'; // Importing Image for the successful upload preview
import Link from 'next/link';

// --- Components ---

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FileInput = ({ file, setFile }: { file: File | null; setFile: (file: File | null) => void }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Image File</label>
        <label className="flex items-center justify-center w-full h-32 px-4 transition bg-black/30 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-black/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2m-5 4v5m-2-2h4"></path></svg>
                <p className="mb-2 text-sm text-gray-400 font-semibold">
                    {file ? `Selected: ${file.name}` : 'Click to select or drag & drop an image'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 10MB)</p>
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
                className="hidden"
            />
        </label>
    </div>
);

// --- Main Page Component ---

export default function AdminUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!file) {
            setError('Please choose an image file first.');
            return;
        }

        setLoading(true);
        try {
            // 1) request signature from our server (Logic remains the same)
            const sigRes = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
            if (!sigRes.ok) throw new Error('Failed to get upload signature');
            const sigJson = await sigRes.json();
            const { signature, timestamp, apiKey, cloudName } = sigJson;

            // 2) prepare formdata for Cloudinary direct upload (Logic remains the same)
            const fd = new FormData();
            fd.append('file', file);
            fd.append('api_key', apiKey);
            fd.append('timestamp', String(timestamp));
            fd.append('signature', signature);

            // 3) POST to Cloudinary upload endpoint (Logic remains the same)
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const cloudRes = await fetch(uploadUrl, {
                method: 'POST',
                body: fd
            });

            if (!cloudRes.ok) {
                const txt = await cloudRes.text();
                throw new Error('Cloudinary upload failed: ' + txt);
            }

            const cloudJson = await cloudRes.json();
            setResult(cloudJson);

            // 4) Save metadata into Supabase via our API (Logic remains the same)
            const tagsArray = tags
                ? tags
                    .split(',')
                    .map((t) => t.trim().toLowerCase())
                    .filter(Boolean)
                : null;


            const saveRes = await fetch('/api/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    public_id: cloudJson.public_id,
                    url: cloudJson.secure_url,
                    prompt: prompt,
                    tags: tagsArray,
                    thumb_url: null,
                    width: cloudJson.width,
                    height: cloudJson.height
                })
            });


            if (!saveRes.ok) {
                const errText = await saveRes.text();
                throw new Error('Failed to save metadata to Supabase: ' + errText);
            }

            const saved = await saveRes.json();
            console.log("Saved in Supabase:", saved);

            // Optionally reset form fields after successful upload
            setFile(null);
            setPrompt('');
            setModel('');
            setTags('');

        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full mt-2 p-3 bg-black/20 text-white placeholder-gray-500 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
    const labelClass = "block text-sm font-medium text-gray-300";

    return (
        <main className="min-h-screen p-6 sm:p-12 bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
            <div className="max-w-4xl mx-auto">

                <Link
                    href="/gallery"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to gallery
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                        Admin Upload 🚀
                    </h1>
                    <p className="text-gray-400 mt-1">Upload AI images and their metadata to populate the gallery.</p>
                </header>

                {/* Form Container (Glassmorphism Style) */}
                <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                    <form onSubmit={handleUpload} className="space-y-6">

                        {/* File Input */}
                        <FileInput file={file} setFile={setFile} />

                        {/* Prompt */}
                        <div>
                            <label className={labelClass}>Prompt (Required)</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className={inputClass}
                                rows={5}
                                placeholder="A detailed prompt describing the image (e.g., 'An oil painting of a cyberpunk cat in a neon alley, high detail, volumetric light')."
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>Tags (comma separated)</label>
                            <input
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className={inputClass}
                                placeholder="e.g., boy, girl, couple, fantasy"
                            />
                        </div>


                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !file || !prompt}
                                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl
                  ${loading || !file || !prompt
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:shadow-pink-500/50 hover:to-indigo-400 active:scale-[0.98]'
                                    }
                `}
                            >
                                {loading && <LoadingSpinner />}
                                {loading ? 'Processing Upload...' : 'Upload Image & Save Metadata'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Status Messages --- */}

                {/* Error State */}
                {error && (
                    <div className="mt-8 p-4 rounded-xl bg-red-900/50 border border-red-700/50 text-red-300 shadow-lg">
                        <h2 className="font-bold text-lg mb-1">Upload Error 🛑</h2>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Success State */}
                {result && (
                    <div className="mt-8 p-6 rounded-xl bg-green-900/50 border border-green-700/50 text-green-300 shadow-lg">
                        <h2 className="font-bold text-lg text-green-300">Success! Image Uploaded & Saved 🎉</h2>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Image Preview */}
                            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border border-green-700/50">
                                <Image
                                    src={result.secure_url}
                                    alt="uploaded image preview"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    sizes="50vw"
                                    className="p-2"
                                />
                            </div>

                            {/* Metadata */}
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-white">Cloudinary ID:</p>
                                <code className="block bg-black/30 p-2 rounded text-xs break-all">{result.public_id}</code>
                                <p className="font-medium text-white">URL:</p>
                                <Link href={result.secure_url} target="_blank" rel="noreferrer" className="block bg-black/30 p-2 rounded text-xs break-all underline text-blue-300 hover:text-blue-200 transition">
                                    {result.secure_url}
                                </Link>
                                <p className="pt-2 text-xs text-green-500">
                                    Image is now live in the gallery!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}