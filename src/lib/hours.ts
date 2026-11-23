import type { OpeningHoursEntry } from '@/components/molecules/OpeningHours'

export const weekdays = [
  { value: 'mo', label: 'Montag', schema: 'Monday' },
  { value: 'tu', label: 'Dienstag', schema: 'Tuesday' },
  { value: 'we', label: 'Mittwoch', schema: 'Wednesday' },
  { value: 'th', label: 'Donnerstag', schema: 'Thursday' },
  { value: 'fr', label: 'Freitag', schema: 'Friday' },
  { value: 'sa', label: 'Samstag', schema: 'Saturday' },
  { value: 'su', label: 'Sonntag', schema: 'Sunday' },
] as const

export type Weekday = (typeof weekdays)[number]['value']

/** One row in the CMS: e.g. Tue–Fri 08:30–18:00. */
export type ScheduleEntry = {
  days: Weekday[]
  opens: string
  closes: string
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

export function isValidTime(value: unknown): value is string {
  return typeof value === 'string' && TIME.test(value)
}

const order = (day: Weekday) => weekdays.findIndex((d) => d.value === day)
const label = (day: Weekday) => weekdays[order(day)].label

/** Sorts days and groups consecutive ones: [tu, we, th, fr] → "Dienstag – Freitag". */
export function formatDays(days: Weekday[]): string {
  const sorted = [...new Set(days)].filter((d) => order(d) >= 0).sort((a, b) => order(a) - order(b))
  const groups: Weekday[][] = []
  for (const day of sorted) {
    const last = groups.at(-1)
    if (last && order(day) === order(last.at(-1)!) + 1) last.push(day)
    else groups.push([day])
  }
  return groups
    .map((group) => {
      if (group.length === 1) return label(group[0])
      if (group.length === 2) return `${label(group[0])} & ${label(group[1])}`
      return `${label(group[0])} – ${label(group.at(-1)!)}`
    })
    .join(', ')
}

/** Normalises CMS rows: drops rows without days or with invalid times. */
export function normalizeSchedule(
  rows?: { days?: string[] | null; opens?: string | null; closes?: string | null }[] | null,
): ScheduleEntry[] {
  return (rows ?? []).flatMap((row) => {
    const days = (row.days ?? []).filter((d): d is Weekday => weekdays.some((w) => w.value === d))
    if (!days.length || !isValidTime(row.opens) || !isValidTime(row.closes)) return []
    return [{ days, opens: row.opens, closes: row.closes }]
  })
}

/** Human readable rows for the website, including the closed days. */
export function formatSchedule(
  schedule: ScheduleEntry[],
  { showClosed = true } = {},
): OpeningHoursEntry[] {
  const rows = schedule
    .slice()
    .sort((a, b) => Math.min(...a.days.map(order)) - Math.min(...b.days.map(order)))
    .map((entry) => ({ days: formatDays(entry.days), hours: `${entry.opens} – ${entry.closes}` }))

  if (showClosed && schedule.length) {
    const open = new Set(schedule.flatMap((e) => e.days))
    const closed = weekdays.map((d) => d.value).filter((d) => !open.has(d))
    if (closed.length) rows.push({ days: formatDays(closed), hours: 'geschlossen' })
  }
  return rows
}

const legacyDayNames: Record<string, Weekday> = Object.fromEntries(
  weekdays.flatMap((d) => [
    [d.label.toLowerCase(), d.value],
    [d.label.slice(0, 2).toLowerCase(), d.value],
  ]),
)

/**
 * Parses the former free-text rows ("Dienstag – Freitag" / "08:30 – 18:00") into a ScheduleEntry.
 * Returns null for closed days or text it cannot understand. Used by the migration.
 */
export function parseLegacyHours(
  days?: string | null,
  hours?: string | null,
): ScheduleEntry | null {
  const times = hours?.match(/(\d{1,2})[:.](\d{2})\s*(?:–|-|bis)\s*(\d{1,2})[:.](\d{2})/)
  if (!days || !times) return null
  const pad = (h: string, m: string) => `${h.padStart(2, '0')}:${m}`
  const opens = pad(times[1], times[2])
  const closes = pad(times[3], times[4])
  if (!isValidTime(opens) || !isValidTime(closes)) return null

  const result: Weekday[] = []
  for (const part of days.toLowerCase().split(/,|&|\bund\b/)) {
    const range = part.split(/–|-|\bbis\b/).map((s) => s.trim().replace(/\.$/, ''))
    const ids = range.map((name) => legacyDayNames[name]).filter(Boolean)
    if (ids.length !== range.length || !ids.length) return null
    if (ids.length === 1) result.push(ids[0])
    else for (let i = order(ids[0]); i <= order(ids[1]); i++) result.push(weekdays[i].value)
  }
  return result.length ? { days: result, opens, closes } : null
}
