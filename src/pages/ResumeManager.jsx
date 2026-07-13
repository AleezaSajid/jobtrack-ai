import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'

const today = () => new Date().toISOString().slice(0, 10)
const formatBytes = (bytes) => {
  if(!bytes) return 'Unknown size'
  if(bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
const blockedResumeNamePattern = /(thesis|report|assignment|project documentation)/i

export default function ResumeManager(){
  const { resumes, addResume, deleteResume, applications } = useApplications()
  const { showToast } = useToast()
  const [target, setTarget] = useState('Frontend roles')
  const [notes, setNotes] = useState('')
  const [selectedId, setSelectedId] = useState(resumes[0]?.id ?? null)
  const [activeId, setActiveId] = useState(resumes[0]?.id ?? null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const uploadPanelRef = useRef(null)
  const fileInputRef = useRef(null)
  const selected = resumes.find((resume) => resume.id === selectedId) || resumes[0]
  const activeResume = resumes.find((resume) => resume.id === activeId) || resumes[0]

  const readiness = useMemo(() => {
    const hasFrontend = resumes.some((resume) => /front|react|ui/i.test(`${resume.target} ${resume.name} ${resume.notes}`))
    const hasBackend = resumes.some((resume) => /back|api|database|server/i.test(`${resume.target} ${resume.name} ${resume.notes}`))
    const hasInternship = resumes.some((resume) => /intern/i.test(`${resume.target} ${resume.name} ${resume.notes}`))
    const checks = [
      {label: 'Frontend Ready', ready: hasFrontend},
      {label: 'Backend Ready', ready: hasBackend},
      {label: 'Internship Ready', ready: hasInternship},
      {label: 'Active Resume Status', ready: Boolean(activeResume)},
    ]
    const score = Math.round((checks.filter((item) => item.ready).length / checks.length) * 100)
    return {checks, score}
  }, [activeResume, resumes])

  useEffect(() => () => {
    if(previewUrl){
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onUpload = (event) => {
    const file = event.target.files?.[0]
    if(!file) return
    if(blockedResumeNamePattern.test(file.name)){
      setError('Please upload a resume or CV document.')
      showToast('Please upload a resume or CV document.', 'error')
      event.target.value = ''
      return
    }
    if(!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)){
      setError('Please upload a resume or CV document.')
      showToast('Please upload a resume or CV document.', 'error')
      event.target.value = ''
      return
    }

    const id = Math.max(0, ...resumes.map((resume) => resume.id || 0)) + 1
    const nextPreview = file.type === 'application/pdf' ? URL.createObjectURL(file) : ''
    if(previewUrl){
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(nextPreview)
    const resume = {
      id,
      name: file.name,
      target,
      updated: today(),
      size: formatBytes(file.size),
      notes: notes || 'Uploaded resume version',
      preview: nextPreview ? 'PDF preview available for this session' : 'Preview unavailable for DOC/DOCX files',
    }
    addResume(resume)
    setSelectedId(id)
    setActiveId(id)
    setNotes('')
    setError('')
    showToast(`${file.name} uploaded to your resume library.`, 'success')
    event.target.value = ''
  }

  const setActiveResume = (resume) => {
    setActiveId(resume.id)
    setSelectedId(resume.id)
    showToast(`${resume.name} set as active resume.`, 'success')
  }

  const removeResume = (resume) => {
    const nextResume = resumes.find((item) => item.id !== resume.id)
    deleteResume(resume.id)
    setSelectedId(nextResume?.id ?? null)
    if(activeId === resume.id){
      setActiveId(nextResume?.id ?? null)
    }
    showToast('Resume version removed.', 'success')
  }

  const confirmDeleteResume = () => {
    if(!pendingDelete) return
    removeResume(pendingDelete)
    setPendingDelete(null)
  }

  const focusUploadBox = () => {
    uploadPanelRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    window.setTimeout(() => fileInputRef.current?.focus(), 250)
  }

  return (
    <motion.div className="page product-page resume-page" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
      <div className="page-title resume-hero-title">
        <div>
          <h1>Manage role-ready resume versions.</h1>
          <p className="lead">Upload resumes, label them by target role, and keep the right version ready for every application.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={focusUploadBox}>Upload Resume</button>
      </div>

      <section className="resume-layout">
        <motion.div className="card upload-panel" ref={uploadPanelRef} whileHover={{y: -3}}>
          <div className="card-heading">
            <div>
              <h2>Upload a resume</h2>
              <p>PDF, DOC, and DOCX metadata is stored locally in this project demo.</p>
            </div>
          </div>
          <div className="upload-dropzone">
            <input ref={fileInputRef} id="resume-file" type="file" accept=".pdf,.doc,.docx" onChange={onUpload} />
            <label htmlFor="resume-file">
              <strong>Choose resume file</strong>
              <span>Drop-in style uploader for polished portfolio demos.</span>
            </label>
          </div>
          {error ? <div className="state-banner error-state">{error}</div> : null}
          <div className="form-grid">
            <div className="field">
              <label htmlFor="resume-target">Target role</label>
              <select id="resume-target" className="input" value={target} onChange={(event) => setTarget(event.target.value)}>
                <option>Frontend roles</option>
                <option>Backend roles</option>
                <option>Full-stack roles</option>
                <option>Internship roles</option>
                <option>Product roles</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="resume-notes">Version notes</label>
              <textarea id="resume-notes" className="input" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What is this resume optimized for?" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card resume-insights resume-readiness" whileHover={{y: -3}}>
          <div className="card-heading">
            <div>
              <h2>Resume Readiness</h2>
              <p>Keep role-specific versions ready for every opportunity.</p>
            </div>
          </div>
          <div className="coverage-meter">
            <span style={{width: `${readiness.score}%`}} />
          </div>
          <div className="readiness-list">
            {readiness.checks.map((item) => (
              <div className={item.ready ? 'ready' : ''} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.ready ? 'Ready' : 'Needs version'}</strong>
              </div>
            ))}
          </div>
          <div className="active-resume-summary">
            <span>Active Resume:</span>
            <strong>{activeResume?.name || 'No active resume'}</strong>
            <span>Target:</span>
            <strong>{activeResume?.target || 'Not set'}</strong>
            <span>Applications Using This Resume:</span>
            <strong>{applications.length}</strong>
          </div>
        </motion.div>
      </section>

      <section className="resume-layout">
        <div className="card panel">
          <div className="card-heading">
            <div>
              <h2>Resume library</h2>
              <p>Click a version to inspect its notes.</p>
            </div>
          </div>
          <div className="resume-list">
            <AnimatePresence>
            {resumes.length ? resumes.map((resume) => (
              <motion.button
                className={`resume-row ${selected?.id === resume.id ? 'active' : ''}`}
                type="button"
                key={resume.id}
                layout
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, x: -12}}
                whileTap={{scale: 0.98}}
                onClick={() => setSelectedId(resume.id)}
              >
                <span className="file-icon">CV</span>
                <span>
                  <strong>{resume.name}</strong>
                  <small>{resume.size} - Uploaded {new Date(resume.updated).toLocaleDateString()}</small>
                </span>
                <em className={activeId === resume.id ? 'active-resume-badge' : ''}>{activeId === resume.id ? 'Active' : resume.target}</em>
              </motion.button>
            )) : <div className="empty-state">Upload your first resume to start building your library.</div>}
            </AnimatePresence>
          </div>
          <div className="resume-helper-card">
            <h3>Need another resume version?</h3>
            <p>Create role-specific versions for:</p>
            <ul>
              <li>Frontend roles</li>
              <li>Backend roles</li>
              <li>Full Stack roles</li>
              <li>Internship applications</li>
            </ul>
          </div>
        </div>

        <aside className="card details-panel">
          {selected ? (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
              <h2>{selected.name}</h2>
              <div className="details-company">
                <strong>{selected.target}</strong>
                {activeId === selected.id ? <span className="status-badge">Active Version</span> : null}
              </div>
              <div className={`resume-status-line ${activeId === selected.id ? 'active' : ''}`}>
                <span aria-hidden="true">{activeId === selected.id ? '●' : '○'}</span>
                Resume Status {activeId === selected.id ? 'Active' : 'Inactive'}
              </div>
              <dl className="details-list">
                <dt>Resume name</dt>
                <dd>{selected.name}</dd>
                <dt>Target role</dt>
                <dd>{selected.target}</dd>
                <dt>Upload date</dt>
                <dd>{new Date(selected.updated).toLocaleDateString()}</dd>
                <dt>File size</dt>
                <dd>{selected.size}</dd>
              </dl>
              <div className="notes-block">
                <h3>Notes</h3>
                <div>{selected.notes}</div>
              </div>
              <div className="pdf-preview">
                <h3>PDF preview</h3>
                {previewUrl && selected.preview?.includes('PDF') ? (
                  <object data={previewUrl} type="application/pdf" aria-label="Resume PDF preview">
                    <p>PDF preview is not available in this browser.</p>
                  </object>
                ) : (
                  <div className="empty-state compact-empty">Upload a PDF in this session to preview it here.</div>
                )}
              </div>
              <div className="resume-detail-actions">
                {activeId === selected.id ? (
                  <button className="btn btn-subtle active-resume-button" type="button" disabled>✓ Active Resume</button>
                ) : (
                  <button className="btn btn-primary" type="button" onClick={() => setActiveResume(selected)}>Set Active Resume</button>
                )}
                <button className="btn btn-subtle danger-button" type="button" onClick={() => setPendingDelete(selected)}>Delete Resume</button>
              </div>
            </motion.div>
          ) : (
            <div className="empty-state">Select a resume to view details.</div>
          )}
        </aside>
      </section>

      <AnimatePresence>
        {pendingDelete ? (
          <motion.div className="modal-overlay" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <motion.div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-resume-title" initial={{opacity: 0, y: 14, scale: 0.98}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 10, scale: 0.98}}>
              <h2 id="delete-resume-title">Delete Resume?</h2>
              <p>This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn btn-subtle" type="button" onClick={() => setPendingDelete(null)}>Cancel</button>
                <button className="btn btn-primary danger-confirm" type="button" onClick={confirmDeleteResume}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
