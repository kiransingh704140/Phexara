import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://phexara.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://phexara.vercel.app/gallery',
      lastModified: new Date(),
    },
  ];
}
