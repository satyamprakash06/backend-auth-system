# 🚀 RESTful API — Node.js Backend

A production-ready RESTful API built with Node.js, Express, and MongoDB featuring a complete JWT authentication system.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Security](#security)

---

## ✨ Features

- ✅ User registration with email verification
- ✅ JWT authentication (access + refresh tokens)
- ✅ Refresh token rotation
- ✅ Role-based access control (customer, seller, admin)
- ✅ Forgot password & reset password flow
- ✅ HTTP-only cookie token delivery
- ✅ Request validation with Joi DTOs
- ✅ Password hashing with bcrypt
- ✅ Email service with Nodemailer
- ✅ Global error handling middleware
- ✅ Clean service/controller architecture

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Nodemailer | Email service |
| cookie-parser | Cookie handling |
| dotenv | Environment variables |
| crypto | Token hashing |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                        # Express app setup
│   ├── common/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── dto/
│   │   │   └── base.dto.js           # Base DTO with Joi validation
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # authenticate & authorize
│   │   │   ├── validation.middleware.js  # request validation
│   │   │   └── error.middleware.js   # global error handler
│   │   └── utils/
│   │       ├── api-error.js          # custom error class
│   │       ├── api-response.js       # consistent response helper
│   │       ├── async-handler.js      # async error wrapper
│   │       ├── jwt.utils.js          # token generation & verification
│   │       └── email.utils.js        # nodemailer email service
│   └── features/
│       └── auth/
│           ├── auth.model.js         # User mongoose schema
│           ├── auth.service.js       # business logic
│           ├── auth.controller.js    # request/response handling
│           ├── auth.router.js        # route definitions
│           └── dto/
│               └── register.dto.js  # registration validation rules
├── server.js                         # entry point
├── .env                              # environment variables
├── .env.example                      # environment variable template
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

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
Fill in your values in the `.env` file (see [Environment Variables](#environment-variables))

**4. Start the server:**
```bash
# development
npm run dev

# production
npm start
```

Server runs at `http://localhost:4000`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```dotenv
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/yourdbname

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com

# Client
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env` file to GitHub. It's already in `.gitignore`.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| POST | `/refresh` | Refresh access token | ❌ |
| POST | `/forgot-password` | Send reset email | ❌ |
| POST | `/reset-password` | Reset password | ❌ |
| GET | `/profile` | Get user profile | ✅ |

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
> Refresh token is set automatically as an HTTP-only cookie 🍪

---

**Protected Route**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

### Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — invalid/missing input |
| 401 | Unauthorized — not logged in or invalid token |
| 403 | Forbidden — logged in but no permission |
| 404 | Not Found — resource doesn't exist |
| 409 | Conflict — resource already exists |
| 500 | Internal Server Error |

---

## 🔄 Authentication Flow

```
REGISTER:
  POST /register → validate → hash password
  → generate verification token → send email → save user

LOGIN:
  POST /login → validate → check password
  → check isVerified → generate tokens
  → save hashed refresh token → return tokens

PROTECTED REQUEST:
  Request + Bearer token → verify JWT
  → find user → attach req.user → proceed

TOKEN REFRESH:
  POST /refresh + cookie → verify refresh token
  → compare hash → rotate tokens → return new tokens

LOGOUT:
  POST /logout → clear refresh token in DB
  → clear cookies → session ended
```

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with 12 salt rounds |
| Token storage | Refresh tokens hashed (SHA256) before saving |
| Token rotation | New refresh token generated on every refresh |
| HTTP-only cookies | Prevents JavaScript access (XSS protection) |
| Secure cookies | HTTPS only in production |
| Field hiding | `select: false` on sensitive DB fields |
| Input validation | Joi validation on all incoming requests |
| Unknown field stripping | `stripUnknown: true` in Joi config |
| Role-based access | authorize() middleware checks user role |
| Token expiry | Access: 15m / Refresh: 7d |

---

## 👨‍💻 Author

**Satya**
- GitHub: [@yourusername](https://github.com/satyamprakash06)
- LinkedIn: [your-linkedin](https://linkedin.com/in/satyamprakash06)
- Twitter/X: [@yourhandle](https://x.com/satyamdotcom)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built while learning backend development step by step 🚀
