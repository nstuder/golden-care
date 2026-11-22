import { useId } from 'react'

import { Input, Label, Textarea } from '@/components/atoms'
import { fieldClasses } from '@/components/atoms/Input'
import { cn } from '@/lib/cn'

export type FormFieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox'

export type FormFieldProps = {
  name: string
  label: string
  type?: FormFieldType
  required?: boolean
  defaultValue?: string
  placeholder?: string
  options?: { label: string; value: string }[]
  error?: string
  width?: number | null
  className?: string
}

export function FormField({
  name,
  label,
  type = 'text',
  required,
  defaultValue,
  placeholder,
  options,
  error,
  width,
  className,
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  }

  const half = width !== undefined && width !== null && width <= 50

  if (type === 'checkbox') {
    return (
      <div className={cn('flex flex-col gap-1 sm:col-span-2', className)}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            value="true"
            defaultChecked={defaultValue === 'true'}
            className="mt-1 size-5 rounded border-secondary-300 accent-primary-600"
            {...shared}
          />
          <Label htmlFor={id} required={required} className="font-normal">
            {label}
          </Label>
        </div>
        {error ? (
          <p id={errorId} className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  let control
  if (type === 'textarea') {
    control = <Textarea defaultValue={defaultValue} placeholder={placeholder} {...shared} />
  } else if (type === 'select') {
    control = (
      <select defaultValue={defaultValue ?? ''} className={fieldClasses} {...shared}>
        <option value="" disabled>
          {placeholder ?? 'Bitte wählen'}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  } else {
    control = (
      <Input type={type} defaultValue={defaultValue} placeholder={placeholder} {...shared} />
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', half ? 'sm:col-span-1' : 'sm:col-span-2', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {control}
      {error ? (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
