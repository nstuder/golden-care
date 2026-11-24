import { Container, Heading, Icon, Section } from '@/components/atoms'
import { ContactItem, MapEmbed, OpeningHours, SectionHeader } from '@/components/molecules'
import { cn } from '@/lib/cn'
import { telHref, whatsappHref } from '@/lib/links'
import { reveal } from '@/lib/reveal'
import { formatAddress, mapsEmbedSrc, mapsHref, type SiteInfo } from '@/lib/site'

export type ContactSectionProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  site: SiteInfo
  /** Embedded Google Maps (click to load) */
  showMapEmbed?: boolean
  privacyHref?: string | null
}

export function ContactSection({
  eyebrow,
  heading,
  intro,
  site,
  showMapEmbed = true,
  privacyHref = '/datenschutz',
}: ContactSectionProps) {
  const address = formatAddress(site)
  const embed = showMapEmbed ? mapsEmbedSrc(site) : null

  return (
    <Section tone="light">
      <Container className="flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div
            {...reveal('up', 0)}
            className="flex flex-col gap-5 rounded-theme bg-white p-8 shadow-sm ring-1 ring-secondary-100 lg:col-start-1"
          >
            <Heading level={3} size={5}>
              So erreichst du uns
            </Heading>
            {site.phone ? (
              <ContactItem icon="phone" label="Telefon" href={telHref(site.phone)}>
                {site.phone}
              </ContactItem>
            ) : null}
            {site.whatsapp ? (
              <ContactItem icon="whatsapp" label="WhatsApp" href={whatsappHref(site.whatsapp)}>
                {site.whatsapp}
              </ContactItem>
            ) : null}
            {site.email ? (
              <ContactItem icon="mail" label="E-Mail" href={`mailto:${site.email}`}>
                {site.email}
              </ContactItem>
            ) : null}
          </div>

          <div
            {...reveal('up', 1)}
            className="flex flex-col gap-5 rounded-theme bg-white p-8 shadow-sm ring-1 ring-secondary-100 lg:col-start-1"
          >
            <Heading level={3} size={5}>
              Öffnungszeiten
            </Heading>
            <OpeningHours entries={site.openingHours} note={site.appointmentNote} />
          </div>

          <div
            {...reveal('up', 2)}
            className={cn(
              'relative flex flex-col gap-5 overflow-hidden rounded-theme bg-secondary-700 p-8 text-white',
              embed && 'lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1',
            )}
          >
            <Heading level={3} size={5} inverted>
              Anfahrt
            </Heading>
            {embed || address ? (
              <div className="flex flex-1 flex-col overflow-hidden rounded-theme ring-1 ring-white/10">
                {embed ? (
                  <MapEmbed
                    src={embed}
                    title={`Karte: ${[site.name, address].filter(Boolean).join(', ')}`}
                    privacyHref={privacyHref}
                    className="aspect-auto min-h-80 flex-1 rounded-none! shadow-none ring-0 sm:aspect-auto"
                  />
                ) : null}
                {address ? <AddressBar site={site} href={mapsHref(site)} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}

/** Address strip attached below the map; opens the location in Google Maps */
function AddressBar({ site, href }: { site: SiteInfo; href: string | null }) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-secondary-900">
        <Icon name="map-pin" className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium text-white">{site.street}</span>
        <span className="text-sm text-white/70">
          {[site.zip, site.city].filter(Boolean).join(' ')}
        </span>
      </span>
      {href ? (
        <span className="hidden items-center gap-1 text-sm font-medium text-primary-300 transition group-hover:text-primary-200 sm:flex">
          In Google Maps öffnen
          <Icon name="chevron-right" className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </>
  )
  const classes = 'flex items-center gap-4 bg-black/20 px-5 py-4'

  if (!href) return <div className={classes}>{content}</div>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(classes, 'group transition hover:bg-black/30')}
    >
      {content}
      <Icon name="chevron-right" className="size-5 shrink-0 text-primary-300 sm:hidden" />
    </a>
  )
}
