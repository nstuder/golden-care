import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Einstellungen',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Website' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Salon',
          fields: [
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              required: true,
              defaultValue: 'Golden Care',
            },
            {
              name: 'tagline',
              label: 'Untertitel',
              type: 'text',
              defaultValue: 'Salon für Hundegesundheit und Fellpflege',
            },
            { name: 'description', label: 'Kurzbeschreibung (Footer, SEO)', type: 'textarea' },
            { name: 'owner', label: 'Inhaber*in', type: 'text' },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Telefon', type: 'text', admin: { width: '50%' } },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp-Nummer',
                  type: 'text',
                  admin: { width: '50%', description: 'Leer lassen, um WhatsApp auszublenden' },
                },
              ],
            },
            { name: 'email', label: 'E-Mail', type: 'email' },
            { name: 'street', label: 'Strasse & Nr.', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'zip', label: 'PLZ', type: 'text', admin: { width: '30%' } },
                { name: 'city', label: 'Ort', type: 'text', admin: { width: '70%' } },
              ],
            },
            {
              name: 'mapsUrl',
              label: 'Karten-Link',
              type: 'text',
              admin: { description: 'Optional. Standard: Google-Maps-Suche nach der Adresse' },
            },
            {
              name: 'socials',
              label: 'Social Media',
              type: 'array',
              labels: { singular: 'Profil', plural: 'Profile' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      label: 'Plattform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'Facebook', value: 'facebook' },
                      ],
                      admin: { width: '30%' },
                    },
                    {
                      name: 'url',
                      label: 'URL',
                      type: 'text',
                      required: true,
                      admin: { width: '70%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Öffnungszeiten',
          fields: [
            {
              name: 'openingHours',
              label: 'Öffnungszeiten',
              type: 'array',
              labels: { singular: 'Zeile', plural: 'Zeilen' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'days',
                      label: 'Tage',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'hours',
                      label: 'Zeiten',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'appointmentNote',
              label: 'Hinweis',
              type: 'text',
              defaultValue: 'Termine nur nach Vereinbarung',
            },
          ],
        },
      ],
    },
  ],
}
