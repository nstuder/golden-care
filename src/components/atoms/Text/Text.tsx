import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg md:text-xl',
} as const

const tones = {
  default: 'text-foreground',
  muted: 'text-muted',
  inverted: 'text-secondary-100',
} as const

export type TextProps = ComponentPropsWithoutRef<'p'> & {
  size?: keyof typeof sizes
  tone?: keyof typeof tones
}

export function Text({ size = 'md', tone = 'muted', className, ...props }: TextProps) {
  return (
    <p
      className={cn('leading-relaxed text-pretty', sizes[size], tones[tone], className)}
      {...props}
    />
  )
}
