export const headingFonts = {
  fraunces: { label: 'Fraunces', variable: '--font-fraunces' },
  playfair: { label: 'Playfair Display', variable: '--font-playfair' },
  cormorant: { label: 'Cormorant Garamond', variable: '--font-cormorant' },
} as const

export type HeadingFont = keyof typeof headingFonts

export const radii = {
  none: { label: 'Eckig', value: '0rem' },
  sm: { label: 'Leicht gerundet', value: '0.375rem' },
  lg: { label: 'Gerundet', value: '1rem' },
  full: { label: 'Stark gerundet', value: '2rem' },
} as const

export type Radius = keyof typeof radii

export type Theme = {
  primary: string
  secondary: string
  background: string
  foreground: string
  headingFont: HeadingFont
  radius: Radius
}

/** Gold + dark purple. Mirrored in globals.css so the page also looks right without the CMS. */
export const themeDefaults: Theme = {
  primary: '#c9a54c',
  secondary: '#2a1638',
  background: '#fbf8f3',
  foreground: '#22162b',
  headingFont: 'fraunces',
  radius: 'lg',
}

export type ThemeInput = {
  [K in keyof Theme]?: string | null
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX.test(value.trim())
}

/** Fills missing or invalid values with the defaults. */
export function resolveTheme(input?: ThemeInput | null): Theme {
  const color = (key: 'primary' | 'secondary' | 'background' | 'foreground') => {
    const value = input?.[key]
    return isHexColor(value) ? value.trim().toLowerCase() : themeDefaults[key]
  }
  const font = input?.headingFont
  const radius = input?.radius

  return {
    primary: color('primary'),
    secondary: color('secondary'),
    background: color('background'),
    foreground: color('foreground'),
    headingFont: font && font in headingFonts ? (font as HeadingFont) : themeDefaults.headingFont,
    radius: radius && radius in radii ? (radius as Radius) : themeDefaults.radius,
  }
}

/** CSS custom properties consumed by the Tailwind tokens in globals.css. */
export function buildThemeCss(input?: ThemeInput | null): string {
  const theme = resolveTheme(input)
  const vars = {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-background': theme.background,
    '--theme-foreground': theme.foreground,
    '--theme-font-heading': `var(${headingFonts[theme.headingFont].variable})`,
    '--theme-radius': radii[theme.radius].value,
  }

  return `:root{${Object.entries(vars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}}`
}
