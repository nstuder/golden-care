import type { ReactNode } from 'react'

import { Icon } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

export type ContactItemProps = {
  icon: IconName
  label: string
  href?: string
  children: ReactNode
  inverted?: boolean
  className?: string
}

export function ContactItem({
  icon,
  label,
  href,
  children,
  inverted,
  className,
}: ContactItemProps) {
  const content = (
    <>
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full',
          inverted ? 'bg-white/10 text-primary-400' : 'bg-primary-100 text-primary-800',
        )}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            'text-xs font-semibold tracking-wider uppercase',
            inverted ? 'text-primary-300' : 'text-primary-700',
          )}
        >
          {label}
        </span>
        <span className={cn(inverted ? 'text-white' : 'text-foreground')}>{children}</span>
      </span>
    </>
  )

  const classes = cn('flex items-center gap-4', className)

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={cn(classes, 'rounded-theme-sm transition hover:opacity-80')}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return <div className={classes}>{content}</div>
}
