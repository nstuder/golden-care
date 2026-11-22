import { buildThemeCss, isHexColor, resolveTheme, themeDefaults } from './theme'

describe('isHexColor', () => {
  it.each(['#fff', '#C9A54C', '#2a1638'])('accepts %s', (value) =>
    expect(isHexColor(value)).toBe(true),
  )
  it.each(['fff', '#ggg', '#12345', 'red', null, 42])('rejects %s', (value) =>
    expect(isHexColor(value)).toBe(false),
  )
})

describe('resolveTheme', () => {
  it('returns the defaults without input', () => {
    expect(resolveTheme()).toEqual(themeDefaults)
  })

  it('keeps valid values and replaces invalid ones', () => {
    const theme = resolveTheme({
      primary: '#ABCDEF',
      secondary: 'purple',
      headingFont: 'playfair',
      radius: 'huge',
    })
    expect(theme.primary).toBe('#abcdef')
    expect(theme.secondary).toBe(themeDefaults.secondary)
    expect(theme.headingFont).toBe('playfair')
    expect(theme.radius).toBe(themeDefaults.radius)
  })
})

describe('buildThemeCss', () => {
  it('writes all custom properties to :root', () => {
    const css = buildThemeCss({ primary: '#112233', headingFont: 'cormorant', radius: 'none' })
    expect(css.startsWith(':root{')).toBe(true)
    expect(css).toContain('--theme-primary:#112233')
    expect(css).toContain('--theme-secondary:#2a1638')
    expect(css).toContain('--theme-font-heading:var(--font-cormorant)')
    expect(css).toContain('--theme-radius:0rem')
  })

  it('cannot be used to inject CSS', () => {
    const css = buildThemeCss({ primary: 'red;}body{display:none' })
    expect(css).not.toContain('display:none')
  })
})
