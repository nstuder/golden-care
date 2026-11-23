import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { headingFonts, isHexColor, radii, themeDefaults } from '@/lib/theme'
import { previewUrl } from '@/lib/preview'

const hexValidate = (value: unknown) =>
  isHexColor(value) ? true : 'Bitte eine Farbe im Format #RRGGBB eingeben.'

const colorField = (name: keyof typeof themeDefaults, label: string, description: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  defaultValue: themeDefaults[name],
  validate: hexValidate,
  admin: {
    description,
    width: '50%',
    components: { Field: '@/components/admin/ColorField#ColorField' },
  },
})

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Design',
  access: { read: anyone, update: authenticated },
  admin: {
    group: 'Website',
    description:
      'Farben und Schrift der Website. Änderungen sind in der Live-Vorschau sofort sichtbar.',
    livePreview: { url: () => previewUrl('/') },
    preview: () => previewUrl('/'),
  },
  fields: [
    {
      type: 'row',
      fields: [
        colorField('primary', 'Akzentfarbe (Gold)', 'Buttons, Linien, Icons'),
        colorField('secondary', 'Grundfarbe (Violett)', 'Header, Footer, dunkle Abschnitte'),
      ],
    },
    {
      type: 'row',
      fields: [
        colorField('background', 'Hintergrund', 'Seitenhintergrund'),
        colorField('foreground', 'Textfarbe', 'Fliesstext und Überschriften'),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'headingFont',
          label: 'Schrift für Überschriften',
          type: 'select',
          required: true,
          defaultValue: themeDefaults.headingFont,
          options: Object.entries(headingFonts).map(([value, { label }]) => ({ label, value })),
          admin: { width: '50%' },
        },
        {
          name: 'radius',
          label: 'Ecken',
          type: 'select',
          required: true,
          defaultValue: themeDefaults.radius,
          options: Object.entries(radii).map(([value, { label }]) => ({ label, value })),
          admin: { width: '50%' },
        },
      ],
    },
  ],
  versions: {
    drafts: { autosave: { interval: 375 } },
    max: 20,
  },
}
