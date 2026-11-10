import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import StatCard from '../components/StatCard'
import StudentTable from '../components/StudentTable'
import { getStudents } from '../services/studentService'
import { getApiErrorMessage } from '../services/api'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [result, setResult] = useState({ students: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getStudents(1, 5)
      .then((data) => { if (active) setResult(data) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Could not load student records.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div><span className="eyebrow welcome-eyebrow">{greeting()}</span><h1>Welcome back, {user?.name?.split(' ')[0] || 'there'} <span className="welcome-wave">✦</span></h1><p>Here’s what’s happening with your student community.</p></div>
        <div className="welcome-art" aria-hidden="true"><div className="welcome-circle circle-back" /><div className="welcome-circle circle-front"><BookOpen size={36} /></div><span className="welcome-spark spark-one">✳</span><span className="welcome-spark spark-two">✦</span></div>
      </section>

      <section className="stat-grid" aria-label="Campus summary">
        <StatCard icon={UsersRound} label="Total students" value={loading ? '—' : (result.pagination?.total ?? 0)} note="Across all student records" tone="blue" />
        <StatCard icon={ShieldCheck} label="Your role" value={user?.role || '—'} note={isAdmin ? 'Full record management' : 'Read-only student access'} tone="green" />
        <StatCard icon={BookOpen} label="Workspace" value="Students" note="One place for campus records" tone="amber" />
      </section>

      <section className="content-card dashboard-records">
        <div className="section-heading">
          <div><span className="eyebrow">STUDENT DIRECTORY</span><h2>Student records</h2><p>A quick look at the first page of your directory.</p></div>
          <Link to="/students" className="text-link">View directory <ArrowRight size={16} /></Link>
        </div>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {loading ? <div className="loading-state"><span className="spinner" />Loading student records…</div>
          : result.students.length ? <StudentTable students={result.students} isAdmin={isAdmin} compact />
            : !error && <div className="empty-state"><span className="empty-icon"><UsersRound size={22} /></span><strong>No students yet</strong><p>Student records will appear here once they are added.</p></div>}
      </section>
      <p className="dashboard-footnote">Student totals and records are loaded from your connected campus API.</p>
    </div>
  )
}
