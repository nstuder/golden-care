'use client'

import { Button, toast } from '@payloadcms/ui'
import { useState } from 'react'

/** Dashboard helper that fills an empty site with example content (POST /api/seed). */
export function SeedButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  async function run(force: boolean) {
    if (
      force &&
      !window.confirm(
        'Bestehende Seiten, Leistungen und Kundenstimmen werden überschrieben. Fortfahren?',
      )
    ) {
      return
    }
    setState('loading')
    try {
      const response = await fetch(`/api/seed${force ? '?force=true' : ''}`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = (await response.json().catch(() => ({}))) as { message?: string }
      if (!response.ok) throw new Error(body.message || `HTTP ${response.status}`)
      toast.success(body.message || 'Beispielinhalte geladen')
      setState('done')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Laden der Beispielinhalte')
      setState('idle')
    }
  }

  return (
    <div
      style={{
        marginBottom: 'calc(var(--base) * 2)',
        padding: 'var(--base)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m)',
      }}
    >
      <h4 style={{ margin: 0 }}>Willkommen bei Golden Care</h4>
      <p style={{ margin: 'calc(var(--base) / 2) 0' }}>
        Noch leer? Lade Beispielseiten, Leistungen, Kundenstimmen und Platzhalterbilder. Danach
        kannst du alles anpassen – die Seiten haben eine Live-Vorschau.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button
          buttonStyle="primary"
          size="small"
          disabled={state === 'loading'}
          onClick={() => run(false)}
          margin={false}
        >
          {state === 'loading' ? 'Wird geladen …' : 'Beispielinhalte laden'}
        </Button>
        <Button
          buttonStyle="secondary"
          size="small"
          disabled={state === 'loading'}
          onClick={() => run(true)}
          margin={false}
        >
          Neu laden (überschreiben)
        </Button>
        {state === 'done' ? (
          <a href="/" target="_blank" rel="noreferrer" style={{ alignSelf: 'center' }}>
            Website ansehen →
          </a>
        ) : null}
      </div>
    </div>
  )
}
