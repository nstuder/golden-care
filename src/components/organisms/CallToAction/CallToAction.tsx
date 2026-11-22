import { Button, Container, Heading, Icon, Text } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { ResolvedLink } from '@/lib/links'

export type CallToActionProps = {
  heading: string
  text?: string | null
  links?: ResolvedLink[]
  tone?: 'gold' | 'dark'
}

export function CallToAction({ heading, text, links = [], tone = 'gold' }: CallToActionProps) {
  const dark = tone === 'dark'

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div
          className={cn(
            'relative overflow-hidden rounded-theme px-6 py-14 text-center md:px-16',
            dark
              ? 'bg-secondary-700'
              : 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600',
          )}
        >
          <Icon
            name="paw"
            className={cn(
              'absolute -bottom-6 -left-6 size-40 rotate-12',
              dark ? 'text-white/5' : 'text-secondary-900/10',
            )}
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <Heading
              level={2}
              size={3}
              inverted={dark}
              className={dark ? undefined : 'text-secondary-900'}
            >
              {heading}
            </Heading>
            {text ? (
              <Text
                size="lg"
                tone={dark ? 'inverted' : 'default'}
                className={dark ? undefined : 'text-secondary-800'}
              >
                {text}
              </Text>
            ) : null}
            {links.length ? (
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                {links.map((link, index) => (
                  <Button
                    key={link.href}
                    href={link.href}
                    newTab={link.newTab}
                    variant={
                      dark
                        ? index === 0
                          ? 'primary'
                          : 'light'
                        : index === 0
                          ? 'secondary'
                          : 'outline'
                    }
                    className={
                      !dark && index > 0
                        ? 'border-secondary-700 text-secondary-800 hover:bg-white/20'
                        : undefined
                    }
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
