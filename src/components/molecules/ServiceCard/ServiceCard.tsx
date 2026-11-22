import { Heading, Icon, Picture, Text } from '@/components/atoms'
import { cn } from '@/lib/cn'
import type { ImageData } from '@/lib/media'

export type ServiceCardProps = {
  title: string
  summary?: string | null
  icon?: string | null
  image?: ImageData | null
  className?: string
}

export function ServiceCard({ title, summary, icon, image, className }: ServiceCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-theme border border-secondary-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary-900/10',
        className,
      )}
    >
      {image !== undefined ? (
        <div className="relative aspect-[4/3]">
          <Picture
            image={image}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            imgClassName="transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="relative flex flex-1 flex-col gap-3 p-6">
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-full bg-secondary-700 text-primary-400 ring-4 ring-white',
            image !== undefined && '-mt-12',
          )}
        >
          <Icon name={icon} />
        </span>
        <Heading level={3} size={5}>
          {title}
        </Heading>
        {summary ? <Text>{summary}</Text> : null}
      </div>
    </article>
  )
}
