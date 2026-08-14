import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;
