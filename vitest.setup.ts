import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// App Router hooks are not available outside Next.js
const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

;(globalThis as { __setPathname?: (pathname: string) => void }).__setPathname = (pathname) => {
  navigation.pathname = pathname
}

afterEach(() => {
  cleanup()
  navigation.pathname = '/'
})
