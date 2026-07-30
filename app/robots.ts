export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard'],
    },
    sitemap: 'https://corestack-v1-5nci.vercel.app/sitemap.xml',
  }
}
