export default function AuthInput({id, label, error, hint, icon: Icon, ...props}){
  return (
    <label className={`auth-field ${error ? 'has-error' : ''}`} htmlFor={id}>
      <span>{label}</span>
      <div className="auth-input-wrap">
        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
        <input id={id} className="auth-input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />
      </div>
      {hint && !error ? <small id={`${id}-hint`}>{hint}</small> : null}
      {error ? <small id={`${id}-error`} className="auth-error">{error}</small> : null}
    </label>
  )
}
