import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function signOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="profile-page">
      <div className="page-title-row"><div><span className="eyebrow">ACCOUNT</span><h1>Your profile</h1><p>Your account information and access level.</p></div></div>
      <section className="content-card profile-card">
        <div className="profile-cover"><div className="profile-avatar">{initials(user?.name)}</div></div>
        <div className="profile-body"><div className="profile-intro"><div><h2>{user?.name}</h2><p>Campusly account</p></div><span className={`role-badge ${user?.role === 'admin' ? 'role-admin' : ''}`}>{user?.role}</span></div>
          <div className="profile-info-grid"><div className="profile-info"><span className="profile-info-icon"><UserRound size={17} /></span><div><small>Full name</small><strong>{user?.name}</strong></div></div><div className="profile-info"><span className="profile-info-icon"><Mail size={17} /></span><div><small>Email address</small><strong>{user?.email}</strong></div></div><div className="profile-info"><span className="profile-info-icon"><ShieldCheck size={17} /></span><div><small>Access role</small><strong className="role-capitalize">{user?.role}</strong></div></div></div>
          <div className="profile-note"><ShieldCheck size={17} /><p>{user?.role === 'admin' ? 'You can view and manage student records.' : 'You have read-only access to student records. An administrator can manage student information.'}</p></div>
          <button className="button button-secondary signout-button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </section>
    </div>
  )
}
