import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import AuthInput from '../components/auth/AuthInput'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import SocialLogin from '../components/auth/SocialLogin'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function Login(){
  const { isAuthenticated, authLoading, login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({email: '', password: '', remember: true})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const from = location.state?.from?.pathname || '/'

  if(authLoading){
    return (
      <AuthLayout>
        <div className="auth-state" role="status" aria-live="polite">Checking your session...</div>
      </AuthLayout>
    )
  }

  if(isAuthenticated){
    return <Navigate to="/" replace />
  }

  const updateField = (field, value) => {
    setForm((current) => ({...current, [field]: value}))
    setErrors((current) => ({...current, [field]: ''}))
    if(status !== 'idle') setStatus('idle')
  }

  const validate = () => {
    const nextErrors = {}
    if(!form.email.trim()) nextErrors.email = 'Email is required.'
    else if(!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if(!form.password) nextErrors.password = 'Password is required.'
    else if(form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if(!validate()){
      setStatus('error')
      return
    }
    setStatus('loading')
    try{
      await login(form)
      setStatus('success')
      showToast('Welcome back to JobTrack AI.', 'success')
      navigate(from, {replace: true})
    }catch(error){
      console.error('Login failed', error)
      setStatus('error')
      showToast(error?.message || 'Login failed. Please try again.', 'error')
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to manage your applications, resumes, interviews, and AI career workspace."
        footer={<span>New to JobTrack AI? <Link to="/signup">Create an account</Link></span>}
      >
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {status === 'success' ? <div className="auth-state success-state">Login successful. Opening your workspace...</div> : null}
          {status === 'error' && !Object.values(errors).some(Boolean) ? <div className="auth-state error-state">We could not sign you in. Check your details and try again.</div> : null}

          <AuthInput
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="aleeza@example.com"
            icon={Mail}
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
          />
          <PasswordInput
            id="login-password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            error={errors.password}
          />

          <div className="auth-options-row">
            <label className="auth-checkbox">
              <input type="checkbox" checked={form.remember} onChange={(event) => updateField('remember', event.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link to="/login" className="auth-inline-link">Forgot password?</Link>
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Signing in...' : 'Login'}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <div className="auth-divider"><span>or</span></div>
          <SocialLogin disabled={status === 'loading'} />
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
