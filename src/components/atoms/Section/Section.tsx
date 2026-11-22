import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

const tones = {
  light: 'bg-background',
  white: 'bg-white',
  tint: 'bg-primary-50',
  dark: 'bg-secondary-700 text-white',
} as const

export type SectionTone = keyof typeof tones

export type SectionProps = ComponentPropsWithoutRef<'section'> & {
  tone?: SectionTone
  spacing?: 'sm' | 'md' | 'lg'
}

const spacings = {
  sm: 'py-10 md:py-14',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:py-32',
} as const

export function Section({ tone = 'light', spacing = 'md', className, ...props }: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(tones[tone], spacings[spacing], className)}
      {...props}
    />
  )
}
