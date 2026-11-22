import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { HOME_SLUG } from '@/lib/links'

import { PageView, pageMetadata } from '../PageView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  return pageMetadata(decodeURIComponent(slug))
}

export default async function SlugPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  if (slug === HOME_SLUG) redirect('/')
  return <PageView slug={decodeURIComponent(slug)} />
}
