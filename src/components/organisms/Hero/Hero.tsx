import { Button, Container, Eyebrow, Heading, Picture, Text } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { ResolvedLink } from '@/lib/links'
import type { ImageData } from '@/lib/media'

export type HeroProps = {
  eyebrow?: string | null
  heading: string
  text?: string | null
  image?: ImageData | null
  links?: ResolvedLink[]
  size?: 'large' | 'compact'
}

export function Hero({ eyebrow, heading, text, image, links = [], size = 'large' }: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate flex overflow-hidden bg-secondary-800',
        size === 'large' ? 'min-h-[80svh] items-center' : 'min-h-[45svh] items-end',
      )}
    >
      <Picture image={image} priority className="-z-20" imgClassName="hero-zoom" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary-900/95 via-secondary-800/75 to-secondary-700/20"
      />
      <Container width="wide" className={cn('py-20', size === 'compact' && 'pt-32 pb-14')}>
        <div className="hero-enter flex max-w-2xl flex-col gap-6">
          {eyebrow ? <Eyebrow className="text-primary-400">{eyebrow}</Eyebrow> : null}
          <Heading level={1} inverted size={size === 'large' ? 1 : 2}>
            {heading}
          </Heading>
          <span aria-hidden className="h-1 w-20 rounded-full bg-primary-500" />
          {text ? (
            <Text size="lg" tone="inverted" className="max-w-xl">
              {text}
            </Text>
          ) : null}
          {links.length ? (
            <div className="flex flex-wrap gap-4 pt-2">
              {links.map((link, index) => (
                <Button
                  key={link.href}
                  href={link.href}
                  newTab={link.newTab}
                  size="lg"
                  variant={index === 0 ? 'primary' : 'light'}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
