import { fallbackSite, formatAddress, mapsEmbedSrc, mapsHref, toSiteInfo } from './site'

describe('site info', () => {
  it('falls back without settings', () => {
    expect(toSiteInfo(null)).toEqual(fallbackSite)
  })

  it('normalises settings', () => {
    const site = toSiteInfo({
      name: ' Golden Care ',
      phone: '',
      schedule: [
        { days: ['mo'], opens: '09:00', closes: '12:00' },
        { days: ['tu'], opens: '9 Uhr', closes: '12:00' },
      ],
      latitude: 46.9,
      longitude: 'x',
      areaServed: [{ name: 'Bern' }, { name: '' }],
      socials: [
        { platform: 'instagram', url: 'https://instagram.com/x' },
        { platform: null, url: 'x' },
      ],
    })
    expect(site.name).toBe('Golden Care')
    expect(site.phone).toBeNull()
    expect(site.schedule).toEqual([{ days: ['mo'], opens: '09:00', closes: '12:00' }])
    expect(site.openingHours).toEqual([
      { days: 'Montag', hours: '09:00 – 12:00' },
      { days: 'Dienstag – Sonntag', hours: 'geschlossen' },
    ])
    expect(site.country).toBe('CH')
    expect(site.latitude).toBe(46.9)
    expect(site.longitude).toBeNull()
    expect(site.areaServed).toEqual(['Bern'])
    expect(site.socials).toEqual([{ platform: 'instagram', url: 'https://instagram.com/x' }])
  })

  it('formats the address and map link', () => {
    const site = { name: 'GC', street: 'Musterstrasse 12', zip: '1234', city: 'Musterort' }
    expect(formatAddress(site)).toBe('Musterstrasse 12, 1234 Musterort')
    expect(mapsHref(site)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Musterstrasse%2012%2C%201234%20Musterort',
    )
    expect(mapsHref({ ...site, mapsUrl: 'https://maps.example' })).toBe('https://maps.example')
    expect(formatAddress({ name: 'GC' })).toBeNull()
    expect(mapsHref({ name: 'GC' })).toBeNull()
  })
})

describe('mapsEmbedSrc', () => {
  it('prefers coordinates', () => {
    expect(mapsEmbedSrc({ name: 'GC', latitude: 47.1, longitude: 8.5, street: 'X 1' })).toBe(
      'https://maps.google.com/maps?q=47.1%2C8.5&z=15&hl=de&output=embed',
    )
  })

  it('falls back to the address and needs one of both', () => {
    expect(
      mapsEmbedSrc({ name: 'GC', street: 'Musterstrasse 12', zip: '1234', city: 'Musterort' }),
    ).toContain(`q=${encodeURIComponent('Musterstrasse 12, 1234 Musterort')}`)
    expect(mapsEmbedSrc({ name: 'GC' })).toBeNull()
  })

  it('exposes a one-line opening hours summary', () => {
    const site = toSiteInfo({ schedule: [{ days: ['sa'], opens: '09:00', closes: '14:00' }] })
    expect(site.hoursSummary).toBe('Sa 09:00–14:00')
  })
})
