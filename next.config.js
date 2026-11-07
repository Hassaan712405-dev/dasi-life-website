/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Turbopack ko batayein ke root yahi project folder hai
  // (Isse "package-lock.json outside Git repo" wali warning khatam ho jayegi)
  turbopack: {
    root: __dirname,
  },

  // ✅ Supabase storage images allow karein
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Local dev mein 504 Gateway Timeout fix (production mein optimization on rahegi)
    unoptimized: process.env.NODE_ENV === 'development',
    // Remote image cache 24 hours
    minimumCacheTTL: 86400,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // ❌ 'eslint' block yahan se hata diya gaya hai (Next.js 16 mein support nahi)

  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Image optimizer ka timeout 30 seconds (504 fix)
    imgOptTimeoutInSeconds: 30,
  },
};

module.exports = nextConfig;