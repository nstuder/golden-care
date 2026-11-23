import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

import { toSiteInfo } from '@/lib/site'
import type { RichTextBlock } from '@/payload-types'
import { PRIVACY_PLACEHOLDER, privacyPolicy } from '@/seed/privacy'
import { richText } from '@/seed/richText'

/**
 * Replaces the placeholder privacy policy from the sample content with the full text
 * (incl. Google Maps). A privacy page that was already edited in the CMS is left untouched.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'datenschutz' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0]
  if (!page) return

  const layout = page.layout ?? []
  const index = layout.findIndex(
    (block) =>
      block.blockType === 'richText' && JSON.stringify(block.content).includes(PRIVACY_PLACEHOLDER),
  )
  if (index === -1) {
    payload.logger.info('Migration: Datenschutzerklärung wurde bereits angepasst, keine Änderung')
    return
  }

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0, req })
  const content = richText(
    ...privacyPolicy(toSiteInfo(settings)),
  ) as unknown as RichTextBlock['content']

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: layout.map((block, i) =>
        i === index && block.blockType === 'richText' ? { ...block, content } : block,
      ),
      _status: 'published',
    },
    req,
    context: { disableRevalidate: true },
  })
  payload.logger.info('Migration: Datenschutzerklärung ergänzt (inkl. Google Maps)')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // The placeholder is not restored.
}
