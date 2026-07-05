const AUTH_KEY = 'bridge.auth'
const PENDING_KEY = 'bridge.pending-verification'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  verified: boolean
}

type AuthState = {
  user: AuthUser | null
  token: string | null
}

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function delay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getAuthState(): AuthState {
  return readJson<AuthState>(AUTH_KEY) ?? { user: null, token: null }
}

export function getPendingVerification(): { email: string; fullName: string } | null {
  return readJson(PENDING_KEY)
}

export async function loginWithEmail(email: string, _password: string) {
  await delay()
  const user: AuthUser = {
    id: crypto.randomUUID(),
    fullName: email.split('@')[0] ?? 'User',
    email,
    verified: true,
  }
  const state: AuthState = { user, token: crypto.randomUUID() }
  writeJson(AUTH_KEY, state)
  return state
}

export async function signupWithEmail(fullName: string, email: string, _password: string) {
  await delay()
  writeJson(PENDING_KEY, { email, fullName })
  return { email, fullName }
}

export async function verifyEmailCode(code: string) {
  await delay()
  if (code !== '123456' && !/^\d{6}$/.test(code)) {
    throw new Error('Invalid verification code')
  }
  const pending = getPendingVerification()
  if (!pending) {
    throw new Error('No pending verification. Sign up again.')
  }
  const user: AuthUser = {
    id: crypto.randomUUID(),
    fullName: pending.fullName,
    email: pending.email,
    verified: true,
  }
  const state: AuthState = { user, token: crypto.randomUUID() }
  writeJson(AUTH_KEY, state)
  localStorage.removeItem(PENDING_KEY)
  return state
}

export async function requestPasswordReset(email: string) {
  await delay()
  writeJson('bridge.reset-email', { email })
  return { email }
}

export async function resetPassword(_password: string) {
  await delay()
  localStorage.removeItem('bridge.reset-email')
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export async function loginWithGoogle() {
  await delay(500)
  throw new Error('Google sign-in will connect once OAuth credentials are configured.')
}
