import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { HOME_SLUG } from '@/lib/links'

import { PageView, pageMetadata } from '../PageView'

/*
 * ISR: pages are rendered on their first visit and then served from the cache.
 * Publishing content in the CMS revalidates them right away (src/plugins/revalidate.ts);
 * the time-based revalidation is only a safety net. Draft mode (live preview) is always dynamic.
 */
export const revalidate = 86400

/** Nothing is prerendered at build time, because the Docker build has no database access */
export function generateStaticParams() {
  return []
}

function slugFromParams(segments: string[] | undefined): string | null {
  if (!segments?.length) return HOME_SLUG
  if (segments.length > 1) return null
  try {
    return decodeURIComponent(segments[0])
  } catch {
    return null // malformed percent-encoding (e.g. "/100%") → 404 instead of a 500
  }
}

export async function generateMetadata({ params }: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const slug = slugFromParams((await params).slug)
  return slug ? pageMetadata(slug) : {}
}

export default async function Page({ params }: PageProps<'/[[...slug]]'>) {
  const { slug: segments } = await params
  const slug = slugFromParams(segments)
  if (!slug) notFound()
  if (segments?.length && slug === HOME_SLUG) redirect('/')
  return <PageView slug={slug} />
}
