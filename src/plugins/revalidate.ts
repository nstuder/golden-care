import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Config,
  GlobalAfterChangeHook,
  Payload,
  Plugin,
} from 'payload'

/** Content that ends up on the (statically cached) website */
export const revalidatedCollections = ['pages', 'services', 'testimonials', 'media', 'forms']
export const revalidatedGlobals = ['settings', 'navigation', 'theme']

type Versioned = { _status?: 'draft' | 'published' | null } | null | undefined

/**
 * Drafts of unpublished documents never reach the public site, so they don't need a revalidation.
 * Unpublishing (published → draft) does, because the page has to disappear. Drafts of an already
 * published page also trigger it (Payload can't tell them apart from unpublishing here) – harmless,
 * the page is just re-rendered with the unchanged published content on the next visit.
 */
export function affectsPublishedSite(doc: Versioned, previousDoc?: Versioned): boolean {
  return doc?._status !== 'draft' || previousDoc?._status === 'published'
}

/** Marks every page of the website as stale; the next visitor gets a freshly rendered page */
export function revalidateSite(payload: Payload, reason: string): void {
  try {
    revalidatePath('/', 'layout')
    payload.logger.info(`Website-Cache erneuert (${reason})`)
  } catch {
    // Outside of a Next.js request (e.g. `pnpm seed`) there is no cache to revalidate
  }
}

const afterChange: CollectionAfterChangeHook = ({ collection, doc, previousDoc, req, context }) => {
  if (!context.disableRevalidate && affectsPublishedSite(doc, previousDoc)) {
    revalidateSite(req.payload, collection.slug)
  }
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ collection, doc, req, context }) => {
  if (!context.disableRevalidate) revalidateSite(req.payload, `${collection.slug} gelöscht`)
  return doc
}

const globalAfterChange: GlobalAfterChangeHook = ({ global, doc, previousDoc, req, context }) => {
  if (!context.disableRevalidate && affectsPublishedSite(doc, previousDoc)) {
    revalidateSite(req.payload, global.slug)
  }
  return doc
}

/** Adds on-demand ISR revalidation hooks to all collections and globals shown on the website */
export const revalidatePlugin =
  (): Plugin =>
  (config: Config): Config => ({
    ...config,
    collections: config.collections?.map((collection) =>
      revalidatedCollections.includes(collection.slug)
        ? {
            ...collection,
            hooks: {
              ...collection.hooks,
              afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
              afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
            },
          }
        : collection,
    ),
    globals: config.globals?.map((global) =>
      revalidatedGlobals.includes(global.slug)
        ? {
            ...global,
            hooks: {
              ...global.hooks,
              afterChange: [...(global.hooks?.afterChange ?? []), globalAfterChange],
            },
          }
        : global,
    ),
  })
