export type MediaLike = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<
    string,
    { url?: string | null; width?: number | null; height?: number | null } | undefined
  > | null
}

export type ImageData = {
  src: string
  alt: string
  width?: number
  height?: number
}

/** Payload may return absolute URLs (serverURL); next/image should load them as local paths. */
export function toLocalUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/')) return parsed.pathname
    return url
  } catch {
    return url
  }
}

/** Normalises a Payload upload value (populated doc, id or null) into image props. */
export function toImage(media: unknown, size?: string): ImageData | null {
  if (!media || typeof media !== 'object') return null
  const doc = media as MediaLike
  const variant = size ? doc.sizes?.[size] : undefined
  const url = variant?.url || doc.url
  if (!url) return null

  return {
    src: toLocalUrl(url),
    alt: doc.alt ?? '',
    width: (variant?.url ? variant.width : doc.width) ?? undefined,
    height: (variant?.url ? variant.height : doc.height) ?? undefined,
  }
}
