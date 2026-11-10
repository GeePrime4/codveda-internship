import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { getApiErrorMessage } from '../services/api'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const notice = location.state?.notice

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to sign in. Please check your details.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <Link to="/login" className="brand auth-brand"><span className="brand-mark"><GraduationCap size={22} /></span><span>Campus<span className="brand-light">ly</span></span></Link>
        <div className="showcase-content">
          <span className="showcase-kicker"><span className="kicker-line" /> A better view of your campus</span>
          <h1>Every student.<br /><span>One clear picture.</span></h1>
          <p>Keep student records organized and make your campus administration feel effortless.</p>
          <div className="showcase-visual" aria-hidden="true">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-education"><GraduationCap size={78} strokeWidth={1.2} /></div>
            <div className="visual-note note-top"><UsersRound size={16} /><span>Student records</span><b>●</b></div>
            <div className="visual-note note-bottom"><ShieldCheck size={17} /><span>Secure access</span><b>✓</b></div>
            <div className="visual-dot dot-a" /><div className="visual-dot dot-b" />
          </div>
        </div>
        <div className="showcase-footer"><span>© 2026 Campusly</span><span>Built for better learning</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-mobile-brand"><span className="brand-mark"><GraduationCap size={21} /></span>Campus<span className="brand-light">ly</span></div>
        <div className="auth-form-wrap">
          <div className="auth-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Enter your credentials to access your workspace.</p></div>
          {notice && <div className="alert alert-success" role="status">{notice}</div>}
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@school.edu" required /></label>
            <label>Password
              <span className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>
            <button type="submit" className="button button-primary auth-submit" disabled={loading}>{loading ? <><span className="spinner spinner-light" />Signing in…</> : <>Sign in <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">New to Campusly? <Link to="/register">Create an account</Link></p>
          <div className="auth-security"><ShieldCheck size={15} /><span>Your account is protected with secure authentication</span></div>
        </div>
        <footer className="auth-copyright">Campusly Student Administration <span>·</span> Secure sign in</footer>
      </section>
    </main>
  )
}
