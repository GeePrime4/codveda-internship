import { BookOpenCheck, LayoutDashboard, LogOut, School, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Sidebar({ open, onNavigate }) {
  const { logout } = useAuth()

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <NavLink to="/dashboard" className="brand" onClick={onNavigate}>
        <span className="brand-mark"><BookOpenCheck size={21} strokeWidth={2.2} /></span>
        <span>Campus<span className="brand-light">ly</span></span>
      </NavLink>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        <NavLink to="/dashboard" onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /><span>Overview</span>
        </NavLink>
        <NavLink to="/students" onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UsersRound size={18} /><span>Students</span>
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="campus-card">
          <span className="campus-icon"><School size={18} /></span>
          <div><strong>Student services</strong><small>Manage your campus</small></div>
        </div>
        <button className="nav-link logout-link" onClick={logout}>
          <LogOut size={18} /><span>Sign out</span>
        </button>
        <div className="sidebar-version">CAMPUSLY · STUDENT ADMIN</div>
      </div>
    </aside>
  )
}
