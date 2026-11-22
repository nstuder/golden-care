import { render, screen } from '@testing-library/react'

import { FormField } from './FormField'

describe('FormField', () => {
  it('connects label and input', () => {
    render(<FormField name="name" label="Name" required />)
    const input = screen.getByLabelText(/Name/)
    expect(input).toHaveAttribute('name', 'name')
    expect(input).toBeRequired()
  })

  it('renders textarea, select and checkbox', () => {
    render(
      <>
        <FormField name="msg" label="Nachricht" type="textarea" />
        <FormField
          name="svc"
          label="Leistung"
          type="select"
          options={[{ label: 'Baden', value: 'bath' }]}
        />
        <FormField name="ok" label="Einverstanden" type="checkbox" />
      </>,
    )
    expect(screen.getByLabelText('Nachricht').tagName).toBe('TEXTAREA')
    expect(screen.getByRole('combobox', { name: 'Leistung' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Baden' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Einverstanden' })).toBeInTheDocument()
  })

  it('shows and links errors', () => {
    render(<FormField name="email" label="E-Mail" type="email" error="Ungültig" />)
    const input = screen.getByLabelText('E-Mail')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Ungültig')
  })

  it('uses half width for narrow fields', () => {
    const { container } = render(<FormField name="a" label="A" width={50} />)
    expect(container.firstChild).toHaveClass('sm:col-span-1')
  })
})
