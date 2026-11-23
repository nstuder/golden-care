import { render, screen } from '@testing-library/react'

import { Container } from './Container'
import { Eyebrow } from './Eyebrow'
import { Logo, LogoBadge, splitTagline } from './Logo'
import { Section } from './Section'
import { Text } from './Text'

describe('simple atoms', () => {
  it('Text renders a paragraph with tone', () => {
    render(<Text tone="inverted">Hallo</Text>)
    expect(screen.getByText('Hallo').tagName).toBe('P')
    expect(screen.getByText('Hallo')).toHaveClass('text-secondary-100')
  })

  it('Eyebrow renders uppercase kicker', () => {
    render(<Eyebrow>Leistungen</Eyebrow>)
    expect(screen.getByText('Leistungen')).toHaveClass('uppercase')
  })

  it('Container limits the width', () => {
    render(<Container width="narrow">Inhalt</Container>)
    expect(screen.getByText('Inhalt')).toHaveClass('max-w-3xl')
  })

  it('Section applies tone', () => {
    render(<Section tone="dark">Dunkel</Section>)
    expect(screen.getByText('Dunkel')).toHaveAttribute('data-tone', 'dark')
  })

  it('Logo shows name and tagline', () => {
    const { container } = render(<Logo name="Golden Care" tagline="Fellpflege" />)
    expect(container).toHaveTextContent('Golden Care')
    expect(screen.getByText('Golden')).toHaveClass('text-primary-400')
    expect(screen.getByText('Fellpflege')).toBeInTheDocument()
  })

  it('LogoBadge is an accessible image with name and tagline', () => {
    render(<LogoBadge name="Golden Care" tagline="Salon für Hundegesundheit und Fellpflege" />)
    const badge = screen.getByRole('img', {
      name: 'Golden Care – Salon für Hundegesundheit und Fellpflege',
    })
    expect(badge).toHaveTextContent('GOLDEN CARE')
    expect(badge).toHaveTextContent('SALON FÜR HUNDEGESUNDHEIT')
    expect(badge).toHaveTextContent('UND FELLPFLEGE')
  })

  it('splitTagline balances long taglines over two lines', () => {
    expect(splitTagline('Fellpflege')).toEqual(['Fellpflege'])
    expect(splitTagline('Salon für Hundegesundheit und Fellpflege')).toEqual([
      'Salon für Hundegesundheit',
      'und Fellpflege',
    ])
    expect(splitTagline('')).toEqual([])
  })
})
