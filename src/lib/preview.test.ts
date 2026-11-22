import { isSafePreviewPath, pagePreviewUrl } from './preview'

describe('preview', () => {
  it('builds preview URLs', () => {
    expect(pagePreviewUrl('home')).toMatch(/\/next\/preview\?path=%2F$/)
    expect(pagePreviewUrl('kontakt')).toMatch(/\/next\/preview\?path=%2Fkontakt$/)
  })

  it('only allows same-site paths', () => {
    expect(isSafePreviewPath('/kontakt')).toBe(true)
    expect(isSafePreviewPath('//evil.com')).toBe(false)
    expect(isSafePreviewPath('/\\evil.com')).toBe(false)
    expect(isSafePreviewPath('https://evil.com')).toBe(false)
    expect(isSafePreviewPath(null)).toBe(false)
  })
})
