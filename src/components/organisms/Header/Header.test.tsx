import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { setPathname } from '@/test/utils'

import { Header } from './Header'

const props = {
  siteName: 'Golden Care',
  tagline: 'Fellpflege',
  links: [
    { href: '/leistungen', label: 'Leistungen', newTab: false },
    { href: '/kontakt', label: 'Kontakt', newTab: false },
  ],
  cta: { href: '/kontakt#form', label: 'Termin vereinbaren', newTab: false },
  phone: '+41 79 123 45 67',
}

describe('Header', () => {
  it('renders logo, navigation, phone and CTA', () => {
    render(<Header {...props} />)
    expect(screen.getByRole('link', { name: 'Golden Care – Startseite' })).toHaveAttribute(
      'href',
      '/',
    )
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' })
    expect(within(nav).getAllByRole('link')).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /\+41 79 123 45 67/ })[0]).toHaveAttribute(
      'href',
      'tel:+41791234567',
    )
    expect(screen.getAllByRole('link', { name: 'Termin vereinbaren' })[0]).toHaveAttribute(
      'href',
      '/kontakt#form',
    )
  })

  it('has a skip link', () => {
    render(<Header {...props} />)
    expect(screen.getByRole('link', { name: 'Zum Inhalt springen' })).toHaveAttribute(
      'href',
      '#inhalt',
    )
  })

  it('toggles the mobile menu and closes it with Escape', async () => {
    const user = userEvent.setup()
    render(<Header {...props} />)
    const toggle = screen.getByRole('button', { name: 'Menü öffnen' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('mobile-menu')).not.toBeVisible()

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Menü schliessen' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('navigation', { name: 'Mobile Navigation' })).toBeVisible()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('closes the mobile menu after navigating', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Header {...props} />)
    await user.click(screen.getByRole('button', { name: 'Menü öffnen' }))
    setPathname('/kontakt')
    rerender(<Header {...props} />)
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toBeInTheDocument()
  })
})
