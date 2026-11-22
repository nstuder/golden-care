import { render, screen } from '@testing-library/react'

import { Heading } from './Heading'

describe('Heading', () => {
  it('renders the semantic level', () => {
    render(<Heading level={1}>Golden Care</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Golden Care' })).toBeInTheDocument()
  })

  it('defaults to h2 and can be visually resized', () => {
    render(<Heading size={5}>Titel</Heading>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('text-lg')
  })

  it('supports inverted colours', () => {
    render(<Heading inverted>Dunkel</Heading>)
    expect(screen.getByRole('heading')).toHaveClass('text-white')
  })
})
