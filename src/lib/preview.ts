import { serverURL } from './env'
import { pathForSlug } from './links'

/** URL that enables draft mode and then shows `path` (used by Payload live preview). */
export function previewUrl(path: string): string {
  return `${serverURL}/next/preview?path=${encodeURIComponent(path)}`
}

export function pagePreviewUrl(slug?: string | null): string {
  return previewUrl(pathForSlug(slug))
}

const PREVIEW_BASE = 'http://preview.invalid'

/**
 * Only allow same-site paths to prevent open redirects. The path is resolved the way a browser
 * would (which strips tabs/newlines and treats "\\" like "/"), so "/\t/evil.com" is rejected too.
 */
export function isSafePreviewPath(path: string | null): path is string {
  if (!path || !path.startsWith('/') || /[\u0000-\u001f\\]/.test(path)) return false
  try {
    return new URL(path, PREVIEW_BASE).origin === PREVIEW_BASE
  } catch {
    return false
  }
}
