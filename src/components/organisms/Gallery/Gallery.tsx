'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Container, Icon, Section } from '@/components/atoms'
import { SectionHeader } from '@/components/molecules'
import type { ImageData } from '@/lib/media'

export type GalleryImage = ImageData & { id: string; caption?: string | null }

export type GalleryProps = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  images: GalleryImage[]
}

export function Gallery({ eyebrow, heading, intro, images }: GalleryProps) {
  const [current, setCurrent] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const close = useCallback(() => {
    setCurrent((index) => {
      if (index !== null) triggerRefs.current[index]?.focus()
      return null
    })
  }, [])

  const step = useCallback(
    (delta: number) =>
      setCurrent((index) =>
        index === null ? null : (index + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (current === null) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [current, close, step])

  if (!images.length) return null
  const active = current === null ? null : images[current]

  return (
    <Section tone="white">
      <Container width="wide" className="flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className={index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : undefined}
            >
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[index] = el
                }}
                onClick={() => setCurrent(index)}
                aria-label={`Bild vergrössern: ${image.caption || image.alt}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-theme-sm bg-secondary-100"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-secondary-900/0 transition group-hover:bg-secondary-900/20" />
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || active.alt || 'Bild'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/95 p-4"
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Schliessen"
            className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <Icon name="close" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Vorheriges Bild"
                className="absolute left-2 flex size-12 items-center justify-center rounded-full text-white hover:bg-white/10 md:left-6"
              >
                <Icon name="chevron-left" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Nächstes Bild"
                className="absolute right-2 flex size-12 items-center justify-center rounded-full text-white hover:bg-white/10 md:right-6"
              >
                <Icon name="chevron-right" />
              </button>
            </>
          ) : null}
          <figure className="flex max-h-full max-w-5xl flex-col items-center gap-4">
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width ?? 1600}
              height={active.height ?? 1200}
              sizes="90vw"
              className="max-h-[80vh] w-auto rounded-theme-sm object-contain"
            />
            <figcaption className="text-center text-secondary-100">
              {active.caption ? <span className="block">{active.caption}</span> : null}
              <span className="text-sm text-secondary-300">
                {current! + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </Section>
  )
}
