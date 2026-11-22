import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { iconOptions } from '@/lib/icons'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Leistung', plural: 'Leistungen' },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
  },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', required: true },
    { name: 'summary', label: 'Kurzbeschreibung', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          defaultValue: 'paw',
          options: iconOptions.map((o) => ({ ...o })),
          admin: { width: '50%' },
        },
        {
          name: 'order',
          label: 'Reihenfolge',
          type: 'number',
          defaultValue: 10,
          admin: { width: '50%', description: 'Kleinere Zahl = weiter vorne' },
        },
      ],
    },
    { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media' },
  ],
}
