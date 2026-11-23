import { render } from '@testing-library/react'

import { JsonLd } from './JsonLd'

describe('JsonLd', () => {
  it('renders an ld+json script', () => {
    const { container } = render(
      <JsonLd data={{ '@context': 'https://schema.org', name: 'Golden <Care>' }} />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script!.innerHTML).not.toContain('<Care>')
    expect(JSON.parse(script!.innerHTML).name).toBe('Golden <Care>')
  })
})
