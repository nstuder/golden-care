export type PreviewBannerProps = {
  exitHref?: string
}

/** Shown while Next.js draft mode is active (live preview / preview links). */
export function PreviewBanner({ exitHref = '/next/exit-preview' }: PreviewBannerProps) {
  return (
    <div
      role="status"
      className="bg-primary-500 px-4 py-2 text-center text-sm font-semibold text-secondary-900"
    >
      Vorschau aktiv – du siehst unveröffentlichte Inhalte.{' '}
      <a href={exitHref} className="underline underline-offset-2">
        Vorschau beenden
      </a>
    </div>
  )
}
