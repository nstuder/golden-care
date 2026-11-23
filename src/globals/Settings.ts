import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { isValidTime, weekdays } from '@/lib/hours'
import { businessTypes } from '@/lib/seo/jsonLd'

const timeField = (name: string, label: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  validate: (value: unknown) =>
    isValidTime(value) ? true : 'Bitte im Format HH:MM eingeben, z.B. 08:30',
})

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
              name: 'schedule',
              label: 'Öffnungszeiten',
              type: 'array',
              labels: { singular: 'Zeile', plural: 'Zeilen' },
              admin: {
                description:
                  'Pro Zeile Wochentage mit gleichen Zeiten. Nicht aufgeführte Tage werden als „geschlossen“ angezeigt. Wird auch für Google (strukturierte Daten) verwendet.',
              },
              fields: [
                {
                  name: 'days',
                  label: 'Tage',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: weekdays.map(({ label, value }) => ({ label, value })),
                },
                {
                  type: 'row',
                  fields: [
                    {
                      ...timeField('opens', 'Öffnet'),
                      admin: { width: '50%', placeholder: '08:30' },
                    },
                    {
                      ...timeField('closes', 'Schliesst'),
                      admin: { width: '50%', placeholder: '18:00' },
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
        {
          label: 'SEO & Google',
          description:
            'Angaben für Suchmaschinen und Google Maps (strukturierte Daten nach schema.org). Am besten identisch mit dem Google-Unternehmensprofil.',
          fields: [
            {
              name: 'businessType',
              label: 'Unternehmenstyp',
              type: 'select',
              defaultValue: 'LocalBusiness',
              options: businessTypes.map(({ label, value }) => ({ label, value })),
            },
            {
              name: 'image',
              label: 'Standardbild',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Für Google und Social-Media-Vorschauen, wenn eine Seite kein eigenes Bild hat.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'region',
                  label: 'Kanton / Region',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'z.B. BE' },
                },
                {
                  name: 'country',
                  label: 'Land (ISO-Code)',
                  type: 'text',
                  defaultValue: 'CH',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  label: 'Breitengrad',
                  type: 'number',
                  min: -90,
                  max: 90,
                  admin: { width: '50%', step: 0.000001, placeholder: '46.948' },
                },
                {
                  name: 'longitude',
                  label: 'Längengrad',
                  type: 'number',
                  min: -180,
                  max: 180,
                  admin: {
                    width: '50%',
                    step: 0.000001,
                    placeholder: '7.4474',
                    description: 'In Google Maps: Rechtsklick auf den Salon → Koordinaten kopieren',
                  },
                },
              ],
            },
            {
              name: 'areaServed',
              label: 'Einzugsgebiet',
              type: 'array',
              labels: { singular: 'Ort', plural: 'Orte' },
              admin: {
                description: 'Orte, aus denen Kundschaft kommt – hilft bei der lokalen Suche.',
              },
              fields: [{ name: 'name', label: 'Ort', type: 'text', required: true }],
            },
            {
              name: 'priceRange',
              label: 'Preisniveau',
              type: 'text',
              admin: { description: 'Optional, z.B. „$$“ oder „CHF 60–150“' },
            },
          ],
        },
      ],
    },
  ],
}
