'use client'

import { TextField, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

import { isHexColor } from '@/lib/theme'

function toSixDigits(raw: string) {
  const value = raw.trim()
  if (value.length === 4) return `#${[...value.slice(1)].map((c) => c + c).join('')}`
  return value
}

/** Text field for hex colours with a colour picker next to it. */
export const ColorField: TextFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const valid = isHexColor(value)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <input
        type="color"
        aria-label="Farbe wählen"
        value={valid ? toSixDigits(value) : '#000000'}
        onChange={(event) => setValue(event.target.value)}
        style={{
          width: 44,
          height: 40,
          marginTop: 26,
          padding: 2,
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          background: 'var(--theme-input-bg)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <TextField {...props} />
      </div>
    </div>
  )
}
