import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

export type EyebrowProps = ComponentPropsWithoutRef<'p'>

/** Small uppercase kicker above headings. */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn('text-sm font-semibold tracking-[0.2em] text-primary-600 uppercase', className)}
      {...props}
    />
  )
}
