import { render, screen } from '@testing-library/react'

import { BaseTemplate } from './BaseTemplate'

describe('BaseTemplate', () => {
  it('renders header, main with skip target, footer and banner', () => {
    render(
      <BaseTemplate
        banner={<div>Banner</div>}
        header={{ siteName: 'Golden Care', links: [] }}
        footer={{ site: { name: 'Golden Care' }, year: 2030 }}
      >
        <p>Inhalt</p>
      </BaseTemplate>,
    )
    expect(screen.getByText('Banner')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'inhalt')
    expect(screen.getByRole('main')).toHaveTextContent('Inhalt')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2030 Golden Care')
  })
})
