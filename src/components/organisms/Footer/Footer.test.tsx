import { render, screen } from '@testing-library/react'

import { Footer } from './Footer'

const site = {
  name: 'Golden Care',
  tagline: 'Fellpflege',
  description: 'Liebevolle Pflege',
  phone: '+41 79 123 45 67',
  whatsapp: '+41 79 123 45 67',
  email: 'hallo@golden-care.ch',
  street: 'Musterstrasse 12',
  zip: '1234',
  city: 'Musterort',
  openingHours: [{ days: 'Samstag', hours: '9–14' }],
  appointmentNote: 'Nach Vereinbarung',
  socials: [{ platform: 'instagram', url: 'https://instagram.com/gc' }],
}

describe('Footer', () => {
  it('shows contact details, hours and legal links', () => {
    render(
      <Footer
        site={site}
        links={[{ href: '/impressum', label: 'Impressum', newTab: false }]}
        year={2030}
      />,
    )
    expect(screen.getByRole('link', { name: /Telefon/ })).toHaveAttribute(
      'href',
      'tel:+41791234567',
    )
    expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
      'href',
      'https://wa.me/41791234567',
    )
    expect(screen.getByRole('link', { name: /E-Mail/ })).toHaveAttribute(
      'href',
      'mailto:hallo@golden-care.ch',
    )
    expect(screen.getByRole('link', { name: /Adresse/ })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps'),
    )
    expect(screen.getByText('Samstag')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Impressum' })).toHaveAttribute('href', '/impressum')
    expect(screen.getByText('© 2030 Golden Care')).toBeInTheDocument()
  })

  it('hides missing contact options', () => {
    render(<Footer site={{ name: 'Golden Care' }} />)
    expect(screen.queryByText('Telefon')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
