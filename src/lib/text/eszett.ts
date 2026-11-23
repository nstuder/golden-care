/** Swiss spellings (ss) used in the sample content and their German spelling (ß) */
const words: Record<string, string> = {
  abschliessend: 'abschließend',
  ausschliesslich: 'ausschließlich',
  ausserdem: 'außerdem',
  Ausserdem: 'Außerdem',
  draussen: 'draußen',
  Fliesstext: 'Fließtext',
  Fuss: 'Fuß',
  Füsse: 'Füße',
  gemäss: 'gemäß',
  Gemäss: 'Gemäß',
  geniesst: 'genießt',
  gross: 'groß',
  Gross: 'Groß',
  grosse: 'große',
  Grosse: 'Große',
  grossen: 'großen',
  grosser: 'großer',
  grosses: 'großes',
  Grösse: 'Größe',
  grösser: 'größer',
  grösste: 'größte',
  Grüsse: 'Grüße',
  heisst: 'heißt',
  Mass: 'Maß',
  massgeschneidert: 'maßgeschneidert',
  Massnahmen: 'Maßnahmen',
  Musterstrasse: 'Musterstraße',
  mässig: 'mäßig',
  regelmässig: 'regelmäßig',
  regelmässige: 'regelmäßige',
  regelmässigen: 'regelmäßigen',
  schliessen: 'schließen',
  Schliessen: 'Schließen',
  Schliesst: 'Schließt',
  schliesst: 'schließt',
  Spass: 'Spaß',
  Strasse: 'Straße',
  strasse: 'straße',
  Strassen: 'Straßen',
  süss: 'süß',
  süsse: 'süße',
  vergrössern: 'vergrößern',
  weiss: 'weiß',
  Weiss: 'Weiß',
  weissem: 'weißem',
  weisser: 'weißer',
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
// Also match words at the start of a sentence ("Regelmässige" → "Regelmäßige")
for (const [swiss, german] of Object.entries({ ...words })) {
  words[capitalize(swiss)] ??= capitalize(german)
}

const pattern = new RegExp(
  `(?<![A-Za-zÄÖÜäöüß])(${Object.keys(words)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?![A-Za-zÄÖÜäöüß])`,
  'g',
)

/** Replaces known Swiss spellings by the German ones, e.g. "regelmässig" → "regelmäßig". */
export function toGermanSpelling(text: string): string {
  return text.replace(pattern, (word) => words[word] ?? word)
}

/** Keys whose values are identifiers or addresses and must never be changed */
const skipKeys = new Set([
  'id',
  'slug',
  'url',
  'email',
  'emailTo',
  'emailFrom',
  'mapsUrl',
  'filename',
  'mimeType',
])

/** Applies toGermanSpelling to all strings in a (CMS) document; returns null if nothing changed. */
export function germanizeDocument<T>(doc: T): T | null {
  let changed = false
  const walk = (value: unknown, key?: string): unknown => {
    if (typeof value === 'string') {
      if (key && skipKeys.has(key)) return value
      const next = toGermanSpelling(value)
      if (next !== value) changed = true
      return next
    }
    if (Array.isArray(value)) return value.map((item) => walk(item))
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, k)]))
    }
    return value
  }
  const result = walk(doc) as T
  return changed ? result : null
}
