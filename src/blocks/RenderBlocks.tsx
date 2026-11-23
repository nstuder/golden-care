import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichText } from '@/components/atoms'
import {
  CallToAction,
  ContactForm,
  ContactSection,
  Faq,
  Features,
  Gallery,
  Hero,
  ImageText,
  RichTextSection,
  ServicesGrid,
  Testimonials,
} from '@/components/organisms'
import { toFormFields } from '@/lib/forms'
import { resolveLink, resolveLinks } from '@/lib/links'
import { toImage } from '@/lib/media'
import type { SiteInfo } from '@/lib/site'
import type { Page, Service, Testimonial } from '@/payload-types'

export type PageBlock = NonNullable<Page['layout']>[number]

export type BlockContext = {
  site: SiteInfo
  services: Service[]
  testimonials: Testimonial[]
}

const isDoc = <T extends { id: string }>(value: unknown): value is T =>
  Boolean(value && typeof value === 'object' && 'id' in value)

function pickSelected<T extends { id: string }>(
  mode: string | null | undefined,
  selected: unknown,
  all: T[],
): T[] {
  if (mode !== 'selected') return all
  return (Array.isArray(selected) ? selected : []).filter(isDoc<T>)
}

function renderBlock(block: PageBlock, context: BlockContext) {
  switch (block.blockType) {
    case 'hero':
      return (
        <Hero
          eyebrow={block.eyebrow}
          heading={block.heading}
          text={block.text}
          image={toImage(block.image, 'large')}
          size={block.size ?? 'large'}
          links={resolveLinks(block.links)}
        />
      )
    case 'richText':
      return (
        <RichTextSection
          content={block.content as unknown as SerializedEditorState}
          width={block.width ?? 'narrow'}
        />
      )
    case 'imageText':
      return (
        <ImageText
          eyebrow={block.eyebrow}
          heading={block.heading}
          content={block.content as unknown as SerializedEditorState}
          image={toImage(block.image, 'card')}
          imagePosition={block.imagePosition ?? 'left'}
          signature={block.signature}
          link={block.enableLink ? resolveLink(block.link) : null}
        />
      )
    case 'servicesGrid':
      return (
        <ServicesGrid
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          showImages={block.showImages ?? true}
          link={block.enableLink ? resolveLink(block.link) : null}
          services={pickSelected<Service>(block.mode, block.services, context.services).map(
            (service) => ({
              id: service.id,
              title: service.title,
              summary: service.summary,
              icon: service.icon,
              image: toImage(service.image, 'card'),
            }),
          )}
        />
      )
    case 'features':
      return (
        <Features
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          tone={block.tone ?? 'light'}
          items={(block.items ?? []).map((item) => ({
            id: item.id,
            icon: item.icon,
            title: item.title,
            text: item.text,
          }))}
        />
      )
    case 'testimonials':
      return (
        <Testimonials
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          items={pickSelected<Testimonial>(
            block.mode,
            block.testimonials,
            context.testimonials,
          ).map((t) => ({
            id: t.id,
            quote: t.quote,
            author: t.author,
            dog: t.dog,
          }))}
        />
      )
    case 'gallery':
      return (
        <Gallery
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          images={(block.images ?? []).flatMap((item, index) => {
            const image = toImage(item.image, 'large')
            return image ? [{ ...image, id: item.id ?? String(index), caption: item.caption }] : []
          })}
        />
      )
    case 'faq':
      return (
        <Faq
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          items={block.items ?? []}
        />
      )
    case 'callToAction':
      return (
        <CallToAction
          heading={block.heading}
          text={block.text}
          tone={block.tone ?? 'gold'}
          links={resolveLinks(block.links)}
        />
      )
    case 'contact':
      return (
        <ContactSection
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          site={context.site}
          showMap={block.showMap ?? true}
          showMapEmbed={block.showMapEmbed ?? true}
        />
      )
    case 'formBlock': {
      const form = isDoc(block.form) ? block.form : null
      if (!form) return null
      return (
        <ContactForm
          formId={form.id}
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          fields={toFormFields(form.fields)}
          submitLabel={form.submitButtonLabel}
          confirmation={
            form.confirmationMessage ? (
              <RichText
                data={form.confirmationMessage as unknown as SerializedEditorState}
                className="text-center"
              />
            ) : undefined
          }
        />
      )
    }
    default:
      return null
  }
}

export type RenderBlocksProps = {
  blocks?: PageBlock[] | null
  context: BlockContext
}

export function RenderBlocks({ blocks, context }: RenderBlocksProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => (
        <div key={block.id ?? index} data-block={block.blockType}>
          {renderBlock(block, context)}
        </div>
      ))}
    </>
  )
}
