'use client'

import { useEffect, useState } from 'react'

import { Button, Icon } from '@/components/atoms'
import { cn } from '@/lib/cn'

export const MAP_CONSENT_KEY = 'golden-care:maps-consent'

export type MapEmbedProps = {
  src: string
  title?: string
  /** Link to the privacy policy shown in the consent notice */
  privacyHref?: string | null
  className?: string
}

function readConsent(): boolean {
  try {
    return window.localStorage.getItem(MAP_CONSENT_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Google Maps with a click-to-load notice: no data goes to Google before the visitor agrees.
 * The decision is remembered in localStorage.
 */
export function MapEmbed({ src, title = 'Karte', privacyHref, className }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // localStorage only exists in the browser, so the saved choice is applied after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent()) setLoaded(true)
  }, [])

  const load = (remember: boolean) => {
    if (remember) {
      try {
        window.localStorage.setItem(MAP_CONSENT_KEY, '1')
      } catch {
        // Storage blocked: load just this time
      }
    }
    setLoaded(true)
  }

  return (
    <div
      className={cn(
        'relative aspect-[4/3] overflow-hidden rounded-theme bg-secondary-100 shadow-sm ring-1 ring-secondary-100 sm:aspect-[16/7]',
        className,
      )}
    >
      {loaded ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* Decorative street grid instead of the real map */}
          <svg
            aria-hidden
            className="absolute inset-0 size-full text-secondary-200"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="map-grid" width="120" height="90" patternUnits="userSpaceOnUse">
                <path
                  d="M0 30 H120 M40 0 V90 M0 75 L120 55 M95 0 L80 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
          <div className="relative flex max-w-md flex-col items-center gap-4 rounded-theme bg-white/95 p-6 text-center shadow-lg backdrop-blur">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-500 text-secondary-900">
              <Icon name="map-pin" className="size-6" />
            </span>
            <p className="text-sm text-secondary-700">
              Beim Laden der Karte werden Daten an Google übertragen.
              {privacyHref ? (
                <>
                  {' '}
                  Mehr dazu in der{' '}
                  <a
                    href={privacyHref}
                    className="font-medium text-primary-700 underline underline-offset-4"
                  >
                    Datenschutzerklärung
                  </a>
                  .
                </>
              ) : null}
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button type="button" onClick={() => load(false)} size="sm">
                Karte laden
              </Button>
              <button
                type="button"
                onClick={() => load(true)}
                className="text-xs text-secondary-500 underline-offset-4 hover:underline"
              >
                Immer laden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
