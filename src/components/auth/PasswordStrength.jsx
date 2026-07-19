const getStrength = (password) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  if(!password) return {score: 0, label: 'Add a password', className: ''}
  if(score <= 1) return {score, label: 'Weak password', className: 'weak'}
  if(score <= 3) return {score, label: 'Medium password', className: 'medium'}
  return {score, label: 'Strong password', className: 'strong'}
}

export default function PasswordStrength({password}){
  const strength = getStrength(password)

  return (
    <div className={`password-strength ${strength.className}`} aria-live="polite">
      <div className="password-strength-track" aria-hidden="true">
        {[1, 2, 3, 4].map((item) => <span className={item <= strength.score ? 'active' : ''} key={item} />)}
      </div>
      <small>{strength.label}</small>
    </div>
  )
}

export { getStrength }
