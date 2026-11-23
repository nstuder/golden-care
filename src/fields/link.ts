import type { Field, GroupField } from 'payload'

type LinkOptions = {
  name?: string
  label?: string
  required?: boolean
}

export function linkField({
  name = 'link',
  label = 'Link',
  required = false,
}: LinkOptions = {}): GroupField {
  return {
    name,
    label,
    type: 'group',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            label: 'Linktyp',
            type: 'radio',
            defaultValue: 'reference',
            options: [
              { label: 'Interne Seite', value: 'reference' },
              { label: 'Eigene URL', value: 'custom' },
            ],
            admin: { layout: 'horizontal', width: '50%' },
          },
          {
            name: 'newTab',
            label: 'In neuem Tab öffnen',
            type: 'checkbox',
            admin: { width: '50%', style: { alignSelf: 'flex-end' } },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            label: 'Seite',
            type: 'relationship',
            relationTo: 'pages',
            required,
            admin: { condition: (_, sibling) => sibling?.type === 'reference', width: '50%' },
          },
          {
            name: 'url',
            label: 'URL',
            type: 'text',
            required,
            admin: {
              condition: (_, sibling) => sibling?.type === 'custom',
              description: 'z.B. https://…, tel:+49…, mailto:… oder /kontakt#kontaktformular',
              width: '50%',
            },
          },
          {
            name: 'label',
            label: 'Beschriftung',
            type: 'text',
            required,
            admin: { width: '50%' },
          },
        ],
      },
    ],
  }
}

export function linksField({ name = 'links', label = 'Links', maxRows = 2 } = {}): Field {
  return {
    name,
    label,
    type: 'array',
    maxRows,
    labels: { singular: 'Link', plural: 'Links' },
    fields: [linkField({ required: true })],
  }
}
