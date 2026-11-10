import React, { useState, useEffect, useCallback, useRef } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { initSocket, disconnectSocket } from './services/socket';
import './App.css';

const SESSION_TOKEN_KEY = 'codveda_ws_token';
const SESSION_USER_KEY = 'codveda_ws_user';

function App() {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem(SESSION_TOKEN_KEY) || null;
  });

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem(SESSION_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [socketStatus, setSocketStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [socketError, setSocketError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Ref to hold current socket to prevent duplicate listeners
  const socketRef = useRef(null);

  const handleLoginSuccess = (authenticatedUser, jwtToken) => {
    // Store in state
    setUser(authenticatedUser);
    setToken(jwtToken);
    setSocketStatus('connecting');
    setSocketError(null);

    // Save in sessionStorage (cleared on logout)
    sessionStorage.setItem(SESSION_TOKEN_KEY, jwtToken);
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(authenticatedUser));
  };

  const handleLogout = useCallback(() => {
    // Disconnect and clean socket
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current = null;
    }
    disconnectSocket();

    // Clear session storage
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);

    // Reset React state
    setToken(null);
    setUser(null);
    setNotifications([]);
    setSocketStatus('disconnected');
    setSocketError(null);
  }, []);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Socket Connection and Event Handling Effect
  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
      disconnectSocket();
      return;
    }

    const socket = initSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketStatus('connected');
      setSocketError(null);
    });

    socket.on('disconnect', (reason) => {
      setSocketStatus('disconnected');
      if (reason === 'io server disconnect') {
        // The server forcibly disconnected the socket (e.g., auth failure)
        setSocketError('Disconnected by server. Session may be expired.');
      }
    });

    socket.on('connect_error', (err) => {
      setSocketStatus('error');
      setSocketError(err?.message || 'WebSocket authentication/connection failed.');
    });

    // Listen for incoming private real-time notifications
    socket.on('notification:new', (payload) => {
      const incomingItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        message: payload?.message || 'New notification',
        sender: payload?.sender || 'admin',
        createdAt: payload?.createdAt || new Date().toISOString(),
      };

      setNotifications((prev) => [incomingItem, ...prev]);
    });

    return () => {
      // Cleanup on unmount or token change
      if (socket) {
        socket.removeAllListeners();
      }
      disconnectSocket();
      socketRef.current = null;
    };
  }, [token, user]);

  const handleRetrySocket = () => {
    if (token) {
      setSocketStatus('connecting');
      setSocketError(null);
      const socket = initSocket(token);
      socketRef.current = socket;
    }
  };

  return (
    <div className="app-container">
      {!token || !user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard
          user={user}
          token={token}
          socketStatus={socketStatus}
          socketError={socketError}
          notifications={notifications}
          onClearNotifications={handleClearNotifications}
          onLogout={handleLogout}
          onRetrySocket={handleRetrySocket}
        />
      )}
    </div>
  );
}

export default App;
