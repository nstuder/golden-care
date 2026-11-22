import { Button, Container, Heading, Section } from '@/components/atoms'
import { ContactItem, OpeningHours, SectionHeader } from '@/components/molecules'
import { telHref, whatsappHref } from '@/lib/links'
import { formatAddress, mapsHref, type SiteInfo } from '@/lib/site'

export type ContactSectionProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  site: SiteInfo
  showMap?: boolean
}

export function ContactSection({
  eyebrow,
  heading,
  intro,
  site,
  showMap = true,
}: ContactSectionProps) {
  const address = formatAddress(site)
  const maps = mapsHref(site)

  return (
    <Section tone="light">
      <Container className="flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-5 rounded-theme bg-white p-8 shadow-sm ring-1 ring-secondary-100">
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

          <div className="flex flex-col gap-5 rounded-theme bg-white p-8 shadow-sm ring-1 ring-secondary-100">
            <Heading level={3} size={5}>
              Öffnungszeiten
            </Heading>
            <OpeningHours entries={site.openingHours} note={site.appointmentNote} />
          </div>

          <div className="relative flex flex-col gap-5 overflow-hidden rounded-theme bg-secondary-700 p-8 text-white">
            <Heading level={3} size={5} inverted>
              Anfahrt
            </Heading>
            {address ? (
              <ContactItem icon="map-pin" label="Adresse" inverted>
                <span className="block">{site.street}</span>
                <span className="block">{[site.zip, site.city].filter(Boolean).join(' ')}</span>
              </ContactItem>
            ) : null}
            {showMap && maps ? (
              <div className="mt-auto pt-2">
                <Button href={maps} newTab variant="primary">
                  Route planen
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
