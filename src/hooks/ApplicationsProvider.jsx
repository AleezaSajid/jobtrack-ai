import { useEffect, useState } from 'react'
import { ApplicationsContext } from './applicationsContext'

const STORAGE_KEY = 'jobtrack_apps_v1'
const RESUME_STORAGE_KEY = 'jobtrack_resumes_v1'
const ASSISTANT_STORAGE_KEY = 'jobtrack_assistant_v1'
const ACTIVITY_STORAGE_KEY = 'jobtrack_activity_v1'
const ONBOARDING_STORAGE_KEY = 'jobtrack_onboarding_done_v1'

const seed = [
  {id: 1, company:'OpenWave Labs', role:'SWE Intern', location:'Remote', type:'Internship', status:'Applied', applied:'2026-05-18', notes:'Applied via website'},
  {id: 2, company:'NovaTech', role:'Junior Frontend', location:'NYC', type:'Junior', status:'Interview', applied:'2026-05-25', notes:'Phone screen scheduled'},
  {id: 3, company:'BrightCloud', role:'Backend Intern', location:'Remote', type:'Internship', status:'Rejected', applied:'2026-04-10', notes:'Not a fit'},
  {id: 4, company:'PixelDrive', role:'Software Engineer Intern', location:'SF', type:'Internship', status:'Offer', applied:'2026-06-02', notes:'Accepted offer'},
]

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
  id: Number(app.id) || index + 1,
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
  const [applications, setApplications] = useState(() => readStored(
    STORAGE_KEY,
    seed,
    isArray,
    (items) => items.filter(isObject).map(normalizeApplication)
  ))
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

  useEffect(() => {
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    }catch(error){
      console.warn('Failed to save apps', error)
    }
  }, [applications])

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

  const addApplication = (app) => {
    setApplications((prev) => [{...app, id: app.id || Math.max(0, ...prev.map((item) => item.id || 0)) + 1}, ...prev])
    addActivity({type:'application', title:'Application added', detail:`${app.company} - ${app.role}`})
  }

  const updateApplication = (id, patch) => {
    const existing = applications.find((app) => app.id === id)
    setApplications((prev) => prev.map((app) => app.id === id ? {...app, ...patch} : app))
    if(existing && patch.status && patch.status !== existing.status){
      addActivity({type:'status', title:`Moved to ${patch.status}`, detail:`${existing.company} - ${existing.role}`})
    }
  }

  const deleteApplication = (id) => {
    const deleted = applications.find((app) => app.id === id)
    setApplications((prev) => prev.filter((app) => app.id !== id))
    if(deleted){
      addActivity({type:'application', title:'Application deleted', detail:`${deleted.company} - ${deleted.role}`})
    }
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
    addApplication,
    updateApplication,
    deleteApplication,
    setApplications,
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
