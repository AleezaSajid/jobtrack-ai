import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'

export default function PasswordInput({id, label, error, hint, ...props}){
  const [visible, setVisible] = useState(false)

  return (
    <label className={`auth-field ${error ? 'has-error' : ''}`} htmlFor={id}>
      <span>{label}</span>
      <div className="auth-password-wrap auth-input-wrap">
        <Lock size={16} aria-hidden="true" />
        <input
          id={id}
          className="auth-input"
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {hint && !error ? <small id={`${id}-hint`}>{hint}</small> : null}
      {error ? <small id={`${id}-error`} className="auth-error">{error}</small> : null}
    </label>
  )
}
