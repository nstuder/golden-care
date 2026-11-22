import type { Metadata } from 'next'

import { PageView, pageMetadata } from './PageView'

export const dynamic = 'force-dynamic'

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata()
}

export default function HomePage() {
  return <PageView />
}
