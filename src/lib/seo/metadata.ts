import type { Metadata } from 'next'

import { HOME_SLUG, pathForSlug } from '../links'
import { toImage, type ImageData } from '../media'
import type { SiteInfo } from '../site'
import { absoluteUrl } from './jsonLd'

export type PageLike = {
  title: string
  slug?: string | null
  updatedAt?: string | null
  layout?:
    { blockType: string; text?: string | null; intro?: string | null; image?: unknown }[] | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
    noIndex?: boolean | null
  } | null
}

const MAX_DESCRIPTION = 160

/** Shortens text to a meta description length at a word boundary. */
export function truncate(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length)}…`
}

const heroOf = (page: PageLike) => page.layout?.find((block) => block.blockType === 'hero')

export function pageTitle(page: PageLike, site: SiteInfo): string {
  if (page.meta?.title) return page.meta.title
  if (!page.slug || page.slug === HOME_SLUG)
    return [site.name, site.tagline].filter(Boolean).join(' – ')
  return `${page.title} – ${site.name}`
}

/** SEO field → hero text → site description. */
export function pageDescription(page: PageLike, site: SiteInfo): string | undefined {
  const text = page.meta?.description || heroOf(page)?.text || site.description || site.tagline
  return text ? truncate(text) : undefined
}

/** SEO image → hero image → default image from the settings. */
export function pageImage(page: PageLike, site: SiteInfo): ImageData | null {
  return (
    toImage(page.meta?.image, 'large') ??
    toImage(heroOf(page)?.image, 'large') ??
    site.image ??
    null
  )
}

export type PageMetadataArgs = {
  page: PageLike
  site: SiteInfo
  baseUrl: string
  allowIndexing: boolean
}

export function buildPageMetadata({
  page,
  site,
  baseUrl,
  allowIndexing,
}: PageMetadataArgs): Metadata {
  const path = pathForSlug(page.slug)
  const title = pageTitle(page, site)
  const description = pageDescription(page, site)
  const image = pageImage(page, site)
  const index = allowIndexing && !page.meta?.noIndex
  const images = image
    ? [
        {
          url: absoluteUrl(baseUrl, image.src),
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ]
    : undefined

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: site.name,
      url: absoluteUrl(baseUrl, path),
      title,
      description,
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images?.map((i) => i.url),
    },
  }
}
