import { toImage, toLocalUrl } from './media'

describe('toLocalUrl', () => {
  it('strips the origin from Payload media URLs', () => {
    expect(toLocalUrl('http://localhost:3000/api/media/file/a.jpg')).toBe('/api/media/file/a.jpg')
  })
  it('keeps other URLs', () => {
    expect(toLocalUrl('/api/media/file/a.jpg')).toBe('/api/media/file/a.jpg')
    expect(toLocalUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg')
  })
})

describe('toImage', () => {
  const doc = {
    url: 'https://golden-care.ch/api/media/file/dog.jpg',
    alt: 'Hund',
    width: 2000,
    height: 1500,
    sizes: {
      card: { url: '/api/media/file/dog-900x675.jpg', width: 900, height: 675 },
      empty: { url: null },
    },
  }

  it('returns null for ids and empty values', () => {
    expect(toImage('abc')).toBeNull()
    expect(toImage(null)).toBeNull()
    expect(toImage({ alt: 'x' })).toBeNull()
  })

  it('uses the original image', () => {
    expect(toImage(doc)).toEqual({
      src: '/api/media/file/dog.jpg',
      alt: 'Hund',
      width: 2000,
      height: 1500,
    })
  })

  it('prefers a generated size and falls back to the original', () => {
    expect(toImage(doc, 'card')).toEqual({
      src: '/api/media/file/dog-900x675.jpg',
      alt: 'Hund',
      width: 900,
      height: 675,
    })
    expect(toImage(doc, 'empty')?.src).toBe('/api/media/file/dog.jpg')
  })
})
