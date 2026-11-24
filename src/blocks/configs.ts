import type { Block } from 'payload'

import { iconOptions } from '@/lib/icons'
import { linkField, linksField } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

const iconField = {
  name: 'icon',
  label: 'Icon',
  type: 'select',
  defaultValue: 'paw',
  options: iconOptions.map((o) => ({ ...o })),
} as const

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heros' },
  fields: [
    { name: 'eyebrow', label: 'Überzeile', type: 'text' },
    { name: 'heading', label: 'Überschrift', type: 'text', required: true },
    { name: 'text', label: 'Text', type: 'textarea' },
    { name: 'image', label: 'Hintergrundbild', type: 'upload', relationTo: 'media' },
    {
      name: 'size',
      label: 'Höhe',
      type: 'select',
      defaultValue: 'large',
      options: [
        { label: 'Groß (Startseite)', value: 'large' },
        { label: 'Kompakt (Unterseite)', value: 'compact' },
      ],
    },
    linksField(),
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Text', plural: 'Texte' },
  fields: [
    { name: 'content', label: 'Inhalt', type: 'richText', required: true },
    {
      name: 'width',
      label: 'Breite',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Schmal', value: 'narrow' },
        { label: 'Normal', value: 'default' },
      ],
    },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Bild & Text', plural: 'Bild & Text' },
  fields: [
    { name: 'eyebrow', label: 'Überzeile', type: 'text' },
    { name: 'heading', label: 'Überschrift', type: 'text' },
    { name: 'content', label: 'Text', type: 'richText' },
    { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      label: 'Bildposition',
      type: 'radio',
      defaultValue: 'left',
      options: [
        { label: 'Links', value: 'left' },
        { label: 'Rechts', value: 'right' },
      ],
      admin: { layout: 'horizontal' },
    },
    { name: 'signature', label: 'Unterschrift', type: 'text' },
    { name: 'enableLink', label: 'Button anzeigen', type: 'checkbox' },
    {
      ...linkField(),
      admin: { condition: (_, sibling) => Boolean(sibling?.enableLink), hideGutter: true },
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: { singular: 'Leistungen', plural: 'Leistungen' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'mode',
      label: 'Anzeige',
      type: 'radio',
      defaultValue: 'all',
      options: [
        { label: 'Alle Leistungen', value: 'all' },
        { label: 'Auswahl', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'services',
      label: 'Leistungen',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.mode === 'selected' },
    },
    { name: 'showImages', label: 'Bilder anzeigen', type: 'checkbox', defaultValue: true },
    { name: 'enableLink', label: 'Button anzeigen', type: 'checkbox' },
    {
      ...linkField(),
      admin: { condition: (_, sibling) => Boolean(sibling?.enableLink), hideGutter: true },
    },
  ],
}

export const FeaturesBlock: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: { singular: 'Vorteile', plural: 'Vorteile' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'tone',
      label: 'Hintergrund',
      type: 'radio',
      defaultValue: 'light',
      options: [
        { label: 'Hell', value: 'light' },
        { label: 'Dunkel', value: 'dark' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'items',
      label: 'Punkte',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Punkt', plural: 'Punkte' },
      fields: [
        iconField,
        { name: 'title', label: 'Titel', type: 'text', required: true },
        { name: 'text', label: 'Text', type: 'textarea' },
      ],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Kundenstimmen', plural: 'Kundenstimmen' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'mode',
      label: 'Anzeige',
      type: 'radio',
      defaultValue: 'all',
      options: [
        { label: 'Alle', value: 'all' },
        { label: 'Auswahl', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'testimonials',
      label: 'Kundenstimmen',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.mode === 'selected' },
    },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Galerie', plural: 'Galerien' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'images',
      label: 'Bilder',
      type: 'array',
      labels: { singular: 'Bild', plural: 'Bilder' },
      fields: [
        { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', label: 'Bildunterschrift', type: 'text' },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      label: 'Fragen',
      type: 'array',
      labels: { singular: 'Frage', plural: 'Fragen' },
      fields: [
        { name: 'question', label: 'Frage', type: 'text', required: true },
        { name: 'answer', label: 'Antwort', type: 'textarea', required: true },
      ],
    },
  ],
}

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'heading', label: 'Überschrift', type: 'text', required: true },
    { name: 'text', label: 'Text', type: 'textarea' },
    {
      name: 'tone',
      label: 'Farbe',
      type: 'radio',
      defaultValue: 'gold',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Dunkel', value: 'dark' },
      ],
      admin: { layout: 'horizontal' },
    },
    linksField(),
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Kontaktdaten', plural: 'Kontaktdaten' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'showMapEmbed',
      label: 'Google-Maps-Karte anzeigen',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Wird im Bereich „Anfahrt“ angezeigt und lädt erst nach einem Klick (Datenschutz). Position: Koordinaten aus „SEO & Google“, sonst die Adresse. Telefon, Adresse und Öffnungszeiten kommen aus den Einstellungen.',
      },
    },
  ],
}

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  labels: { singular: 'Formular', plural: 'Formulare' },
  fields: [
    ...sectionHeaderFields(),
    { name: 'form', label: 'Formular', type: 'relationship', relationTo: 'forms', required: true },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  ImageTextBlock,
  ServicesGridBlock,
  FeaturesBlock,
  TestimonialsBlock,
  GalleryBlock,
  FaqBlock,
  CallToActionBlock,
  ContactBlock,
  FormBlock,
]
