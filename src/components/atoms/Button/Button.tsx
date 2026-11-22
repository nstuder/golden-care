import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { isExternal } from '@/lib/links'

const variants = {
  primary:
    'bg-primary-500 text-secondary-900 shadow-sm shadow-primary-900/20 hover:bg-primary-400 focus-visible:outline-primary-600',
  secondary: 'bg-secondary-700 text-white hover:bg-secondary-600',
  outline: 'border-2 border-primary-500 text-secondary-700 hover:bg-primary-50',
  light: 'border-2 border-white/70 text-white hover:border-white hover:bg-white/10',
  ghost: 'text-secondary-700 hover:bg-secondary-50',
} as const

const sizes = {
  sm: 'gap-1.5 px-4 py-2 text-sm',
  md: 'gap-2 px-6 py-3 text-base',
  lg: 'gap-2.5 px-8 py-4 text-lg',
} as const

export type ButtonVariant = keyof typeof variants
export type ButtonSize = keyof typeof sizes

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type AsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined }
type AsLink = CommonProps & { href: string; newTab?: boolean; 'aria-label'?: string }

export type ButtonProps = AsButton | AsLink

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Button(props: ButtonProps) {
  const { variant, size, className, children } = props
  const classes = buttonClasses(variant, size, className)

  if (props.href !== undefined) {
    const { href, newTab } = props
    if (isExternal(href) || newTab) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={props['aria-label']}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} aria-label={props['aria-label']}>
        {children}
      </Link>
    )
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    type = 'button',
    ...rest
  } = props as AsButton
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
