import { useState } from 'react'
import { X } from 'lucide-react'

export default function StudentForm({ student, saving, error, onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: student?.name || '',
    email: student?.email || '',
    course: student?.course || '',
  })
  const [validationError, setValidationError] = useState('')

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setValidationError('')
  }

  function submit(event) {
    event.preventDefault()
    const name = values.name.trim()
    const email = values.email.trim()
    const course = values.course.trim()
    if (!name || !course || !email) {
      setValidationError('Please complete all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Enter a valid email address.')
      return
    }
    onSubmit({ name, email, course })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose() }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <div className="modal-header">
          <div><span className="eyebrow">{student ? 'STUDENT RECORD' : 'NEW ENROLLMENT'}</span><h2 id="student-form-title">{student ? 'Edit student' : 'Add student'}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} disabled={saving} aria-label="Close dialog"><X size={19} /></button>
        </div>
        <p className="modal-description">{student ? 'Update the student information below.' : 'Enter the student information to add a record.'}</p>
        <form className="student-form" onSubmit={submit}>
          <label>Full name<input name="name" value={values.name} onChange={update} placeholder="e.g. Jordan Lee" autoFocus maxLength="120" /></label>
          <label>Email address<input name="email" type="email" value={values.email} onChange={update} placeholder="jordan@example.com" maxLength="160" /></label>
          <label>Course<input name="course" value={values.course} onChange={update} placeholder="e.g. Computer Engineering" maxLength="120" /></label>
          {(validationError || error) && <div className="alert alert-error" role="alert">{validationError || error}</div>}
          <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <><span className="spinner spinner-light" />Saving…</> : student ? 'Save changes' : 'Add student'}</button></div>
        </form>
      </section>
    </div>
  )
}
