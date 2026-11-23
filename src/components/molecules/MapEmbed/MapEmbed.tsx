import { cn } from '@/lib/cn'

export type MapEmbedProps = {
  src: string
  title?: string
  className?: string
}

/** Embedded Google Maps. Loads lazily once it comes close to the viewport. */
export function MapEmbed({ src, title = 'Karte', className }: MapEmbedProps) {
  return (
    <div
      className={cn(
        'relative aspect-[4/3] overflow-hidden rounded-theme bg-secondary-100 shadow-sm ring-1 ring-secondary-100 sm:aspect-[16/7]',
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
