import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './index'

const payload = await getPayload({ config })
const result = await seed({ payload, force: process.argv.includes('--force') })
payload.logger.info(result.message)
process.exit(0)
