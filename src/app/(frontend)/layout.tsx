import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Fraunces, Inter, Marcellus, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

import { PreviewBanner } from '@/components/organisms'
import { BaseTemplate } from '@/components/templates'
import { JsonLd } from '@/components/utils/JsonLd'
import { LivePreviewListener } from '@/components/utils/LivePreviewListener'
import { allowIndexing, serverURL } from '@/lib/env'
import { resolveLink, resolveLinks } from '@/lib/links'
import { getServices, getSiteGlobals, isDraftMode } from '@/lib/queries'
import { buildGraph, buildLocalBusiness, buildWebSite } from '@/lib/seo/jsonLd'
import { toSiteInfo } from '@/lib/site'
import { buildThemeCss, resolveTheme } from '@/lib/theme'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
})

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteGlobals()
  const site = toSiteInfo(settings)
  const index = allowIndexing()
  const title = [site.name, site.tagline].filter(Boolean).join(' – ')

  return {
    metadataBase: new URL(serverURL),
    title: { default: title, template: `%s – ${site.name}` },
    description: site.description ?? site.tagline ?? undefined,
    applicationName: site.name,
    authors: site.owner ? [{ name: site.owner }] : undefined,
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { siteName: site.name, locale: 'de_CH', type: 'website' },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const { theme } = await getSiteGlobals()
  return { themeColor: resolveTheme(theme).secondary }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ settings, navigation, theme }, draft, services] = await Promise.all([
    getSiteGlobals(),
    isDraftMode(),
    getServices(),
  ])
  const site = toSiteInfo(settings)

  const structuredData = buildGraph(
    buildLocalBusiness({
      site,
      baseUrl: serverURL,
      type: settings.businessType,
      logoUrl: '/logo.png',
      services: services.map((service) => ({ name: service.title, description: service.summary })),
    }),
    buildWebSite({ site, baseUrl: serverURL }),
  )

  return (
    <html
      lang="de-CH"
      className={`${inter.variable} ${marcellus.variable} ${fraunces.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <head>
        <style id="theme" dangerouslySetInnerHTML={{ __html: buildThemeCss(theme) }} />
      </head>
      <body className="font-sans">
        <JsonLd data={structuredData} />
        {draft ? <LivePreviewListener serverURL={serverURL} /> : null}
        <BaseTemplate
          banner={draft ? <PreviewBanner /> : null}
          header={{
            siteName: site.name,
            tagline: site.tagline,
            links: resolveLinks(navigation.headerLinks),
            cta: resolveLink(navigation.cta),
            phone: site.phone,
          }}
          footer={{ site, links: resolveLinks(navigation.footerLinks) }}
        >
          {children}
        </BaseTemplate>
      </body>
    </html>
  )
}
