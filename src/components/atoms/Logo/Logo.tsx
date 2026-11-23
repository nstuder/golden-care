import { useId } from 'react'

import { cn } from '@/lib/cn'

import { dogEarPath, dogPath, laurelPath, laurelStemPath } from './paths'

const LAUREL_GREEN = '#7f9668'

/** Splits "Golden Care" into the golden first word and the rest */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/)
  return [first ?? '', rest.join(' ')]
}

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e2bd6b" />
      <stop offset="0.45" stopColor="#b8862f" />
      <stop offset="0.7" stopColor="#d9b25e" />
      <stop offset="1" stopColor="#8f6420" />
    </linearGradient>
  )
}

export type LogoMarkProps = {
  className?: string
  /** Colour of the ear line, should match the background */
  earColor?: string
  title?: string
}

/** The trotting golden retriever on its own (header, favicons) */
export function LogoMark({ className, earColor = '#2a1638', title }: LogoMarkProps) {
  const gradient = useId()
  return (
    <svg
      viewBox="0 0 800 460"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <GoldGradient id={gradient} />
      </defs>
      <path d={dogPath} fill={`url(#${gradient})`} />
      <path
        d={dogEarPath}
        fill="none"
        stroke={earColor}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.8}
      />
    </svg>
  )
}

export type LogoBadgeProps = {
  name?: string
  tagline?: string | null
  inverted?: boolean
  className?: string
}

/** Full round logo: brush ring, name, retriever, laurels and tagline */
export function LogoBadge({
  name = 'Golden Care',
  tagline = 'Salon für Hundegesundheit und Fellpflege',
  inverted,
  className,
}: LogoBadgeProps) {
  const gradient = useId()
  const gold = `url(#${gradient})`
  const [first, rest] = splitName(name)
  const lines = splitTagline(tagline ?? '')
  const textColor = inverted ? '#e3cf95' : '#3b3340'

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={[name, tagline].filter(Boolean).join(' – ')}
    >
      <defs>
        <GoldGradient id={gradient} />
      </defs>
      <g fill="none" stroke={gold} strokeLinecap="round">
        <circle cx="200" cy="200" r="182" strokeWidth="7" />
        <path d="M48 120 A178 178 0 0 1 292 38" strokeWidth="2.5" />
        <path d="M368 252 A176 176 0 0 1 122 360" strokeWidth="3" />
        <path d="M32 228 A172 172 0 0 0 92 330" strokeWidth="1.6" />
      </g>
      <text
        x="200"
        y="134"
        textAnchor="middle"
        fontSize="38"
        letterSpacing="1"
        style={{ fontFamily: 'var(--font-logo)' }}
      >
        <tspan fill={gold}>{first.toUpperCase()}</tspan>
        {rest ? <tspan fill={inverted ? '#fbf8f3' : '#2a1638'}> {rest.toUpperCase()}</tspan> : null}
      </text>
      <g transform="translate(86 150) scale(.29)">
        <path d={dogPath} fill={gold} />
        <path
          d={dogEarPath}
          fill="none"
          stroke={inverted ? '#2a1638' : '#fbf8f3'}
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.8}
        />
      </g>
      <g fill={LAUREL_GREEN}>
        <g transform="translate(30 160) scale(.25)">
          <path d={laurelPath} />
          <path d={laurelStemPath} fill="none" stroke={LAUREL_GREEN} strokeWidth={7} />
        </g>
        <g transform="translate(370 160) scale(-.25 .25)">
          <path d={laurelPath} />
          <path d={laurelStemPath} fill="none" stroke={LAUREL_GREEN} strokeWidth={7} />
        </g>
      </g>
      {lines.map((line, i) => (
        <text
          key={line}
          x="200"
          y={300 + i * 20}
          textAnchor="middle"
          fontSize="13.5"
          fontWeight={500}
          letterSpacing=".6"
          fill={textColor}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {line.toUpperCase()}
        </text>
      ))}
    </svg>
  )
}

/** Breaks the tagline into at most two balanced lines for the badge */
export function splitTagline(tagline: string): string[] {
  const words = tagline.trim().split(/\s+/).filter(Boolean)
  if (words.join(' ').length <= 26) return words.length ? [words.join(' ')] : []
  let best: string[] = [words.join(' ')]
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    // Prefer a longer first line, like the original artwork
    const diff = Math.abs(a.length - b.length) + (a.length < b.length ? 4 : 0)
    if (diff < bestDiff) {
      best = [a, b]
      bestDiff = diff
    }
  }
  return best
}

export type LogoProps = {
  name?: string
  tagline?: string | null
  inverted?: boolean
  className?: string
  /** Extra classes for the retriever, e.g. to shrink it in the sticky header */
  markClassName?: string
}

/** Horizontal lockup for the header: retriever + wordmark */
export function Logo({
  name = 'Golden Care',
  tagline,
  inverted,
  className,
  markClassName,
}: LogoProps) {
  const [first, rest] = splitName(name)
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark
        className={cn('h-9 w-auto shrink-0', markClassName)}
        earColor={inverted ? '#2a1638' : '#fbf8f3'}
      />
      <span className="flex flex-col leading-tight">
        <span className="font-logo text-xl tracking-wide whitespace-nowrap uppercase">
          <span className="text-primary-400">{first}</span>
          {rest ? (
            <span className={inverted ? 'text-white' : 'text-secondary-700'}> {rest}</span>
          ) : null}
        </span>
        {tagline ? (
          <span
            className={cn(
              'hidden text-xs tracking-wide sm:block',
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
