import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useApplications } from '../hooks/useApplications.jsx'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'

const initialApplicationForm = {company:'',role:'',location:'',type:'Internship',status:'Applied',applied:'',notes:''}

export default function AddApplication(){
  const { addApplication } = useApplications()
  const { showToast } = useToast()
  const [form, setForm] = useState(initialApplicationForm)
  const [error, setError] = useState('')
  const companyInputRef = useRef(null)
  const formShellRef = useRef(null)

  const onChange = (e) => setForm(f=>({...f,[e.target.name]: e.target.value}))

  const navigate = useNavigate()

  const startNewOpportunity = () => {
    setForm(initialApplicationForm)
    setError('')
    formShellRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    window.requestAnimationFrame(() => {
      companyInputRef.current?.focus()
    })
    showToast('Ready for a new application.', 'success')
  }

  const onSubmit = async (e) =>{
    e.preventDefault()
    if(!form.company.trim() || !form.role.trim()){
      setError('Company and role are required before this can be added.')
      showToast('Company and role are required.', 'error')
      return
    }
    try{
      await addApplication(form)
      showToast(`${form.company} added to your live pipeline.`, 'success')
      setForm(initialApplicationForm)
      navigate('/applications')
    }catch(error){
      console.error('Failed to add application', error)
      setError('Application could not be saved. Please try again.')
      showToast('Application could not be saved. Please try again.', 'error')
    }
  }

  return (
    <motion.div className="page add-application-page" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
      <div className="page-title">
        <div>
          <button className="page-badge" type="button" onClick={startNewOpportunity}>+ New Opportunity</button>
          <h1>Add Application</h1>
          <p className="lead">Track a new opportunity in your job pipeline.</p>
        </div>
      </div>
      <motion.div ref={formShellRef} className="card panel form-shell application-intake-shell" whileHover={{y: -2}}>
        <form className="form-grid" onSubmit={onSubmit}>
          {error ? <div className="state-banner error-state">{error}</div> : null}

          <section className="form-section">
            <div className="form-section-heading">
              <h2>Opportunity Details</h2>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="company">Company</label>
                <input ref={companyInputRef} id="company" className="input" name="company" value={form.company} onChange={(event) => { setError(''); onChange(event) }} placeholder="Acme Inc" required />
              </div>
              <div className="field">
                <label htmlFor="role">Role</label>
                <input id="role" className="input" name="role" value={form.role} onChange={(event) => { setError(''); onChange(event) }} placeholder="Software Engineering Intern" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" className="input" name="location" value={form.location} onChange={onChange} placeholder="Remote / City, State" />
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <h2>Application Status</h2>
            </div>
            <div className="form-row three-column">
              <div className="field">
                <label htmlFor="type">Job Type</label>
                <select id="type" className="input" name="type" value={form.type} onChange={onChange}>
                  <option>Internship</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" className="input" name="status" value={form.status} onChange={onChange}>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="applied">Applied Date</label>
                <input id="applied" className="input" name="applied" type="date" value={form.applied} onChange={onChange} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <h2>Notes</h2>
            </div>
            <div className="field">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" className="input" name="notes" value={form.notes} onChange={onChange} rows={3} placeholder="Optional notes about the role, contact, or next steps" />
              <p className="field-helper">Examples: recruiter contact, interview date, referral details, follow-up reminders.</p>
            </div>
          </section>

          <div className="form-actions">
            <motion.button className="btn btn-subtle" type="button" onClick={() => navigate('/applications')} whileTap={{scale: 0.97}}>Cancel</motion.button>
            <motion.button className="btn btn-primary" type="submit" disabled={!form.company.trim() || !form.role.trim()} whileTap={{scale: 0.97}}>Save Application</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
