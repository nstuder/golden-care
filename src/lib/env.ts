export const serverURL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

/** Search engines may only index the site once ALLOW_INDEXING=true (go-live). Read at request time. */
export function allowIndexing(): boolean {
  return process.env.ALLOW_INDEXING === 'true'
}
