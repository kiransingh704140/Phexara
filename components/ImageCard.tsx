// components/ImageCard.tsx
import Image from 'next/image';
import PromptCopyButton from './PromptCopyButton';

type ImageRow = {
  id: string;
  public_id: string;
  url: string;
  thumb_url: string | null;
  prompt: string;
  created_at: string;
};

export default function ImageCard({ image }: { image: ImageRow }) {
  // prefer thumb_url if available, else use url
  const src = image.thumb_url ?? image.url;

  return (
    <article className="rounded overflow-hidden shadow-sm bg-white">
      <a href={`/gallery/${image.id}`} className="block">
        <div className="relative w-full h-64 bg-gray-100">
          {/* next/image handles remote images (ensure next.config.js allows cloudinary) */}
          <Image
            src={src}
            alt={image.prompt ?? 'AI image'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </a>

      <div className="p-3">
        <p className="text-sm line-clamp-3 mb-3">{image.prompt}</p>
        <div className="flex items-center justify-between">
          <PromptCopyButton prompt={image.prompt} />
          <time className="text-xs text-gray-500" dateTime={image.created_at}>
            {new Date(image.created_at).toISOString().slice(0, 10)}
          </time>
        </div>
      </div>
    </article>
  );
}
