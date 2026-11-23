import type { CSSProperties } from 'react'

export type RevealVariant = 'up' | 'left' | 'right' | 'zoom'

export type RevealProps = {
  'data-reveal': RevealVariant
  style?: CSSProperties
}

/**
 * Marks an element for the scroll-in transition (see RevealObserver and globals.css).
 * `index` staggers items of a list; the delay is capped so long lists don't lag behind.
 */
export function reveal(variant: RevealVariant = 'up', index = 0, step = 90): RevealProps {
  const delay = Math.min(index, 5) * step
  return delay
    ? { 'data-reveal': variant, style: { '--reveal-delay': `${delay}ms` } as CSSProperties }
    : { 'data-reveal': variant }
}
