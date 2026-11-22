import { Icon } from '@/components/atoms'
import { cn } from '@/lib/cn'

export type FaqItemProps = {
  question: string
  answer: string
  defaultOpen?: boolean
  className?: string
}

/** Native <details> accordion – accessible and works without JavaScript. */
export function FaqItem({ question, answer, defaultOpen, className }: FaqItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'group rounded-theme-sm border border-secondary-100 bg-white px-6 open:shadow-sm',
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        {question}
        <Icon
          name="chevron-down"
          className="size-5 text-primary-600 transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="pb-5 leading-relaxed whitespace-pre-line text-muted">{answer}</p>
    </details>
  )
}
