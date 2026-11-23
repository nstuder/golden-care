import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Golden Care – Salon für Hundegesundheit und Fellpflege',
    short_name: 'Golden Care',
    description: 'Liebevolle, fachgerechte Fellpflege und Wellness für Hunde.',
    lang: 'de-CH',
    start_url: '/',
    display: 'browser',
    background_color: '#fbf8f3',
    theme_color: '#2a1638',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
