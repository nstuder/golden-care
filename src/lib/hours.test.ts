import {
  formatDays,
  formatSchedule,
  isValidTime,
  normalizeSchedule,
  parseLegacyHours,
} from './hours'

describe('isValidTime', () => {
  it.each(['00:00', '08:30', '23:59'])('accepts %s', (t) => expect(isValidTime(t)).toBe(true))
  it.each(['8:30', '24:00', '12:60', '', null])('rejects %s', (t) =>
    expect(isValidTime(t)).toBe(false),
  )
})

describe('formatDays', () => {
  it('groups consecutive days', () => {
    expect(formatDays(['tu', 'we', 'th', 'fr'])).toBe('Dienstag – Freitag')
    expect(formatDays(['sa', 'su'])).toBe('Samstag & Sonntag')
    expect(formatDays(['su', 'mo'])).toBe('Montag, Sonntag')
    expect(formatDays(['fr', 'mo', 'tu', 'we', 'mo'])).toBe('Montag – Mittwoch, Freitag')
  })
})

describe('normalizeSchedule', () => {
  it('drops incomplete rows and unknown days', () => {
    expect(
      normalizeSchedule([
        { days: ['mo', 'xx'], opens: '08:00', closes: '12:00' },
        { days: [], opens: '08:00', closes: '12:00' },
        { days: ['tu'], opens: '8', closes: '12:00' },
        { days: null, opens: null, closes: null },
      ]),
    ).toEqual([{ days: ['mo'], opens: '08:00', closes: '12:00' }])
    expect(normalizeSchedule(undefined)).toEqual([])
  })
})

describe('formatSchedule', () => {
  const schedule = [
    { days: ['sa' as const], opens: '09:00', closes: '14:00' },
    {
      days: ['tu' as const, 'we' as const, 'th' as const, 'fr' as const],
      opens: '08:30',
      closes: '18:00',
    },
  ]

  it('sorts rows by weekday and adds closed days', () => {
    expect(formatSchedule(schedule)).toEqual([
      { days: 'Dienstag – Freitag', hours: '08:30 – 18:00' },
      { days: 'Samstag', hours: '09:00 – 14:00' },
      { days: 'Montag, Sonntag', hours: 'geschlossen' },
    ])
  })

  it('can hide closed days and handles an empty schedule', () => {
    expect(formatSchedule(schedule, { showClosed: false })).toHaveLength(2)
    expect(formatSchedule([])).toEqual([])
  })
})

describe('parseLegacyHours', () => {
  it('parses the former free-text rows', () => {
    expect(parseLegacyHours('Dienstag – Freitag', '08:30 – 18:00')).toEqual({
      days: ['tu', 'we', 'th', 'fr'],
      opens: '08:30',
      closes: '18:00',
    })
    expect(parseLegacyHours('Samstag', '9.00 - 14.00')).toEqual({
      days: ['sa'],
      opens: '09:00',
      closes: '14:00',
    })
    expect(parseLegacyHours('Mo, Mi & Fr', '10:00 bis 12:00')?.days).toEqual(['mo', 'we', 'fr'])
  })

  it('ignores closed days and unknown text', () => {
    expect(parseLegacyHours('Sonntag & Montag', 'geschlossen')).toBeNull()
    expect(parseLegacyHours('Feiertage', '10:00 – 12:00')).toBeNull()
    expect(parseLegacyHours(null, '10:00 – 12:00')).toBeNull()
  })
})
