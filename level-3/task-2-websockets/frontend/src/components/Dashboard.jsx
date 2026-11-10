import React from 'react';
import {
  LogOut,
  Shield,
  User,
  Radio,
  Cpu,
  Layers,
  CheckCircle,
} from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import SendNotification from './SendNotification';
import NotificationPanel from './NotificationPanel';

const Dashboard = ({
  user,
  token,
  socketStatus,
  socketError,
  notifications,
  onClearNotifications,
  onLogout,
  onRetrySocket,
}) => {
  const isAdmin = user?.role === 'admin';

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="nav-brand-section">
          <div className="brand-badge small">
            <Radio size={18} />
          </div>
          <div>
            <div className="nav-title-row">
              <h1 className="nav-app-name">Codveda WebSockets</h1>
              <span className="task-badge">Level 3 &bull; Task 2</span>
            </div>
            <p className="nav-sub">Real-Time Private Room Event Engine</p>
          </div>
        </div>

        <div className="nav-center-section">
          <ConnectionStatus
            status={socketStatus}
            errorMessage={socketError}
            onRetry={onRetrySocket}
          />
        </div>

        <div className="nav-user-section">
          <div className="user-profile-badge">
            <div className={`avatar-icon ${isAdmin ? 'admin' : 'user'}`}>
              {isAdmin ? <Shield size={16} /> : <User size={16} />}
            </div>
            <div className="user-info-text">
              <span className="user-email">{user?.email}</span>
              <div className="user-role-row">
                <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-user'}`}>
                  {isAdmin ? 'ADMIN' : 'REGULAR USER'}
                </span>
                <span className="user-id-pill">ID #{user?.id}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="btn btn-logout"
            title="Sign out and disconnect socket"
          >
            <LogOut size={16} />
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Info Header Banner */}
        <section className="info-banner">
          <div className="banner-content">
            <div className="banner-icon-col">
              <Cpu size={24} className="banner-icon" />
            </div>
            <div className="banner-text">
              <h2 className="banner-title">
                {isAdmin ? 'Admin Operations Control' : 'User Notification Terminal'}
              </h2>
              <p className="banner-desc">
                {isAdmin
                  ? `Authenticated as Admin (ID: ${user?.id}). Joined rooms: "user:${user?.id}" & "admins". You have permission to dispatch private notifications to User ID 2.`
                  : `Authenticated as User (ID: ${user?.id}). Joined room: "user:${user?.id}". You are listening for private Socket.IO broadcasts targeted specifically to you.`}
              </p>
            </div>
          </div>
          <div className="banner-badges">
            <span className="banner-pill">
              <Layers size={13} /> Room: <code>user:{user?.id}</code>
            </span>
            <span className="banner-pill">
              <CheckCircle size={13} /> JWT Protected
            </span>
          </div>
        </section>

        {/* Dashboard Content Grid */}
        <div className={`dashboard-grid ${isAdmin ? 'two-columns' : 'single-column'}`}>
          {/* Admin Dispatch Section */}
          {isAdmin && (
            <div className="dashboard-col col-admin">
              <SendNotification token={token} />
            </div>
          )}

          {/* Inbox Section (Visible to both admin and user) */}
          <div className="dashboard-col col-inbox">
            <NotificationPanel
              notifications={notifications}
              onClear={onClearNotifications}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          Codveda Technologies Internship &bull; Level 3 Task 2 &mdash; Socket.IO Handshake Auth Demo
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
