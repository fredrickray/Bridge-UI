import { useSyncExternalStore } from 'react'

const AUTH_KEY = 'bridge.auth'
const PENDING_KEY = 'bridge.pending-verification'
const RESET_KEY = 'bridge.reset-email'

export type NotificationPrefs = {
  emailAgreements: boolean
  emailMilestones: boolean
  emailFunding: boolean
  inAppAgreements: boolean
  inAppMilestones: boolean
  inAppFunding: boolean
}

export type AuthUser = {
  id: string
  fullName: string
  email: string
  phone: string
  company: string
  timezone: string
  verified: boolean
  notifications: NotificationPrefs
}

type AuthState = {
  user: AuthUser | null
  token: string | null
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailAgreements: true,
  emailMilestones: true,
  emailFunding: true,
  inAppAgreements: true,
  inAppMilestones: true,
  inAppFunding: true,
}

const listeners = new Set<() => void>()

const EMPTY_AUTH_STATE: AuthState = Object.freeze({
  user: null,
  token: null,
})

let cachedAuthState: AuthState = EMPTY_AUTH_STATE
let cacheHydrated = false

function emitAuthChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
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

function normalizeUser(user: Partial<AuthUser> & Pick<AuthUser, 'id' | 'email'>): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName ?? '',
    email: user.email,
    phone: user.phone ?? '',
    company: user.company ?? '',
    timezone: user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    verified: user.verified ?? false,
    notifications: {
      ...DEFAULT_NOTIFICATIONS,
      ...user.notifications,
    },
  }
}

function readAuthState(): AuthState {
  const raw = readJson<AuthState>(AUTH_KEY)
  if (!raw?.token) return EMPTY_AUTH_STATE
  return {
    token: raw.token,
    user: raw.user ? normalizeUser(raw.user) : null,
  }
}

function setCachedAuthState(state: AuthState) {
  cachedAuthState = state.token ? state : EMPTY_AUTH_STATE
  cacheHydrated = true
}

function writeAuthState(state: AuthState) {
  writeJson(AUTH_KEY, state)
  setCachedAuthState(state)
  emitAuthChange()
}

/** Stable snapshot for useSyncExternalStore — never allocate a new object unless auth changed. */
export function getAuthState(): AuthState {
  if (!cacheHydrated) {
    setCachedAuthState(readAuthState())
  }
  return cachedAuthState
}

export function useAuthState() {
  return useSyncExternalStore(subscribeAuth, getAuthState, () => EMPTY_AUTH_STATE)
}

export function getPendingVerification(): { email: string; fullName: string } | null {
  return readJson(PENDING_KEY)
}

function createUser(partial: {
  fullName: string
  email: string
  verified?: boolean
}): AuthUser {
  return normalizeUser({
    id: crypto.randomUUID(),
    fullName: partial.fullName,
    email: partial.email,
    verified: partial.verified ?? true,
  })
}

export async function loginWithEmail(email: string, _password: string) {
  await delay()
  const state: AuthState = {
    user: createUser({
      fullName: email.split('@')[0] ?? 'User',
      email,
      verified: true,
    }),
    token: crypto.randomUUID(),
  }
  writeAuthState(state)
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
  const state: AuthState = {
    user: createUser({
      fullName: pending.fullName,
      email: pending.email,
      verified: true,
    }),
    token: crypto.randomUUID(),
  }
  writeAuthState(state)
  localStorage.removeItem(PENDING_KEY)
  return state
}

export async function requestPasswordReset(email: string) {
  await delay()
  writeJson(RESET_KEY, { email })
  return { email }
}

export async function resetPassword(_password: string) {
  await delay()
  localStorage.removeItem(RESET_KEY)
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
  setCachedAuthState(EMPTY_AUTH_STATE)
  emitAuthChange()
}

export async function loginWithGoogle() {
  await delay(500)
  throw new Error('Google sign-in will connect once OAuth credentials are configured.')
}

export async function updateProfile(input: {
  fullName: string
  phone: string
  company: string
  timezone: string
}) {
  await delay(500)
  const current = readAuthState()
  if (!current.user || !current.token) {
    throw new Error('You must be signed in to update your profile.')
  }
  const state: AuthState = {
    token: current.token,
    user: {
      ...current.user,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      company: input.company.trim(),
      timezone: input.timezone,
    },
  }
  writeAuthState(state)
  if (!state.user) {
    throw new Error('Unable to update profile.')
  }
  return state.user
}

export async function updateEmail(email: string) {
  await delay(500)
  const current = readAuthState()
  if (!current.user || !current.token) {
    throw new Error('You must be signed in to update your email.')
  }
  const next = email.trim().toLowerCase()
  if (!next.includes('@')) {
    throw new Error('Enter a valid email address.')
  }
  const state: AuthState = {
    token: current.token,
    user: {
      ...current.user,
      email: next,
      verified: next === current.user.email ? current.user.verified : false,
    },
  }
  writeAuthState(state)
  if (!state.user) {
    throw new Error('Unable to update email.')
  }
  return state.user
}

export async function changePassword(currentPassword: string, nextPassword: string) {
  await delay(600)
  if (currentPassword.length < 8) {
    throw new Error('Current password is incorrect.')
  }
  if (nextPassword.length < 8) {
    throw new Error('New password must be at least 8 characters.')
  }
  return { ok: true as const }
}

export async function updateNotifications(notifications: NotificationPrefs) {
  await delay(400)
  const current = readAuthState()
  if (!current.user || !current.token) {
    throw new Error('You must be signed in to update notifications.')
  }
  const state: AuthState = {
    token: current.token,
    user: {
      ...current.user,
      notifications,
    },
  }
  writeAuthState(state)
  if (!state.user) {
    throw new Error('Unable to update notifications.')
  }
  return state.user
}

export async function deleteAccount() {
  await delay(700)
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(PENDING_KEY)
  setCachedAuthState(EMPTY_AUTH_STATE)
  emitAuthChange()
  return { ok: true as const }
}
