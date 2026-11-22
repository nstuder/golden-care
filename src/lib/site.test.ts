import { fallbackSite, formatAddress, mapsHref, toSiteInfo } from './site'

describe('site info', () => {
  it('falls back without settings', () => {
    expect(toSiteInfo(null)).toEqual(fallbackSite)
  })

  it('normalises settings', () => {
    const site = toSiteInfo({
      name: ' Golden Care ',
      phone: '',
      openingHours: [
        { days: 'Mo', hours: '9–12' },
        { days: 'Di', hours: null },
      ],
      socials: [
        { platform: 'instagram', url: 'https://instagram.com/x' },
        { platform: null, url: 'x' },
      ],
    })
    expect(site.name).toBe('Golden Care')
    expect(site.phone).toBeNull()
    expect(site.openingHours).toEqual([{ days: 'Mo', hours: '9–12' }])
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
