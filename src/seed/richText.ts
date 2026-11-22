import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Node = Record<string, unknown>

export type RichTextInput =
  string | { h2: string } | { h3: string } | { ul: string[] } | { quote: string }

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

/** Supports **bold** segments inside a line. */
function textNodes(text: string): Node[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return {
        type: 'text',
        text: bold ? part.slice(2, -2) : part,
        format: bold ? 1 : 0,
        style: '',
        mode: 'normal',
        detail: 0,
        version: 1,
      }
    })
}

function toNode(input: RichTextInput): Node {
  if (typeof input === 'string') {
    return { ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: textNodes(input) }
  }
  if ('h2' in input) return { ...base, type: 'heading', tag: 'h2', children: textNodes(input.h2) }
  if ('h3' in input) return { ...base, type: 'heading', tag: 'h3', children: textNodes(input.h3) }
  if ('quote' in input) return { ...base, type: 'quote', children: textNodes(input.quote) }
  return {
    ...base,
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    children: input.ul.map((item, index) => ({
      ...base,
      type: 'listitem',
      value: index + 1,
      children: textNodes(item),
    })),
  }
}

/** Builds a Lexical editor state from a compact description (used by the seed). */
export function richText(...blocks: RichTextInput[]): SerializedEditorState {
  return {
    root: { ...base, type: 'root', children: blocks.map(toNode) },
  } as unknown as SerializedEditorState
}
