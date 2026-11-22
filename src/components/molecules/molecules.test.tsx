import { render, screen } from '@testing-library/react'

import { sampleImage } from '@/test/utils'

import { ContactItem } from './ContactItem'
import { FaqItem } from './FaqItem'
import { FeatureItem } from './FeatureItem'
import { OpeningHours } from './OpeningHours'
import { SectionHeader } from './SectionHeader'
import { ServiceCard } from './ServiceCard'
import { SocialLinks } from './SocialLinks'
import { TestimonialCard } from './TestimonialCard'

describe('SectionHeader', () => {
  it('renders eyebrow, heading and intro', () => {
    render(<SectionHeader eyebrow="Kicker" heading="Titel" intro="Einleitung" />)
    expect(screen.getByText('Kicker')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Titel' })).toBeInTheDocument()
    expect(screen.getByText('Einleitung')).toBeInTheDocument()
  })

  it('renders nothing when empty', () => {
    const { container } = render(<SectionHeader />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ServiceCard', () => {
  it('shows title, summary and image', () => {
    render(<ServiceCard title="Baden" summary="Sanft" icon="bath" image={sampleImage} />)
    expect(screen.getByRole('heading', { name: 'Baden' })).toBeInTheDocument()
    expect(screen.getByText('Sanft')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ein Hund' })).toBeInTheDocument()
  })

  it('omits the image area when image is undefined', () => {
    render(<ServiceCard title="Baden" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

describe('TestimonialCard', () => {
  it('renders quote and author', () => {
    render(<TestimonialCard quote="Super!" author="Anna" dog="mit Luna" />)
    expect(screen.getByText('„Super!“')).toBeInTheDocument()
    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByText('mit Luna')).toBeInTheDocument()
  })
})

describe('FeatureItem', () => {
  it('renders title and text', () => {
    render(<FeatureItem title="Hygiene" text="Sauber" icon="shield" />)
    expect(screen.getByRole('heading', { name: 'Hygiene' })).toBeInTheDocument()
    expect(screen.getByText('Sauber')).toBeInTheDocument()
  })
})

describe('ContactItem', () => {
  it('renders a link', () => {
    render(
      <ContactItem icon="phone" label="Telefon" href="tel:+41">
        +41
      </ContactItem>,
    )
    expect(screen.getByRole('link', { name: /Telefon/ })).toHaveAttribute('href', 'tel:+41')
  })

  it('opens web links in a new tab', () => {
    render(
      <ContactItem icon="whatsapp" label="WhatsApp" href="https://wa.me/41">
        Schreiben
      </ContactItem>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
  })

  it('renders plain text without href', () => {
    render(
      <ContactItem icon="map-pin" label="Adresse">
        Musterstrasse
      </ContactItem>,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Musterstrasse')).toBeInTheDocument()
  })
})

describe('FaqItem', () => {
  it('uses a details element', () => {
    const { container } = render(<FaqItem question="Wie lange?" answer="2 Stunden" defaultOpen />)
    expect(container.querySelector('details')).toHaveAttribute('open')
    expect(screen.getByText('Wie lange?')).toBeInTheDocument()
    expect(screen.getByText('2 Stunden')).toBeInTheDocument()
  })
})

describe('OpeningHours', () => {
  it('lists entries and note', () => {
    render(<OpeningHours entries={[{ days: 'Di – Fr', hours: '8–18' }]} note="Nach Vereinbarung" />)
    expect(screen.getByText('Di – Fr')).toBeInTheDocument()
    expect(screen.getByText('8–18')).toBeInTheDocument()
    expect(screen.getByText('Nach Vereinbarung')).toBeInTheDocument()
  })

  it('renders nothing without data', () => {
    const { container } = render(<OpeningHours entries={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('SocialLinks', () => {
  it('renders labelled links', () => {
    render(<SocialLinks links={[{ platform: 'instagram', url: 'https://instagram.com/gc' }]} />)
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/gc',
    )
  })
})
