import { slugify } from './slug'

describe('slugify', () => {
  it.each([
    ['Über uns', 'ueber-uns'],
    ['Kontakt & Anfahrt', 'kontakt-anfahrt'],
    ['  Grösse   Fell ', 'groesse-fell'],
    ['Café Crème', 'cafe-creme'],
    ['Straße', 'strasse'],
  ])('%s → %s', (input, expected) => expect(slugify(input)).toBe(expected))
})
