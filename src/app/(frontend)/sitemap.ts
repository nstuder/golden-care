import type { MetadataRoute } from 'next'

import { serverURL } from '@/lib/env'
import { HOME_SLUG, pathForSlug } from '@/lib/links'
import { getPublishedSlugs } from '@/lib/queries'

export const dynamic = 'force-dynamic'

const legal = new Set(['impressum', 'datenschutz'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedSlugs()
  return pages
    .filter((page) => !page.meta?.noIndex)
    .map((page) => ({
      url: `${serverURL}${pathForSlug(page.slug)}`,
      lastModified: page.updatedAt,
      changeFrequency: legal.has(page.slug ?? '') ? 'yearly' : 'monthly',
      priority: page.slug === HOME_SLUG ? 1 : legal.has(page.slug ?? '') ? 0.2 : 0.8,
    }))
}
