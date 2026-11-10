import { api } from './api'

export async function getStudents(page = 1, limit = 10) {
  const { data } = await api.get('/students', { params: { page, limit } })
  const result = data?.students
  if (!Array.isArray(result?.students) || !result?.pagination) {
    throw new Error('The API returned an unexpected student list response.')
  }
  return { students: result.students, pagination: result.pagination }
}

export async function getStudent(id) {
  const { data } = await api.get(`/students/${id}`)
  if (!data?.data) throw new Error('The API returned an unexpected student response.')
  return data.data
}

export async function createStudent(student) {
  const { data } = await api.post('/students', student)
  return data.student
}

export async function updateStudent(id, student) {
  const { data } = await api.put(`/students/${id}`, student)
  return data.data
}

export async function deleteStudent(id) {
  return api.delete(`/students/${id}`)
}
