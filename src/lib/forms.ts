import type { FormFieldProps } from '@/components/molecules/FormField'
import type { Form } from '@/payload-types'

type FormBuilderField = NonNullable<Form['fields']>[number]

const PHONE = /phone|telefon|tel\b/i

/** Maps form builder plugin fields to FormField props. Unsupported blocks are skipped. */
export function toFormFields(fields?: FormBuilderField[] | null): FormFieldProps[] {
  return (fields ?? []).flatMap((field): FormFieldProps[] => {
    switch (field.blockType) {
      case 'text':
        return [
          {
            name: field.name,
            label: field.label || field.name,
            type: PHONE.test(field.name) ? 'tel' : 'text',
            required: Boolean(field.required),
            defaultValue: field.defaultValue ?? undefined,
            width: field.width,
          },
        ]
      case 'email':
        return [
          {
            name: field.name,
            label: field.label || field.name,
            type: 'email',
            required: Boolean(field.required),
            width: field.width,
          },
        ]
      case 'textarea':
        return [
          {
            name: field.name,
            label: field.label || field.name,
            type: 'textarea',
            required: Boolean(field.required),
            defaultValue: field.defaultValue ?? undefined,
            width: field.width,
          },
        ]
      case 'select':
        return [
          {
            name: field.name,
            label: field.label || field.name,
            type: 'select',
            required: Boolean(field.required),
            defaultValue: field.defaultValue ?? undefined,
            placeholder: field.placeholder ?? undefined,
            options: (field.options ?? []).map(({ label, value }) => ({ label, value })),
            width: field.width,
          },
        ]
      case 'checkbox':
        return [
          {
            name: field.name,
            label: field.label || field.name,
            type: 'checkbox',
            required: Boolean(field.required),
            defaultValue: field.defaultValue ? 'true' : undefined,
          },
        ]
      default:
        return []
    }
  })
}
