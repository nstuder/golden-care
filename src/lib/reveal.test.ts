import { reveal } from './reveal'

describe('reveal', () => {
  it('marks elements and staggers list items', () => {
    expect(reveal()).toEqual({ 'data-reveal': 'up' })
    expect(reveal('zoom', 2, 60)).toEqual({
      'data-reveal': 'zoom',
      style: { '--reveal-delay': '120ms' },
    })
  })

  it('caps the delay for long lists', () => {
    expect(reveal('up', 20).style).toEqual({ '--reveal-delay': '450ms' })
  })
})
