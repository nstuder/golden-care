import Link from 'next/link'

import { Container, Logo, Text } from '@/components/atoms'
import { ContactItem, OpeningHours, SocialLinks } from '@/components/molecules'
import { telHref, whatsappHref, type ResolvedLink } from '@/lib/links'
import { formatAddress, mapsHref, type SiteInfo } from '@/lib/site'

export type FooterProps = {
  site: SiteInfo
  links?: ResolvedLink[]
  year?: number
}

export function Footer({ site, links = [], year = new Date().getFullYear() }: FooterProps) {
  const address = formatAddress(site)
  const maps = mapsHref(site)

  return (
    <footer className="bg-secondary-800 text-secondary-100">
      <div
        aria-hidden
        className="h-1 bg-gradient-to-r from-primary-700 via-primary-400 to-primary-700"
      />
      <Container width="wide" className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Logo name={site.name} tagline={site.tagline} inverted />
          {site.description ? <Text tone="inverted">{site.description}</Text> : null}
          <SocialLinks links={site.socials} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-white">Kontakt</h2>
          {site.phone ? (
            <ContactItem icon="phone" label="Telefon" href={telHref(site.phone)} inverted>
              {site.phone}
            </ContactItem>
          ) : null}
          {site.whatsapp ? (
            <ContactItem
              icon="whatsapp"
              label="WhatsApp"
              href={whatsappHref(site.whatsapp)}
              inverted
            >
              Nachricht schreiben
            </ContactItem>
          ) : null}
          {site.email ? (
            <ContactItem icon="mail" label="E-Mail" href={`mailto:${site.email}`} inverted>
              {site.email}
            </ContactItem>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-white">Salon</h2>
          {address ? (
            <ContactItem icon="map-pin" label="Adresse" href={maps ?? undefined} inverted>
              <span className="block">{site.street}</span>
              <span className="block">{[site.zip, site.city].filter(Boolean).join(' ')}</span>
            </ContactItem>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-white">Öffnungszeiten</h2>
          <OpeningHours entries={site.openingHours} note={site.appointmentNote} inverted />
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container
          width="wide"
          className="flex flex-col items-center justify-between gap-4 py-6 text-sm sm:flex-row"
        >
          <p>
            © {year} {site.name}
          </p>
          {links.length ? (
            <nav aria-label="Rechtliches">
              <ul className="flex gap-6">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-primary-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Container>
      </div>
    </footer>
  )
}
