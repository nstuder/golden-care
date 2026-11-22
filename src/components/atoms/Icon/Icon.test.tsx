import { render, screen } from '@testing-library/react'

import { Icon } from './Icon'

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="scissors" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('data-icon', 'scissors')
  })

  it('can be labelled', () => {
    render(<Icon name="phone" label="Telefon" />)
    expect(screen.getByRole('img', { name: 'Telefon' })).toBeInTheDocument()
  })

  it('renders brand icons and falls back to the paw', () => {
    const { container } = render(
      <>
        <Icon name="instagram" />
        <Icon name="does-not-exist" />
        <Icon />
      </>,
    )
    expect(container.querySelectorAll('svg')).toHaveLength(3)
  })
})
