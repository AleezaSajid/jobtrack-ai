import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const AUTH_STORAGE_KEY = 'jobtrack_auth_user_v1'

const readUser = () => {
  try{
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  }catch(error){
    console.warn('Failed to read auth user', error)
    return null
  }
}

export default function AuthProvider({children}){
  const [user, setUser] = useState(readUser)

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
  }, [])

  const login = useCallback(async ({email, remember}) => {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    const nextUser = {
      name: email.split('@')[0] || 'Aleeza',
      email,
      remember: Boolean(remember),
      authenticatedAt: new Date().toISOString(),
    }
    persistUser(nextUser)
    return nextUser
  }, [persistUser])

  const signup = useCallback(async ({fullName, email}) => {
    await new Promise((resolve) => window.setTimeout(resolve, 750))
    const nextUser = {
      name: fullName,
      email,
      remember: true,
      authenticatedAt: new Date().toISOString(),
    }
    persistUser(nextUser)
    return nextUser
  }, [persistUser])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  }), [login, logout, signup, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
