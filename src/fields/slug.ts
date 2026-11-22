import type { FieldHook, TextField } from 'payload'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  const title = data?.title ?? originalDoc?.title
  return typeof title === 'string' ? slugify(title) : value
}

export const slugField = (): TextField => ({
  name: 'slug',
  label: 'URL-Pfad',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Wird aus dem Titel erzeugt. „home“ ist die Startseite.',
  },
  hooks: { beforeValidate: [formatSlug] },
})
