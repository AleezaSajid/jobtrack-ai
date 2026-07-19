import { BriefcaseBusiness } from 'lucide-react'

export default function BrandLogo({variant = 'default', className = ''}){
  return (
    <div className={`brand-lockup brand-lockup-${variant} ${className}`.trim()} aria-label="JobTrack AI Logo">
      <span className="brand-lockup-mark" aria-hidden="true">
        <BriefcaseBusiness size={variant === 'auth' ? 28 : 24} strokeWidth={1.9} />
      </span>
      <span className="brand-lockup-copy">
        <span className="brand-lockup-wordmark">JobTrack <strong>AI</strong></span>
        <small>Track - Manage - Grow - AI-powered.</small>
      </span>
    </div>
  )
}
