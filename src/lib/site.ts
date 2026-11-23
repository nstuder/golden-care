import type { SocialLink } from '@/components/molecules/SocialLinks'
import type { OpeningHoursEntry } from '@/components/molecules/OpeningHours'

import { formatSchedule, formatScheduleShort, normalizeSchedule, type ScheduleEntry } from './hours'
import { toImage, type ImageData } from './media'

/** Business details as used by the frontend (from the "Einstellungen" global). */
export type SiteInfo = {
  name: string
  tagline?: string | null
  description?: string | null
  owner?: string | null
  street?: string | null
  zip?: string | null
  city?: string | null
  region?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  /** Structured opening hours (JSON-LD) */
  schedule?: ScheduleEntry[] | null
  /** Display rows derived from `schedule` */
  openingHours?: OpeningHoursEntry[] | null
  /** One-line summary, e.g. for the header */
  hoursSummary?: string | null
  appointmentNote?: string | null
  socials?: SocialLink[] | null
  mapsUrl?: string | null
  areaServed?: string[] | null
  priceRange?: string | null
  /** Default share image and business photo */
  image?: ImageData | null
}

export const fallbackSite: SiteInfo = {
  name: 'Golden Care',
  tagline: 'Salon für Hundegesundheit und Fellpflege',
}

type SettingsLike = Record<string, unknown> & {
  schedule?: { days?: string[] | null; opens?: string | null; closes?: string | null }[] | null
  socials?: { platform?: string | null; url?: string | null }[] | null
  areaServed?: { name?: string | null }[] | null
}

/** Accepts the "settings" global (or any partial object of it). */
export function toSiteInfo(input?: object | null): SiteInfo {
  if (!input) return fallbackSite
  const settings = input as SettingsLike
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  const schedule = normalizeSchedule(settings.schedule)

  return {
    name: str(settings.name) ?? fallbackSite.name,
    tagline: str(settings.tagline) ?? fallbackSite.tagline,
    description: str(settings.description),
    owner: str(settings.owner),
    street: str(settings.street),
    zip: str(settings.zip),
    city: str(settings.city),
    region: str(settings.region),
    country: str(settings.country) ?? 'DE',
    latitude: num(settings.latitude),
    longitude: num(settings.longitude),
    phone: str(settings.phone),
    whatsapp: str(settings.whatsapp),
    email: str(settings.email),
    appointmentNote: str(settings.appointmentNote),
    mapsUrl: str(settings.mapsUrl),
    priceRange: str(settings.priceRange),
    schedule,
    openingHours: formatSchedule(schedule),
    hoursSummary: formatScheduleShort(schedule) || null,
    areaServed: (settings.areaServed ?? [])
      .map((a) => str(a?.name))
      .filter((a): a is string => Boolean(a)),
    socials: (settings.socials ?? [])
      .filter((s) => s?.platform && s?.url)
      .map((s) => ({ platform: s.platform as string, url: s.url as string })),
    image: toImage(settings.image, 'large'),
  }
}

export function formatAddress(site: SiteInfo): string | null {
  const cityLine = [site.zip, site.city].filter(Boolean).join(' ')
  const parts = [site.street, cityLine].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

/** Google Maps embed (no API key needed): uses the coordinates if set, otherwise the address */
export function mapsEmbedSrc(site: SiteInfo): string | null {
  const hasCoords = typeof site.latitude === 'number' && typeof site.longitude === 'number'
  const query = hasCoords ? `${site.latitude},${site.longitude}` : formatAddress(site)
  if (!query) return null
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=de&output=embed`
}

export function mapsHref(site: SiteInfo): string | null {
  if (site.mapsUrl) return site.mapsUrl
  const address = formatAddress(site)
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null
}
