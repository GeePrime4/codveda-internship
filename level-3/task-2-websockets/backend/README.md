# Codveda Technologies Level 3 – Task 2: Real-Time WebSockets Backend

A dedicated, standalone WebSocket and HTTP notification server built for **Codveda Technologies Level 3 – Task 2 (WebSockets)**. This application provides real-time private messaging, JWT handshake authentication, and isolated room routing using **Socket.IO** and **Express**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Socket.IO Architecture](#socketio-architecture)
- [JWT Handshake Authentication](#jwt-handshake-authentication)
- [Private User Rooms & Admin Rooms](#private-user-rooms--admin-rooms)
- [Demo Account Configuration](#demo-account-configuration)
- [API Endpoints](#api-endpoints)
- [Notification Events & Payload Structure](#notification-events--payload-structure)
- [Installation & Setup](#installation--setup)
- [How to Start the Backend](#how-to-start-the-backend)
- [How to Test Communication Between Two Clients](#how-to-test-communication-between-two-clients)

---

## 🎯 Overview

The Task 2 backend is a completely independent real-time server operating on **port 5002**. Unlike Task 1, it requires no external SQL database; authentication credentials and roles are configured dynamically via environment variables for isolated demonstration of:
1. **Authenticated WebSocket connections** via JWT in the handshake.
2. **Private messaging** dispatched strictly to a specific recipient's room.
3. **Role-gated dispatch** ensuring only authorized administrators can trigger notifications.

---

## 💻 Technologies Used

- **Runtime**: Node.js (v18+)
- **Server Framework**: Express.js (v5)
- **Real-Time Communication**: Socket.IO (v4.8)
- **Authentication & Security**: JSON Web Token (`jsonwebtoken`), `cors`
- **Configuration & Tooling**: `dotenv`, `nodemon`

---

## 🔌 Socket.IO Architecture

The real-time architecture isolates connections into security-gated rooms:

```
[ Client ] 
    │  (Connects with handshake: auth = { token: "JWT..." })
    ▼
[ io.use(authenticateSocket) ]
    │  (Verifies JWT signature using JWT_SECRET)
    ├── If Valid: socket.user = decoded; next();
    └── If Invalid: next(new Error("Invalid or expired token"));
    ▼
[ io.on('connection') ]
    ├── socket.join(`user:${socket.user.id}`)  --> Private room for this user only
    └── if (role === 'admin') socket.join('admins') --> Admin broadcast room
```

---

## 🔑 JWT Handshake Authentication

Authentication occurs **before** the WebSocket connection is approved:

- The client passes the token in the Socket.IO connection options:
  ```javascript
  const socket = io("http://localhost:5002", {
    auth: {
      token: "YOUR_JWT_TOKEN"
    }
  });
  ```
- The backend middleware ([`middleware/auth.middleware.js`](file:///c:/Users/User/codveda-internship/level-3/task-2-websockets/backend/middleware/auth.middleware.js)) reads `socket.handshake.auth.token`.
- If missing or unverified, the connection handshake is immediately rejected with `Authentication required` or `Invalid or expired token`.

---

## 🏢 Private User Rooms & Admin Rooms

When a client successfully connects:
1. **Private User Room (`user:<id>`)**:
   - Every authenticated user is automatically joined to `user:${socket.user.id}`.
   - For example, Regular User (ID: 2) joins `user:2`.
   - Notifications dispatched to this room are received exclusively by User 2 across any connected tabs.
2. **Admin Room (`admins`)**:
   - Clients with `socket.user.role === 'admin'` are automatically joined to the `admins` room.
   - Regular users cannot join or eavesdrop on admin communications.

---

## 👥 Demo Account Configuration

The backend reads demo account credentials directly from environment variables. No external database setup is required.

Deterministic IDs are assigned upon login:
- **Admin**: ID `1`, `role: "admin"`
- **Regular User**: ID `2`, `role: "user"`

### Environment Variables List

Create a `.env` file in `level-3/task-2-websockets/backend/` containing:

| Variable Name | Description | Default / Example Value |
|---|---|---|
| `PORT` | Backend HTTP & WebSocket port | `5002` |
| `CLIENT_URL` | Allowed CORS origin for frontend | `http://localhost:5174` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | *(secure secret string)* |
| `DEMO_ADMIN_EMAIL` | Email address for demo admin account | `admin@example.com` |
| `DEMO_ADMIN_PASSWORD` | Password for demo admin account | *(configured demo password)* |
| `DEMO_USER_EMAIL` | Email address for demo regular user account | `user@example.com` |
| `DEMO_USER_PASSWORD` | Password for demo regular user account | *(configured demo password)* |

> [!CAUTION]
> Keep your `.env` file protected. The backend `.gitignore` ensures this file is not committed to source control.

---

## 🌐 API Endpoints

### 1. Demo Login (`POST /api/auth/login`)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "AdminPassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (401 Unauthorized)**:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### 2. Send Private Notification (`POST /api/notifications/:userId`)
- **Access**: Admin Only (`Authorization: Bearer <admin_jwt>`)
- **URL Parameter**: `userId` — The target user ID (e.g. `2`)
- **Request Body**:
  ```json
  {
    "message": "Your progress report has been reviewed."
  }
  ```
- **Behavior**:
  1. Validates the sender's JWT token.
  2. Verifies `decoded.role === "admin"`. If not admin, returns `403 Forbidden: Admin access required`.
  3. Validates that `message` is non-empty.
  4. Dispatches the notification event strictly to the recipient's room:
     ```javascript
     getIO().to(`user:${req.params.userId}`).emit("notification:new", { ... });
     ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Notification sent"
  }
  ```

---

### 3. Server Health Check (`GET /`)
- **Access**: Public
- **Response (200 OK)**:
  ```json
  {
    "message": "Codveda WebSocket Server is running!"
  }
  ```

---

## 📡 Notification Events & Payload Structure

### Outgoing Server Event: `notification:new`

Emitted by the backend server to room `user:<userId>`.

**Payload Structure**:
```json
{
  "message": "System maintenance scheduled for tonight at 23:00 UTC.",
  "sender": "admin",
  "createdAt": "2026-11-10T19:35:00.000Z"
}
```

- `message` *(String)*: Text content of the notification.
- `sender` *(String)*: Identity of sender (`admin`).
- `createdAt` *(ISO 8601 String)*: Accurate UTC timestamp of dispatch.

---

## 🛠️ Installation & Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd level-3/task-2-websockets/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file is present and properly configured with credentials and secrets.

---

## 🚀 How to Start the Backend

### Development Mode (with Nodemon auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

When running, the console confirms:
```
WebSocket server running on port 5002
Socket.IO is ready
```

---

## 🧪 How to Test Communication Between Two Clients

To demonstrate real-time WebSocket delivery between clients:

1. **Start the Task 2 Frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend runs at `http://localhost:5174`.

2. **Open Two Independent Browsers**:
   - **Client A (Admin)**: Open standard browser at `http://localhost:5174`.
   - **Client B (Regular User)**: Open an incognito/private window at `http://localhost:5174`.

3. **Log In on Both Windows**:
   - **Client A**: Sign in with `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD`.
     - *State*: Top badge shows green `● Connected`. Role displays `ADMIN (ID #1)`.
   - **Client B**: Sign in with `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD`.
     - *State*: Top badge shows green `● Connected`. Role displays `REGULAR USER (ID #2)`. The admin message form is completely hidden.

4. **Dispatch Notification**:
   - In **Client A (Admin)**, enter a message in the "Send Private Notification" card and click **Send Private Notification**.
   - Watch **Client B (Regular User)**: The notification immediately appears in User 2's inbox with a green highlight animation and timestamp **without refreshing the page**.
   - Notice that Admin's own inbox did not receive this message, proving that only `user:2` was targeted.

5. **Test Disconnection**:
   - Click **Sign Out** in either window. The WebSocket cleanly disconnects and removes all listeners.
