import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, User } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import AuthInput from '../components/auth/AuthInput'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrength, { getStrength } from '../components/auth/PasswordStrength'
import SocialLogin from '../components/auth/SocialLogin'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function Signup(){
  const { isAuthenticated, authLoading, signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  if(authLoading){
    return (
      <AuthLayout eyebrow="Start your workspace">
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
    const strength = getStrength(form.password)
    if(!form.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if(!form.email.trim()) nextErrors.email = 'Email is required.'
    else if(!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if(!form.password) nextErrors.password = 'Password is required.'
    else if(strength.score < 2) nextErrors.password = 'Use a stronger password.'
    if(!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.'
    else if(form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if(!form.terms) nextErrors.terms = 'Accept the terms to continue.'
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
      await signup(form)
      setStatus('success')
      showToast('Account created. Welcome to JobTrack AI.', 'success')
      navigate('/', {replace: true})
    }catch(error){
      console.error('Signup failed', error)
      setStatus('error')
      showToast(error?.message || 'Sign up failed. Please try again.', 'error')
    }
  }

  return (
    <AuthLayout eyebrow="Start your workspace">
      <AuthCard
        title="Create your account"
        description="Build a focused career workspace for applications, interviews, resumes, and AI coaching."
        footer={<span>Already have an account? <Link to="/login">Login</Link></span>}
      >
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {status === 'success' ? <div className="auth-state success-state">Account created. Opening your workspace...</div> : null}
          {status === 'error' && !Object.values(errors).some(Boolean) ? <div className="auth-state error-state">We could not create your account. Please try again.</div> : null}

          <AuthInput
            id="signup-name"
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Aleeza Rashid"
            icon={User}
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            error={errors.fullName}
          />
          <AuthInput
            id="signup-email"
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
            id="signup-password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
          <PasswordInput
            id="signup-confirm-password"
            label="Confirm Password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            error={errors.confirmPassword}
          />

          <label className={`auth-checkbox auth-terms ${errors.terms ? 'has-error' : ''}`}>
            <input type="checkbox" checked={form.terms} onChange={(event) => updateField('terms', event.target.checked)} />
            <span>I agree to the Terms & Conditions and privacy policy.</span>
          </label>
          {errors.terms ? <small className="auth-error">{errors.terms}</small> : null}

          <button className="btn btn-primary auth-submit" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <div className="auth-divider"><span>or</span></div>
          <SocialLogin label="Sign up with Google" disabled={status === 'loading'} />
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
