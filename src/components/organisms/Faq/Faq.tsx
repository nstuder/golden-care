import { Container, Section } from '@/components/atoms'
import { FaqItem, SectionHeader } from '@/components/molecules'

export type FaqProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  items: { id?: string | null; question: string; answer: string }[]
}

export function Faq({ eyebrow, heading, intro, items }: FaqProps) {
  if (!items.length) return null

  return (
    <Section tone="light">
      <Container width="narrow" className="flex flex-col gap-10">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <FaqItem
              key={item.id ?? index}
              question={item.question}
              answer={item.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
