import { Heading } from '@/components/atoms'
import { BaseTemplate } from '@/components/templates'

export default function HomePage() {
  return (
    <BaseTemplate className="items-center justify-center">
      <Heading level={1} className="text-golden-700">
        Golden Care
      </Heading>
    </BaseTemplate>
  )
}
