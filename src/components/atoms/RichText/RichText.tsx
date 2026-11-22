import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  LinkJSXConverter,
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'
import { pathForSlug } from '@/lib/links'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc?.value
      return pathForSlug(
        typeof doc === 'object' && doc && 'slug' in doc ? (doc.slug as string) : null,
      )
    },
  }),
})

export type RichTextProps = {
  data?: SerializedEditorState | null
  inverted?: boolean
  className?: string
}

export function RichText({ data, inverted, className }: RichTextProps) {
  if (!data?.root?.children?.length) return null

  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={cn('prose-content', inverted && 'prose-invert', className)}
    />
  )
}
