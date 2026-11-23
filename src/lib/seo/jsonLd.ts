import { weekdays } from '../hours'
import { pathForSlug } from '../links'
import { formatAddress, mapsHref, type SiteInfo } from '../site'

/**
 * Builders for schema.org structured data (JSON-LD).
 * Nodes reference each other via `@id`, so business, website and page form one graph.
 */

export type JsonLdNode = { '@type': string | string[]; '@id'?: string; [key: string]: unknown }
export type JsonLdGraph = { '@context': 'https://schema.org'; '@graph': JsonLdNode[] }

export const businessTypes = [
  { label: 'Lokales Unternehmen (allgemein)', value: 'LocalBusiness' },
  { label: 'Tierbedarf / Zoohandlung', value: 'PetStore' },
  { label: 'Tierarztpraxis', value: 'VeterinaryCare' },
] as const

export type BusinessType = (typeof businessTypes)[number]['value']

export type ServiceInfo = { name: string; description?: string | null }

const stripSlash = (url: string) => url.replace(/\/+$/, '')

export function absoluteUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${stripSlash(baseUrl)}${path.startsWith('/') ? '' : '/'}${path}`
}

export const ids = {
  business: (baseUrl: string) => `${stripSlash(baseUrl)}/#business`,
  website: (baseUrl: string) => `${stripSlash(baseUrl)}/#website`,
  webpage: (url: string) => `${url}#webpage`,
  breadcrumb: (url: string) => `${url}#breadcrumb`,
  faq: (url: string) => `${url}#faq`,
}

/** Removes null, undefined, empty strings, empty arrays and empty objects (recursively). */
export function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(compact).filter((v) => !isEmpty(v)) as T
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => [k, compact(v)] as const)
      .filter(([, v]) => !isEmpty(v))
    return Object.fromEntries(entries) as T
  }
  return value
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export function buildOpeningHours(site: SiteInfo) {
  return (site.schedule ?? []).map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: entry.days.map(
      (day) => `https://schema.org/${weekdays.find((w) => w.value === day)!.schema}`,
    ),
    opens: entry.opens,
    closes: entry.closes,
  }))
}

export type LocalBusinessOptions = {
  site: SiteInfo
  baseUrl: string
  type?: BusinessType | string | null
  logoUrl?: string
  services?: ServiceInfo[]
}

export function buildLocalBusiness({
  site,
  baseUrl,
  type,
  logoUrl,
  services = [],
}: LocalBusinessOptions): JsonLdNode {
  const hasAddress = Boolean(formatAddress(site))
  const hasGeo = typeof site.latitude === 'number' && typeof site.longitude === 'number'

  return compact({
    '@type': type || 'LocalBusiness',
    '@id': ids.business(baseUrl),
    name: site.name,
    slogan: site.tagline,
    description: site.description ?? site.tagline,
    url: absoluteUrl(baseUrl, '/'),
    logo: logoUrl ? absoluteUrl(baseUrl, logoUrl) : undefined,
    image: site.image
      ? [absoluteUrl(baseUrl, site.image.src)]
      : logoUrl
        ? [absoluteUrl(baseUrl, logoUrl)]
        : undefined,
    telephone: site.phone,
    email: site.email,
    founder: site.owner ? { '@type': 'Person', name: site.owner } : undefined,
    priceRange: site.priceRange,
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.street,
          postalCode: site.zip,
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country ?? 'CH',
        }
      : undefined,
    geo: hasGeo
      ? { '@type': 'GeoCoordinates', latitude: site.latitude, longitude: site.longitude }
      : undefined,
    hasMap: hasAddress ? mapsHref(site) : undefined,
    openingHoursSpecification: buildOpeningHours(site),
    areaServed: (site.areaServed ?? []).map((name) => ({ '@type': 'Place', name })),
    sameAs: (site.socials ?? []).map((s) => s.url),
    hasOfferCatalog: services.length
      ? {
          '@type': 'OfferCatalog',
          name: 'Leistungen',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.name,
              description: service.description,
              provider: { '@id': ids.business(baseUrl) },
            },
          })),
        }
      : undefined,
  })
}

export function buildWebSite({ site, baseUrl }: { site: SiteInfo; baseUrl: string }): JsonLdNode {
  return compact({
    '@type': 'WebSite',
    '@id': ids.website(baseUrl),
    url: absoluteUrl(baseUrl, '/'),
    name: site.name,
    description: site.description ?? site.tagline,
    inLanguage: 'de-CH',
    publisher: { '@id': ids.business(baseUrl) },
  })
}

export type WebPageOptions = {
  baseUrl: string
  slug?: string | null
  name: string
  description?: string | null
  imageUrl?: string | null
  dateModified?: string | null
  type?: 'WebPage' | 'ContactPage' | 'AboutPage' | 'CollectionPage'
  hasBreadcrumb?: boolean
}

export function buildWebPage({
  baseUrl,
  slug,
  name,
  description,
  imageUrl,
  dateModified,
  type = 'WebPage',
  hasBreadcrumb,
}: WebPageOptions): JsonLdNode {
  const url = absoluteUrl(baseUrl, pathForSlug(slug))
  return compact({
    '@type': type,
    '@id': ids.webpage(url),
    url,
    name,
    description,
    inLanguage: 'de-CH',
    isPartOf: { '@id': ids.website(baseUrl) },
    about: { '@id': ids.business(baseUrl) },
    primaryImageOfPage: imageUrl
      ? { '@type': 'ImageObject', url: absoluteUrl(baseUrl, imageUrl) }
      : undefined,
    dateModified,
    breadcrumb: hasBreadcrumb ? { '@id': ids.breadcrumb(url) } : undefined,
  })
}

export function buildBreadcrumbs(
  baseUrl: string,
  items: { name: string; path: string }[],
): JsonLdNode {
  const url = absoluteUrl(baseUrl, items.at(-1)?.path ?? '/')
  return {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb(url),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(baseUrl, item.path),
    })),
  }
}

export function buildFaqPage(
  pageUrl: string,
  items: { question: string; answer: string }[],
): JsonLdNode | null {
  if (!items.length) return null
  return {
    '@type': 'FAQPage',
    '@id': ids.faq(pageUrl),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function buildGraph(...nodes: (JsonLdNode | null | undefined | false)[]): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((n): n is JsonLdNode => Boolean(n)),
  }
}

/** JSON for a <script> tag – escapes "<" so content cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
