import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { JsonLd } from '@/components/utils/JsonLd'
import { allowIndexing, serverURL } from '@/lib/env'
import { HOME_SLUG } from '@/lib/links'
import { getPageBySlug, getServices, getSiteGlobals, getTestimonials } from '@/lib/queries'
import { buildPageJsonLd } from '@/lib/seo/pageJsonLd'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { toSiteInfo } from '@/lib/site'

export async function PageView({ slug = HOME_SLUG }: { slug?: string }) {
  const page = await getPageBySlug(slug)
  if (!page) {
    if (slug === HOME_SLUG) return <EmptySite />
    notFound()
  }

  const blockTypes = new Set(page.layout?.map((block) => block.blockType))
  const [{ settings }, services, testimonials] = await Promise.all([
    getSiteGlobals(),
    blockTypes.has('servicesGrid') ? getServices() : Promise.resolve([]),
    blockTypes.has('testimonials') ? getTestimonials() : Promise.resolve([]),
  ])
  const site = toSiteInfo(settings)

  return (
    <>
      <JsonLd data={buildPageJsonLd({ page, site, baseUrl: serverURL })} />
      <RenderBlocks blocks={page.layout} context={{ site, services, testimonials }} />
    </>
  )
}

export async function pageMetadata(slug = HOME_SLUG): Promise<Metadata> {
  const [page, { settings }] = await Promise.all([getPageBySlug(slug), getSiteGlobals()])
  if (!page) return {}
  return buildPageMetadata({
    page,
    site: toSiteInfo(settings),
    baseUrl: serverURL,
    allowIndexing: allowIndexing(),
  })
}

/** Shown before the first content exists (fresh installation). */
function EmptySite() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <h1 className="font-display text-4xl font-semibold text-secondary-700">Golden Care</h1>
      <p className="max-w-md text-muted">
        Noch keine Inhalte vorhanden. Melde dich im{' '}
        <Link className="text-primary-700 underline" href="/admin">
          Admin
        </Link>{' '}
        an und lade die Beispielinhalte.
      </p>
    </section>
  )
}
