import * as structuredOpeningHours from './20261123_structured_opening_hours'

/** Run automatically on start in production (mongooseAdapter prodMigrations). */
export const migrations = [{ name: '20261123_structured_opening_hours', ...structuredOpeningHours }]
