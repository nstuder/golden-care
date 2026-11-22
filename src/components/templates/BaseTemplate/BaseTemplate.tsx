import type { ReactNode } from 'react'

import { Footer, Header, type FooterProps, type HeaderProps } from '@/components/organisms'
import { cn } from '@/lib/cn'

export type BaseTemplateProps = {
  header: HeaderProps
  footer: FooterProps
  banner?: ReactNode
  children: ReactNode
  className?: string
}

/** Page skeleton shared by all frontend pages: header, main content, footer. */
export function BaseTemplate({ header, footer, banner, children, className }: BaseTemplateProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {banner}
      <Header {...header} />
      <main id="inhalt" className={cn('flex flex-1 flex-col', className)}>
        {children}
      </main>
      <Footer {...footer} />
    </div>
  )
}
