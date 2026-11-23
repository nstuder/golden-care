import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { Settings } from './globals/Settings'
import { Theme } from './globals/Theme'
import { pathForSlug } from './lib/links'
import { truncate } from './lib/seo/metadata'
import { migrations } from './migrations'
import { serverURL } from './lib/env'
import { revalidatePlugin } from './plugins/revalidate'
import { seed } from './seed'

type HeroLike = { blockType?: string; text?: string | null; image?: string | { id: string } | null }
const heroBlock = (doc: { layout?: HeroLike[] | null } | undefined) =>
  doc?.layout?.find((block) => block.blockType === 'hero')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Without SMTP settings Payload logs e-mails to the console instead of sending them. */
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'noreply@golden-care.ch',
      defaultFromName: 'Golden Care',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      },
    })
  : undefined

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' – Golden Care',
    },
    components: {
      beforeDashboard: ['@/components/admin/SeedButton#SeedButton'],
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobil', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: {
    supportedLanguages: { de },
    fallbackLanguage: 'de',
  },
  collections: [Pages, Services, Testimonials, Media, Users],
  globals: [Settings, Navigation, Theme],
  cors: [serverURL],
  csrf: [serverURL],
  editor: lexicalEditor(),
  email,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    // Data migrations run automatically when the production server starts
    prodMigrations: migrations,
  }),
  sharp,
  endpoints: [
    {
      path: '/seed',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Nicht angemeldet' }, { status: 401 })
        }
        try {
          const force = req.searchParams.get('force') === 'true'
          const result = await seed({ payload: req.payload, force })
          return Response.json(result)
        } catch (error) {
          req.payload.logger.error({ err: error, msg: 'Seed fehlgeschlagen' })
          return Response.json(
            { message: error instanceof Error ? error.message : 'Seed fehlgeschlagen' },
            { status: 500 },
          )
        }
      },
    },
  ],
  plugins: [
    formBuilderPlugin({
      fields: {
        payment: false,
        country: false,
        state: false,
        date: false,
        number: false,
      },
      defaultToEmail: process.env.CONTACT_EMAIL,
      formOverrides: {
        labels: { singular: 'Formular', plural: 'Formulare' },
        admin: { group: 'Formulare' },
      },
      formSubmissionOverrides: {
        labels: { singular: 'Einsendung', plural: 'Einsendungen' },
        admin: { group: 'Formulare' },
      },
    }),
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} – Golden Care` : 'Golden Care'),
      // Suggestions for the "Generieren" buttons, taken from the first hero section
      generateDescription: ({ doc }) => truncate(heroBlock(doc)?.text ?? ''),
      generateImage: ({ doc }) => {
        const image = heroBlock(doc)?.image
        return (typeof image === 'object' && image ? image.id : image) ?? ''
      },
      generateURL: ({ doc }) => `${serverURL}${pathForSlug(doc?.slug)}`,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'noIndex',
          label: 'Nicht in Suchmaschinen anzeigen (noindex)',
          type: 'checkbox',
          admin: { description: 'Seite wird aus Sitemap und Suchergebnissen ausgeschlossen.' },
        },
      ],
    }),
    // Must stay last, so it also sees the collections added by other plugins
    revalidatePlugin(),
  ],
})
