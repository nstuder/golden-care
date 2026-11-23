import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MAP_CONSENT_KEY, MapEmbed } from './MapEmbed'

const src = 'https://maps.google.com/maps?q=x&output=embed'

describe('MapEmbed', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('does not contact Google before the visitor agrees', async () => {
    const user = userEvent.setup()
    render(<MapEmbed src={src} title="Karte" privacyHref="/datenschutz" />)
    expect(screen.queryByTitle('Karte')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Datenschutzerklärung' })).toHaveAttribute(
      'href',
      '/datenschutz',
    )

    await user.click(screen.getByRole('button', { name: 'Karte laden' }))
    expect(screen.getByTitle('Karte')).toHaveAttribute('src', src)
    expect(window.localStorage.getItem(MAP_CONSENT_KEY)).toBeNull()
  })

  it('remembers "Immer laden"', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<MapEmbed src={src} title="Karte" />)
    await user.click(screen.getByRole('button', { name: 'Immer laden' }))
    expect(window.localStorage.getItem(MAP_CONSENT_KEY)).toBe('1')
    unmount()

    render(<MapEmbed src={src} title="Karte" />)
    expect(await screen.findByTitle('Karte')).toBeInTheDocument()
  })
})
