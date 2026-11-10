import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { getApiErrorMessage } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    const details = { name: values.name.trim(), email: values.email.trim(), password: values.password }
    if (!details.name || !details.email || !details.password) {
      setError('Please complete all fields.')
      return
    }
    if (details.password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const response = await register(details)
      navigate('/login', { replace: true, state: { notice: response.message || 'Registration successful. Sign in to continue.' } })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create your account. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page auth-page-register">
      <section className="auth-showcase">
        <Link to="/login" className="brand auth-brand"><span className="brand-mark"><GraduationCap size={22} /></span><span>Campus<span className="brand-light">ly</span></span></Link>
        <div className="showcase-content">
          <span className="showcase-kicker"><span className="kicker-line" /> A better view of your campus</span>
          <h1>Make room for<br /><span>great things.</span></h1>
          <p>One simple place to keep your student community connected and organized.</p>
          <div className="register-points"><div><span>01</span><strong>Simple student records</strong></div><div><span>02</span><strong>Secure team access</strong></div><div><span>03</span><strong>Clear campus overview</strong></div></div>
        </div>
        <div className="showcase-footer"><span>© 2026 Campusly</span><span>Built for better learning</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-mobile-brand"><span className="brand-mark"><GraduationCap size={21} /></span>Campus<span className="brand-light">ly</span></div>
        <div className="auth-form-wrap">
          <div className="auth-heading"><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p>Set up your access to the student workspace.</p></div>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            <label>Full name<input name="name" autoComplete="name" value={values.name} onChange={update} placeholder="Your name" maxLength="120" required /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" value={values.email} onChange={update} placeholder="you@school.edu" required /></label>
            <label>Password
              <span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.password} onChange={update} placeholder="At least 8 characters" minLength="8" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>
            <button type="submit" className="button button-primary auth-submit" disabled={loading}>{loading ? <><span className="spinner spinner-light" />Creating account…</> : <>Create account <ArrowRight size={17} /></>}</button>
          </form>
          <p className="role-note">New accounts receive the default staff role.</p>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        <footer className="auth-copyright">Campusly Student Administration <span>·</span> Secure access</footer>
      </section>
    </main>
  )
}
