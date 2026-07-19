import { motion } from 'framer-motion'
import { Bot, BriefcaseBusiness, CalendarDays, FileText, Sparkles } from 'lucide-react'
import BrandLogo from '../BrandLogo'

const highlights = [
  {Icon: BriefcaseBusiness, label: 'Track Applications', text: 'Monitor every application and stay organized.'},
  {Icon: FileText, label: 'Organize Resumes', text: 'Manage multiple resumes for different roles.'},
  {Icon: Sparkles, label: 'AI Resume Review', text: 'Get AI-powered feedback and improve your resume.'},
  {Icon: CalendarDays, label: 'Interview Preparation', text: 'Prepare better with AI insights and guidance.'},
]

export default function AuthLayout({children, eyebrow = 'Career pipeline intelligence'}){
  return (
    <main className="auth-shell">
      <motion.section className="auth-brand-panel" initial={{opacity: 0, x: -18}} animate={{opacity: 1, x: 0}}>
        <div className="auth-light auth-light-one" aria-hidden="true" />
        <div className="auth-light auth-light-two" aria-hidden="true" />
        <BrandLogo variant="auth" className="auth-brand-lockup" />
        <div className="auth-brand-copy">
          <span><Bot size={13} /> {eyebrow}</span>
          <p className="auth-brand-kicker">AI-powered Career Management</p>
          <h1>Smart job tracking for focused career momentum.</h1>
          <p>Organize applications, optimize your resume, prepare for interviews, and accelerate your career with AI.</p>
        </div>
        <div className="auth-highlight-list">
          {highlights.map((item) => (
            <div key={item.label}>
              <span aria-hidden="true"><item.Icon size={17} /></span>
              <p><strong>{item.label}</strong>{item.text}</p>
            </div>
          ))}
        </div>
      </motion.section>
      <section className="auth-form-panel">
        {children}
      </section>
    </main>
  )
}
