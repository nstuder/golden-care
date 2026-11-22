import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { richText } from '@/seed/richText'

export function setPathname(pathname: string) {
  ;(globalThis as { __setPathname?: (p: string) => void }).__setPathname?.(pathname)
}

export const sampleRichText = (...text: string[]): SerializedEditorState => richText(...text)

export const sampleImage = {
  src: '/api/media/file/dog.jpg',
  alt: 'Ein Hund',
  width: 800,
  height: 600,
}
