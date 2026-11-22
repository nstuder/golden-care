import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type BaseTemplateProps = {
  children: ReactNode
  className?: string
}

/** Page skeleton shared by all frontend pages. Header and footer organisms go here later. */
export function BaseTemplate({ children, className }: BaseTemplateProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className={cn('mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 md:px-8', className)}>
        {children}
      </main>
    </div>
  )
}
