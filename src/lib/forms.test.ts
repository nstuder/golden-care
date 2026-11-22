import { toFormFields } from './forms'

describe('toFormFields', () => {
  it('maps form builder fields', () => {
    const fields = toFormFields([
      { blockType: 'text', name: 'name', label: 'Name', required: true, width: 50 },
      { blockType: 'text', name: 'phone', label: 'Telefon' },
      { blockType: 'email', name: 'email', label: 'E-Mail', required: true },
      { blockType: 'textarea', name: 'message', label: null },
      {
        blockType: 'select',
        name: 'service',
        label: 'Leistung',
        options: [{ label: 'Baden', value: 'bath', id: '1' }],
      },
      { blockType: 'checkbox', name: 'privacy', label: 'OK', required: true, defaultValue: true },
      { blockType: 'message', message: null },
    ])

    expect(fields.map((f) => [f.name, f.type])).toEqual([
      ['name', 'text'],
      ['phone', 'tel'],
      ['email', 'email'],
      ['message', 'textarea'],
      ['service', 'select'],
      ['privacy', 'checkbox'],
    ])
    expect(fields[0]).toMatchObject({ required: true, width: 50 })
    expect(fields[3].label).toBe('message')
    expect(fields[4].options).toEqual([{ label: 'Baden', value: 'bath' }])
    expect(fields[5].defaultValue).toBe('true')
  })

  it('handles missing fields', () => {
    expect(toFormFields(null)).toEqual([])
  })
})
