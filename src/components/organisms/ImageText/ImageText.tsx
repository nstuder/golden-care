import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { Button, Container, Eyebrow, Heading, Picture, RichText, Section } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { ResolvedLink } from '@/lib/links'
import type { ImageData } from '@/lib/media'

export type ImageTextProps = {
  eyebrow?: string | null
  heading?: string | null
  content?: SerializedEditorState | null
  image?: ImageData | null
  imagePosition?: 'left' | 'right'
  signature?: string | null
  link?: ResolvedLink | null
}

export function ImageText({
  eyebrow,
  heading,
  content,
  image,
  imagePosition = 'left',
  signature,
  link,
}: ImageTextProps) {
  return (
    <Section tone="light">
      <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className={cn('relative', imagePosition === 'right' && 'md:order-2')}>
          <div
            aria-hidden
            className={cn(
              'absolute -inset-3 rounded-theme border-2 border-primary-400',
              imagePosition === 'left'
                ? 'translate-x-4 translate-y-4'
                : '-translate-x-4 translate-y-4',
            )}
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-theme shadow-xl shadow-secondary-900/15">
            <Picture image={image} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {heading ? <Heading level={2}>{heading}</Heading> : null}
          {heading ? <span aria-hidden className="h-1 w-16 rounded-full bg-primary-500" /> : null}
          <RichText data={content} />
          {signature ? (
            <p className="font-display text-2xl text-primary-700 italic">{signature}</p>
          ) : null}
          {link ? (
            <div className="pt-2">
              <Button href={link.href} newTab={link.newTab} variant="outline">
                {link.label}
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
