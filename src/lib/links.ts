export type LinkReference = { slug?: string | null } | string | number | null | undefined

export type LinkData = {
  type?: 'reference' | 'custom' | null
  reference?: LinkReference
  url?: string | null
  label?: string | null
  newTab?: boolean | null
}

export type ResolvedLink = {
  href: string
  label: string
  newTab: boolean
}

export const HOME_SLUG = 'home'

/** Public path for a page slug. The page with slug "home" lives at "/". */
export function pathForSlug(slug?: string | null): string {
  if (!slug || slug === HOME_SLUG) return '/'
  return `/${slug}`
}

export function resolveHref(link?: LinkData | null): string | null {
  if (!link) return null

  if (link.type === 'reference') {
    const ref = link.reference
    if (ref && typeof ref === 'object' && 'slug' in ref) return pathForSlug(ref.slug)
    return null
  }

  return link.url?.trim() || null
}

export function resolveLink(link?: LinkData | null): ResolvedLink | null {
  const href = resolveHref(link)
  if (!href || !link?.label) return null
  return { href, label: link.label, newTab: Boolean(link.newTab) }
}

export function resolveLinks(links?: ({ link?: LinkData | null } | null)[] | null): ResolvedLink[] {
  return (links ?? [])
    .map((item) => resolveLink(item?.link))
    .filter((l): l is ResolvedLink => l !== null)
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href)
}

/** "+41 79 123 45 67" → "tel:+41791234567" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** "+41 79 123 45 67" → "https://wa.me/41791234567" */
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`
}
