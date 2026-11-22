import { cn } from '@/lib/cn'

import { Icon } from '../Icon'

export type LogoProps = {
  name?: string
  tagline?: string | null
  inverted?: boolean
  className?: string
}

export function Logo({ name = 'Golden Care', tagline, inverted, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span className="flex size-10 items-center justify-center rounded-full bg-primary-500 text-secondary-800">
        <Icon name="paw" className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-display text-xl font-semibold',
            inverted ? 'text-white' : 'text-secondary-700',
          )}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={cn(
              'text-xs tracking-wide',
              inverted ? 'text-primary-300' : 'text-primary-700',
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  )
}
