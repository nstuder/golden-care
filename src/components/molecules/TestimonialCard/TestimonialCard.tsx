import { Icon } from '@/components/atoms'
import { cn } from '@/lib/cn'

export type TestimonialCardProps = {
  quote: string
  author: string
  dog?: string | null
  className?: string
}

export function TestimonialCard({ quote, author, dog, className }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col gap-6 rounded-theme bg-white/5 p-8 ring-1 ring-white/10',
        className,
      )}
    >
      <Icon name="quote" className="size-8 text-primary-400" />
      <blockquote className="flex-1 font-display text-xl leading-relaxed text-white">
        „{quote}“
      </blockquote>
      <figcaption className="flex flex-col">
        <span className="font-semibold text-primary-300">{author}</span>
        {dog ? <span className="text-sm text-secondary-200">{dog}</span> : null}
      </figcaption>
    </figure>
  )
}
