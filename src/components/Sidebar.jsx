import { NavLink } from 'react-router-dom'
import { Check } from 'lucide-react'
import jobtrackLogo from '../assets/jobtrack-logo-full.png'

const links = [
  {to: '/', label: 'Dashboard'},
  {to: '/applications', label: 'Applications'},
  {to: '/add-application', label: 'Add Application'},
  {to: '/resume', label: 'Resume Manager'},
  {to: '/ai', label: 'AI Assistant'},
  {to: '/settings', label: 'Settings'},
]

const ICONS = {
  '/': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21V12h14v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/applications': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/add-application': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/resume': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 17h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/ai': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  '/settings': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 16.88l.06-.06c.5-.5.66-1.22.33-1.82A1.65 1.65 0 0 0 2.6 12V11a2 2 0 1 1 4 0v.09c.05.59.37 1.14.92 1.51.5.33 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 12 7.7v.1c0 .58.21 1.13.6 1.53.5.5 1.22.66 1.82.33.59-.31 1.14-.63 1.51-.92H21a2 2 0 0 1 0 4h-.09c-.59.05-1.14.37-1.51.92-.33.5-.17 1.32.33 1.82l.06.06A2 2 0 0 1 19.4 15z" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function NavLinks({ className = 'nav-links' }){
  return (
    <nav className={className} aria-label="Primary navigation">
      {links.map((link)=> (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({isActive}) => `nav-link ${link.to === '/add-application' ? 'nav-link-primary' : ''} ${isActive ? 'active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{ICONS[link.to]}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-logo-img" src={jobtrackLogo} alt="JobTrack AI Logo" />
      </div>

      <NavLinks />

      <div className="sidebar-footer">
        <strong>Application Readiness</strong>
        <span className="profile-progress-value">85%</span>
        <div className="profile-progress-track" aria-label="Application readiness 85 percent complete">
          <span style={{width: '85%'}} />
        </div>
        <span className="profile-progress-item"><Check size={12} />Resume uploaded</span>
        <span className="profile-progress-item"><Check size={12} />Applications tracked</span>
        <span className="profile-progress-item"><Check size={12} />Interview tracked</span>
        <span className="profile-progress-item pending">AI review pending</span>
        <span className="profile-progress-footer">1 step remaining</span>
      </div>
    </aside>
  )
}
