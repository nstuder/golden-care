import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

export type LabelProps = ComponentPropsWithoutRef<'label'> & { required?: boolean }

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-semibold text-foreground', className)} {...props}>
      {children}
      {required ? (
        <span className="ml-0.5 text-primary-700" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  )
}
