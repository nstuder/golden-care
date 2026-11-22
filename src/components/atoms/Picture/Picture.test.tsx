import { render, screen } from '@testing-library/react'

import { sampleImage } from '@/test/utils'

import { Picture } from './Picture'

describe('Picture', () => {
  it('renders the image with alt text', () => {
    render(<Picture image={sampleImage} />)
    expect(screen.getByRole('img', { name: 'Ein Hund' })).toBeInTheDocument()
  })

  it('renders intrinsic size when not filling', () => {
    render(<Picture image={sampleImage} fill={false} />)
    const img = screen.getByRole('img', { name: 'Ein Hund' })
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '600')
  })

  it('shows a placeholder without image', () => {
    render(<Picture image={null} />)
    expect(screen.getByRole('img', { name: 'Platzhalterbild' })).toBeInTheDocument()
  })
})
