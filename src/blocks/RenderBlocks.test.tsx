import { render, screen } from '@testing-library/react'

import { richText } from '@/seed/richText'
import type { Service, Testimonial } from '@/payload-types'

import { RenderBlocks, type BlockContext, type PageBlock } from './RenderBlocks'

const media = {
  id: 'm1',
  alt: 'Hund',
  url: '/api/media/file/hund.jpg',
  width: 1000,
  height: 800,
  updatedAt: '',
  createdAt: '',
}
const page = (slug: string) => ({ id: slug, title: slug, slug, updatedAt: '', createdAt: '' })

const service = (id: string, title: string): Service => ({
  id,
  title,
  summary: `${title} Text`,
  icon: 'paw',
  order: 1,
  updatedAt: '',
  createdAt: '',
})
const testimonial = (id: string, author: string): Testimonial => ({
  id,
  author,
  quote: 'Super',
  updatedAt: '',
  createdAt: '',
})

const context: BlockContext = {
  site: { name: 'Golden Care', phone: '+41 1' },
  services: [service('s1', 'Baden'), service('s2', 'Trimmen')],
  testimonials: [testimonial('t1', 'Anna'), testimonial('t2', 'Marco')],
}

const blocks = [
  {
    blockType: 'hero',
    heading: 'Willkommen',
    image: media,
    links: [{ link: { type: 'reference', reference: page('kontakt'), label: 'Termin' } }],
  },
  { blockType: 'richText', content: richText({ h2: 'Preise' }) },
  {
    blockType: 'imageText',
    heading: 'Über uns',
    content: richText('Text'),
    enableLink: false,
    link: { label: 'x', url: '/x', type: 'custom' },
  },
  {
    blockType: 'servicesGrid',
    heading: 'Leistungen',
    mode: 'selected',
    services: [service('s2', 'Trimmen'), 's1'],
  },
  { blockType: 'features', heading: 'Vorteile', items: [{ title: 'Ruhig', icon: 'heart' }] },
  { blockType: 'testimonials', heading: 'Stimmen', mode: 'all' },
  {
    blockType: 'gallery',
    heading: 'Galerie',
    images: [{ image: media, caption: 'Hund' }, { image: 'unpopulated' }],
  },
  { blockType: 'faq', heading: 'FAQ', items: [{ question: 'Wie?', answer: 'So.' }] },
  { blockType: 'callToAction', heading: 'Jetzt', links: [] },
  { blockType: 'contact', heading: 'Kontakt' },
  {
    blockType: 'formBlock',
    heading: 'Formular',
    form: {
      id: 'f1',
      title: 'Kontakt',
      fields: [{ blockType: 'text', name: 'name', label: 'Name' }],
      updatedAt: '',
      createdAt: '',
    },
  },
  { blockType: 'formBlock', heading: 'Unpopuliert', form: 'f2' },
] as unknown as PageBlock[]

describe('RenderBlocks', () => {
  it('renders every block type in order', () => {
    const { container } = render(<RenderBlocks blocks={blocks} context={context} />)
    const rendered = [...container.querySelectorAll('[data-block]')].map((el) =>
      el.getAttribute('data-block'),
    )
    expect(rendered).toEqual(blocks.map((b) => b.blockType))

    expect(screen.getByRole('heading', { level: 1, name: 'Willkommen' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Termin' })).toHaveAttribute('href', '/kontakt')
    expect(screen.getByRole('heading', { name: 'Preise' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Unpopuliert' })).not.toBeInTheDocument()
  })

  it('uses only populated, selected services and all testimonials', () => {
    render(<RenderBlocks blocks={blocks} context={context} />)
    expect(screen.getByRole('heading', { name: 'Trimmen' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Baden' })).not.toBeInTheDocument()
    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByText('Marco')).toBeInTheDocument()
  })

  it('hides the optional link unless enabled', () => {
    render(<RenderBlocks blocks={blocks} context={context} />)
    expect(screen.queryByRole('link', { name: 'x' })).not.toBeInTheDocument()
  })

  it('skips gallery items without populated image', () => {
    render(<RenderBlocks blocks={blocks} context={context} />)
    expect(screen.getAllByRole('button', { name: /Bild vergrößern/ })).toHaveLength(1)
  })

  it('renders nothing without blocks', () => {
    const { container } = render(<RenderBlocks blocks={[]} context={context} />)
    expect(container).toBeEmptyDOMElement()
  })
})
