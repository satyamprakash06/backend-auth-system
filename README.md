# 🔐 RESTful API — Complete Authentication System

A production-ready RESTful API built with Node.js, Express, and MongoDB featuring a fully secure JWT authentication system with email verification, token rotation, and role-based access control.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Security Measures](#security-measures)
- [Error Handling](#error-handling)

---

## ✨ Features

### Auth
- ✅ User registration with email verification
- ✅ Login with JWT access + refresh tokens
- ✅ Logout with token invalidation
- ✅ Refresh token rotation
- ✅ Forgot password with reset email
- ✅ Get current user profile

### Security
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Refresh tokens hashed (SHA256) before saving to DB
- ✅ HTTP-only, secure, sameSite cookies
- ✅ Token rotation on every refresh
- ✅ Email verification before login
- ✅ Role-based access control (customer, seller, admin)
- ✅ Sensitive fields hidden with `select: false`
- ✅ Rollback on email failure

### Code Quality
- ✅ Clean service / controller architecture
- ✅ Joi validation with DTOs
- ✅ Custom ApiError & ApiResponse classes
- ✅ Global error handler middleware
- ✅ asyncHandler utility — no repetitive try/catch
- ✅ Consistent response format across all endpoints

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM — schema, hooks, methods |
| jsonwebtoken | JWT access & refresh tokens |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Nodemailer | Email service (verification & reset) |
| cookie-parser | Cookie parsing middleware |
| dotenv | Environment variable management |
| crypto (built-in) | SHA256 token hashing |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                             # Express app, middleware setup
│   ├── common/
│   │   ├── config/
│   │   │   ├── db.js                      # MongoDB connection
│   │   │   └── email.js                   # Nodemailer transporter + sendMail
│   │   ├── dto/
│   │   │   └── base.dto.js                # Base DTO — Joi validation logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # authenticate & authorize
│   │   │   ├── validation.middleware.js    # request validation middleware
│   │   │   └── error.middleware.js         # global error handler
│   │   └── utils/
│   │       ├── api-error.js               # custom ApiError class
│   │       ├── api-response.js            # consistent response helper
│   │       ├── async-handler.js           # async error wrapper
│   │       └── jwt.utils.js               # token generation & verification
│   └── features/
│       └── auth/
│           ├── auth.model.js              # User schema + pre-save hook + comparePassword
│           ├── auth.service.js            # all 7 business logic functions
│           ├── auth.controller.js         # all 7 HTTP controllers
│           ├── auth.router.js             # route definitions
│           └── dto/
│               ├── register.dto.js        # register validation rules
│               ├── login.dto.js           # login validation rules
│               └── forgetPassword.dto.js  # forgot password validation rules
├── server.js                              # entry point — DB connect + server start
├── .env                                   # environment variables (never commit!)
├── .env.example                           # environment variable template
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn
- SMTP credentials (Gmail, Mailtrap, etc.)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**
```bash
cp .env.example .env
```
Fill in your values in `.env`

**4. Start the server:**
```bash
# development
npm run dev

# production
npm start
```

Server runs at `http://localhost:4000` ✅

---

## 🔐 Environment Variables

```dotenv
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/yourdbname

# JWT
JWT_ACCESS_SECRET=your_strong_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_strong_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com

# Client
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` to GitHub. Use `.env.example` as a template.

**Recommended SMTP providers:**

| Provider | Best for |
|---|---|
| Mailtrap | Development & testing 🧪 |
| Gmail | Small projects |
| Resend | Production (modern) |
| SendGrid | Production at scale |

---

## 📡 API Endpoints

Base URL: `/api/auth`

### Public Routes

| Method | Endpoint | Description | Body |
|---|---|---|---|
| POST | `/register` | Register new user | `name, email, password, role` |
| POST | `/login` | Login user | `email, password` |
| POST | `/refresh` | Refresh access token | cookie: `refreshToken` |
| GET | `/verify/:token` | Verify email address | token in URL |
| POST | `/forgot-password` | Send password reset email | `email` |

### Protected Routes (login required)

| Method | Endpoint | Description | Header |
|---|---|---|---|
| GET | `/me` | Get current user profile | `Authorization: Bearer <token>` |
| POST | `/logout` | Logout user | `Authorization: Bearer <token>` |

---

### Request & Response Examples

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "password": "secret123",
  "role": "customer"
}
```
```json
{
  "success": true,
  "message": "Registration Success",
  "data": {
    "_id": "64abc123...",
    "name": "Priya Kumar",
    "email": "priya@example.com",
    "role": "customer",
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "secret123"
}
```
```json
{
  "success": true,
  "message": "Login Successful",
  "data": {
    "user": {
      "name": "Priya Kumar",
      "email": "priya@example.com",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```
> 🍪 `refreshToken` is automatically set as an HTTP-only cookie

---

**Forgot Password**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "priya@example.com"
}
```
```json
{
  "success": true,
  "message": "If this email exists you will receive a reset link"
}
```
> 🔒 Same response whether email exists or not — prevents email enumeration attacks

---

**Protected Route**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```
```json
{
  "success": true,
  "message": "User Profile",
  "data": {
    "name": "Priya Kumar",
    "email": "priya@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

---

## 🔄 Authentication Flow

### Registration & Email Verification
```
POST /register
      ↓
Validate input (Joi DTO)
      ↓
Check duplicate email
      ↓
Hash password (bcrypt, 12 rounds)
      ↓
Generate verificationToken (SHA256 hashed → saved in DB)
      ↓
Send verification email with rawToken 📧
  fails? → rollback token → throw 500
      ↓
Return clean user (no password, no token)

GET /verify/:token
      ↓
Hash rawToken → compare with DB
      ↓
isVerified = true, clear token
      ↓
User can now login ✅
```

### Login & Token Flow
```
POST /login
      ↓
Find user → comparePassword() → check isVerified
      ↓
Generate accessToken (15m) + refreshToken (7d)
      ↓
Hash refreshToken → save to DB
      ↓
accessToken  → response body
refreshToken → HTTP-only cookie 🍪

Every Protected Request:
Authorization: Bearer accessToken
      ↓
authenticate middleware → verify JWT → attach req.user
      ↓
Controller runs ✅

POST /refresh (when access token expires)
      ↓
Verify refreshToken + compare hash in DB
      ↓
Generate NEW tokens → save new hash
      ↓
Old token invalidated 🔒 → return new tokens ✅
```

### Forgot Password Flow
```
POST /forgot-password { email }
      ↓
Find user (vague response if not found 🔒)
      ↓
Generate resetToken → save hash + 15min expiry to DB
      ↓
Send reset email 📧
  fails? → rollback → throw 500
      ↓
User clicks link → POST /reset-password { token, newPassword }
      ↓
Hash token → find user → check expiry
      ↓
Hash new password → save → clear reset fields
      ↓
Password reset ✅
```

---

## 🔒 Security Measures

| Measure | Implementation | Protects Against |
|---|---|---|
| Password hashing | bcryptjs 12 rounds | Plain text exposure |
| Token hashing | SHA256 before DB save | Token theft from DB |
| Token rotation | New refresh token each use | Token replay attacks |
| HTTP-only cookies | `httpOnly: true` | XSS attacks |
| Secure cookies | `secure: true` | Network interception |
| SameSite cookies | `sameSite: "strict"` | CSRF attacks |
| `select: false` | Sensitive DB fields hidden | Accidental data leaks |
| Vague error messages | Same response for missing email | Email enumeration |
| Email rollback | Undo DB changes if email fails | Orphaned tokens in DB |
| Short access token | Expires in 15 minutes | Token theft damage |
| Input validation | Joi DTOs on all routes | Invalid/malicious input |
| Role-based access | `authorize()` middleware | Privilege escalation |

---

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Type | When |
|---|---|---|
| 400 | Bad Request | Invalid or missing input |
| 401 | Unauthorized | Not logged in / invalid token |
| 403 | Forbidden | Logged in but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Internal Server Error | Unexpected server error |

---

## 👨‍💻 Author

**Satyam Prakash**
- GitHub: [@satyamprakash06](https://github.com/satyamprakash06)
- LinkedIn: [satyamprakash06](https://linkedin.com/in/satyamprakash06)
- Twitter/X: [@satyamdotcom](https://x.com/satyamdotcom)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built while learning backend development step by step 🚀
> Every line of code understood — not just copy-pasted. 
