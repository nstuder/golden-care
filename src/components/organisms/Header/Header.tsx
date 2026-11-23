'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button, Container, Icon, Logo } from '@/components/atoms'
import { NavLink, type SocialLink } from '@/components/molecules'
import { cn } from '@/lib/cn'
import { telHref, type ResolvedLink } from '@/lib/links'

export type HeaderProps = {
  siteName: string
  tagline?: string | null
  links: ResolvedLink[]
  cta?: ResolvedLink | null
  phone?: string | null
  /** One-line opening hours for the top bar, e.g. "Di–Fr 08:30–18:00 · Sa 09:00–14:00" */
  hours?: string | null
  address?: string | null
  mapsHref?: string | null
  socials?: SocialLink[] | null
}

const socialLabels: Record<string, string> = { instagram: 'Instagram', facebook: 'Facebook' }

export function Header({
  siteName,
  tagline,
  links,
  cta,
  phone,
  hours,
  address,
  mapsHref,
  socials,
}: HeaderProps) {
  const pathname = usePathname()
  // Remember on which page the menu was opened, so it closes automatically after navigating
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenOn(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasTopbar = Boolean(hours || address || phone || socials?.length)

  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      className="group/header sticky top-0 z-40 shadow-secondary-900/30 transition-shadow duration-300 data-[scrolled]:shadow-xl"
    >
      <a
        href="#inhalt"
        className="sr-only rounded-full bg-primary-500 px-4 py-2 font-semibold text-secondary-900 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Zum Inhalt springen
      </a>

      {hasTopbar ? (
        <div className="hidden grid-rows-[1fr] bg-secondary-900 text-xs text-secondary-200 transition-[grid-template-rows] duration-300 group-data-[scrolled]/header:grid-rows-[0fr] md:grid">
          <div className="overflow-hidden">
            <Container width="wide" className="flex h-9 items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {hours ? (
                  <span className="flex items-center gap-2">
                    <Icon name="clock" className="size-3.5 text-primary-400" />
                    {hours}
                  </span>
                ) : null}
                {address ? (
                  <a
                    href={mapsHref ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center gap-2 transition hover:text-primary-300 lg:flex"
                  >
                    <Icon name="map-pin" className="size-3.5 text-primary-400" />
                    {address}
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-5">
                {phone ? (
                  <a
                    href={telHref(phone)}
                    className="flex items-center gap-2 font-semibold text-primary-300 transition hover:text-primary-200"
                  >
                    <Icon name="phone" className="size-3.5" />
                    {phone}
                  </a>
                ) : null}
                {socials?.length ? (
                  <ul className="flex items-center gap-3 border-l border-white/15 pl-5">
                    {socials.map((social) => (
                      <li key={social.url}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={socialLabels[social.platform] ?? social.platform}
                          className="block transition hover:text-primary-300"
                        >
                          <Icon name={social.platform} className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Container>
          </div>
        </div>
      ) : null}

      <div className="relative bg-secondary-700/95 backdrop-blur transition-colors duration-300 group-data-[scrolled]/header:bg-secondary-800/95">
        <Container
          width="wide"
          className="relative flex h-20 items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled]/header:h-16"
        >
          <Link
            href="/"
            aria-label={`${siteName} – Startseite`}
            className="group/logo rounded-full"
          >
            <Logo
              name={siteName}
              tagline={tagline}
              inverted
              markClassName="transition-transform duration-300 group-hover/logo:-translate-x-0.5 group-hover/logo:-rotate-3 group-data-[scrolled]/header:scale-90"
            />
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
            {cta ? (
              <Button
                href={cta.href}
                newTab={cta.newTab}
                size="sm"
                className="shine hidden sm:inline-flex"
              >
                <Icon name="calendar" className="size-4" />
                {cta.label}
              </Button>
            ) : null}
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </Container>
        {/* Golden hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/80 to-transparent"
        />
      </div>

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
