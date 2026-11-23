import type { MigrateDownArgs, MigrateUpArgs, MongooseAdapter } from '@payloadcms/db-mongodb'

import { parseLegacyHours, type ScheduleEntry } from '@/lib/hours'

type LegacySettings = {
  openingHours?: { days?: string; hours?: string }[]
  schedule?: unknown[]
}

/**
 * Opening hours used to be free text ("Dienstag – Freitag" / "08:30 – 18:00").
 * They are now structured (weekdays + opens/closes) for the JSON-LD data.
 * Rows that cannot be parsed (e.g. "geschlossen") are dropped – closed days are derived automatically.
 */
export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  const globals = (payload.db as MongooseAdapter).globals.collection
  const doc = (await globals.findOne(
    { globalType: 'settings' },
    { session },
  )) as LegacySettings | null
  if (!doc?.openingHours?.length || doc.schedule?.length) return

  const schedule = doc.openingHours
    .map((row) => parseLegacyHours(row.days, row.hours))
    .filter((entry): entry is ScheduleEntry => entry !== null)

  await globals.updateOne(
    { globalType: 'settings' },
    { $set: { schedule }, $unset: { openingHours: '' } },
    { session },
  )
  payload.logger.info(`Migration: ${schedule.length} Öffnungszeiten-Zeilen übernommen`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Not reversible: the structured data is richer than the old free text.
}
