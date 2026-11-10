import { Eye, Pencil, Trash2 } from 'lucide-react'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'S'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default function StudentTable({ students, isAdmin, onView, onEdit, onDelete, compact = false }) {
  return (
    <div className="table-scroll">
      <table className={`student-table ${compact ? 'compact-table' : ''}`}>
        <thead>
          <tr>
            <th>STUDENT</th><th>EMAIL ADDRESS</th><th>COURSE</th>
            {!compact && <th>REGISTERED</th>}
            {!compact && <th className="actions-heading">{isAdmin ? 'ACTIONS' : 'DETAILS'}</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="student-identity">
                  <span className="student-avatar">{initials(student.name)}</span>
                  <span className="student-name">{student.name}</span>
                </div>
              </td>
              <td className="student-email">{student.email}</td>
              <td><span className="course-pill">{student.course}</span></td>
              {!compact && <td className="date-cell">{formatDate(student.created_at || student.createdAt)}</td>}
              {!compact && <td>
                <div className="row-actions">
                  <button className="table-action view-action" onClick={() => onView(student)} aria-label={`View ${student.name}`} title="View details"><Eye size={16} /></button>
                  {isAdmin && <>
                    <button className="table-action edit-action" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} title="Edit student"><Pencil size={15} /></button>
                    <button className="table-action delete-action" onClick={() => onDelete(student)} aria-label={`Delete ${student.name}`} title="Delete student"><Trash2 size={15} /></button>
                  </>}
                </div>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
