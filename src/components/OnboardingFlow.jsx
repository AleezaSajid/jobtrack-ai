import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function OnboardingFlow({open, onComplete}){
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="onboarding-overlay"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
        >
          <motion.section
            className="onboarding-modal"
            initial={{opacity: 0, y: 28, scale: 0.96}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 18, scale: 0.98}}
            transition={{type: 'spring', stiffness: 360, damping: 30}}
            aria-labelledby="onboarding-title"
            role="dialog"
            aria-modal="true"
          >
            <span className="eyebrow">Welcome to JobTrack AI</span>
            <h2 id="onboarding-title">Set up your living career workspace.</h2>
            <div className="onboarding-steps">
              <div><strong>1</strong><span>Add your first application</span></div>
              <div><strong>2</strong><span>Upload a resume for ATS scoring</span></div>
              <div><strong>3</strong><span>Ask AI for your next best action</span></div>
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/add-application" onClick={onComplete}>Start tracking</Link>
              <button className="btn btn-subtle" type="button" onClick={onComplete}>Explore dashboard</button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
