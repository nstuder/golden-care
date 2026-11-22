import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access'
import { pageBlocks } from '@/blocks/configs'
import { slugField } from '@/fields/slug'
import { pagePreviewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Seite', plural: 'Seiten' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => pagePreviewUrl(data?.slug as string | undefined),
    },
    preview: (data) => pagePreviewUrl(data?.slug as string | undefined),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inhalt',
          fields: [
            {
              name: 'layout',
              label: 'Abschnitte',
              type: 'blocks',
              blocks: pageBlocks,
              labels: { singular: 'Abschnitt', plural: 'Abschnitte' },
            },
          ],
        },
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: { interval: 375 },
      schedulePublish: false,
    },
    maxPerDoc: 30,
  },
}
