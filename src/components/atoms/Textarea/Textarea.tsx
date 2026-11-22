import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

import { fieldClasses } from '../Input'

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>

export function Textarea({ className, rows = 5, ...props }: TextareaProps) {
  return <textarea rows={rows} className={cn(fieldClasses, 'resize-y', className)} {...props} />
}
