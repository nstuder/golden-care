import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const

export type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  width?: keyof typeof widths
}

export function Container({ width = 'default', className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-4 md:px-8', widths[width], className)} {...props} />
}
