# JWT Authentication Backend API

A secure Express.js backend API for JWT-based authentication with MySQL database. Features HTTP-only cookie storage for JWT tokens and full CORS support for frontend integration.

## 🚀 Features

✅ User registration and login  
✅ JWT token authentication with HTTP-only cookies  
✅ Password hashing with bcrypt  
✅ Email validation  
✅ Protected routes with authentication middleware  
✅ Error handling middleware  
✅ CORS enabled for React frontend  
✅ MySQL database integration  
✅ Environment variables configuration  
✅ Graceful error responses  

## 📋 Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- npm

## 🔧 Installation

```bash
# 1. Clone or extract the project
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Update .env with your database credentials
# Edit .env file and set:
#   - DB_HOST
#   - DB_USER
#   - DB_PASSWORD
#   - DB_NAME
#   - JWT_SECRET

# 5. Create database and tables
# Run the SQL script in allinone.txt to set up the database
```

## 🗄️ Database Setup

Run the following SQL to set up the database:

```sql
CREATE DATABASE jwt_auth;
USE jwt_auth;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server will run on `http://localhost:8000` by default.

## 📡 API Endpoints

### 1. Register User
**POST** `/api/auth/register`

Request body:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

Response (201 Created):
```json
{
    "success": true,
    "message": "Account created successfully! Please login.",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
}
```

---

### 2. Login User
**POST** `/api/auth/login`

Request body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response (200 OK):
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "created_at": "2026-04-13T10:00:00.000Z"
        }
    }
}
```

**Note:** JWT token is sent as an HTTP-only cookie (not in response body for security)

---

### 3. Logout User
**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

## 🛡️ Security Features

### HTTP-Only Cookies
- JWT tokens are stored in HTTP-only cookies
- Protected from XSS attacks (JavaScript cannot access)
- Automatically sent with each request (credentials: true)

### CORS Configuration
- Only allows requests from frontend URL (default: `http://localhost:3000`)
- Credentials enabled for cookie transfer
- Strict CORS validation

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Requires minimum 6 characters

### Authentication Middleware
- Verifies JWT token from cookies or Authorization header
- Returns 401 for invalid/expired tokens
- Protects sensitive endpoints

## 📁 Project Structure

```
backend/
├── controllers/
│   └── auth.controller.js          # Route handlers
├── middlewares/
│   ├── validate.middleware.js      # Input validation
│   ├── auth.middleware.js          # JWT verification
│   └── error.middleware.js         # Error handling
├── routes/
│   └── auth.routes.js              # Route definitions
├── services/
│   └── auth.service.js             # Business logic
├── utils/
│   └── jwt.util.js                 # JWT utilities
├── db.js                           # Database connection
├── data.js                         # Express app setup (server)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=jwt_auth

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

## 🔄 Frontend Integration

### React Frontend Configuration

The frontend (running on `http://localhost:3000`) should:

1. Make API calls to `http://localhost:8000/api/auth`
2. Include `credentials: true` in fetch/axios requests
3. Store user data in sessionStorage (not the token!)
4. Use HTTP-only cookies for JWT storage automatically

### Example Axios Configuration

```javascript
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true  // ✅ Important: allows cookies
});

export default API;
```

## 📊 Validation Rules

### Register
- **name**: Required, non-empty string
- **email**: Required, valid email format
- **password**: Required, minimum 6 characters

### Login
- **email**: Required, valid email format
- **password**: Required

## ⚠️ Error Responses

All errors follow this format:

```json
{
    "success": false,
    "message": "Error description"
}
```

Common HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid credentials or missing token)
- **409**: Conflict (email already exists)
- **500**: Internal Server Error

## 🧪 Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -b cookies.txt
```

### Using Postman

1. Create a new request
2. Set method to POST
3. Set URL (e.g., `http://localhost:8000/api/auth/login`)
4. Go to Headers and add `Content-Type: application/json`
5. Go to Body, select JSON, and add your request data
6. Click Send

## 🐛 Troubleshooting

### "Cannot GET /"
- Server is not running. Run `npm run dev`
- Check port is not in use

### "CORS error"
- Frontend URL might not match `FRONTEND_URL` in .env
- `credentials: true` is required in frontend requests
- Check browser console for exact error

### "Database connection failed"
- Verify MySQL is running
- Check DB credentials in .env match your setup
- Ensure database exists (run SQL setup script)

### "Invalid token"
- Token might be expired (check JWT_EXPIRES_IN)
- Check token is being sent in correct format
- Try logging in again to get new token

## 🚀 Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in .env
2. Generate a strong JWT_SECRET (use crypto-random generator)
3. Set `secure: true` in cookie options (HTTPS required)
4. Update FRONTEND_URL to your production domain
5. Use environment variables from your hosting provider
6. Set up proper database backups
7. Enable HTTPS on your server

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [CORS middleware](https://www.npmjs.com/package/cors)

## 📝 License

MIT

## 👨‍💻 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.
