import type { Config, Payload } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath: (...args: unknown[]) => revalidatePath(...args) }))

const { affectsPublishedSite, revalidatePlugin, revalidateSite } = await import('./revalidate')

const payload = { logger: { info: vi.fn() } } as unknown as Payload

describe('affectsPublishedSite', () => {
  it('ignores drafts and autosaves', () => {
    expect(affectsPublishedSite({ _status: 'draft' }, { _status: 'draft' })).toBe(false)
    expect(affectsPublishedSite({ _status: 'draft' }, null)).toBe(false)
  })

  it('reacts to publishing, unpublishing and collections without drafts', () => {
    expect(affectsPublishedSite({ _status: 'published' }, { _status: 'draft' })).toBe(true)
    expect(affectsPublishedSite({ _status: 'draft' }, { _status: 'published' })).toBe(true)
    expect(affectsPublishedSite({}, {})).toBe(true)
  })
})

describe('revalidateSite', () => {
  beforeEach(() => {
    revalidatePath.mockReset()
  })

  it('revalidates the whole site', () => {
    revalidateSite(payload, 'pages')
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('does not throw outside of Next.js', () => {
    revalidatePath.mockImplementationOnce(() => {
      throw new Error('static generation store missing')
    })
    revalidateSite(payload, 'seed')
    expect(revalidatePath).toHaveBeenCalledOnce()
  })
})

describe('revalidatePlugin', () => {
  it('adds hooks only to website content', () => {
    const config = revalidatePlugin()({
      collections: [
        { slug: 'pages', fields: [] },
        { slug: 'users', fields: [] },
      ],
      globals: [{ slug: 'theme', fields: [] }],
    } as unknown as Config) as Config

    const [pages, users] = config.collections!
    expect(pages.hooks?.afterChange).toHaveLength(1)
    expect(pages.hooks?.afterDelete).toHaveLength(1)
    expect(users.hooks).toBeUndefined()
    expect(config.globals![0].hooks?.afterChange).toHaveLength(1)
  })
})
