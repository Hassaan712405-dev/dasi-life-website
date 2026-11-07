/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 86400,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // ❌ 'eslint' block yahan nahi hona chahiye
  // ❌ 'experimental' block bhi hata dein agar koi error de raha ho

  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    imgOptTimeoutInSeconds: 30,
  },
};

module.exports = nextConfig;