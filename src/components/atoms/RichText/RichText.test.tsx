import { render, screen } from '@testing-library/react'

import { richText } from '@/seed/richText'

import { RichText } from './RichText'

describe('RichText', () => {
  it('renders lexical content', () => {
    render(
      <RichText
        data={richText({ h2: 'Titel' }, 'Ein **fetter** Satz.', { ul: ['Eins', 'Zwei'] })}
      />,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Titel' })).toBeInTheDocument()
    expect(screen.getByText('fetter').tagName).toBe('STRONG')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders nothing for empty content', () => {
    const { container } = render(<RichText data={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
