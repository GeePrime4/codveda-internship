import { Bell, Menu, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
}

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu-button" onClick={onMenuClick} aria-label="Toggle navigation">
        <Menu size={20} />
      </button>
      <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>Student administration</strong></div>
      <div className="topbar-actions">
        <span className="topbar-date">Campus management</span>
        <button className="icon-button notification-button" aria-label="Notifications" title="No new notifications">
          <Bell size={18} /><span className="notification-dot" />
        </button>
        <Link to="/profile" className="user-menu" aria-label="Open profile">
          <span className="avatar">{initials(user?.name)}</span>
          <span className="user-menu-copy"><strong>{user?.name}</strong><small>{user?.role}</small></span>
          <ChevronDown size={15} className="user-chevron" />
        </Link>
      </div>
    </header>
  )
}
