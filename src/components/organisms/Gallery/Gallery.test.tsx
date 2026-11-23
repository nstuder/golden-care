import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Gallery } from './Gallery'

const images = [
  { id: '1', src: '/a.jpg', alt: 'Beagle', caption: 'Frisch gebadet' },
  { id: '2', src: '/b.jpg', alt: 'Pudel' },
  { id: '3', src: '/c.jpg', alt: 'Mops' },
]

describe('Gallery', () => {
  it('renders a thumbnail button per image', () => {
    render(<Gallery heading="Galerie" images={images} />)
    expect(screen.getAllByRole('button', { name: /Bild vergrößern/ })).toHaveLength(3)
  })

  it('opens the lightbox and navigates with buttons and keys', async () => {
    const user = userEvent.setup()
    render(<Gallery images={images} />)

    await user.click(screen.getByRole('button', { name: 'Bild vergrößern: Frisch gebadet' }))
    const dialog = screen.getByRole('dialog', { name: 'Frisch gebadet' })
    expect(dialog).toHaveTextContent('1 / 3')
    expect(screen.getByRole('button', { name: 'Schließen' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Nächstes Bild' }))
    expect(screen.getByRole('dialog', { name: 'Pudel' })).toHaveTextContent('2 / 3')

    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('dialog', { name: 'Mops' })).toHaveTextContent('3 / 3')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders nothing without images', () => {
    const { container } = render(<Gallery images={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
