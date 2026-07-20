const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

const parseErrorMessage = async (response) => {
  const fallback = `Request failed with status ${response.status}`
  const text = await response.text().catch(() => '')

  if (text) {
    try {
      const data = JSON.parse(text)
      const error = new Error(data?.message || fallback)
      error.success = false
      error.data = data
      error.status = response.status
      return error
    } catch {
      return new Error(text)
    }
  }

  return new Error(fallback)
}

const request = async (path, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch (error) {
    throw new Error(error?.message || 'Unable to reach the server. Please try again.')
  }

  if (!response.ok) {
    throw await parseErrorMessage(response)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

const unwrapApplications = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.applications)) return data.applications
  if (Array.isArray(data?.data)) return data.data
  return []
}

const unwrapApplication = (data) => data?.application || data?.data || data

const toApiPayload = (application = {}) => ({
  company: application.company,
  position: application.position ?? application.role,
  status: application.status,
  location: application.location,
  salary: application.salary,
  jobType: application.jobType ?? application.type,
  jobUrl: application.jobUrl,
  notes: application.notes,
  appliedDate: application.appliedDate ?? application.applied,
  interviewDate: application.interviewDate,
})

const toUiApplication = (application = {}) => ({
  ...application,
  id: application.id ?? application._id,
  role: application.role ?? application.position,
  type: application.type ?? application.jobType,
  applied: application.applied ?? (application.appliedDate
    ? new Date(application.appliedDate).toISOString().slice(0, 10)
    : ''),
})

export const applicationsApi = {
  async getApplications() {
    const records = unwrapApplications(await request('/applications'))
    return records.map(toUiApplication)
  },

  async createApplication(application) {
    const created = unwrapApplication(
      await request('/applications', {
        method: 'POST',
        body: JSON.stringify(toApiPayload(application)),
      })
    )
    return toUiApplication(created)
  },

  async updateApplication(id, application) {
    const updated = unwrapApplication(
      await request(`/applications/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(toApiPayload(application)),
      })
    )
    return toUiApplication(updated)
  },

  async deleteApplication(id) {
    return request(`/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}
