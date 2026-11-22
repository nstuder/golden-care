import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  it('renders a button and handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Senden</Button>)
    const button = screen.getByRole('button', { name: 'Senden' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders an internal link', () => {
    render(<Button href="/kontakt">Kontakt</Button>)
    const link = screen.getByRole('link', { name: 'Kontakt' })
    expect(link).toHaveAttribute('href', '/kontakt')
    expect(link).not.toHaveAttribute('target')
  })

  it('opens new-tab links safely', () => {
    render(
      <Button href="https://maps.example" newTab>
        Karte
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Karte' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies variants', () => {
    render(
      <Button variant="secondary" size="lg" className="extra">
        X
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-700', 'px-8', 'extra')
  })

  it('can be disabled', () => {
    render(<Button disabled>X</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
