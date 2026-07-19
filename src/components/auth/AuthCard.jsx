import { motion } from 'framer-motion'
import { BriefcaseBusiness, ShieldCheck } from 'lucide-react'

export default function AuthCard({title, description, children, footer}){
  return (
    <motion.div
      className="auth-card"
      initial={{opacity: 0, y: 18, scale: 0.98}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{duration: 0.28, ease: 'easeOut'}}
    >
      <div className="auth-card-header">
        <span className="auth-card-icon" aria-label="JobTrack AI Logo">
          <BriefcaseBusiness size={25} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
      {footer ? <div className="auth-card-footer">{footer}</div> : null}
      <div className="auth-secure-note"><ShieldCheck size={14} /> Your data is protected and secure</div>
    </motion.div>
  )
}
