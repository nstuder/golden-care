import { render, screen } from '@testing-library/react'

import { MapEmbed } from './MapEmbed'

describe('MapEmbed', () => {
  it('embeds the map right away', () => {
    const src = 'https://maps.google.com/maps?q=x&output=embed'
    render(<MapEmbed src={src} title="Karte: Golden Care" />)
    const frame = screen.getByTitle('Karte: Golden Care')
    expect(frame).toHaveAttribute('src', src)
    expect(frame).toHaveAttribute('loading', 'lazy')
  })
})
