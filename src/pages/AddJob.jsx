import { motion } from 'framer-motion'
import { useToast } from '../hooks/useToast'

export default function AddJob(){
  const { showToast } = useToast()

  return (
    <motion.div className="page" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
      <div className="page-title">
        <div>
          <h1>Add job</h1>
          <p className="lead">Create a role record for sourcing or future tracking.</p>
        </div>
      </div>
      <motion.div className="card panel form-shell" whileHover={{y: -2}}>
        <form className="form-grid">
          <div className="state-banner success-state">Job creation is staged as a UI workflow. Application tracking remains available from Add Application.</div>
          <div className="field">
            <label htmlFor="job-title">Job title</label>
            <input id="job-title" className="input" placeholder="Product Designer" />
          </div>
          <div className="field">
            <label htmlFor="job-company">Company</label>
            <input id="job-company" className="input" placeholder="Company" />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="job-location">Location</label>
              <input id="job-location" className="input" placeholder="Remote / City" />
            </div>
            <div className="field">
              <label htmlFor="job-employment">Employment type</label>
              <select id="job-employment" className="input"><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="job-description">Description</label>
            <textarea id="job-description" className="input" rows={6} placeholder="Description" />
          </div>
          <div className="form-actions">
            <motion.button className="btn btn-primary" type="button" whileTap={{scale: 0.97}} onClick={() => showToast('Job draft created in the demo workspace.', 'success')}>Create</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
