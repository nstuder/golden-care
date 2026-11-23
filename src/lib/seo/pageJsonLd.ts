import { HOME_SLUG, pathForSlug } from '../links'
import type { SiteInfo } from '../site'
import {
  absoluteUrl,
  buildBreadcrumbs,
  buildFaqPage,
  buildGraph,
  buildWebPage,
  type WebPageOptions,
} from './jsonLd'
import { pageDescription, pageImage, pageTitle, type PageLike } from './metadata'

type FaqLike = {
  blockType: string
  items?: { question?: string | null; answer?: string | null }[] | null
}

/** Picks a more specific schema.org page type from the sections on the page. */
export function pageTypeFor(page: PageLike): NonNullable<WebPageOptions['type']> {
  const types = new Set(page.layout?.map((block) => block.blockType))
  if (types.has('contact') || types.has('formBlock')) return 'ContactPage'
  if (types.has('gallery')) return 'CollectionPage'
  return 'WebPage'
}

/** WebPage + BreadcrumbList + FAQPage for one CMS page. */
export function buildPageJsonLd({
  page,
  site,
  baseUrl,
}: {
  page: PageLike
  site: SiteInfo
  baseUrl: string
}) {
  const isHome = !page.slug || page.slug === HOME_SLUG
  const path = pathForSlug(page.slug)
  const faqItems = (page.layout as FaqLike[] | null | undefined)
    ?.filter((block) => block.blockType === 'faq')
    .flatMap((block) => block.items ?? [])
    .filter((item): item is { question: string; answer: string } =>
      Boolean(item.question && item.answer),
    )

  return buildGraph(
    buildWebPage({
      baseUrl,
      slug: page.slug,
      name: pageTitle(page, site),
      description: pageDescription(page, site),
      imageUrl: pageImage(page, site)?.src,
      dateModified: page.updatedAt,
      type: pageTypeFor(page),
      hasBreadcrumb: !isHome,
    }),
    !isHome &&
      buildBreadcrumbs(baseUrl, [
        { name: 'Startseite', path: '/' },
        { name: page.title, path },
      ]),
    faqItems?.length ? buildFaqPage(absoluteUrl(baseUrl, path), faqItems) : null,
  )
}
