import { render, screen, within } from '@testing-library/react'

import { ContactSection } from './ContactSection'

const site = { name: 'Golden Care', street: 'Musterstraße 12', zip: '1234', city: 'Musterort' }

describe('ContactSection', () => {
  it('shows the click-to-load map inside the address card', () => {
    render(<ContactSection heading="Kontakt" site={site} />)
    const card = screen.getByRole('heading', { name: 'Anfahrt' }).closest('div[data-reveal]')!
    expect(
      within(card as HTMLElement).getByRole('button', { name: 'Karte laden' }),
    ).toBeInTheDocument()
    expect(
      within(card as HTMLElement).getByRole('link', { name: /Musterstraße 12/ }),
    ).toHaveAttribute('href', expect.stringContaining('google.com/maps'))
    expect(screen.queryByRole('link', { name: 'Route planen' })).not.toBeInTheDocument()
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
