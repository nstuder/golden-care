import { Eyebrow, Heading, Text } from '@/components/atoms'
import { cn } from '@/lib/cn'
import { reveal } from '@/lib/reveal'

export type SectionHeaderProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  align?: 'left' | 'center'
  inverted?: boolean
  level?: 1 | 2
  className?: string
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  align = 'center',
  inverted,
  level = 2,
  className,
}: SectionHeaderProps) {
  if (!eyebrow && !heading && !intro) return null

  return (
    <header
      {...reveal()}
      className={cn(
        'flex max-w-3xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow className={cn(inverted && 'text-primary-400')}>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <Heading level={level} size={2} inverted={inverted}>
          {heading}
        </Heading>
      ) : null}
      {heading ? <span aria-hidden className="h-1 w-16 rounded-full bg-primary-500" /> : null}
      {intro ? (
        <Text size="lg" tone={inverted ? 'inverted' : 'muted'}>
          {intro}
        </Text>
      ) : null}
    </header>
  )
}
