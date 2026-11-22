import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { Container, RichText, Section } from '@/components/atoms'

export type RichTextSectionProps = {
  content?: SerializedEditorState | null
  width?: 'narrow' | 'default'
}

export function RichTextSection({ content, width = 'narrow' }: RichTextSectionProps) {
  if (!content) return null

  return (
    <Section tone="light" spacing="sm">
      <Container width={width}>
        <RichText data={content} />
      </Container>
    </Section>
  )
}
