const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if(!response.ok){
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if(response.status === 204){
    return null
  }

  return response.json()
}

const unwrapApplications = (data) => {
  if(Array.isArray(data)) return data
  if(Array.isArray(data?.applications)) return data.applications
  if(Array.isArray(data?.data)) return data.data
  return []
}

const unwrapApplication = (data) => data?.application || data?.data || data

export const applicationsApi = {
  async getApplications(){
    return unwrapApplications(await request('/applications'))
  },

  async createApplication(application){
    return unwrapApplication(await request('/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    }))
  },

  async updateApplication(id, application){
    return unwrapApplication(await request(`/applications/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(application),
    }))
  },

  async deleteApplication(id){
    return request(`/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}
