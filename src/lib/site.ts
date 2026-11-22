import type { SocialLink } from '@/components/molecules/SocialLinks'
import type { OpeningHoursEntry } from '@/components/molecules/OpeningHours'

/** Business details as used by the frontend (from the "Einstellungen" global). */
export type SiteInfo = {
  name: string
  tagline?: string | null
  description?: string | null
  owner?: string | null
  street?: string | null
  zip?: string | null
  city?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  openingHours?: OpeningHoursEntry[] | null
  appointmentNote?: string | null
  socials?: SocialLink[] | null
  mapsUrl?: string | null
}

export const fallbackSite: SiteInfo = {
  name: 'Golden Care',
  tagline: 'Salon für Hundegesundheit und Fellpflege',
}

type SettingsLike = Partial<Record<keyof SiteInfo, unknown>> & {
  openingHours?: { days?: string | null; hours?: string | null }[] | null
  socials?: { platform?: string | null; url?: string | null }[] | null
}

export function toSiteInfo(settings?: SettingsLike | null): SiteInfo {
  if (!settings) return fallbackSite
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)

  return {
    name: str(settings.name) ?? fallbackSite.name,
    tagline: str(settings.tagline) ?? fallbackSite.tagline,
    description: str(settings.description),
    owner: str(settings.owner),
    street: str(settings.street),
    zip: str(settings.zip),
    city: str(settings.city),
    phone: str(settings.phone),
    whatsapp: str(settings.whatsapp),
    email: str(settings.email),
    appointmentNote: str(settings.appointmentNote),
    mapsUrl: str(settings.mapsUrl),
    openingHours: (settings.openingHours ?? [])
      .filter((e) => e?.days && e?.hours)
      .map((e) => ({ days: e.days as string, hours: e.hours as string })),
    socials: (settings.socials ?? [])
      .filter((s) => s?.platform && s?.url)
      .map((s) => ({ platform: s.platform as string, url: s.url as string })),
  }
}

export function formatAddress(site: SiteInfo): string | null {
  const cityLine = [site.zip, site.city].filter(Boolean).join(' ')
  const parts = [site.street, cityLine].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

export function mapsHref(site: SiteInfo): string | null {
  if (site.mapsUrl) return site.mapsUrl
  const address = formatAddress(site)
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null
}
