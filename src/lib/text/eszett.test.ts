import { germanizeDocument, toGermanSpelling } from './eszett'

describe('toGermanSpelling', () => {
  it('replaces whole Swiss words only', () => {
    expect(toGermanSpelling('Regelmässige Pflege, ausschliesslich für grosse Hunde')).toBe(
      'Regelmäßige Pflege, ausschließlich für große Hunde',
    )
    expect(toGermanSpelling('Wellness, Massage, Wasser, Stress, Musterstrasse 12')).toBe(
      'Wellness, Massage, Wasser, Stress, Musterstraße 12',
    )
  })
})

describe('germanizeDocument', () => {
  it('walks nested content and keeps identifiers', () => {
    const doc = {
      id: 'x',
      slug: 'strasse',
      title: 'Bild vergrössern',
      layout: [{ content: { root: { children: [{ text: 'regelmässig' }] } } }],
    }
    expect(germanizeDocument(doc)).toEqual({
      id: 'x',
      slug: 'strasse',
      title: 'Bild vergrößern',
      layout: [{ content: { root: { children: [{ text: 'regelmäßig' }] } } }],
    })
  })

  it('returns null when nothing changes', () => {
    expect(germanizeDocument({ title: 'Fellpflege' })).toBeNull()
  })
})
