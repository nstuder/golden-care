'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

export type NavLinkProps = {
  href: string
  label: string
  newTab?: boolean
  onNavigate?: () => void
  className?: string
}

export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavLink({ href, label, newTab, onNavigate, className }: NavLinkProps) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative py-2 font-medium text-secondary-100 transition-colors hover:text-primary-300',
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary-400 after:transition-transform after:content-['']",
        'hover:after:scale-x-100',
        active && 'text-primary-300 after:scale-x-100',
        className,
      )}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
    </Link>
  )
}
