import type { Metadata } from 'next'
import { Cormorant_Garamond, Fraunces, Inter, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

import { PreviewBanner } from '@/components/organisms'
import { BaseTemplate } from '@/components/templates'
import { LivePreviewListener } from '@/components/utils/LivePreviewListener'
import { resolveLink, resolveLinks } from '@/lib/links'
import { getSiteGlobals, isDraftMode } from '@/lib/queries'
import { formatAddress, toSiteInfo } from '@/lib/site'
import { buildThemeCss } from '@/lib/theme'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
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

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteGlobals()
  const site = toSiteInfo(settings)
  return {
    metadataBase: new URL(serverURL),
    title: { default: `${site.name} – ${site.tagline}`, template: `%s – ${site.name}` },
    description: site.description ?? undefined,
    openGraph: { siteName: site.name, locale: 'de_CH', type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ settings, navigation, theme }, draft] = await Promise.all([
    getSiteGlobals(),
    isDraftMode(),
  ])
  const site = toSiteInfo(settings)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PetGroomer',
    name: site.name,
    description: site.description ?? site.tagline,
    url: serverURL,
    telephone: site.phone ?? undefined,
    email: site.email ?? undefined,
    address: formatAddress(site)
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.street,
          postalCode: site.zip,
          addressLocality: site.city,
          addressCountry: 'CH',
        }
      : undefined,
  }

  return (
    <html
      lang="de"
      className={`${inter.variable} ${fraunces.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <head>
        <style id="theme" dangerouslySetInnerHTML={{ __html: buildThemeCss(theme) }} />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
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
