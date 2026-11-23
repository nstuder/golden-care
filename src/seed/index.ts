import type { Payload } from 'payload'

import { seedImages, unsplashUrl, type SeedImageKey } from './images'
import { privacyPolicy } from './privacy'
import { richText } from './richText'

export type SeedResult = { seeded: boolean; message: string }

type Id = string
type LinkInput = { label: string; page?: Id; url?: string; newTab?: boolean }

const link = ({ label, page, url, newTab }: LinkInput) =>
  page
    ? { type: 'reference' as const, reference: page, label, newTab: Boolean(newTab) }
    : { type: 'custom' as const, url, label, newTab: Boolean(newTab) }

const links = (...items: LinkInput[]) => items.map((item) => ({ link: link(item) }))

const placeholder = {
  phone: '+41 79 123 45 67',
  email: 'hallo@golden-care.ch',
  street: 'Musterstrasse 12',
  zip: '1234',
  city: 'Musterort',
  owner: 'Anna Muster',
}

async function ensureMedia(payload: Payload): Promise<Record<SeedImageKey, Id>> {
  const ids = {} as Record<SeedImageKey, Id>

  for (const [key, image] of Object.entries(seedImages) as [
    SeedImageKey,
    (typeof seedImages)[SeedImageKey],
  ][]) {
    const filename = `seed-${key}.jpg`
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      ids[key] = String(existing.docs[0].id)
      continue
    }

    const response = await fetch(unsplashUrl(image.id))
    if (!response.ok)
      throw new Error(`Bild ${key} konnte nicht geladen werden (HTTP ${response.status})`)
    const data = Buffer.from(await response.arrayBuffer())

    const doc = await payload.create({
      collection: 'media',
      data: { alt: image.alt, credit: 'Unsplash (Platzhalter)' },
      file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
    })
    ids[key] = String(doc.id)
  }

  return ids
}

export async function seed({
  payload,
  force = false,
}: {
  payload: Payload
  force?: boolean
}): Promise<SeedResult> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (totalDocs > 0 && !force) {
    return {
      seeded: false,
      message: 'Es gibt bereits Seiten – nichts geändert. Mit „überschreiben“ neu laden.',
    }
  }

  // Download images first: if that fails, existing content must still be intact
  payload.logger.info('Seed: lade Platzhalterbilder …')
  const img = await ensureMedia(payload)

  if (force) {
    payload.logger.info('Seed: lösche bestehende Inhalte …')
    for (const collection of ['pages', 'services', 'testimonials', 'forms'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } } })
    }
  }

  // ── Leistungen ────────────────────────────────────────────────────────────
  payload.logger.info('Seed: erstelle Leistungen und Kundenstimmen …')
  const serviceData = [
    {
      title: 'Baden & Föhnen',
      summary:
        'Sanfte Wäsche mit hochwertigen, auf Fell und Haut abgestimmten Pflegeprodukten – danach schonend geföhnt und durchgebürstet.',
      icon: 'bath',
      image: img.bath,
    },
    {
      title: 'Schneiden & Styling',
      summary:
        'Pflegeleichter Alltagsschnitt oder rassetypische Frisur – ganz nach den Bedürfnissen deines Hundes.',
      icon: 'scissors',
      image: img.haircut,
    },
    {
      title: 'Trimmen',
      summary:
        'Fachgerechtes Handtrimmen für rauhaarige Rassen – für gesundes Fell und eine natürliche Struktur.',
      icon: 'sparkles',
      image: img.trimming,
    },
    {
      title: 'Unterwolle & Entfilzen',
      summary:
        'Carding und schonendes Entfernen von Unterwolle und Verfilzungen, damit die Haut wieder atmen kann.',
      icon: 'wind',
      image: img.undercoat,
    },
    {
      title: 'Pfoten-, Krallen- & Ohrenpflege',
      summary:
        'Krallen kürzen, Pfotenhaare schneiden, Ohren reinigen – bei jeder Behandlung inklusive.',
      icon: 'paw',
      image: img.paws,
    },
    {
      title: 'Hundewellness',
      summary:
        'Pflegende Bäder, Fellkuren und eine entspannende Massage – Zeit zum Wohlfühlen für Haut und Fell.',
      icon: 'droplets',
      image: img.wellness,
    },
    {
      title: 'Welpen-Schnupperstunde',
      summary:
        'Ein kostenloser, spielerischer erster Besuch, damit dein Welpe den Salon ganz ohne Stress kennenlernt.',
      icon: 'heart',
      image: img.puppy,
    },
  ]
  const services: Id[] = []
  for (const [index, data] of serviceData.entries()) {
    const doc = await payload.create({
      collection: 'services',
      data: { ...data, order: (index + 1) * 10 } as never,
    })
    services.push(String(doc.id))
  }

  // ── Kundenstimmen ─────────────────────────────────────────────────────────
  for (const data of [
    {
      quote:
        'Luna geht richtig gerne hin – das sagt eigentlich alles. Ihr Fell war noch nie so weich und glänzend.',
      author: 'Sandra M.',
      dog: 'mit Luna, Golden Retriever',
    },
    {
      quote:
        'Sehr geduldig und einfühlsam mit unserem ängstlichen Tierschutzhund. Herzlichen Dank für die ruhige Art!',
      author: 'Marco B.',
      dog: 'mit Kira, Mischling',
    },
    {
      quote:
        'Perfekt getrimmt, alles wurde genau erklärt und ich habe wertvolle Tipps für die Pflege zuhause bekommen.',
      author: 'Petra K.',
      dog: 'mit Bruno, Zwergschnauzer',
    },
  ]) {
    await payload.create({ collection: 'testimonials', data })
  }

  // ── Kontaktformular ───────────────────────────────────────────────────────
  payload.logger.info('Seed: erstelle Kontaktformular …')
  const form = await payload.create({
    collection: 'forms',
    data: {
      title: 'Kontaktformular',
      submitButtonLabel: 'Nachricht senden',
      confirmationType: 'message',
      confirmationMessage: richText(
        '**Vielen Dank für deine Nachricht!**',
        'Wir melden uns so rasch wie möglich bei dir – meist innerhalb eines Arbeitstages.',
      ),
      fields: [
        { blockType: 'text', name: 'name', label: 'Name', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Telefon', required: false, width: 50 },
        {
          blockType: 'text',
          name: 'dog',
          label: 'Hund (Name & Rasse)',
          required: false,
          width: 50,
        },
        {
          blockType: 'select',
          name: 'service',
          label: 'Gewünschte Leistung',
          required: false,
          options: [
            ...serviceData.map((s) => ({ label: s.title, value: s.title })),
            { label: 'Beratung / Sonstiges', value: 'Beratung' },
          ],
        },
        { blockType: 'textarea', name: 'message', label: 'Nachricht', required: true },
        {
          blockType: 'checkbox',
          name: 'privacy',
          label:
            'Ich bin einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage gespeichert werden.',
          required: true,
        },
      ],
      emails: [
        {
          // No emailTo: the form builder falls back to CONTACT_EMAIL (defaultToEmail)
          replyTo: '{{email}}',
          subject: 'Neue Anfrage von {{name}}',
          message: richText(
            'Neue Anfrage über die Website:',
            '**Name:** {{name}}',
            '**E-Mail:** {{email}}',
            '**Telefon:** {{phone}}',
            '**Hund:** {{dog}}',
            '**Leistung:** {{service}}',
            '**Nachricht:** {{message}}',
          ),
        },
      ],
    } as never,
  })

  // ── Seiten ────────────────────────────────────────────────────────────────
  payload.logger.info('Seed: erstelle Seiten …')
  const createPage = async (data: Record<string, unknown>) => {
    const doc = await payload.create({
      collection: 'pages',
      data: { ...data, _status: 'published' } as never,
      draft: false,
    })
    return String(doc.id)
  }

  await createPage({
    title: 'Impressum',
    slug: 'impressum',
    layout: [
      { blockType: 'hero', heading: 'Impressum', size: 'compact', image: img.heroContact },
      {
        blockType: 'richText',
        content: richText(
          { h2: 'Verantwortlich für den Inhalt' },
          `Golden Care – Salon für Hundegesundheit und Fellpflege`,
          `${placeholder.owner}, ${placeholder.street}, ${placeholder.zip} ${placeholder.city}`,
          `Telefon: ${placeholder.phone} · E-Mail: ${placeholder.email}`,
          { h2: 'Bildnachweis' },
          'Platzhalterbilder: Unsplash (unsplash.com), Unsplash License.',
          '**Platzhalter:** Bitte durch das rechtlich geprüfte Impressum ersetzen.',
        ),
      },
    ],
  })

  await createPage({
    title: 'Datenschutz',
    slug: 'datenschutz',
    layout: [
      {
        blockType: 'hero',
        heading: 'Datenschutzerklärung',
        size: 'compact',
        image: img.heroContact,
      },
      {
        blockType: 'richText',
        content: richText(...privacyPolicy({ name: 'Golden Care', ...placeholder })),
      },
    ],
  })

  const contact = await createPage({
    title: 'Kontakt & Anfahrt',
    slug: 'kontakt',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Kontakt & Anfahrt',
        heading: 'Wir freuen uns auf euch',
        text: 'Ruf an, schreib uns auf WhatsApp oder nutze das Formular – wir finden gemeinsam einen passenden Termin.',
        size: 'compact',
        image: img.heroContact,
      },
      {
        blockType: 'contact',
        eyebrow: 'So findest du uns',
        heading: 'Kontakt & Öffnungszeiten',
        intro:
          'Termine vergeben wir nach Vereinbarung – so haben wir für jeden Hund genügend Zeit.',
        showMap: true,
      },
      {
        blockType: 'formBlock',
        eyebrow: 'Schreib uns',
        heading: 'Termin anfragen',
        intro: 'Erzähl uns kurz von deinem Hund. Wir melden uns mit einem Terminvorschlag.',
        form: String(form.id),
      },
    ],
  })

  const gallery = await createPage({
    title: 'Galerie',
    slug: 'galerie',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Galerie',
        heading: 'Glückliche Vierbeiner',
        text: 'Ein kleiner Einblick in unseren Alltag – frisch gebadet, gebürstet und gestylt.',
        size: 'compact',
        image: img.heroGallery,
      },
      {
        blockType: 'gallery',
        heading: 'Unsere Kundschaft',
        intro: 'Klick auf ein Bild, um es gross anzusehen.',
        images: (
          [
            'beagle',
            'cavalier',
            'pug',
            'haircut',
            'corgiPuppy',
            'samoyed',
            'goldenFlower',
            'trimming',
            'happyMix',
            'labrador',
            'paws',
            'fluffyPuppy',
            'bath',
            'puppy',
            'undercoat',
            'wellness',
          ] as SeedImageKey[]
        ).map((key) => ({ image: img[key] })),
      },
      {
        blockType: 'callToAction',
        heading: 'Soll dein Hund der Nächste sein?',
        text: 'Wir freuen uns darauf, deinen Liebling kennenzulernen.',
        tone: 'dark',
        links: links({ label: 'Termin vereinbaren', page: contact }),
      },
    ],
  })

  const about = await createPage({
    title: 'Über uns',
    slug: 'ueber-uns',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Über uns',
        heading: 'Mit Herz, Ruhe und Fachwissen',
        text: 'Bei Golden Care steht das Wohlbefinden deines Hundes immer an erster Stelle.',
        size: 'compact',
        image: img.heroAbout,
      },
      {
        blockType: 'imageText',
        eyebrow: 'Hallo!',
        heading: `Ich bin ${placeholder.owner}`,
        content: richText(
          'Seit meiner Kindheit begleiten mich Hunde – heute darf ich meine Leidenschaft zum Beruf machen. Als ausgebildete Hundecoiffeuse lege ich grossen Wert auf eine ruhige, stressfreie Behandlung.',
          'Jeder Hund ist anders: Darum nehme ich mir Zeit, lerne deinen Vierbeiner kennen und gehe auf seine Bedürfnisse, sein Fell und seine Haut ein.',
          {
            quote:
              'Gib dem Menschen einen Hund und seine Seele wird gesund. – Hildegard von Bingen',
          },
        ),
        image: img.grooming,
        imagePosition: 'left',
        signature: placeholder.owner,
      },
      {
        blockType: 'features',
        eyebrow: 'Unser Versprechen',
        heading: 'Darauf kannst du dich verlassen',
        tone: 'dark',
        items: [
          {
            icon: 'hand-heart',
            title: 'Liebevoller Umgang',
            text: 'Geduld und Ruhe – ohne Zeitdruck und ohne Zwang.',
          },
          {
            icon: 'award',
            title: 'Fachgerechte Pflege',
            text: 'Aktuelle Techniken und rassetypische Schnitte.',
          },
          {
            icon: 'leaf',
            title: 'Hochwertige Produkte',
            text: 'Hautfreundliche, tierversuchsfreie Pflegeprodukte.',
          },
          {
            icon: 'shield',
            title: 'Höchste Hygiene',
            text: 'Frische Handtücher und desinfizierte Werkzeuge für jeden Hund.',
          },
          {
            icon: 'dog',
            title: 'Hundefreundlicher Salon',
            text: 'Ein ruhiger, heller Raum, in dem sich Hunde wohlfühlen.',
          },
          {
            icon: 'heart',
            title: 'Gesundheit im Blick',
            text: 'Auffälligkeiten an Haut, Ohren oder Krallen sprechen wir an.',
          },
        ],
      },
      {
        blockType: 'callToAction',
        heading: 'Neugierig geworden?',
        text: 'Schau dir an, wie glücklich unsere Kundschaft nach dem Besuch aussieht.',
        tone: 'gold',
        links: links({ label: 'Zur Galerie', page: gallery }, { label: 'Kontakt', page: contact }),
      },
    ],
  })

  const servicesPage = await createPage({
    title: 'Leistungen',
    slug: 'leistungen',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Leistungen',
        heading: 'Pflege, die man sieht und spürt',
        text: 'Von der sanften Wäsche bis zum rassetypischen Schnitt – abgestimmt auf Fell, Haut und Charakter deines Hundes.',
        size: 'compact',
        image: img.heroServices,
      },
      {
        blockType: 'servicesGrid',
        eyebrow: 'Unser Angebot',
        heading: 'Alles für ein gesundes, schönes Fell',
        mode: 'all',
        showImages: true,
      },
      {
        blockType: 'richText',
        content: richText(
          { h2: 'Wie setzt sich der Preis zusammen?' },
          'Jeder Hund ist einzigartig – deshalb richtet sich der Preis nach **Grösse**, **Felltyp**, **Fellzustand** und dem **Temperament** deines Hundes. Gerne geben wir dir vorab eine unverbindliche Einschätzung.',
          'Pfoten-, Krallen- und Ohrenpflege ist bei jeder Behandlung inklusive.',
        ),
      },
      {
        blockType: 'faq',
        eyebrow: 'Gut zu wissen',
        heading: 'Häufige Fragen',
        items: [
          {
            question: 'Was kostet eine Behandlung?',
            answer:
              'Der Preis hängt vom Aufwand ab: Grösse, Felltyp und -zustand sowie das Temperament spielen eine Rolle. Für stark verfilztes Fell kann ein Zuschlag anfallen. Ruf uns an – wir beraten dich gerne.',
          },
          {
            question: 'Wie lange dauert ein Termin?',
            answer:
              'Je nach Hund und Behandlung zwischen einer und drei Stunden. Du kannst warten oder deinen Hund in der Zwischenzeit bei uns lassen – wir melden uns, sobald er abholbereit ist.',
          },
          {
            question: 'Wie vereinbare ich einen Termin?',
            answer:
              'Am einfachsten telefonisch, per WhatsApp oder über das Kontaktformular. Bitte sag Termine mindestens 24 Stunden im Voraus ab.',
          },
          {
            question: 'Welche Produkte verwendet ihr?',
            answer:
              'Wir arbeiten mit professionellem Werkzeug und hochwertigen, tierversuchsfreien Pflegeprodukten, die wir auf Haut und Fell deines Hundes abstimmen.',
          },
          {
            question: 'Mein Hund ist ängstlich – geht das trotzdem?',
            answer:
              'Ja! Wir nehmen uns Zeit, machen Pausen und arbeiten ohne Zwang. Bei sehr unsicheren Hunden empfehlen wir einen kurzen Kennenlerntermin.',
          },
        ],
      },
      {
        blockType: 'callToAction',
        heading: 'Bereit für den nächsten Pflegetermin?',
        text: 'Ruf uns an oder schreib uns – wir finden einen Termin, der passt.',
        tone: 'gold',
        links: links(
          { label: 'Termin anfragen', page: contact },
          { label: 'Anrufen', url: `tel:${placeholder.phone.replace(/\s/g, '')}` },
        ),
      },
    ],
  })

  await createPage({
    title: 'Startseite',
    slug: 'home',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Salon für Hundegesundheit und Fellpflege',
        heading: 'Goldene Pflege für deinen besten Freund',
        text: 'Liebevolle, fachgerechte Fellpflege in ruhiger Atmosphäre – damit sich dein Hund rundum wohlfühlt.',
        size: 'large',
        image: img.heroHome,
        links: links(
          { label: 'Termin vereinbaren', page: contact },
          { label: 'Unsere Leistungen', page: servicesPage },
        ),
      },
      {
        blockType: 'imageText',
        eyebrow: 'Herzlich willkommen',
        heading: 'Gesundes Fell beginnt mit Vertrauen',
        content: richText(
          'Bei Golden Care verbinden wir professionelle Fellpflege mit viel Geduld und Einfühlungsvermögen. Wir nehmen uns Zeit für jeden Hund – ganz ohne Stress.',
          'Ob regelmässige Pflege, rassetypischer Schnitt oder eine Wellnessbehandlung: Wir achten dabei immer auch auf die Gesundheit von Haut, Ohren und Pfoten.',
        ),
        image: img.grooming,
        imagePosition: 'left',
        enableLink: true,
        link: link({ label: 'Mehr über uns', page: about }),
      },
      {
        blockType: 'servicesGrid',
        eyebrow: 'Leistungen',
        heading: 'Was wir für deinen Hund tun',
        intro: 'Individuelle Pflege für jede Rasse und jeden Felltyp.',
        mode: 'selected',
        services: services.slice(0, 6),
        showImages: true,
        enableLink: true,
        link: link({ label: 'Alle Leistungen', page: servicesPage }),
      },
      {
        blockType: 'features',
        eyebrow: 'Warum Golden Care',
        heading: 'Qualität, die man spürt',
        tone: 'light',
        items: [
          {
            icon: 'hand-heart',
            title: 'Stressfreie Behandlung',
            text: 'Ruhig, geduldig und mit viel Liebe.',
          },
          { icon: 'leaf', title: 'Sanfte Produkte', text: 'Hautfreundlich und tierversuchsfrei.' },
          {
            icon: 'shield',
            title: 'Hygiene & Sorgfalt',
            text: 'Sauberes Werkzeug, frische Handtücher.',
          },
        ],
      },
      {
        blockType: 'testimonials',
        eyebrow: 'Kundenstimmen',
        heading: 'Das sagen unsere Kundinnen und Kunden',
        mode: 'all',
      },
      {
        blockType: 'callToAction',
        heading: 'Gönn deinem Hund eine goldene Auszeit',
        text: 'Termine nach Vereinbarung – wir freuen uns auf euch!',
        tone: 'gold',
        links: links(
          { label: 'Termin anfragen', page: contact },
          { label: 'Anrufen', url: `tel:${placeholder.phone.replace(/\s/g, '')}` },
        ),
      },
    ],
  })

  // ── Globals ───────────────────────────────────────────────────────────────
  payload.logger.info('Seed: aktualisiere Einstellungen, Navigation und Design …')
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      name: 'Golden Care',
      tagline: 'Salon für Hundegesundheit und Fellpflege',
      description: 'Liebevolle, fachgerechte Fellpflege und Wellness für Hunde jeder Rasse.',
      owner: placeholder.owner,
      phone: placeholder.phone,
      whatsapp: placeholder.phone,
      email: placeholder.email,
      street: placeholder.street,
      zip: placeholder.zip,
      city: placeholder.city,
      schedule: [
        { days: ['tu', 'we', 'th', 'fr'], opens: '08:30', closes: '18:00' },
        { days: ['sa'], opens: '09:00', closes: '14:00' },
      ],
      appointmentNote: 'Termine nur nach Vereinbarung',
      socials: [{ platform: 'instagram', url: 'https://www.instagram.com/' }],
      businessType: 'LocalBusiness',
      image: img.heroHome,
      country: 'CH',
      areaServed: [{ name: placeholder.city }, { name: 'Umgebung' }],
    } as never,
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      headerLinks: links(
        { label: 'Leistungen', page: servicesPage },
        { label: 'Über uns', page: about },
        { label: 'Galerie', page: gallery },
        { label: 'Kontakt', page: contact },
      ),
      cta: link({ label: 'Termin vereinbaren', url: '/kontakt#kontaktformular' }),
      footerLinks: links(
        { label: 'Impressum', page: await pageId(payload, 'impressum') },
        { label: 'Datenschutz', page: await pageId(payload, 'datenschutz') },
      ),
    } as never,
  })

  const theme = await payload.findGlobal({ slug: 'theme', depth: 0 })
  if (!theme?.primary || force) {
    await payload.updateGlobal({
      slug: 'theme',
      data: {
        primary: '#c9a54c',
        secondary: '#2a1638',
        background: '#fbf8f3',
        foreground: '#22162b',
        headingFont: 'fraunces',
        radius: 'lg',
        _status: 'published',
      } as never,
    })
  }

  return { seeded: true, message: 'Beispielinhalte wurden geladen.' }
}

async function pageId(payload: Payload, slug: string): Promise<Id | undefined> {
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0] ? String(result.docs[0].id) : undefined
}
