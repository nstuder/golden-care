import type { Field } from 'payload'

/** Eyebrow, heading and intro text shared by most blocks. */
export const sectionHeaderFields = ({ headingRequired = false } = {}): Field[] => [
  { name: 'eyebrow', label: 'Überzeile', type: 'text' },
  { name: 'heading', label: 'Überschrift', type: 'text', required: headingRequired },
  { name: 'intro', label: 'Einleitung', type: 'textarea' },
]
