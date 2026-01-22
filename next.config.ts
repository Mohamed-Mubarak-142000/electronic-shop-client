import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance: Optimize compiler output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance: Optimize images with formats and device sizes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  
  // Performance: Enable experimental features for better optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },
};

export default nextConfig;
