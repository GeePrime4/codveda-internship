# Codveda Technologies Level 3 – Task 1: Full-Stack Student Management API

A production-grade, relational backend API for the **Codveda Technologies Level 3 – Task 1** full-stack internship project. This application provides secure student record management, JWT-based user authentication, role-based access control (RBAC), and real-time administrative event dispatch via Socket.IO.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Setup & Migrations](#database-setup--migrations)
- [Admin Seeder Instructions](#admin-seeder-instructions)
- [API Endpoints](#api-endpoints)
- [Authentication & Role Permissions](#authentication--role-permissions)
- [How to Start the Server](#how-to-start-the-server)
- [Testing Instructions](#testing-instructions)

---

## 🎯 Overview

The Task 1 backend server exposes a RESTful API on **port 5001** to manage student directory records and user accounts. It persists data in a MariaDB/MySQL database via Sequelize ORM, secures sensitive endpoints with JSON Web Tokens (JWT) and `bcryptjs` password hashing, and broadcasts real-time student lifecycle events to connected admin sessions using Socket.IO.

---

## 💻 Technologies Used

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5)
- **Database & ORM**: MariaDB / MySQL with Sequelize (v6) and `sequelize-cli`
- **Real-Time Engine**: Socket.IO (v4.8)
- **Security & Cryptography**: JSON Web Token (`jsonwebtoken`), `bcryptjs`
- **Development Tooling**: `nodemon`, `dotenv`

---

## ✨ Features

- **User Authentication**: Secure registration and login workflows with 12-round bcrypt salt hashing and signed JWT bearer tokens (10-minute expiry).
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full read, write, update, and delete access on student records.
  - **Staff**: Read-only access to view student records and paginated listings.
- **Student CRUD Engine**: Complete lifecycle management (Create, Read, Update, Delete) with Sequelize schema validation (`isEmail`, unique constraint checks).
- **Pagination**: Built-in `findAndCountAll` pagination supporting `page` and `limit` query parameters with total page count calculations.
- **Real-Time Admin Broadcasting**: Automatically emits `notification:new` events to the Socket.IO `admins` room whenever a student is created, updated, or deleted.

---

## 📁 Project Structure

```
level-3/task-1-fullstack-application/
├── config/
│   ├── config.json         # Sequelize environment database configuration
│   └── database.js         # Sequelize database connection & test authentication
├── controllers/
│   ├── auth.controller.js   # User registration and login controller logic
│   └── student.controller.js# Student CRUD logic and real-time Socket.IO notifications
├── middlewares/
│   └── auth.middleware.js   # JWT token verification and role authorization guards
├── migrations/             # Sequelize database migration scripts
│   ├── 20261016122834-create-student.js
│   ├── 20261101120000-add-unique-email-index-to-students.js
│   └── 20261108163941-create-user.js
├── models/                 # Sequelize data models
│   ├── index.js            # Model loader and association registry
│   ├── student.js          # Student schema definition and constraints
│   └── user.js             # User schema definition (admin/staff)
├── routes/                 # Express routing modules
│   ├── auth.route.js       # Authentication routes (/api/auth)
│   └── student.route.js    # Student resource routes (/api/students)
├── seeders/                # Database seed scripts
│   └── 20261110120301-create-admin-user.js
├── sockets/
│   └── socket.js           # Socket.IO initialization and JWT handshake handling
├── .env.example            # Template for environment configuration
├── package.json            # Node.js dependencies and scripts
└── server.js               # Application entrypoint and HTTP/Socket server setup
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of `level-3/task-1-fullstack-application/` based on the provided `.env.example`.

| Variable Name | Description | Example / Default |
|---|---|---|
| `PORT` | HTTP port for the backend server | `5001` |
| `DB_NAME` | Relational database schema name | `codveda_internship` |
| `DB_USER` | Database user account | `root` |
| `DB_PASSWORD` | Database user password | *(user-specific)* |
| `DB_HOST` | Database host address | `localhost` |
| `DB_DIALECT` | Database driver dialect | `mariadb` or `mysql` |
| `JWT_SECRET` | Secret key used for signing and verifying JWTs | *(secure secret string)* |
| `CLIENT_URL` | Frontend origin permitted for Socket.IO connections | `http://localhost:5173` |
| `ADMIN_NAME` | Default administrator name for seeder | `Administrator` |
| `ADMIN_EMAIL` | Default administrator email for seeder | `admin@example.com` |
| `ADMIN_PASSWORD` | Default administrator password for seeder | *(secure password)* |

> [!CAUTION]
> Never commit your `.env` file or hardcode secret credentials into Git. The repository `.gitignore` automatically excludes `.env`.

---

## 🗄️ Database Setup & Migrations

Ensure your MariaDB or MySQL server is running locally and the database specified by `DB_NAME` exists.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run database migrations**:
   Execute the migration suite to create the `users` and `students` tables with all indexes and constraints:
   ```bash
   npm run db:migrate
   ```

3. **Roll back migrations (if needed)**:
   ```bash
   npm run db:migrate:undo
   ```

---

## 👤 Admin Seeder Instructions

To generate or promote the initial administrator account without exposing passwords in code:

1. Configure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in your `.env` file.
2. Run the Sequelize seeder:
   ```bash
   npx sequelize-cli db:seed:all
   ```
3. The seeder checks if the email already exists in `users`:
   - If not found, it inserts a new user with `role: "admin"` and a 12-round bcrypt hash.
   - If found, it updates the record to ensure the user has admin role privileges.

---

## 🌐 API Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register-user` | Public | `{ name, email, password }` | Registers a new account with default role `staff`. Validates input and enforces min 8 characters for password. |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Verifies credentials, generates signed 10-minute JWT, and returns user details (`id`, `name`, `email`, `role`). |

### 2. Students (`/api/students`)

*All student routes require a valid JWT token in the `Authorization: Bearer <token>` header.*

| Method | Endpoint | Required Role | Parameters / Body | Description |
|---|---|---|---|---|
| `GET` | `/api/students` | `admin`, `staff` | Query: `?page=1&limit=10` | Returns paginated student records with count, current page, and total pages. |
| `GET` | `/api/students/:id` | `admin`, `staff` | URL Param: `id` (Integer) | Fetches a single student record by primary key ID. |
| `POST` | `/api/students` | `admin` | `{ name, email, course }` | Creates a new student record and emits real-time event to `admins`. |
| `PUT` | `/api/students/:id` | `admin` | `{ name, email, course }` | Updates an existing student record and emits real-time event to `admins`. |
| `DELETE` | `/api/students/:id` | `admin` | URL Param: `id` (Integer) | Removes a student record and emits real-time event to `admins`. |

### 3. Server Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Returns `{"message": "Codveda Student Management API is running!"}` |

---

## 🛡️ Authentication & Role Permissions

1. **Authentication Middleware (`authenticateToken`)**:
   - Reads `Authorization: Bearer <token>`.
   - Validates signature and expiration against `process.env.JWT_SECRET`.
   - Populates `req.user` with `{ id, email, role }`.
   - Returns `401 Unauthorized` if header is missing, or `403 Forbidden` if the token is expired/invalid.

2. **Role Authorization Middleware (`authorizeRole(...allowedRoles)`)**:
   - Evaluates `req.user.role`.
   - Blocks unauthorized access with `403 Forbidden: Access denied. You do not have permission.` if the role does not match.

3. **Socket Handshake Authentication**:
   - Accepts JWT via `socket.handshake.auth.token`.
   - Automatically joins the user to room `user:<id>`.
   - If `role === 'admin'`, also joins the socket to room `admins`.

---

## 🚀 How to Start the Server

### Development Mode (with Hot Reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

When started successfully, the terminal displays:
```
Database connection established successfully.
Server is running on port 5001
Socket.IO is ready
```

---

## 🧪 Testing Instructions

### 1. Manual Testing via cURL or Postman

#### Login as Admin:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "YourAdminPassword"}'
```
*Save the returned `token` string for subsequent requests.*

#### Read Students (Admin or Staff):
```bash
curl -X GET "http://localhost:5001/api/students?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create a Student (Admin Only):
```bash
curl -X POST http://localhost:5001/api/students \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane.doe@example.com", "course": "Computer Science"}'
```

### 2. Frontend Integration Testing
1. Navigate to the Task 1 frontend directory: `level-3/task-1-fullstack-application/frontend`
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:5173`.
4. Sign in as Admin to perform full CRUD operations; sign in as Staff to verify that modification buttons are hidden and restricted.
