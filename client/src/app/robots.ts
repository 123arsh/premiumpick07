import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const adminPath = process.env.ADMIN_PATH || 'cp-internal-manage';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [`/${adminPath}/`, '/manage/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
