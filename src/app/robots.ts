import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Indexing stays off until the site goes live (ALLOW_INDEXING=true). */
export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING !== 'true') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next'] },
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
