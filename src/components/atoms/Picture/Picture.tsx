import Image from 'next/image'

import { cn } from '@/lib/cn'
import type { ImageData } from '@/lib/media'

import { Icon } from '../Icon'

export type PictureProps = {
  image?: ImageData | null
  /** Fill the (relatively positioned) parent instead of using intrinsic size. */
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
}

/** Image from the CMS, with a branded placeholder when none is set. */
export function Picture({
  image,
  fill = true,
  sizes = '100vw',
  priority,
  className,
  imgClassName,
}: PictureProps) {
  if (!image) {
    return (
      <div
        role="img"
        aria-label="Platzhalterbild"
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-200',
          fill && 'absolute inset-0',
          className,
        )}
      >
        <Icon name="paw" className="size-12 text-secondary-700/40" />
      </div>
    )
  }

  if (fill) {
    return (
      <div className={cn('absolute inset-0 overflow-hidden', className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imgClassName)}
        />
      </div>
    )
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width ?? 1200}
      height={image.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className, imgClassName)}
    />
  )
}
