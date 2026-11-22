'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button, Container, Icon, Logo } from '@/components/atoms'
import { NavLink } from '@/components/molecules'
import { cn } from '@/lib/cn'
import { telHref, type ResolvedLink } from '@/lib/links'

export type HeaderProps = {
  siteName: string
  tagline?: string | null
  links: ResolvedLink[]
  cta?: ResolvedLink | null
  phone?: string | null
}

export function Header({ siteName, tagline, links, cta, phone }: HeaderProps) {
  const pathname = usePathname()
  // Remember on which page the menu was opened, so it closes automatically after navigating
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenOn(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 bg-secondary-700/95 shadow-lg shadow-secondary-900/20 backdrop-blur">
      <a
        href="#inhalt"
        className="sr-only rounded-full bg-primary-500 px-4 py-2 font-semibold text-secondary-900 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Zum Inhalt springen
      </a>
      <Container width="wide" className="flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteName} – Startseite`} className="rounded-full">
          <Logo name={siteName} tagline={tagline} inverted />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {phone ? (
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary-300 transition hover:text-primary-200 md:flex"
            >
              <Icon name="phone" className="size-4" />
              {phone}
            </a>
          ) : null}
          {cta ? (
            <Button href={cta.href} newTab={cta.newTab} size="sm" className="hidden sm:inline-flex">
              {cta.label}
            </Button>
          ) : null}
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menü schliessen' : 'Menü öffnen'}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn('border-t border-white/10 bg-secondary-800 lg:hidden')}
      >
        <Container className="flex flex-col gap-6 py-6">
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} onNavigate={() => setOpen(false)} className="block text-lg" />
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3 sm:flex-row">
            {cta ? (
              <Button href={cta.href} newTab={cta.newTab}>
                {cta.label}
              </Button>
            ) : null}
            {phone ? (
              <Button href={telHref(phone)} variant="light">
                <Icon name="phone" className="size-5" />
                {phone}
              </Button>
            ) : null}
          </div>
        </Container>
      </div>
    </header>
  )
}
