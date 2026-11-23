import { Container, Section } from '@/components/atoms'
import { FeatureItem, SectionHeader, type FeatureItemProps } from '@/components/molecules'
import { reveal } from '@/lib/reveal'

export type FeaturesProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  items: (Omit<FeatureItemProps, 'inverted'> & { id?: string | null })[]
  tone?: 'light' | 'dark'
}

export function Features({ eyebrow, heading, intro, items, tone = 'light' }: FeaturesProps) {
  const inverted = tone === 'dark'

  return (
    <Section tone={inverted ? 'dark' : 'tint'}>
      <Container className="flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} inverted={inverted} />
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ id, ...item }, index) => (
            <li key={id ?? index} {...reveal('up', index)}>
              <FeatureItem {...item} inverted={inverted} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
