import { Container, Section } from '@/components/atoms'
import { SectionHeader, TestimonialCard, type TestimonialCardProps } from '@/components/molecules'

export type TestimonialsProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  items: (TestimonialCardProps & { id: string })[]
}

export function Testimonials({ eyebrow, heading, intro, items }: TestimonialsProps) {
  if (!items.length) return null

  return (
    <Section tone="dark" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-500/10 blur-3xl"
      />
      <Container className="relative flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} inverted />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ id, ...item }) => (
            <li key={id}>
              <TestimonialCard {...item} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
