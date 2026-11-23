import { buildPageJsonLd, pageTypeFor } from './pageJsonLd'

const base = 'https://golden-care.ch'
const site = { name: 'Golden Care', tagline: 'Fellpflege' }

describe('pageTypeFor', () => {
  it('picks a specific page type', () => {
    expect(pageTypeFor({ title: 'K', layout: [{ blockType: 'contact' }] })).toBe('ContactPage')
    expect(pageTypeFor({ title: 'G', layout: [{ blockType: 'gallery' }] })).toBe('CollectionPage')
    expect(pageTypeFor({ title: 'X', layout: [{ blockType: 'hero' }] })).toBe('WebPage')
  })
})

describe('buildPageJsonLd', () => {
  it('has no breadcrumb on the home page', () => {
    const graph = buildPageJsonLd({ page: { title: 'Start', slug: 'home' }, site, baseUrl: base })
    expect(graph['@graph'].map((n) => n['@type'])).toEqual(['WebPage'])
    expect(graph['@graph'][0].url).toBe(`${base}/`)
  })

  it('adds breadcrumbs and FAQ for sub pages', () => {
    const graph = buildPageJsonLd({
      page: {
        title: 'Leistungen',
        slug: 'leistungen',
        updatedAt: '2026-11-23T10:00:00.000Z',
        layout: [
          { blockType: 'hero', text: 'Pflege' },
          {
            blockType: 'faq',
            items: [
              { question: 'Wie lange?', answer: '2 Stunden' },
              { question: 'Leer', answer: '' },
            ],
          },
        ] as never,
      },
      site,
      baseUrl: base,
    })
    const [webPage, breadcrumbs, faq] = graph['@graph']
    expect(webPage).toMatchObject({
      '@type': 'WebPage',
      description: 'Pflege',
      dateModified: '2026-11-23T10:00:00.000Z',
    })
    expect(breadcrumbs['@type']).toBe('BreadcrumbList')
    expect(faq).toMatchObject({ '@type': 'FAQPage', mainEntity: [{ name: 'Wie lange?' }] })
  })
})
