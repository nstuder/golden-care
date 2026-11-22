/** Icons editors can choose in the CMS. Rendered by the Icon atom. */
export const iconOptions = [
  { label: 'Pfote', value: 'paw' },
  { label: 'Schere', value: 'scissors' },
  { label: 'Bad', value: 'bath' },
  { label: 'Föhn / Wind', value: 'wind' },
  { label: 'Tropfen', value: 'droplets' },
  { label: 'Bürste / Glanz', value: 'sparkles' },
  { label: 'Herz', value: 'heart' },
  { label: 'Hand mit Herz', value: 'hand-heart' },
  { label: 'Schild', value: 'shield' },
  { label: 'Blatt', value: 'leaf' },
  { label: 'Stern', value: 'star' },
  { label: 'Auszeichnung', value: 'award' },
  { label: 'Uhr', value: 'clock' },
  { label: 'Knochen', value: 'bone' },
  { label: 'Hund', value: 'dog' },
  { label: 'Lächeln', value: 'smile' },
  { label: 'Kalender', value: 'calendar' },
] as const

export type IconName =
  | (typeof iconOptions)[number]['value']
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'menu'
  | 'close'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'quote'
  | 'check'
  | 'send'
