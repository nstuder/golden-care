/**
 * Placeholder photos from Unsplash (free to use under the Unsplash License).
 * Replace them in the media library once real photos of the salon exist.
 */
export const seedImages = {
  heroHome: {
    id: '1576201836106-db1758fd1c97',
    alt: 'Golden-Retriever-Welpe rennt im warmen Abendlicht',
  },
  heroServices: {
    id: '1544568100-847a948585b9',
    alt: 'Glücklicher Hund mit glänzendem Fell auf einem Feldweg',
  },
  heroAbout: {
    id: '1558788353-f76d92427f16',
    alt: 'Golden Retriever schaut freundlich in die Kamera',
  },
  heroGallery: {
    id: '1548199973-03cce0bbc87b',
    alt: 'Corgi und Yorkshire Terrier laufen gemeinsam einen Weg entlang',
  },
  heroContact: { id: '1588943211346-0908a1fb0b01', alt: 'Cocker Spaniel liegt entspannt im Gras' },
  grooming: { id: '1516734212186-a967f81ad0d7', alt: 'Golden Retriever wird liebevoll gepflegt' },
  bath: { id: '1530281700549-e82e7bf110d6', alt: 'Nasser Hund rennt fröhlich aus dem Wasser' },
  haircut: {
    id: '1534361960057-19889db9621e',
    alt: 'Frisch geschnittener weißer Pudel rennt über die Wiese',
  },
  trimming: { id: '1625316708582-7c38734be31d', alt: 'Zwergschnauzer mit frisch getrimmtem Bart' },
  undercoat: { id: '1529429617124-95b109e86bb8', alt: 'Samojede mit dichtem, weißem Fell' },
  paws: {
    id: '1561037404-61cd46aa615b',
    alt: 'Jack Russell Terrier sitzt aufmerksam vor rosa Hintergrund',
  },
  puppy: { id: '1507146426996-ef05306b995a', alt: 'Golden-Retriever-Welpe mit rotem Halsband' },
  wellness: {
    id: '1587300003388-59208cc962cb',
    alt: 'Australian Shepherd genießt den Tag am Strand',
  },
  beagle: { id: '1543466835-00a7907e9de1', alt: 'Lachender Beagle' },
  pug: { id: '1517849845537-4d257902454a', alt: 'Schwarzer Mops vor gelbem Hintergrund' },
  cavalier: {
    id: '1560807707-8cc77767d783',
    alt: 'Cavalier King Charles Spaniel schaut über die Kante',
  },
  corgiPuppy: { id: '1537151625747-768eb6cf92b2', alt: 'Corgi-Welpe vor orangem Hintergrund' },
  samoyed: { id: '1596492784531-6e6eb5ea9993', alt: 'Flauschiger Samojede vor rosa Hintergrund' },
  goldenFlower: { id: '1552053831-71594a27632d', alt: 'Golden Retriever mit einer Blume im Maul' },
  happyMix: {
    id: '1477884213360-7e9d7dcc1e48',
    alt: 'Fröhlicher schwarz-weißer Hund auf dem Gehweg',
  },
  labrador: { id: '1518717758536-85ae29035b6d', alt: 'Brauner Labrador leckt sich die Nase' },
  fluffyPuppy: { id: '1600804340584-c7db2eacf0bf', alt: 'Flauschiger Welpe schaut nach oben' },
} as const

export type SeedImageKey = keyof typeof seedImages

export function unsplashUrl(id: string, width = 1920): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&fm=jpg&fit=max`
}
