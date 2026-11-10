import { api } from './api'

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  if (!data?.token || !data?.user) {
    throw new Error('The API returned an unexpected login response.')
  }
  return data
}

export async function register(details) {
  const { data } = await api.post('/auth/register-user', details)
  return data
}
