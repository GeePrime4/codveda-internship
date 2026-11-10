import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

const ConnectionStatus = ({ status, errorMessage, onRetry }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'connected':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#059669',
          dot: '#10b981',
          label: 'Connected',
          icon: Wifi,
        };
      case 'connecting':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
          color: '#d97706',
          dot: '#f59e0b',
          label: 'Connecting...',
          icon: RefreshCw,
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.35)',
          color: '#dc2626',
          dot: '#ef4444',
          label: 'Connection Error',
          icon: AlertTriangle,
        };
      case 'disconnected':
      default:
        return {
          bg: 'rgba(100, 116, 139, 0.12)',
          border: 'rgba(100, 116, 139, 0.35)',
          color: '#64748b',
          dot: '#94a3b8',
          label: 'Disconnected',
          icon: WifiOff,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="status-container">
      <div
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          borderColor: config.border,
          color: config.color,
        }}
      >
        <span
          className={`status-dot ${status === 'connected' ? 'pulse' : ''} ${status === 'connecting' ? 'spin' : ''}`}
          style={{ backgroundColor: config.dot }}
        />
        <Icon size={14} className={status === 'connecting' ? 'animate-spin' : ''} />
        <span className="status-label">{config.label}</span>
      </div>

      {status === 'error' && (
        <div className="status-error-inline">
          <span className="error-text">{errorMessage || 'Failed to connect to WebSocket server'}</span>
          {onRetry && (
            <button type="button" onClick={onRetry} className="status-retry-btn">
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
