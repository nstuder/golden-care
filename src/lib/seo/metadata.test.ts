import type { SiteInfo } from '../site'
import { buildPageMetadata, pageDescription, pageImage, pageTitle, truncate } from './metadata'

const base = 'https://golden-care.ch'
const site: SiteInfo = {
  name: 'Golden Care',
  tagline: 'Salon für Hundegesundheit und Fellpflege',
  description: 'Liebevolle Fellpflege',
  image: { src: '/api/media/file/default.jpg', alt: 'Default', width: 1200, height: 630 },
}
const heroImage = { url: '/api/media/file/hero.jpg', alt: 'Hero', width: 1920, height: 1280 }
const page = {
  title: 'Leistungen',
  slug: 'leistungen',
  layout: [{ blockType: 'hero', text: 'Pflege, die man sieht und spürt.', image: heroImage }],
}

describe('truncate', () => {
  it('keeps short text and cuts long text at a word boundary', () => {
    expect(truncate('  kurz   und gut ')).toBe('kurz und gut')
    const result = truncate('wort '.repeat(50), 30)
    expect(result.length).toBeLessThanOrEqual(30)
    expect(result.endsWith('wort…')).toBe(true)
  })
})

describe('page SEO values', () => {
  it('derives the title', () => {
    expect(pageTitle({ title: 'Startseite', slug: 'home' }, site)).toBe(
      'Golden Care – Salon für Hundegesundheit und Fellpflege',
    )
    expect(pageTitle(page, site)).toBe('Leistungen – Golden Care')
    expect(pageTitle({ ...page, meta: { title: 'Eigener Titel' } }, site)).toBe('Eigener Titel')
  })

  it('falls back from SEO description to hero text to site description', () => {
    expect(pageDescription({ ...page, meta: { description: 'SEO' } }, site)).toBe('SEO')
    expect(pageDescription(page, site)).toBe('Pflege, die man sieht und spürt.')
    expect(pageDescription({ title: 'X' }, site)).toBe('Liebevolle Fellpflege')
  })

  it('falls back from SEO image to hero image to default image', () => {
    expect(
      pageImage({ ...page, meta: { image: { url: '/seo.jpg', alt: 'SEO' } } }, site)?.src,
    ).toBe('/seo.jpg')
    expect(pageImage(page, site)?.src).toBe('/api/media/file/hero.jpg')
    expect(pageImage({ title: 'X' }, site)?.src).toBe('/api/media/file/default.jpg')
  })
})

describe('buildPageMetadata', () => {
  it('builds canonical, Open Graph and Twitter data', () => {
    const metadata = buildPageMetadata({ page, site, baseUrl: base, allowIndexing: true })
    expect(metadata.title).toEqual({ absolute: 'Leistungen – Golden Care' })
    expect(metadata.alternates?.canonical).toBe('/leistungen')
    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect(metadata.openGraph).toMatchObject({
      url: `${base}/leistungen`,
      locale: 'de_CH',
      siteName: 'Golden Care',
      images: [{ url: `${base}/api/media/file/hero.jpg`, width: 1920, height: 1280, alt: 'Hero' }],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [`${base}/api/media/file/hero.jpg`],
    })
  })

  it('blocks indexing before go-live or for noindex pages', () => {
    expect(buildPageMetadata({ page, site, baseUrl: base, allowIndexing: false }).robots).toEqual({
      index: false,
      follow: false,
    })
    expect(
      buildPageMetadata({
        page: { ...page, meta: { noIndex: true } },
        site,
        baseUrl: base,
        allowIndexing: true,
      }).robots,
    ).toEqual({ index: false, follow: false })
  })

  it('uses the home path for the start page', () => {
    const metadata = buildPageMetadata({
      page: { title: 'Start', slug: 'home' },
      site,
      baseUrl: base,
      allowIndexing: true,
    })
    expect(metadata.alternates?.canonical).toBe('/')
  })
})
