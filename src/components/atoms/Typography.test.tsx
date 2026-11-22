import { render, screen } from '@testing-library/react'

import { Container } from './Container'
import { Eyebrow } from './Eyebrow'
import { Logo } from './Logo'
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
    render(<Logo name="Golden Care" tagline="Fellpflege" />)
    expect(screen.getByText('Golden Care')).toBeInTheDocument()
    expect(screen.getByText('Fellpflege')).toBeInTheDocument()
  })
})
