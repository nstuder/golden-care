import {
  isExternal,
  pathForSlug,
  resolveHref,
  resolveLink,
  resolveLinks,
  telHref,
  whatsappHref,
} from './links'

describe('links', () => {
  it('maps slugs to paths', () => {
    expect(pathForSlug('home')).toBe('/')
    expect(pathForSlug(null)).toBe('/')
    expect(pathForSlug('kontakt')).toBe('/kontakt')
  })

  it('resolves internal references and custom URLs', () => {
    expect(resolveHref({ type: 'reference', reference: { slug: 'galerie' } })).toBe('/galerie')
    expect(resolveHref({ type: 'reference', reference: 'unpopulated-id' })).toBeNull()
    expect(resolveHref({ type: 'custom', url: ' https://example.com ' })).toBe(
      'https://example.com',
    )
    expect(resolveHref(null)).toBeNull()
  })

  it('drops links without label or target', () => {
    expect(resolveLink({ type: 'custom', url: '/x' })).toBeNull()
    expect(resolveLink({ type: 'custom', url: '/x', label: 'X', newTab: true })).toEqual({
      href: '/x',
      label: 'X',
      newTab: true,
    })
    expect(
      resolveLinks([
        { link: { type: 'custom', url: '/a', label: 'A' } },
        { link: { type: 'reference', reference: null, label: 'B' } },
        null,
      ]),
    ).toEqual([{ href: '/a', label: 'A', newTab: false }])
  })

  it('detects external links', () => {
    expect(isExternal('https://x.ch')).toBe(true)
    expect(isExternal('tel:+41')).toBe(true)
    expect(isExternal('mailto:a@b.ch')).toBe(true)
    expect(isExternal('/kontakt')).toBe(false)
  })

  it('formats phone links', () => {
    expect(telHref('+41 79 123 45 67')).toBe('tel:+41791234567')
    expect(whatsappHref('+41 79 123 45 67')).toBe('https://wa.me/41791234567')
  })
})
