import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import type { CollectionSlug, GlobalSlug } from 'payload'

import { toSiteInfo } from '@/lib/site'
import { germanizeDocument } from '@/lib/text/eszett'
import type { RichTextBlock } from '@/payload-types'
import { PRIVACY_PLACEHOLDER, PRIVACY_SWISS_MARKER, privacyPolicy } from '@/seed/privacy'
import { richText } from '@/seed/richText'

const context = { disableRevalidate: true }
const textCollections: CollectionSlug[] = ['pages', 'services', 'testimonials', 'forms', 'media']
const textGlobals: GlobalSlug[] = ['settings', 'navigation']

/** Only the top-level fields whose text changed, so derived fields (e.g. upload sizes) stay untouched */
function changedFields(doc: Record<string, unknown>): Record<string, unknown> | null {
  const next = germanizeDocument(doc)
  if (!next) return null
  return Object.fromEntries(
    Object.keys(doc)
      .filter((key) => JSON.stringify(doc[key]) !== JSON.stringify(next[key]))
      .map((key) => [key, next[key]]),
  )
}

/**
 * The salon is in Germany, not in Switzerland:
 * 1. country CH → DE in the settings (JSON-LD address)
 * 2. Swiss spellings in the sample content → ß ("regelmässig" → "regelmäßig")
 * 3. privacy policy → GDPR version, if it is still the generated text (edited pages stay untouched)
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'settings', depth: 0, req })
  if (settings.country === 'CH') {
    await payload.updateGlobal({ slug: 'settings', data: { country: 'DE' }, req, context })
    payload.logger.info('Migration: Land auf DE gesetzt')
  }

  let changed = 0
  for (const collection of textCollections) {
    const { docs } = await payload.find({ collection, depth: 0, pagination: false, req })
    for (const doc of docs as unknown as Record<string, unknown>[]) {
      const data = changedFields(doc)
      if (!data) continue
      if (doc._status === 'published') data._status = 'published'
      await payload.update({ collection, id: doc.id as string, data: data as never, req, context })
      changed++
    }
  }
  for (const slug of textGlobals) {
    const doc = (await payload.findGlobal({ slug, depth: 0, req })) as unknown as Record<
      string,
      unknown
    >
    const data = changedFields(doc)
    if (!data) continue
    await payload.updateGlobal({ slug, data: data as never, req, context })
    changed++
  }
  payload.logger.info(`Migration: Schreibweise mit ß in ${changed} Dokumenten angepasst`)

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'datenschutz' } },
    limit: 1,
    depth: 0,
    req,
  })
  const page = docs[0]
  const layout = page?.layout ?? []
  const index = layout.findIndex((block) => {
    if (block.blockType !== 'richText') return false
    const text = JSON.stringify(block.content)
    return text.includes(PRIVACY_PLACEHOLDER) || text.includes(PRIVACY_SWISS_MARKER)
  })
  if (!page || index === -1) {
    payload.logger.info('Migration: Datenschutzerklärung wurde angepasst, keine Änderung')
    return
  }

  const site = toSiteInfo(await payload.findGlobal({ slug: 'settings', depth: 0, req }))
  const content = richText(...privacyPolicy(site)) as unknown as RichTextBlock['content']
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
    context,
  })
  payload.logger.info('Migration: Datenschutzerklärung auf DSGVO umgestellt')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Not reversible.
}
