import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Briefcase, CircleX, Eye, FileText, Pencil, Target, Trash2 } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'

const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Not set'

function companyInitial(company){
  return String(company || '?').trim().charAt(0).toUpperCase()
}

function ApplicationCard({app, selected, onSelect, onEdit, onDelete}){
  return (
    <motion.article
      className={`application-grid-card status-${app.status} ${selected ? 'active' : ''}`}
      layout
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      whileHover={{y: -2}}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(event) => {
        if(event.key === 'Enter' || event.key === ' '){
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <div className="application-card-top">
        <span className={`dashboard-status-badge status-${app.status}`}>{app.status}</span>
      </div>

      <div className="application-card-main">
        <h2>{app.role}</h2>
        <div className="application-company">
          <span className="company-avatar" aria-hidden="true">{companyInitial(app.company)}</span>
          <span>{app.company}</span>
        </div>
      </div>

      <div className="application-card-meta">
        <span>{app.location || 'Location not set'}</span>
        <span>Applied {formatDate(app.applied)}</span>
      </div>

      <div className="application-card-actions" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="icon-button" onClick={onSelect} aria-label={`View details for ${app.company}`} title="View">
          <Eye size={16} />
          <span className="sr-only">View</span>
        </button>
        <button type="button" className="icon-button" onClick={onEdit} aria-label={`Edit ${app.company}`} title="Edit">
          <Pencil size={16} />
          <span className="sr-only">Edit</span>
        </button>
        <button type="button" className="icon-button danger-icon" onClick={onDelete} aria-label={`Delete ${app.company}`} title="Delete">
          <Trash2 size={16} />
          <span className="sr-only">Delete</span>
        </button>
      </div>
    </motion.article>
  )
}

export default function Applications(){
  const { applications, updateApplication, deleteApplication } = useApplications()
  const { showToast } = useToast()
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)

  const selected = useMemo(() => applications.find((app) => app.id === selectedId) || null, [applications, selectedId])
  const visibleApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = applications.filter((app) => {
      const matchesQuery = !normalizedQuery ||
        [app.company, app.role, app.location, app.type].some((value) =>
          String(value || '').toLowerCase().includes(normalizedQuery)
        )
      const matchesStatus = !status || app.status === status
      return matchesQuery && matchesStatus
    })

    return filtered.slice().sort((a, b) => {
      if(sortBy === 'company') return String(a.company).localeCompare(String(b.company))
      if(sortBy === 'status') return String(a.status).localeCompare(String(b.status))
      if(sortBy === 'oldest') return new Date(a.applied || 0) - new Date(b.applied || 0)
      return new Date(b.applied || 0) - new Date(a.applied || 0)
    })
  }, [applications, query, status, sortBy])

  const handleDelete = (app) => {
    deleteApplication(app.id)
    if(selectedId === app.id){
      setSelectedId(null)
    }
    if(editingId === app.id){
      setEditingId(null)
      setDraft(null)
    }
    showToast(`${app.company} removed from applications.`, 'success')
  }

  const handleEdit = (app) => {
    setSelectedId(app.id)
    setEditingId(app.id)
    setDraft({...app})
  }

  const handleSelect = (id) => {
    setSelectedId(id)
    setEditingId(null)
    setDraft(null)
  }

  const updateDraft = (field, value) => {
    setDraft((current) => ({...current, [field]: value}))
  }

  const handleSave = (event) => {
    event.preventDefault()
    if(!draft?.company?.trim() || !draft?.role?.trim()){
      showToast('Company and role are required.', 'error')
      return
    }
    updateApplication(draft.id, draft)
    setEditingId(null)
    setDraft(null)
    showToast(`${draft.company} updated.`, 'success')
  }

  return (
    <motion.div className="apps-page applications-redesign" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
      <div className="apps-header applications-hero">
        <div>
          <h1>Applications</h1>
          <p className="lead">Track, organize, and manage every opportunity.</p>
        </div>
      </div>

      <div className="stats-grid applications-summary" aria-label="Application totals">
        <motion.div className="card stat-card elevated-stat" layout whileHover={{y: -3}}>
          <span className="metric-icon"><Briefcase size={18} /></span>
          <div className="stat-label">Total Applications</div>
          <p className="stat-value"><AnimatedCounter value={applications.length} /></p>
          <span className="stat-note">Across all stages</span>
        </motion.div>
        <motion.div className="card stat-card elevated-stat" layout whileHover={{y: -3}}>
          <span className="metric-icon"><Target size={18} /></span>
          <div className="stat-label">Interviews</div>
          <p className="stat-value"><AnimatedCounter value={applications.filter((app) => app.status === 'Interview').length} /></p>
          <span className="stat-note">Need preparation</span>
        </motion.div>
        <motion.div className="card stat-card elevated-stat" layout whileHover={{y: -3}}>
          <span className="metric-icon"><BadgeCheck size={18} /></span>
          <div className="stat-label">Offers</div>
          <p className="stat-value"><AnimatedCounter value={applications.filter((app) => app.status === 'Offer').length} /></p>
          <span className="stat-note">Successful outcomes</span>
        </motion.div>
        <motion.div className="card stat-card elevated-stat" layout whileHover={{y: -3}}>
          <span className="metric-icon"><CircleX size={18} /></span>
          <div className="stat-label">Rejected</div>
          <p className="stat-value"><AnimatedCounter value={applications.filter((app) => app.status === 'Rejected').length} /></p>
          <span className="stat-note">Closed opportunities</span>
        </motion.div>
      </div>

      <div className="apps-toolbar card applications-filter-bar">
        <label className="sr-only" htmlFor="application-search">Search applications</label>
        <input
          id="application-search"
          className="input search-input"
          placeholder="Search applications..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label className="sr-only" htmlFor="status-filter">Filter by status</label>
        <select id="status-filter" className="input status-select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All Statuses</option>
          <option>Wishlist</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <label className="sr-only" htmlFor="sort-by">Sort applications</label>
        <select id="sort-by" className="input status-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="newest">Sort By: Newest</option>
          <option value="oldest">Sort By: Oldest</option>
          <option value="company">Sort By: Company</option>
          <option value="status">Sort By: Status</option>
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="card applications-empty-state">
          <div className="empty-illustration" aria-hidden="true">+</div>
          <h2>No saved jobs yet</h2>
          <p>+ Save a job to start tracking</p>
        </div>
      ) : (
        <div className="applications-card-layout">
          <div className="applications-card-grid">
            <AnimatePresence>
              {visibleApplications.map((app) => (
                <ApplicationCard
                  app={app}
                  key={app.id}
                  selected={app.id === selectedId}
                  onSelect={() => handleSelect(app.id)}
                  onEdit={() => handleEdit(app)}
                  onDelete={() => handleDelete(app)}
                />
              ))}
            </AnimatePresence>
            {visibleApplications.length === 0 ? (
              <motion.div className="card applications-empty-state compact" initial={{opacity: 0, scale: 0.96}} animate={{opacity: 1, scale: 1}}>
                <div className="empty-illustration" aria-hidden="true">?</div>
                <h2>No applications found</h2>
                <p>Try changing your search or status filter.</p>
              </motion.div>
            ) : null}
          </div>

          <motion.aside className="card application-drawer" layout>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{opacity: 0, x: 12}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -12}}>
                  <div className="drawer-company-header">
                    <span className={`company-avatar status-${selected.status}`} aria-hidden="true">{companyInitial(selected.company)}</span>
                    <div>
                      <h2>{selected.company}</h2>
                      <p>{selected.role}</p>
                    </div>
                  </div>
                  {editingId === selected.id && draft ? (
                    <form className="drawer-edit-form" onSubmit={handleSave}>
                      <label>
                        Company
                        <input className="input" value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} />
                      </label>
                      <label>
                        Role
                        <input className="input" value={draft.role} onChange={(event) => updateDraft('role', event.target.value)} />
                      </label>
                      <label>
                        Location
                        <input className="input" value={draft.location} onChange={(event) => updateDraft('location', event.target.value)} />
                      </label>
                      <label>
                        Applied Date
                        <input className="input" type="date" value={draft.applied} onChange={(event) => updateDraft('applied', event.target.value)} />
                      </label>
                      <label>
                        Status
                        <select className="input" value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                          <option>Wishlist</option>
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      </label>
                      <label>
                        Notes
                        <textarea className="input" rows={4} value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} />
                      </label>
                      <div className="drawer-form-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setDraft(null) }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <dl className="details-list drawer-details">
                        <dt>Location</dt>
                        <dd>{selected.location || 'Not set'}</dd>
                        <dt>Applied Date</dt>
                        <dd>{formatDate(selected.applied)}</dd>
                        <dt>Status</dt>
                        <dd><span className={`dashboard-status-badge status-${selected.status}`}>{selected.status}</span></dd>
                        <dt>Resume Attached</dt>
                        <dd>Resume version ready</dd>
                        <dt>Interview Date</dt>
                        <dd>{selected.status === 'Interview' ? formatDate(selected.applied) : 'Not scheduled'}</dd>
                        <dt>Follow-up Date</dt>
                        <dd>{selected.status === 'Applied' ? 'Recommended this week' : 'Not needed'}</dd>
                      </dl>
                      <div className="notes-block">
                        <h3>Notes</h3>
                        <div>{selected.notes || 'No notes added yet.'}</div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div className="drawer-empty-state" initial={{opacity: 0}} animate={{opacity: 1}}>
                  <span className="drawer-empty-icon" aria-hidden="true"><FileText size={24} /></span>
                  <h2>Application Details</h2>
                  <p>Select an application to view:</p>
                  <ul>
                    <li>Interview dates</li>
                    <li>Follow-up reminders</li>
                    <li>Resume version</li>
                    <li>Notes</li>
                    <li>Application history</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </div>
      )}
    </motion.div>
  )
}
