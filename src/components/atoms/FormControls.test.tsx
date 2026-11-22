import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Input } from './Input'
import { Label } from './Label'
import { Textarea } from './Textarea'

describe('form atoms', () => {
  it('Label marks required fields', () => {
    render(
      <>
        <Label htmlFor="n" required>
          Name
        </Label>
        <Input id="n" />
      </>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
  })

  it('Input and Textarea accept typing', async () => {
    render(
      <>
        <Input aria-label="Name" />
        <Textarea aria-label="Nachricht" />
      </>,
    )
    await userEvent.type(screen.getByLabelText('Name'), 'Anna')
    await userEvent.type(screen.getByLabelText('Nachricht'), 'Hallo')
    expect(screen.getByLabelText('Name')).toHaveValue('Anna')
    expect(screen.getByLabelText('Nachricht')).toHaveValue('Hallo')
    expect(screen.getByLabelText('Nachricht')).toHaveAttribute('rows', '5')
  })
})
