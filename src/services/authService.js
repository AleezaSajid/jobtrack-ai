import api from './api'

const toAuthError = (error) => {
  const data = error?.response?.data
  const message =
    data?.message ||
    error?.message ||
    'Server Error'

  const authError = new Error(message)
  authError.success = false
  authError.data = data || { success: false, message }
  authError.status = error?.response?.status
  return authError
}

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    throw toAuthError(error)
  }
}

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    throw toAuthError(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    throw toAuthError(error)
  }
}
