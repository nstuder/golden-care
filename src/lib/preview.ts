import { pathForSlug } from './links'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** URL that enables draft mode and then shows `path` (used by Payload live preview). */
export function previewUrl(path: string): string {
  return `${serverURL}/next/preview?path=${encodeURIComponent(path)}`
}

export function pagePreviewUrl(slug?: string | null): string {
  return previewUrl(pathForSlug(slug))
}

/** Only allow same-site paths to prevent open redirects. */
export function isSafePreviewPath(path: string | null): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\'))
}
