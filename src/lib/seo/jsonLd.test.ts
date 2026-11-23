import type { SiteInfo } from '../site'
import {
  absoluteUrl,
  buildBreadcrumbs,
  buildFaqPage,
  buildGraph,
  buildLocalBusiness,
  buildWebPage,
  buildWebSite,
  compact,
  serializeJsonLd,
} from './jsonLd'

const base = 'https://golden-care.ch'

const site: SiteInfo = {
  name: 'Golden Care',
  tagline: 'Salon für Hundegesundheit und Fellpflege',
  description: 'Liebevolle Fellpflege',
  owner: 'Anna Muster',
  street: 'Musterstraße 12',
  zip: '1234',
  city: 'Musterort',
  region: 'BE',
  country: 'CH',
  latitude: 46.948,
  longitude: 7.447,
  phone: '+41 79 123 45 67',
  email: 'hallo@golden-care.ch',
  schedule: [
    { days: ['tu', 'we', 'th', 'fr'], opens: '08:30', closes: '18:00' },
    { days: ['sa'], opens: '09:00', closes: '14:00' },
  ],
  socials: [{ platform: 'instagram', url: 'https://instagram.com/goldencare' }],
  areaServed: ['Musterort', 'Bern'],
  priceRange: '$$',
  image: { src: '/api/media/file/hero.jpg', alt: 'Hund' },
}

describe('helpers', () => {
  it('builds absolute URLs', () => {
    expect(absoluteUrl(`${base}/`, '/kontakt')).toBe(`${base}/kontakt`)
    expect(absoluteUrl(base, 'logo.png')).toBe(`${base}/logo.png`)
    expect(absoluteUrl(base, 'https://cdn.example/x.jpg')).toBe('https://cdn.example/x.jpg')
  })

  it('removes empty values recursively', () => {
    expect(
      compact({
        a: 1,
        b: null,
        c: '',
        d: [],
        e: { f: undefined },
        g: [{ h: null }, 2],
        i: 0,
        j: false,
      }),
    ).toEqual({
      a: 1,
      g: [2],
      i: 0,
      j: false,
    })
  })

  it('serializes safely for a script tag', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(json).not.toContain('</script>')
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>')
  })
})

describe('buildLocalBusiness', () => {
  const business = buildLocalBusiness({
    site,
    baseUrl: base,
    logoUrl: '/logo.png',
    services: [{ name: 'Baden & Föhnen', description: 'Sanfte Wäsche' }, { name: 'Trimmen' }],
  })

  it('describes the business with address, geo and contact', () => {
    expect(business).toMatchObject({
      '@type': 'LocalBusiness',
      '@id': `${base}/#business`,
      name: 'Golden Care',
      url: `${base}/`,
      logo: `${base}/logo.png`,
      image: [`${base}/api/media/file/hero.jpg`],
      telephone: '+41 79 123 45 67',
      email: 'hallo@golden-care.ch',
      priceRange: '$$',
      founder: { '@type': 'Person', name: 'Anna Muster' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 12',
        postalCode: '1234',
        addressLocality: 'Musterort',
        addressRegion: 'BE',
        addressCountry: 'CH',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 46.948, longitude: 7.447 },
      sameAs: ['https://instagram.com/goldencare'],
      areaServed: [
        { '@type': 'Place', name: 'Musterort' },
        { '@type': 'Place', name: 'Bern' },
      ],
    })
    expect(business.hasMap).toContain('google.com/maps')
  })

  it('includes structured opening hours', () => {
    expect(business.openingHoursSpecification).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'https://schema.org/Tuesday',
          'https://schema.org/Wednesday',
          'https://schema.org/Thursday',
          'https://schema.org/Friday',
        ],
        opens: '08:30',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['https://schema.org/Saturday'],
        opens: '09:00',
        closes: '14:00',
      },
    ])
  })

  it('lists services as offer catalog', () => {
    const catalog = business.hasOfferCatalog as {
      itemListElement: { itemOffered: Record<string, unknown> }[]
    }
    expect(catalog.itemListElement).toHaveLength(2)
    expect(catalog.itemListElement[0].itemOffered).toMatchObject({
      '@type': 'Service',
      name: 'Baden & Föhnen',
      description: 'Sanfte Wäsche',
      provider: { '@id': `${base}/#business` },
    })
    expect(catalog.itemListElement[1].itemOffered).not.toHaveProperty('description')
  })

  it('omits unknown data and supports other business types', () => {
    const minimal = buildLocalBusiness({
      site: { name: 'Golden Care' },
      baseUrl: base,
      type: 'PetStore',
    })
    expect(minimal).toEqual({
      '@type': 'PetStore',
      '@id': `${base}/#business`,
      name: 'Golden Care',
      url: `${base}/`,
    })
  })
})

describe('website and page nodes', () => {
  it('links website to the business', () => {
    expect(buildWebSite({ site, baseUrl: base })).toMatchObject({
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      inLanguage: 'de-DE',
      publisher: { '@id': `${base}/#business` },
    })
  })

  it('builds a web page with breadcrumb reference', () => {
    expect(
      buildWebPage({
        baseUrl: base,
        slug: 'kontakt',
        name: 'Kontakt',
        type: 'ContactPage',
        hasBreadcrumb: true,
      }),
    ).toMatchObject({
      '@type': 'ContactPage',
      '@id': `${base}/kontakt#webpage`,
      url: `${base}/kontakt`,
      isPartOf: { '@id': `${base}/#website` },
      breadcrumb: { '@id': `${base}/kontakt#breadcrumb` },
    })
  })

  it('builds breadcrumbs', () => {
    expect(
      buildBreadcrumbs(base, [
        { name: 'Startseite', path: '/' },
        { name: 'Galerie', path: '/galerie' },
      ]),
    ).toEqual({
      '@type': 'BreadcrumbList',
      '@id': `${base}/galerie#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Galerie', item: `${base}/galerie` },
      ],
    })
  })

  it('builds an FAQ page', () => {
    expect(buildFaqPage(`${base}/leistungen`, [])).toBeNull()
    expect(
      buildFaqPage(`${base}/leistungen`, [{ question: 'Wie lange?', answer: '2 Stunden' }]),
    ).toEqual({
      '@type': 'FAQPage',
      '@id': `${base}/leistungen#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Wie lange?',
          acceptedAnswer: { '@type': 'Answer', text: '2 Stunden' },
        },
      ],
    })
  })

  it('wraps nodes in a graph and skips empty ones', () => {
    const graph = buildGraph(buildWebSite({ site, baseUrl: base }), null, false, undefined)
    expect(graph['@context']).toBe('https://schema.org')
    expect(graph['@graph']).toHaveLength(1)
  })
})
