import api from './api'

export const createApplication = async (applicationData) => {
  try {
    const response = await api.post('/applications', applicationData)
    return response.data
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Server Error' }
  }
}

export const getApplications = async () => {
  try {
    const response = await api.get('/applications')
    return response.data
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Server Error' }
  }
}

export const getApplication = async (id) => {
  try {
    const response = await api.get(`/applications/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Server Error' }
  }
}

export const updateApplication = async (id, applicationData) => {
  try {
    const response = await api.put(`/applications/${id}`, applicationData)
    return response.data
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Server Error' }
  }
}

export const deleteApplication = async (id) => {
  try {
    const response = await api.delete(`/applications/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Server Error' }
  }
}
