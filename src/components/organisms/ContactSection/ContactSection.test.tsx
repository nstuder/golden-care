import { render, screen } from '@testing-library/react'

import { ContactSection } from './ContactSection'

const site = { name: 'Golden Care', street: 'Musterstrasse 12', zip: '1234', city: 'Musterort' }

describe('ContactSection', () => {
  it('shows the map and the route button', () => {
    render(<ContactSection heading="Kontakt" site={site} />)
    expect(
      screen.getByTitle('Karte: Golden Care, Musterstrasse 12, 1234 Musterort'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Route planen' })).toBeInTheDocument()
  })

  it('can hide the map', () => {
    render(<ContactSection heading="Kontakt" site={site} showMapEmbed={false} />)
    expect(screen.queryByTitle(/^Karte/)).not.toBeInTheDocument()
  })

  it('has no map without an address', () => {
    render(<ContactSection heading="Kontakt" site={{ name: 'Golden Care' }} />)
    expect(screen.queryByTitle(/^Karte/)).not.toBeInTheDocument()
  })
})
