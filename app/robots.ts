import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin-login/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/api/',
          '/order-success/',
          '/_next/',
          '/login/',
          '/register/',
          '/forgot-password/',
        ],
      },
    ],
    sitemap: 'https://www.dasilife.store/sitemap.xml',
    host: 'https://www.dasilife.store',
  };
}