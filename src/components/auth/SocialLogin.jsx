export default function SocialLogin({label = 'Continue with Google', disabled = false}){
  return (
    <button className="auth-social-button" type="button" disabled={disabled} aria-label={label}>
      <span aria-hidden="true">G</span>
      {label}
    </button>
  )
}
