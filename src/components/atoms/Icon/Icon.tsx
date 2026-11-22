import {
  Award,
  Bath,
  Bone,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Dog,
  Droplets,
  HandHeart,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PawPrint,
  Phone,
  Quote,
  Scissors,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { SVGProps } from 'react'

import type { IconName } from '@/lib/icons'
import { cn } from '@/lib/cn'

type SvgIcon = (props: SVGProps<SVGSVGElement>) => React.JSX.Element

// lucide no longer ships brand icons
const Instagram: SvgIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)

const Facebook: SvgIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const icons: Record<IconName, LucideIcon | SvgIcon> = {
  paw: PawPrint,
  scissors: Scissors,
  bath: Bath,
  wind: Wind,
  droplets: Droplets,
  sparkles: Sparkles,
  heart: Heart,
  'hand-heart': HandHeart,
  shield: ShieldCheck,
  leaf: Leaf,
  star: Star,
  award: Award,
  clock: Clock,
  bone: Bone,
  dog: Dog,
  smile: Smile,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  whatsapp: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
  menu: Menu,
  close: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  quote: Quote,
  check: CircleCheck,
  send: Send,
}

export type IconProps = {
  name?: IconName | string | null
  className?: string
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  label?: string
}

export function Icon({ name, className, label }: IconProps) {
  const Component = (name && icons[name as IconName]) || PawPrint

  return (
    <Component
      className={cn('size-6 shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      data-icon={name ?? 'paw'}
    />
  )
}
