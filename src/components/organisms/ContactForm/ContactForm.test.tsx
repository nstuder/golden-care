import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { FormFieldProps } from '@/components/molecules'

import { ContactForm, validate } from './ContactForm'

const fields: FormFieldProps[] = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'E-Mail', type: 'email', required: true },
  { name: 'message', label: 'Nachricht', type: 'textarea' },
  { name: 'privacy', label: 'Einverstanden', type: 'checkbox', required: true },
]

describe('validate', () => {
  it('reports required and invalid fields', () => {
    const data = new FormData()
    data.set('email', 'kein-mail')
    expect(validate(fields, data)).toEqual({
      name: 'Bitte ausfüllen.',
      email: 'Bitte eine gültige E-Mail-Adresse eingeben.',
      privacy: 'Bitte bestätigen.',
    })
  })
})

describe('ContactForm', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => vi.unstubAllGlobals())

  async function fillValid(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/^Name/), 'Anna')
    await user.type(screen.getByLabelText(/^E-Mail/), 'anna@example.com')
    await user.type(screen.getByLabelText('Nachricht'), 'Hallo')
    await user.click(screen.getByRole('checkbox', { name: /Einverstanden/ }))
  }

  it('shows validation errors and does not submit', async () => {
    const user = userEvent.setup()
    render(<ContactForm formId="f1" fields={fields} />)
    await user.click(screen.getByRole('button', { name: /Nachricht senden/ }))
    expect(screen.getAllByText('Bitte ausfüllen.')).toHaveLength(2)
    expect(screen.getByText('Bitte bestätigen.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits to the form builder endpoint and shows the confirmation', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(
      <ContactForm
        formId="f1"
        fields={fields}
        submitLabel="Absenden"
        confirmation={<p>Danke!</p>}
      />,
    )
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /Absenden/ }))

    expect(await screen.findByText('Danke!')).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/form-submissions')
    expect(JSON.parse(init.body)).toEqual({
      form: 'f1',
      submissionData: [
        { field: 'name', value: 'Anna' },
        { field: 'email', value: 'anna@example.com' },
        { field: 'message', value: 'Hallo' },
        { field: 'privacy', value: 'true' },
      ],
    })
  })

  it('shows an error when sending fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })
    const user = userEvent.setup()
    render(<ContactForm formId="f1" fields={fields} />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /Nachricht senden/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('schiefgelaufen')
    expect(screen.getByRole('button', { name: /Nachricht senden/ })).toBeEnabled()
  })
})
