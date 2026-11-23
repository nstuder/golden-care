'use client'

import { useEffect } from 'react'

const SELECTOR = '[data-reveal]:not([data-revealed])'

/**
 * Fades elements marked with `data-reveal` in when they scroll into view.
 * A MutationObserver picks up content added later (client navigation, live preview).
 * Without JavaScript or with reduced motion everything is simply visible (see globals.css).
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement
    if (!('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready')
      return
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          intersection.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const observeAll = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => intersection.observe(el))
    observeAll()

    const mutation = new MutationObserver(observeAll)
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersection.disconnect()
      mutation.disconnect()
    }
  }, [])

  return null
}
