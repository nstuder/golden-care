import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medium',
    plural: 'Medien',
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    {
      name: 'alt',
      label: 'Alternativtext',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      label: 'Bildnachweis',
      type: 'text',
    },
  ],
  upload: {
    // Relative to the working directory: ./media locally, /app/media in the container
    staticDir: 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 900, height: 675, position: 'centre' },
      { name: 'large', width: 1920, withoutEnlargement: true },
    ],
  },
}
