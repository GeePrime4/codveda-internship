import { useCallback, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/authService'
import { setUnauthorizedHandler } from '../services/api'
import { AuthContext } from './authContextValue'

const TOKEN_KEY = 'codveda_student_token'
const USER_KEY = 'codveda_student_user'
function readStoredAuth() {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY)
    const user = JSON.parse(window.localStorage.getItem(USER_KEY) || 'null')
    return token && user ? { token, user } : null
  } catch {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    return null
  }
}

function tokenExpiry(token) {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    setAuth(null)
  }, [])

  const saveAuth = useCallback((token, user) => {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  const signIn = useCallback(async (credentials) => {
    const result = await loginRequest(credentials)
    saveAuth(result.token, result.user)
    return result.user
  }, [saveAuth])

  setUnauthorizedHandler(logout)

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(() => {})
  }, [logout])

  useEffect(() => {
    if (!auth?.token) return undefined
    const expiry = tokenExpiry(auth.token)
    if (!expiry) return undefined
    const timeout = window.setTimeout(logout, Math.max(0, expiry - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [auth, logout])

  const value = useMemo(() => ({
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token && auth?.user),
    signIn,
    logout,
  }), [auth, signIn, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
