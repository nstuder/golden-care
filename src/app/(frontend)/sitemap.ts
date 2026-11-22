import type { MetadataRoute } from 'next'

import { pathForSlug } from '@/lib/links'
import { getPublishedSlugs } from '@/lib/queries'

export const dynamic = 'force-dynamic'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedSlugs()
  return pages.map((page) => ({
    url: `${serverURL}${pathForSlug(page.slug)}`,
    lastModified: page.updatedAt,
  }))
}
