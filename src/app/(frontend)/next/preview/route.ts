import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { isSafePreviewPath } from '@/lib/preview'

/** Entry point for Payload live preview: requires a logged-in editor, then enables draft mode. */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path')
  if (!isSafePreviewPath(path)) {
    return new Response('Ungültiger Pfad', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('Bitte im Admin anmelden, um die Vorschau zu sehen.', { status: 403 })
  }

  draft.enable()
  redirect(path)
}
