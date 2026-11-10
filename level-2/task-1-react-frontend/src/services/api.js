import axios from 'axios'

const TOKEN_KEY = 'codveda_student_token'
let unauthorizedHandler = () => {}

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api'),
  headers: { 'Content-Type': 'application/json' },
})

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || ''
    if (status === 401 || (status === 403 && /expired|invalid token/i.test(message))) {
      unauthorizedHandler()
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error.response?.data
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors.join(', ')
  if (typeof data?.message === 'string' && data.message) return data.message
  if (error.code === 'ERR_NETWORK') {
    return 'Could not reach the API. Check that the backend is running on localhost:5000.'
  }
  if (!error.response && error.message) return error.message
  return fallback
}
