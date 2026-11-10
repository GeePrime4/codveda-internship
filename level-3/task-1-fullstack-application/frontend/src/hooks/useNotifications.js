import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { createSocket } from '../services/socket'

export function useNotifications() {
  const { token, user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!token || !user) return undefined

    const socket = createSocket(token)

    const handleConnect = () => {
      setConnected(true)
      console.log('Socket.IO connected:', socket.id)
    }

    const handleDisconnect = () => {
      setConnected(false)
    }

    const handleNotification = (notification) => {
      setNotifications((previous) =>
        [notification, ...previous].slice(0, 20)
      )
    }

    const handleConnectError = (error) => {
      setConnected(false)
      console.error('Socket connection failed:', error.message)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('notification:new', handleNotification)

    socket.connect()

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
}, [token, user])
  return { notifications, connected }
}