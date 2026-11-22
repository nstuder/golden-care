import { cn } from '@/lib/cn'

export type OpeningHoursEntry = {
  days: string
  hours: string
}

export type OpeningHoursProps = {
  entries?: OpeningHoursEntry[] | null
  note?: string | null
  inverted?: boolean
  className?: string
}

export function OpeningHours({ entries, note, inverted, className }: OpeningHoursProps) {
  if (!entries?.length && !note) return null

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {entries?.length ? (
        <dl className="divide-y divide-current/10">
          {entries.map((entry) => (
            <div key={`${entry.days}-${entry.hours}`} className="flex justify-between gap-6 py-2">
              <dt className={cn('font-medium', inverted ? 'text-white' : 'text-foreground')}>
                {entry.days}
              </dt>
              <dd
                className={cn(
                  'text-right tabular-nums',
                  inverted ? 'text-secondary-100' : 'text-muted',
                )}
              >
                {entry.hours}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {note ? (
        <p className={cn('text-sm italic', inverted ? 'text-primary-300' : 'text-primary-800')}>
          {note}
        </p>
      ) : null}
    </div>
  )
}
