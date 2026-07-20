import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../services/authService'

const AUTH_STORAGE_KEY = 'jobtrack_auth_user_v1'
const TOKEN_KEY = 'token'

const normalizeUser = (user, extras = {}) => {
  if (!user) return null

  return {
    id: user.id ?? user._id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    ...(user.remember !== undefined ? { remember: Boolean(user.remember) } : {}),
    ...extras,
  }
}

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

const persistUser = (nextUser) => {
  if (!nextUser) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  const applySession = useCallback((nextUser, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }

    const normalized = normalizeUser(nextUser)
    setUser(normalized)
    persistUser(normalized)
    return normalized
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearAuthStorage()
  }, [])

  useEffect(() => {
    let cancelled = false

    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY)

      if (!token) {
        clearAuthStorage()
        if (!cancelled) {
          setUser(null)
          setAuthLoading(false)
        }
        return
      }

      try {
        const data = await getCurrentUser()

        if (cancelled) return

        if (!data?.user) {
          clearAuthStorage()
          setUser(null)
        } else {
          const normalized = normalizeUser(data.user)
          setUser(normalized)
          persistUser(normalized)
        }
      } catch (error) {
        console.warn('Failed to restore auth session', error)
        if (!cancelled) {
          clearAuthStorage()
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ email, password, remember }) => {
    const data = await loginRequest({
      email: String(email || '').trim(),
      password,
    })

    if (!data?.token || !data?.user) {
      throw new Error(data?.message || 'Login failed. Please try again.')
    }

    return applySession(
      {
        ...data.user,
        remember: Boolean(remember),
      },
      data.token
    )
  }, [applySession])

  const signup = useCallback(async ({ fullName, email, password }) => {
    await registerRequest({
      name: String(fullName || '').trim(),
      email: String(email || '').trim(),
      password,
    })

    // Backend register does not return a JWT — sign in immediately after account creation.
    const data = await loginRequest({
      email: String(email || '').trim(),
      password,
    })

    if (!data?.token || !data?.user) {
      throw new Error(data?.message || 'Account created. Please sign in.')
    }

    return applySession(data.user, data.token)
  }, [applySession])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    signup,
    logout,
  }), [authLoading, login, logout, signup, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
