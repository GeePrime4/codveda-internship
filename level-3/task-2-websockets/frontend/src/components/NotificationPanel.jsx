import React from 'react';
import { Bell, BellOff, Clock, User, Shield, Trash2 } from 'lucide-react';

const NotificationPanel = ({ notifications = [], onClear }) => {
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="card notification-panel-card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="icon-badge">
            <Bell size={18} />
          </div>
          <div>
            <div className="card-title-row">
              <h2 className="card-title">Live Notification Inbox</h2>
              {notifications.length > 0 && (
                <span className="count-badge">{notifications.length}</span>
              )}
            </div>
            <p className="card-subtitle">
              Listening in real-time to <code>notification:new</code> Socket.IO events
            </p>
          </div>
        </div>

        {notifications.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="btn btn-ghost btn-sm clear-btn"
            title="Clear inbox"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="notifications-body">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BellOff size={32} />
            </div>
            <h3 className="empty-state-title">No notifications received yet</h3>
            <p className="empty-state-text">
              Real-time notifications sent to your private room will instantly appear here via
              Socket.IO without requiring page reload.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((item, index) => (
              <div
                key={item.id || index}
                className={`notification-item ${index === 0 ? 'notification-item-fresh' : ''}`}
              >
                <div className="notification-item-header">
                  <div className="sender-pill">
                    {item.sender === 'admin' ? (
                      <>
                        <Shield size={12} className="sender-icon admin" />
                        <span className="sender-name">Admin Dispatch</span>
                      </>
                    ) : (
                      <>
                        <User size={12} className="sender-icon" />
                        <span className="sender-name">{item.sender || 'System'}</span>
                      </>
                    )}
                  </div>

                  <div className="time-pill">
                    <Clock size={12} />
                    <span>{formatDate(item.createdAt)} {formatTime(item.createdAt)}</span>
                  </div>
                </div>

                <div className="notification-message">
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
