import { render, screen } from '@testing-library/react'

import { ContactSection } from './ContactSection'

const site = { name: 'Golden Care', street: 'Musterstraße 12', zip: '1234', city: 'Musterort' }

describe('ContactSection', () => {
  it('shows the click-to-load map and the route button', () => {
    render(<ContactSection heading="Kontakt" site={site} />)
    expect(screen.getByRole('button', { name: 'Karte laden' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Route planen' })).toBeInTheDocument()
  })

  it('can hide the map', () => {
    render(<ContactSection heading="Kontakt" site={site} showMapEmbed={false} />)
    expect(screen.queryByRole('button', { name: 'Karte laden' })).not.toBeInTheDocument()
  })

  it('has no map without an address', () => {
    render(<ContactSection heading="Kontakt" site={{ name: 'Golden Care' }} />)
    expect(screen.queryByRole('button', { name: 'Karte laden' })).not.toBeInTheDocument()
  })
})
