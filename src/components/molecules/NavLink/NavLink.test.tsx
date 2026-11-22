import { render, screen } from '@testing-library/react'

import { setPathname } from '@/test/utils'

import { isActivePath, NavLink } from './NavLink'

describe('isActivePath', () => {
  it('matches exact and nested paths', () => {
    expect(isActivePath('/', '/')).toBe(true)
    expect(isActivePath('/kontakt', '/')).toBe(false)
    expect(isActivePath('/kontakt', '/kontakt')).toBe(true)
    expect(isActivePath('/kontakt/x', '/kontakt')).toBe(true)
    expect(isActivePath('/kontakte', '/kontakt')).toBe(false)
    expect(isActivePath(null, '/')).toBe(false)
  })
})

describe('NavLink', () => {
  it('marks the current page', () => {
    setPathname('/galerie')
    render(
      <>
        <NavLink href="/galerie" label="Galerie" />
        <NavLink href="/kontakt" label="Kontakt" />
      </>,
    )
    expect(screen.getByRole('link', { name: 'Galerie' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Kontakt' })).not.toHaveAttribute('aria-current')
  })
})
