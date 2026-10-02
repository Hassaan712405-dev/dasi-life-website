/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Fix Turbopack warning
  turbopack: {
    root: __dirname,
  },
  // ✅ Production mein console.log remove karein
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ✅ Images configuration (aapki existing)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;