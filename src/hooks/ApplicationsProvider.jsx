import { useCallback, useEffect, useState } from 'react'
import { ApplicationsContext } from './applicationsContext'
import { applicationsApi } from '../services/applicationsApi'

const RESUME_STORAGE_KEY = 'jobtrack_resumes_v1'
const ASSISTANT_STORAGE_KEY = 'jobtrack_assistant_v1'
const ACTIVITY_STORAGE_KEY = 'jobtrack_activity_v1'
const ONBOARDING_STORAGE_KEY = 'jobtrack_onboarding_done_v1'

const resumeSeed = [
  {id: 1, name:'Software Engineering Resume.pdf', target:'Frontend roles', updated:'2026-06-12', size:'248 KB', notes:'React, internship, and product project version'},
  {id: 2, name:'Backend Internship Resume.pdf', target:'Backend roles', updated:'2026-06-05', size:'231 KB', notes:'API, database, and systems-focused version'},
]

const assistantSeed = [
  {id: 1, role:'assistant', text:'Hi, I am your AI Career Copilot. I can help with interview prep, recruiter follow-ups, resume improvements, cover letters, and application priorities.'},
]

const activitySeed = [
  {id: 1, type:'success', title:'Offer logged', detail:'PixelDrive moved to Offer', time:'2026-06-02'},
  {id: 2, type:'interview', title:'Interview stage', detail:'NovaTech is ready for prep', time:'2026-05-25'},
  {id: 3, type:'application', title:'Application added', detail:'OpenWave Labs added to pipeline', time:'2026-05-18'},
]

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const isArray = (value) => Array.isArray(value)
const isBoolean = (value) => typeof value === 'boolean'

const normalizeApplication = (app, index) => ({
  id: app.id ?? app._id ?? index + 1,
  company: String(app.company || 'Untitled company'),
  role: String(app.role || 'Untitled role'),
  location: String(app.location || ''),
  type: String(app.type || 'Internship'),
  status: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'].includes(app.status) ? app.status : 'Applied',
  applied: String(app.applied || ''),
  notes: String(app.notes || ''),
})

const normalizeResume = (resume, index) => ({
  id: Number(resume.id) || index + 1,
  name: String(resume.name || 'Untitled resume'),
  target: String(resume.target || 'General roles'),
  updated: String(resume.updated || new Date().toISOString().slice(0, 10)),
  size: String(resume.size || 'Unknown size'),
  notes: String(resume.notes || ''),
  preview: String(resume.preview || ''),
})

const normalizeMessage = (message, index) => ({
  id: Number(message.id) || index + 1,
  role: message.role === 'user' ? 'user' : 'assistant',
  text: String(message.text || ''),
})

const normalizeActivity = (entry, index) => ({
  id: Number(entry.id) || index + 1,
  type: String(entry.type || 'application'),
  title: String(entry.title || 'Activity update'),
  detail: String(entry.detail || ''),
  time: String(entry.time || new Date().toISOString()),
})

const readStored = (key, fallback, validator = () => true, normalizer = (value) => value) => {
  try{
    const raw = localStorage.getItem(key)
    if(raw){
      const parsed = JSON.parse(raw)
      if(validator(parsed)){
        return normalizer(parsed)
      }
      console.warn(`Ignoring invalid ${key} from storage`)
    }
  }catch(error){
    console.warn(`Failed to parse ${key} from storage`, error)
  }
  return fallback
}

export default function ApplicationsProvider({children}){
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState('')
  const [resumes, setResumes] = useState(() => readStored(
    RESUME_STORAGE_KEY,
    resumeSeed,
    isArray,
    (items) => items.filter(isObject).map(normalizeResume)
  ))
  const [assistantMessages, setAssistantMessages] = useState(() => readStored(
    ASSISTANT_STORAGE_KEY,
    assistantSeed,
    isArray,
    (items) => items.filter(isObject).map(normalizeMessage)
  ))
  const [activity, setActivity] = useState(() => readStored(
    ACTIVITY_STORAGE_KEY,
    activitySeed,
    isArray,
    (items) => items.filter(isObject).map(normalizeActivity)
  ))
  const [onboardingComplete, setOnboardingComplete] = useState(() => readStored(
    ONBOARDING_STORAGE_KEY,
    false,
    isBoolean
  ))

  const loadApplications = useCallback(async () => {
    setApplicationsLoading(true)
    setApplicationsError('')
    try{
      const records = await applicationsApi.getApplications()
      setApplications(records.filter(isObject).map(normalizeApplication))
    }catch(error){
      console.error('Failed to load applications', error)
      setApplicationsError('Unable to load applications from the server.')
      setApplications([])
    }finally{
      setApplicationsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  useEffect(() => {
    try{
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumes))
    }catch(error){
      console.warn('Failed to save resumes', error)
    }
  }, [resumes])

  useEffect(() => {
    try{
      localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(assistantMessages))
    }catch(error){
      console.warn('Failed to save assistant messages', error)
    }
  }, [assistantMessages])

  useEffect(() => {
    try{
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity))
    }catch(error){
      console.warn('Failed to save activity', error)
    }
  }, [activity])

  useEffect(() => {
    try{
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(onboardingComplete))
    }catch(error){
      console.warn('Failed to save onboarding state', error)
    }
  }, [onboardingComplete])

  const addActivity = (entry) => {
    setActivity((prev) => [
      {
        id: Math.max(0, ...prev.map((item) => item.id || 0)) + 1,
        time: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ].slice(0, 25))
  }

  const addApplication = async (app) => {
    const response = await applicationsApi.createApplication(app)
    const created = normalizeApplication(isObject(response) ? response : app, applications.length)
    setApplications((prev) => [created, ...prev])
    addActivity({type:'application', title:'Application added', detail:`${created.company} - ${created.role}`})
    return created
  }

  const updateApplication = async (id, patch) => {
    const existing = applications.find((app) => String(app.id) === String(id))
    const merged = {...existing, ...patch}
    const response = await applicationsApi.updateApplication(id, merged)
    const updated = normalizeApplication(isObject(response) ? response : merged, 0)
    setApplications((prev) => prev.map((app) => String(app.id) === String(id) ? updated : app))
    if(existing && patch.status && patch.status !== existing.status){
      addActivity({type:'status', title:`Moved to ${patch.status}`, detail:`${existing.company} - ${existing.role}`})
    }
    return updated
  }

  const deleteApplication = async (id) => {
    const deleted = applications.find((app) => String(app.id) === String(id))
    await applicationsApi.deleteApplication(id)
    setApplications((prev) => prev.filter((app) => String(app.id) !== String(id)))
    if(deleted){
      addActivity({type:'application', title:'Application deleted', detail:`${deleted.company} - ${deleted.role}`})
    }
    return deleted
  }

  const addResume = (resume) => {
    setResumes((prev) => [{...resume, id: resume.id || Math.max(0, ...prev.map((item) => item.id || 0)) + 1}, ...prev])
    addActivity({type:'resume', title:'Resume uploaded', detail: resume.name})
  }

  const deleteResume = (id) => {
    const deleted = resumes.find((resume) => resume.id === id)
    setResumes((prev) => prev.filter((resume) => resume.id !== id))
    if(deleted){
      addActivity({type:'resume', title:'Resume removed', detail: deleted.name})
    }
  }

  const addAssistantMessage = (message) => {
    setAssistantMessages((prev) => [...prev, {...message, id: message.id || Math.max(0, ...prev.map((item) => item.id || 0)) + 1}])
    if(message.role === 'user'){
      addActivity({type:'ai', title:'AI prompt sent', detail: message.text.slice(0, 80)})
    }
  }

  const clearAssistantMessages = () => {
    setAssistantMessages(assistantSeed)
  }

  const value = {
    applications,
    applicationsLoading,
    applicationsError,
    reloadApplications: loadApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    resumes,
    addResume,
    deleteResume,
    assistantMessages,
    addAssistantMessage,
    clearAssistantMessages,
    activity,
    addActivity,
    onboardingComplete,
    completeOnboarding: () => setOnboardingComplete(true),
  }

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}
