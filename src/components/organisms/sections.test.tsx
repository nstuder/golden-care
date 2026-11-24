import { render, screen, within } from '@testing-library/react'

import { richText } from '@/seed/richText'
import { sampleImage } from '@/test/utils'

import { CallToAction } from './CallToAction'
import { ContactSection } from './ContactSection'
import { Faq } from './Faq'
import { Features } from './Features'
import { Hero } from './Hero'
import { ImageText } from './ImageText'
import { PreviewBanner } from './PreviewBanner'
import { RichTextSection } from './RichTextSection'
import { ServicesGrid } from './ServicesGrid'
import { Testimonials } from './Testimonials'

const link = (label: string, href: string) => ({ label, href, newTab: false })

describe('Hero', () => {
  it('renders h1, text, image and buttons', () => {
    render(
      <Hero
        eyebrow="Willkommen"
        heading="Goldene Pflege"
        text="Für deinen Hund"
        image={sampleImage}
        links={[link('Termin', '/kontakt'), link('Leistungen', '/leistungen')]}
      />,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Goldene Pflege' })).toBeInTheDocument()
    expect(screen.getByText('Für deinen Hund')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ein Hund' })).toBeInTheDocument()
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/kontakt',
      '/leistungen',
    ])
  })
})

describe('ServicesGrid', () => {
  const services = [
    { id: '1', title: 'Baden', summary: 'Sanft', icon: 'bath', image: sampleImage },
    { id: '2', title: 'Trimmen', summary: 'Fachgerecht', icon: 'sparkles', image: null },
  ]

  it('lists services with optional link', () => {
    render(
      <ServicesGrid heading="Leistungen" services={services} link={link('Alle', '/leistungen')} />,
    )
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('img', { name: 'Platzhalterbild' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Alle' })).toHaveAttribute('href', '/leistungen')
  })

  it('can hide images', () => {
    render(<ServicesGrid services={services} showImages={false} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows a hint without services', () => {
    render(<ServicesGrid services={[]} />)
    expect(screen.getByText('Noch keine Leistungen erfasst.')).toBeInTheDocument()
  })
})

describe('Features', () => {
  it('renders items in the chosen tone', () => {
    const { container } = render(
      <Features
        heading="Vorteile"
        tone="dark"
        items={[{ title: 'Ruhig', text: 'Ohne Stress', icon: 'heart' }]}
      />,
    )
    expect(container.querySelector('section')).toHaveAttribute('data-tone', 'dark')
    expect(screen.getByRole('heading', { name: 'Ruhig' })).toBeInTheDocument()
  })
})

describe('Testimonials', () => {
  it('renders quotes', () => {
    render(<Testimonials heading="Stimmen" items={[{ id: '1', quote: 'Toll', author: 'Anna' }]} />)
    expect(screen.getByText('„Toll“')).toBeInTheDocument()
  })

  it('renders nothing without items', () => {
    const { container } = render(<Testimonials items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('Faq', () => {
  it('opens the first question', () => {
    const { container } = render(
      <Faq
        heading="FAQ"
        items={[
          { question: 'A?', answer: 'a' },
          { question: 'B?', answer: 'b' },
        ]}
      />,
    )
    const details = container.querySelectorAll('details')
    expect(details).toHaveLength(2)
    expect(details[0]).toHaveAttribute('open')
    expect(details[1]).not.toHaveAttribute('open')
  })
})

describe('CallToAction', () => {
  it('renders heading, text and links', () => {
    render(
      <CallToAction
        heading="Jetzt buchen"
        text="Wir freuen uns"
        links={[link('Termin', '/kontakt')]}
        tone="dark"
      />,
    )
    expect(screen.getByRole('heading', { name: 'Jetzt buchen' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Termin' })).toHaveAttribute('href', '/kontakt')
  })
})

describe('ImageText', () => {
  it('renders rich text, image, signature and link', () => {
    render(
      <ImageText
        heading="Über mich"
        content={richText('Ich liebe Hunde.')}
        image={sampleImage}
        imagePosition="right"
        signature="Anna"
        link={link('Mehr', '/ueber-uns')}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Über mich' })).toBeInTheDocument()
    expect(screen.getByText('Ich liebe Hunde.')).toBeInTheDocument()
    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mehr' })).toBeInTheDocument()
  })
})

describe('RichTextSection', () => {
  it('renders content', () => {
    render(<RichTextSection content={richText({ h2: 'Preise' })} />)
    expect(screen.getByRole('heading', { name: 'Preise' })).toBeInTheDocument()
  })
})

describe('ContactSection', () => {
  it('uses the site info', () => {
    render(
      <ContactSection
        heading="Kontakt"
        site={{
          name: 'GC',
          phone: '+41 1',
          email: 'a@b.ch',
          street: 'Weg 1',
          zip: '1000',
          city: 'Ort',
        }}
      />,
    )
    expect(screen.getByRole('link', { name: /Telefon/ })).toHaveAttribute('href', 'tel:+411')
    expect(screen.getByRole('link', { name: /Weg 1/ })).toHaveAttribute('target', '_blank')
    expect(screen.queryByRole('link', { name: 'Route planen' })).not.toBeInTheDocument()
  })
})

describe('PreviewBanner', () => {
  it('links to exit preview', () => {
    render(<PreviewBanner />)
    expect(screen.getByRole('status')).toHaveTextContent('Vorschau aktiv')
    expect(screen.getByRole('link', { name: 'Vorschau beenden' })).toHaveAttribute(
      'href',
      '/next/exit-preview',
    )
  })
})
