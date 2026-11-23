import * as structuredOpeningHours from './20261123_structured_opening_hours'
import * as privacyPolicy from './20261124_privacy_policy'

/** Run automatically on start in production (mongooseAdapter prodMigrations). */
export const migrations = [
  { name: '20261123_structured_opening_hours', ...structuredOpeningHours },
  { name: '20261124_privacy_policy', ...privacyPolicy },
]
