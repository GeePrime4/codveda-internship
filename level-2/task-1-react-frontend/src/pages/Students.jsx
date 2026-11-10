import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, UsersRound } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import StudentForm from '../components/StudentForm'
import StudentTable from '../components/StudentTable'
import { createStudent, deleteStudent, getStudent, getStudents, updateStudent } from '../services/studentService'
import { getApiErrorMessage } from '../services/api'

function formatDate(value) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not provided' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export default function Students() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [success, setSuccess] = useState('')
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const requestStudents = useCallback(() => getStudents(page, 10), [page])

  const loadStudents = useCallback(async () => {
    try {
      const result = await requestStudents()
      setStudents(result.students)
      setPagination(result.pagination)
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Could not load student records.'))
    } finally {
      setLoading(false)
    }
  }, [requestStudents])

  useEffect(() => {
    let active = true
    requestStudents()
      .then((result) => {
        if (!active) return
        setStudents(result.students)
        setPagination(result.pagination)
        setPageError('')
      })
      .catch((error) => {
        if (active) setPageError(getApiErrorMessage(error, 'Could not load student records.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [requestStudents])

  function retryLoad() {
    setLoading(true)
    setPageError('')
    loadStudents()
  }

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return students
    return students.filter((student) => [student.name, student.email, student.course].some((value) => value?.toLowerCase().includes(search)))
  }, [students, query])

  async function openDetails(student) {
    setDetailLoading(true)
    setDetail({ loading: true, student })
    try {
      setDetail({ loading: false, student: await getStudent(student.id) })
    } catch (error) {
      setDetail({ loading: false, error: getApiErrorMessage(error, 'Could not load student details.') })
    } finally {
      setDetailLoading(false)
    }
  }

  async function openEdit(student) {
    setFormError('')
    setPageError('')
    try {
      const record = await getStudent(student.id)
      setModal({ type: 'edit', student: record })
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Could not load the student for editing.'))
    }
  }

  async function submitForm(values) {
    setSaving(true)
    setFormError('')
    try {
      if (modal.type === 'edit') await updateStudent(modal.student.id, values)
      else await createStudent(values)
      setModal(null)
      setSuccess(modal.type === 'edit' ? 'Student details updated.' : 'Student added successfully.')
      setLoading(true)
      await loadStudents()
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save this student.'))
    } finally {
      setSaving(false)
    }
  }

  async function removeStudent(student) {
    if (!window.confirm(`Delete ${student.name} from the student directory? This action cannot be undone.`)) return
    setPageError('')
    setSuccess('')
    try {
      await deleteStudent(student.id)
      setSuccess(`${student.name} was deleted.`)
      if (students.length === 1 && page > 1) {
        setLoading(true)
        setPage((current) => current - 1)
      }
      else {
        setLoading(true)
        await loadStudents()
      }
    } catch (error) {
      setPageError(getApiErrorMessage(error, 'Could not delete this student.'))
    }
  }

  useEffect(() => {
    if (!success) return undefined
    const timeout = window.setTimeout(() => setSuccess(''), 4500)
    return () => window.clearTimeout(timeout)
  }, [success])

  const totalPages = pagination?.total_pages || 1

  return (
    <div className="students-page">
      <div className="page-title-row">
        <div><span className="eyebrow">CAMPUS DIRECTORY</span><h1>Students</h1><p>View and manage student records across your campus.</p></div>
        {isAdmin && <button className="button button-primary add-student-button" onClick={() => { setModal({ type: 'create' }); setFormError('') }}><Plus size={18} /> Add student</button>}
      </div>
      <section className="content-card directory-card">
        <div className="directory-toolbar">
          <div className="directory-heading"><div className="directory-heading-icon"><UsersRound size={19} /></div><div><h2>All students</h2><p>{pagination ? `${pagination.total} ${pagination.total === 1 ? 'record' : 'records'} in the directory` : 'Student records'}</p></div></div>
          <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this page…" aria-label="Search current student page" /><kbd>⌕</kbd></label>
        </div>
        {success && <div className="alert alert-success" role="status">{success}</div>}
        {pageError && <div className="alert alert-error" role="alert">{pageError}<button className="alert-retry" onClick={retryLoad}>Try again</button></div>}
        {loading ? <div className="loading-state"><span className="spinner" />Loading student records…</div>
          : filteredStudents.length ? <StudentTable students={filteredStudents} isAdmin={isAdmin} onView={openDetails} onEdit={openEdit} onDelete={removeStudent} />
            : !pageError && <div className="empty-state"><span className="empty-icon"><UsersRound size={22} /></span><strong>{query ? 'No matching students' : 'No students in this directory yet'}</strong><p>{query ? 'Try another name, email, or course.' : isAdmin ? 'Add your first student to get started.' : 'Student records will appear here when available.'}</p>{query && <button className="text-link clear-search" onClick={() => setQuery('')}>Clear search</button>}</div>}
        {!loading && pagination?.total > 0 && <div className="pagination">
          <span>Page <strong>{pagination.page}</strong> of <strong>{totalPages}</strong><span className="pagination-total"> · {pagination.total} students</span></span>
          <div className="pagination-buttons"><button className="button button-secondary button-small" disabled={page <= 1} onClick={() => { setLoading(true); setPageError(''); setPage((current) => Math.max(1, current - 1)) }}>Previous</button><button className="button button-secondary button-small" disabled={page >= totalPages} onClick={() => { setLoading(true); setPageError(''); setPage((current) => Math.min(totalPages, current + 1)) }}>Next</button></div>
        </div>}
        {!loading && students.length > 0 && query && <p className="search-scope-note">Search is limited to the currently loaded page because server-side search is not available on this API.</p>}
      </section>

      {modal && <StudentForm student={modal.student} saving={saving} error={formError} onClose={() => { if (!saving) setModal(null) }} onSubmit={submitForm} />}
      {detail && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null) }}>
        <section className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div className="modal-header"><div><span className="eyebrow">STUDENT RECORD</span><h2 id="detail-title">Student details</h2></div><button className="icon-button" onClick={() => setDetail(null)} aria-label="Close dialog"><span aria-hidden="true">×</span></button></div>
          {detailLoading || detail.loading ? <div className="loading-state"><span className="spinner" />Loading student details…</div> : detail.error ? <div className="alert alert-error" role="alert">{detail.error}</div> : <>
            <div className="detail-person"><span className="student-avatar detail-avatar">{detail.student.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span><div><strong>{detail.student.name}</strong><span>Student #{detail.student.id}</span></div></div>
            <dl className="detail-list"><div><dt>Email address</dt><dd>{detail.student.email}</dd></div><div><dt>Course</dt><dd>{detail.student.course}</dd></div><div><dt>Registered</dt><dd>{formatDate(detail.student.created_at || detail.student.createdAt)}</dd></div></dl>
          </>}
          <div className="modal-actions"><button className="button button-secondary" onClick={() => setDetail(null)}>Close</button></div>
        </section>
      </div>}
    </div>
  )
}
