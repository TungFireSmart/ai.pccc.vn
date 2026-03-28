import { useEffect, useState } from 'react'
import type { AuthResponse } from './api'

const STORAGE_KEY = 'ai-pccc-auth'

export type AuthState = AuthResponse | null

export function loadAuthState(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthResponse
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveAuthState(value: AuthState) {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearAuthState() {
  saveAuthState(null)
}

export function useAuthState() {
  const [auth, setAuth] = useState<AuthState>(() => loadAuthState())

  useEffect(() => {
    saveAuthState(auth)
  }, [auth])

  useEffect(() => {
    const onStorage = () => setAuth(loadAuthState())
    window.addEventListener('storage', onStorage)
    window.addEventListener('ai-pccc-auth-changed', onStorage as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('ai-pccc-auth-changed', onStorage as EventListener)
    }
  }, [])

  return { auth, setAuth }
}
