import { useMemo, useState } from 'react'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'

const SETTINGS_STORAGE_KEY = 'jobtrack_settings_v1'

const defaultSettings = {
  fullName: 'Aleeza Rashid',
  email: 'aleeza@example.com',
  targetRole: 'Frontend Developer',
  locationPreference: 'Remote / Hybrid',
  followUpReminders: true,
  interviewReminders: true,
  resumeReminders: true,
  reminderTiming: '1 day before',
  defaultStatus: 'Applied',
  defaultJobType: 'Internship',
  sortApplicationsBy: 'Newest',
  showRejected: true,
  aiProvider: 'Ollama',
  modelName: 'qwen2.5:3b',
  responseStyle: 'Balanced',
  useResumeContext: true,
  useApplicationHistory: true,
}

const readSettings = () => {
  try{
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
    return saved ? {...defaultSettings, ...JSON.parse(saved)} : defaultSettings
  }catch(error){
    console.warn('Failed to read settings', error)
    return defaultSettings
  }
}

function Field({label, helper, children}){
  return (
    <label className="settings-field">
      <span>{label}</span>
      {children}
      {helper ? <small>{helper}</small> : null}
    </label>
  )
}

function Toggle({label, checked, onChange, helper}){
  return (
    <label className="settings-toggle">
      <span>
        <strong>{label}</strong>
        {helper ? <small>{helper}</small> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}

function SettingsCard({title, description, children, actions}){
  return (
    <section className="card settings-card">
      <div className="settings-card-heading">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions}
      </div>
      <div className="settings-card-body">
        {children}
      </div>
    </section>
  )
}

export default function Settings(){
  const { applications, resumes, assistantMessages, clearAssistantMessages } = useApplications()
  const { showToast } = useToast()
  const [settings, setSettings] = useState(readSettings)

  const updateSetting = (key, value) => {
    setSettings((current) => ({...current, [key]: value}))
  }

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    showToast('Settings saved.', 'success')
  }

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      applications,
      resumes,
      assistantMessages,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'jobtrack-ai-data.json'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Application data exported.', 'success')
  }

  const clearChat = () => {
    clearAssistantMessages()
    showToast('AI chat history cleared.', 'success')
  }

  const resetDemoData = () => {
    localStorage.removeItem('jobtrack_resumes_v1')
    localStorage.removeItem('jobtrack_activity_v1')
    localStorage.removeItem('jobtrack_assistant_v1')
    showToast('Demo data reset. Refresh to reload defaults.', 'success')
  }

  const initials = useMemo(() => settings.fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JT', [settings.fullName])

  return (
    <div className="page settings-page">
      <div className="page-title settings-hero">
        <div>
          <h1>Settings</h1>
          <p className="lead">Manage your profile, reminders, workspace defaults, AI preferences, and data.</p>
        </div>
        <div className="settings-profile-chip">
          <span className="settings-avatar">{initials}</span>
          <div>
            <strong>{settings.fullName || 'Profile'}</strong>
            <span>{settings.targetRole || 'Target role'}</span>
            <em>{settings.locationPreference || 'Location preference'}</em>
          </div>
          <small>Open to Work</small>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-row">
          <SettingsCard
            title="Profile Settings"
            description="Keep recruiter-facing details consistent across your workspace."
            actions={<button className="btn btn-primary" type="button" onClick={saveSettings}>Save Profile</button>}
          >
            <Field label="Full name">
              <input className="input" value={settings.fullName} onChange={(event) => updateSetting('fullName', event.target.value)} />
            </Field>
            <Field label="Email">
              <input className="input" type="email" value={settings.email} onChange={(event) => updateSetting('email', event.target.value)} />
            </Field>
            <Field label="Target role">
              <input className="input" value={settings.targetRole} onChange={(event) => updateSetting('targetRole', event.target.value)} />
            </Field>
            <Field label="Location preference" helper="Examples: Remote, Hybrid, NYC, Lahore">
              <input className="input" value={settings.locationPreference} onChange={(event) => updateSetting('locationPreference', event.target.value)} />
            </Field>
          </SettingsCard>

          <SettingsCard title="Notification Settings" description="Choose which career tasks should remind you.">
            <Toggle label="Follow-up reminders" checked={settings.followUpReminders} onChange={(value) => updateSetting('followUpReminders', value)} />
            <Toggle label="Interview reminders" checked={settings.interviewReminders} onChange={(value) => updateSetting('interviewReminders', value)} />
            <Toggle label="Resume update reminders" checked={settings.resumeReminders} onChange={(value) => updateSetting('resumeReminders', value)} />
            <Field label="Reminder timing">
              <select value={settings.reminderTiming} onChange={(event) => updateSetting('reminderTiming', event.target.value)}>
                <option>Same day</option>
                <option>1 day before</option>
                <option>3 days before</option>
              </select>
            </Field>
          </SettingsCard>
        </div>

        <div className="settings-row">
          <SettingsCard title="Workspace Preferences" description="Control how new opportunities and lists behave.">
            <Field label="Default application status">
              <select value={settings.defaultStatus} onChange={(event) => updateSetting('defaultStatus', event.target.value)}>
                <option>Wishlist</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </Field>
            <Field label="Default job type">
              <select value={settings.defaultJobType} onChange={(event) => updateSetting('defaultJobType', event.target.value)}>
                <option>Internship</option>
                <option>Junior</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </Field>
            <Field label="Sort applications by">
              <select value={settings.sortApplicationsBy} onChange={(event) => updateSetting('sortApplicationsBy', event.target.value)}>
                <option>Newest</option>
                <option>Oldest</option>
                <option>Status</option>
                <option>Company</option>
              </select>
            </Field>
            <Toggle
              label="Show rejected applications"
              checked={settings.showRejected}
              onChange={(value) => updateSetting('showRejected', value)}
              helper="Keep closed opportunities visible in lists."
            />
          </SettingsCard>

          <SettingsCard title="AI Assistant Settings" description="Configure local Ollama behavior and workspace context.">
            <div className="ai-integration-status">
              <span className="status-dot" aria-hidden="true" />
              <div>
                <strong>Ollama Connected</strong>
                <p>Current model: {settings.modelName || 'qwen2.5:3b'}</p>
                <p>Provider: Local AI</p>
              </div>
            </div>
            <Field label="AI provider">
              <input className="input" value={settings.aiProvider} readOnly />
            </Field>
            <Field label="Model name" helper="Used by the local Ollama service.">
              <input className="input" value={settings.modelName} onChange={(event) => updateSetting('modelName', event.target.value)} />
            </Field>
            <Field label="Response style">
              <select value={settings.responseStyle} onChange={(event) => updateSetting('responseStyle', event.target.value)}>
                <option>Short</option>
                <option>Balanced</option>
                <option>Detailed</option>
              </select>
            </Field>
            <Toggle label="Use resume context" checked={settings.useResumeContext} onChange={(value) => updateSetting('useResumeContext', value)} />
            <Toggle label="Use application history" checked={settings.useApplicationHistory} onChange={(value) => updateSetting('useApplicationHistory', value)} />
          </SettingsCard>
        </div>

        <SettingsCard title="Data Management" description="Export, clear, or reset local demo data.">
          <div className="settings-actions-grid">
            <button className="btn btn-subtle" type="button" onClick={exportData}>Export application data</button>
            <button className="btn btn-subtle" type="button" onClick={clearChat}>Clear AI chat history</button>
            <button className="btn btn-danger" type="button" onClick={resetDemoData}>Reset demo data</button>
          </div>
        </SettingsCard>
      </div>

      <div className="settings-save-bar">
        <span>Changes are saved locally.</span>
        <button className="btn btn-primary" type="button" onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  )
}
