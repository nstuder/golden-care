import { Icon } from '@/components/atoms'
import { cn } from '@/lib/cn'

export type SocialLink = {
  platform: 'instagram' | 'facebook' | string
  url: string
}

export type SocialLinksProps = {
  links?: SocialLink[] | null
  className?: string
}

const labels: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  if (!links?.length) return null

  return (
    <ul className={cn('flex gap-3', className)}>
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels[link.platform] ?? link.platform}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 text-primary-300 transition hover:bg-primary-500 hover:text-secondary-900"
          >
            <Icon name={link.platform} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
