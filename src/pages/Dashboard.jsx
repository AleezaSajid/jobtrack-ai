import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, CircleX, Target, TrendingUp } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'

const columns = [
  {key:'Wishlist', title:'Wishlist', description:'Jobs saved but not applied'},
  {key:'Applied', title:'Applied', description:'Applications already submitted'},
  {key:'Interview', title:'Interview', description:'Needs preparation'},
  {key:'Offer', title:'Offer', description:'Successful applications'},
  {key:'Rejected', title:'Rejected', description:'Closed opportunities'},
]

const metricConfig = [
  {label:'Applications Sent', helper:'Across all stages', icon: TrendingUp},
  {label:'Interviews Scheduled', helper:'Needs preparation', icon: Target},
  {label:'Offers Received', helper:'Successful outcomes', icon: BadgeCheck},
  {label:'Rejections', helper:'Closed opportunities', icon: CircleX},
]

const prepChecklist = [
  'Review React fundamentals',
  'Practice JavaScript questions',
  'Research company basics',
]

const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No date'

export function getGreeting(date = new Date()){
  const hour = date.getHours()

  if(hour >= 5 && hour < 12){
    return {
      title: 'Good Morning, Aleeza ☀️',
      subtitle: 'Ready to make progress today?',
    }
  }

  if(hour >= 12 && hour < 17){
    return {
      title: 'Good Afternoon, Aleeza 🌤️',
      subtitle: "Let's keep the momentum going.",
    }
  }

  if(hour >= 17 && hour < 21){
    return {
      title: 'Good Evening, Aleeza 🌙',
      subtitle: 'Time to review opportunities.',
    }
  }

  return {
    title: 'Good Night, Aleeza 🌙',
    subtitle: "Plan tomorrow's success today.",
  }
}

function urgencyLabel(date){
  if(!date) return 'Preparation needed'
  const interviewDate = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.ceil((interviewDate - today) / 86400000)
  if(days > 1) return `${days} days remaining`
  if(days === 1) return 'Tomorrow'
  if(days === 0) return 'Today'
  return 'Preparation overdue'
}

function urgencyStatus(date){
  if(!date) return 'future'
  const interviewDate = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.ceil((interviewDate - today) / 86400000)
  if(days < 0) return 'overdue'
  if(days <= 7) return 'soon'
  return 'future'
}

function AppCard({app}){
  const status = app.status || 'Applied'
  const statusClass = `status-${status}`
  const initial = String(app.company || '?').trim().charAt(0).toUpperCase()

  return (
    <div className={`card app-card dashboard-app-card ${statusClass}`}>
      <div className="dashboard-card-company">
        <span className="company-avatar" aria-hidden="true">{initial}</span>
        <span>{app.company}</span>
      </div>
      <h4 className="role">{app.role}</h4>
      <div className="dashboard-card-meta">
        <span>{app.location || 'Location not set'} - {formatDate(app.applied)}</span>
      </div>
      <span className={`dashboard-status-badge status-${status}`}>{status}</span>
      <Link className="card-hover-action" to="/applications">View Details</Link>
    </div>
  )
}

function activityCopy(app){
  if((app.status || 'Applied') === 'Offer') return {title: 'Offer received', company: app.company, label:'NEW'}
  if(app.status === 'Interview') return {title: 'Interview scheduled', company: app.company, label:'Needs prep'}
  if(app.status === 'Rejected') return {title: 'Application closed', company: app.company, label:'Closed'}
  if(app.status === 'Wishlist') return {title: 'Saved to wishlist', company: app.company, label:'Saved'}
  return {title: 'Application submitted', company: app.company, label:'Active'}
}

export default function Dashboard(){
  const { applications, applicationsLoading, applicationsError, updateApplication } = useApplications()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 220)
    return () => window.clearTimeout(timer)
  }, [])

  const byColumn = (key) => applications.filter((app) => (app.status || 'Applied') === key)
  const interviews = byColumn('Interview')
  const offers = byColumn('Offer').length
  const rejections = byColumn('Rejected').length
  const applicationsSent = applications.filter((app) => ['Applied', 'Interview', 'Offer', 'Rejected'].includes(app.status || 'Applied')).length
  const activeApplications = applications.filter((app) => ['Applied', 'Interview'].includes(app.status || 'Applied')).length
  const nextInterview = useMemo(() => interviews
    .slice()
    .sort((a, b) => new Date(a.applied || 0) - new Date(b.applied || 0))[0], [interviews])
  const recentActivity = applications
    .slice()
    .sort((a, b) => new Date(b.applied || 0) - new Date(a.applied || 0))
    .slice(0, 5)
  const priorityLine = nextInterview
    ? `Next priority: ${nextInterview.company} interview on ${formatDate(nextInterview.applied)}`
    : 'Next priority: add your next application'
  const greeting = getGreeting()

  const onDrop = async (event, key) =>{
    const id = event.dataTransfer.getData('text/plain')
    const app = applications.find((item) => String(item.id) === String(id))
    try{
      await updateApplication(id, { status: key })
      if(app && app.status !== key){
        showToast(`${app.company} moved to ${key}.`, 'success')
      }
    }catch(error){
      console.error('Failed to move application', error)
      showToast(error?.message || 'Application status could not be updated. Please try again.', 'error')
    }
  }

  const onDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', String(id))
  }

  const moveWithKeyboard = async (event, app) => {
    const index = columns.findIndex((col) => col.key === (app.status || 'Applied'))
    if(event.key === 'ArrowRight' && index < columns.length - 1){
      try{
        await updateApplication(app.id, { status: columns[index + 1].key })
        showToast(`${app.company} moved to ${columns[index + 1].key}.`, 'success')
      }catch(error){
        console.error('Failed to move application', error)
        showToast(error?.message || 'Application status could not be updated. Please try again.', 'error')
      }
    }
    if(event.key === 'ArrowLeft' && index > 0){
      try{
        await updateApplication(app.id, { status: columns[index - 1].key })
        showToast(`${app.company} moved to ${columns[index - 1].key}.`, 'success')
      }catch(error){
        console.error('Failed to move application', error)
        showToast(error?.message || 'Application status could not be updated. Please try again.', 'error')
      }
    }
  }

  if(loading || applicationsLoading){
    return (
      <div className="page dashboard-page">
        <div className="skeleton dashboard-overview-skeleton" />
        <div className="dashboard-stats">
          {[1, 2, 3, 4].map((item) => <div className="skeleton stat-skeleton" key={item} />)}
        </div>
        <div className="skeleton dashboard-pipeline-skeleton" />
      </div>
    )
  }

  return (
    <motion.div className="page dashboard-page" initial={{opacity: 0}} animate={{opacity: 1}}>
      {applicationsError ? <div className="state-banner error-state">{applicationsError}</div> : null}
      <motion.section className="card dashboard-command-header" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
        <div className="dashboard-command-copy">
          <h1>{greeting.title}</h1>
          <p className="dashboard-greeting-subtitle">{greeting.subtitle}</p>
          <p>{priorityLine}</p>
          <div className="dashboard-command-actions">
            <Link className="btn btn-primary" to="/ai">Prepare Interview</Link>
            <Link className="btn btn-subtle" to="/add-application">Add Application</Link>
          </div>
        </div>
        <div className="dashboard-command-stats" aria-label="Priority overview">
          <div>
            <strong><AnimatedCounter value={interviews.length} /></strong>
            <span>Interviews to prepare</span>
          </div>
          <div>
            <strong><AnimatedCounter value={activeApplications} /></strong>
            <span>Active applications</span>
          </div>
          <div>
            <strong><AnimatedCounter value={offers} /></strong>
            <span>Offers received</span>
          </div>
        </div>
      </motion.section>

      <section className="dashboard-stats dashboard-metrics" aria-label="Application metrics">
        {[applicationsSent, interviews.length, offers, rejections].map((value, index) => (
          <motion.div className="card stat-card elevated-stat" layout whileHover={{y: -3}} key={metricConfig[index].label}>
            <span className="metric-icon" aria-hidden="true">
              {(() => {
                const Icon = metricConfig[index].icon
                return <Icon size={19} strokeWidth={2} />
              })()}
            </span>
            <p className="stat-value"><AnimatedCounter value={value} /></p>
            <div className="stat-label">{metricConfig[index].label}</div>
            <div className="stat-note">{metricConfig[index].helper}</div>
          </motion.div>
        ))}
      </section>

      <section className="pipeline-section dashboard-pipeline">
        <div className="section-header">
          <div>
            <h2>Application pipeline</h2>
            <p>Every application grouped by where it stands right now.</p>
          </div>
        </div>
        <div className="kanban-grid dashboard-kanban-grid">
          {columns.map((col) => (
            <div key={col.key} className={`kanban-column dashboard-kanban-column status-${col.key}`} onDragOver={(event)=>event.preventDefault()} onDrop={(event)=>onDrop(event,col.key)}>
              <div className="kanban-column-header dashboard-column-header">
                <div>
                  <h2>{col.title}</h2>
                  <p>{col.description}</p>
                </div>
                <span className="count-pill">{byColumn(col.key).length}</span>
              </div>
              <motion.div className="kanban-column-list" layout>
                <AnimatePresence>
                  {byColumn(col.key).map((app) => (
                    <motion.div
                      key={app.id}
                      className="draggable-card"
                      layout
                      initial={{opacity: 0, scale: 0.96}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.94}}
                      whileDrag={{scale: 1.03, rotate: 0.4}}
                      draggable
                      role="button"
                      tabIndex={0}
                      aria-label={`${app.role} at ${app.company}. Use arrow keys to move between stages.`}
                      onDragStart={(event)=>onDragStart(event, app.id)}
                      onKeyDown={(event)=>moveWithKeyboard(event, app)}
                    >
                      <AppCard app={app} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {byColumn(col.key).length === 0 ? (
                  <div className="empty-state compact-empty dashboard-empty-stage">
                    <strong>No applications yet</strong>
                    <span>Add a role to get started</span>
                  </div>
                ) : null}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-lower-grid">
        <motion.div className="card next-interview-card" layout whileHover={{y: -3}}>
          {nextInterview ? (
            <div className="next-interview-content">
              <span className="task-eyebrow">Next Interview</span>
              <div>
                <h2>{nextInterview.role}</h2>
                <p>{nextInterview.company}</p>
              </div>
              <span className={`urgency-pill urgency-${urgencyStatus(nextInterview.applied)}`}>{urgencyLabel(nextInterview.applied)}</span>
              <div className="interview-meta-line">{formatDate(nextInterview.applied)} - {nextInterview.location || 'Location TBD'}</div>
              <div className="prep-checklist">
                <span>Preparation checklist</span>
                <ul>
                  {prepChecklist.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <Link className="btn btn-primary" to="/ai">Prepare Now</Link>
            </div>
          ) : (
            <div className="empty-state compact-empty">No interview scheduled yet.</div>
          )}
        </motion.div>

        <motion.div className="card recent-activity-card" layout whileHover={{y: -3}}>
          <div className="card-heading activity-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>The latest changes in your job search.</p>
            </div>
            <Link to="/applications">View All Activity</Link>
          </div>
          <div className="dashboard-timeline">
            {recentActivity.length ? recentActivity.map((app) => {
              const item = activityCopy(app)
              const initial = String(app.company || '?').trim().charAt(0).toUpperCase()
              return (
                <motion.div className="dashboard-timeline-item" key={app.id} layout initial={{opacity: 0, x: -8}} animate={{opacity: 1, x: 0}}>
                  <span className={`activity-icon status-${app.status || 'Applied'}`} aria-hidden="true">{initial}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.company}</span>
                  </div>
                  <span className={`activity-label status-${app.status || 'Applied'}`}>{item.label}</span>
                  <time>{formatDate(app.applied)}</time>
                </motion.div>
              )
            }) : <div className="empty-state compact-empty">No recent activity yet.</div>}
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
