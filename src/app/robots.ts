import type { MetadataRoute } from 'next'

import { allowIndexing, serverURL } from '@/lib/env'

export const dynamic = 'force-dynamic'

/** Indexing stays off until the site goes live (ALLOW_INDEXING=true). */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next'] },
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
