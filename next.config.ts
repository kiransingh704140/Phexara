/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // prefer remotePatterns; allow Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allowed dev origins to avoid cross-origin dev warning (adjust IPs if needed)
  allowedDevOrigins: ['http://0.0.0.0:3000', 'http://localhost:3000'],
  // don't include invalid experimental keys here
};

module.exports = nextConfig;
