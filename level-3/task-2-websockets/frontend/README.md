# Codveda Technologies Level 3 – Task 2: WebSockets Frontend

A modern, responsive React frontend demonstration for **Codveda Technologies Level 3 Task 2 (WebSockets)** showcasing real-time bidirectional communication using **Socket.IO**, **JWT authentication**, and private room event broadcasting.

---

## 🚀 Features

- **JWT-Protected Socket.IO Handshake**: Authenticates connection by sending the token via `socket.handshake.auth.token`.
- **Role-Based Access Control**:
  - **Admin**: Can dispatch private notifications to User ID 2 using `POST /api/notifications/2` with Bearer auth.
  - **Regular User**: Only has access to the real-time inbox listening on private room `user:2`. The admin sending form is completely absent.
- **Real-Time Notification Inbox**:
  - Listens to the `notification:new` event and updates instantly without page reload.
  - Formatted timestamps, sender badges, visual empty states, and fresh arrival animations.
- **Live Connection Status Badge**:
  - Displays **Connected** (pulsing green), **Connecting** (amber spinner), **Connection Error** (red alert with retry), and **Disconnected** (slate).
- **Session-Based State Isolation**:
  - Stores JWT and user details in `sessionStorage` (cleared on logout) so you can test Admin in one tab and User in another tab or incognito window.
- **Strict Port Configuration**:
  - Configured to run strictly on **port 5174** to match backend CORS policy.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Socket.IO Client 4.8**
- **Axios**
- **Lucide React** (Modern iconography)
- **Oxlint** (Zero-warning linting)

---

## 📦 Project Structure

```
src/
├── components/
│   ├── ConnectionStatus.jsx   # Real-time WebSocket connection state badge
│   ├── Dashboard.jsx          # Role-based dashboard shell & layout
│   ├── Login.jsx              # Authentication form with 1-click demo autofill
│   ├── NotificationPanel.jsx  # Real-time notification inbox
│   └── SendNotification.jsx   # Admin notification dispatch form
├── services/
│   ├── api.js                 # Axios API requests (login & send notification)
│   └── socket.js              # Socket.IO client initialization & lifecycle
├── App.jsx                    # State coordinator & socket event listener
├── App.css                    # Modern navy/light UI styling
├── index.css                  # Base styles and reset
└── main.jsx                   # React root entrypoint
```

---

## ⚙️ Setup & Running

1. **Ensure the backend is running** on `http://localhost:5002`.
2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```
3. **Start the frontend**:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5174`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Linting**:
   ```bash
   npm run lint
   ```

---

## 🧪 Demo Credentials

| Role | Email | Password | Socket Room |
|---|---|---|---|
| **Admin** | `admin@example.com` | `Admin123!` | `user:1` & `admins` |
| **Regular User** | `user@example.com` | `User123!` | `user:2` |

---

## 🔍 Manual Testing Steps

1. Open a regular browser window at `http://localhost:5174` and click **Admin Account** to log in as admin.
2. Open an incognito window at `http://localhost:5174` and click **Regular User (ID: 2)** to log in as user.
3. Check both headers: both show green **Connected** badges.
4. From the admin window, select a message template and click **Send Private Notification**.
5. Immediately observe the incognito window: the notification appears in real-time in the user's inbox without refreshing.
6. Verify the regular user has no access to the send form.
7. Click **Sign Out** to test clean socket disconnection.
