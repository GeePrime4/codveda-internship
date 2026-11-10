import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

export function createSocket(token) {
  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: false,
  })
}