import { Button, Container, Section, type SectionTone } from '@/components/atoms'
import { SectionHeader, ServiceCard, type ServiceCardProps } from '@/components/molecules'
import type { ResolvedLink } from '@/lib/links'

export type ServicesGridProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  services: (ServiceCardProps & { id: string })[]
  showImages?: boolean
  link?: ResolvedLink | null
  tone?: SectionTone
}

export function ServicesGrid({
  eyebrow,
  heading,
  intro,
  services,
  showImages = true,
  link,
  tone = 'light',
}: ServicesGridProps) {
  return (
    <Section tone={tone}>
      <Container className="flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        {services.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ id, image, ...service }) => (
              <li key={id}>
                <ServiceCard {...service} image={showImages ? (image ?? null) : undefined} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">Noch keine Leistungen erfasst.</p>
        )}
        {link ? (
          <div className="flex justify-center">
            <Button href={link.href} newTab={link.newTab} variant="outline">
              {link.label}
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
