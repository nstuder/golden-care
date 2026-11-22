import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

export const fieldClasses =
  'w-full rounded-theme-sm border border-secondary-200 bg-white px-4 py-3 text-foreground placeholder:text-muted/60 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none aria-invalid:border-red-600'

export type InputProps = ComponentPropsWithoutRef<'input'>

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(fieldClasses, className)} {...props} />
}
