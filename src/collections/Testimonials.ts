import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Kundenstimme', plural: 'Kundenstimmen' },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'dog', 'updatedAt'],
  },
  fields: [
    { name: 'quote', label: 'Zitat', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'author', label: 'Name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'dog',
          label: 'Hund',
          type: 'text',
          admin: { width: '50%', description: 'z.B. „mit Luna, Golden Retriever“' },
        },
      ],
    },
  ],
}
