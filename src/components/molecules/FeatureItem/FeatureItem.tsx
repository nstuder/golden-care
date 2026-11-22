import { Heading, Icon, Text } from '@/components/atoms'
import { cn } from '@/lib/cn'

export type FeatureItemProps = {
  icon?: string | null
  title: string
  text?: string | null
  inverted?: boolean
  className?: string
}

export function FeatureItem({ icon, title, text, inverted, className }: FeatureItemProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-theme-sm',
          inverted ? 'bg-primary-500 text-secondary-800' : 'bg-primary-100 text-primary-800',
        )}
      >
        <Icon name={icon} />
      </span>
      <div className="flex flex-col gap-1">
        <Heading level={3} size={6} inverted={inverted}>
          {title}
        </Heading>
        {text ? <Text tone={inverted ? 'inverted' : 'muted'}>{text}</Text> : null}
      </div>
    </div>
  )
}
