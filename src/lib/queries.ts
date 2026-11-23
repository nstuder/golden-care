import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { HOME_SLUG } from './links'

export const getPayloadClient = () => getPayload({ config })

export const isDraftMode = cache(async () => (await draftMode()).isEnabled)

export const getPageBySlug = cache(async (slug: string = HOME_SLUG) => {
  const draft = await isDraftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
    depth: 2,
    pagination: false,
  })
  return result.docs[0] ?? null
})

export const getSiteGlobals = cache(async () => {
  const draft = await isDraftMode()
  const payload = await getPayloadClient()
  const [settings, navigation, theme] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 1 }),
    payload.findGlobal({ slug: 'navigation', depth: 1 }),
    payload.findGlobal({ slug: 'theme', depth: 0, draft, overrideAccess: draft }),
  ])
  return { settings, navigation, theme }
})

export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    sort: 'order',
    depth: 1,
    pagination: false,
  })
  return result.docs
})

export const getTestimonials = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'testimonials',
    sort: 'createdAt',
    depth: 0,
    pagination: false,
  })
  return result.docs
})

export const getPublishedSlugs = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    select: { slug: true, updatedAt: true, meta: { noIndex: true } },
    depth: 0,
    pagination: false,
  })
  return result.docs
})
