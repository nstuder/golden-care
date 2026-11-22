import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const sizes: Record<HeadingLevel, string> = {
  1: 'text-5xl md:text-7xl',
  2: 'text-4xl md:text-5xl',
  3: 'text-3xl md:text-4xl',
  4: 'text-2xl md:text-3xl',
  5: 'text-xl md:text-2xl',
  6: 'text-lg md:text-xl',
}

export type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
  /** Semantic heading level (h1–h6). */
  level?: HeadingLevel
  /** Visual size, if it should differ from the semantic level. */
  size?: HeadingLevel
}

export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const

  return (
    <Tag
      className={cn(
        'font-display font-semibold tracking-tight text-balance text-ink',
        sizes[size ?? level],
        className,
      )}
      {...props}
    />
  )
}
