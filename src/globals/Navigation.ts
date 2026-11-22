import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { linkField } from '@/fields/link'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Website' },
  fields: [
    {
      name: 'headerLinks',
      label: 'Hauptmenü',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Link', plural: 'Links' },
      fields: [linkField({ required: true })],
    },
    {
      ...linkField({ name: 'cta', label: 'Button im Header' }),
      admin: { hideGutter: false, description: 'z.B. „Termin vereinbaren“' },
    },
    {
      name: 'footerLinks',
      label: 'Footer-Links',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Link', plural: 'Links' },
      fields: [linkField({ required: true })],
    },
  ],
}
