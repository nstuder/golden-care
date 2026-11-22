'use client'

import { useState, type FormEvent, type ReactNode } from 'react'

import { Button, Container, Icon, Section } from '@/components/atoms'
import { FormField, SectionHeader, type FormFieldProps } from '@/components/molecules'

export type ContactFormProps = {
  formId: string
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  fields: FormFieldProps[]
  submitLabel?: string | null
  confirmation?: ReactNode
  /** Endpoint of the Payload form builder plugin. */
  action?: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(fields: FormFieldProps[], data: FormData): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const value = String(data.get(field.name) ?? '').trim()
    if (field.required && !value) {
      errors[field.name] = field.type === 'checkbox' ? 'Bitte bestätigen.' : 'Bitte ausfüllen.'
    } else if (field.type === 'email' && value && !EMAIL.test(value)) {
      errors[field.name] = 'Bitte eine gültige E-Mail-Adresse eingeben.'
    }
  }
  return errors
}

export function ContactForm({
  formId,
  eyebrow,
  heading,
  intro,
  fields,
  submitLabel,
  confirmation,
  action = '/api/form-submissions',
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = validate(fields, data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('sending')
    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: fields.map((field) => ({
            field: field.name,
            value: String(data.get(field.name) ?? (field.type === 'checkbox' ? 'false' : '')),
          })),
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section tone="tint" id="kontaktformular">
      <Container width="narrow" className="flex flex-col gap-10">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className="rounded-theme bg-white p-6 shadow-lg ring-1 shadow-secondary-900/5 ring-secondary-100 md:p-10">
          {status === 'success' ? (
            <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <Icon name="check" className="size-7" />
              </span>
              {confirmation ?? (
                <p className="text-lg">Vielen Dank für deine Nachricht! Wir melden uns bald.</p>
              )}
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <FormField key={field.name} {...field} error={errors[field.name]} />
              ))}
              {status === 'error' ? (
                <p role="alert" className="text-red-700 sm:col-span-2">
                  Leider ist etwas schiefgelaufen. Bitte versuche es nochmals oder ruf uns an.
                </p>
              ) : null}
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" disabled={status === 'sending'}>
                  <Icon name="send" className="size-5" />
                  {status === 'sending' ? 'Wird gesendet …' : submitLabel || 'Nachricht senden'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </Section>
  )
}
