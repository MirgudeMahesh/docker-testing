# 🔗 Frontend + Backend Connection Guide

This document explains how the frontend (React) and backend (Express) are connected.

## 🏗️ Architecture

```
Frontend (React)                Backend (Express)
├── localhost:3000              ├── localhost:8000
├── Axios Requests              ├── REST API
└── withCredentials: true       └── HTTP-only Cookies
        ↕ (HTTP Requests)
```

## 📡 API Connection Points

### Frontend → Backend Communication

The frontend communicates with the backend through these API endpoints:

```javascript
// Base URL
http://localhost:8000/api/auth

// Endpoints
POST   /login       → Login with email/password
POST   /register    → Create new account
POST   /logout      → Logout and clear session
```

### Configuration

**Frontend (React):**
- Default API URL: `http://localhost:8000/api/auth`
- Can be overridden via `.env` file: `REACT_APP_API_URL`
- Axios instance uses `withCredentials: true` for cookie transfer

**Backend (Express):**
- Port: `8000` (default)
- CORS enabled for frontend URL (default: `http://localhost:3000`)
- Can be configured via `.env`: `FRONTEND_URL`

## 🍪 Cookie & Authentication Flow

### 1. Login Flow
```
User (React) → POST /login
         ↓
Backend validates credentials
         ↓
Backend creates JWT token
         ↓
Response with Set-Cookie header
         ↓
Browser automatically stores cookie
         ↓
User redirected to /dashboard
```

### 2. Subsequent Requests
```
User navigates/makes requests
         ↓
Browser automatically includes cookie
         ↓
Backend reads token from cookie
         ↓
Request authenticated ✅
```

### 3. Logout Flow
```
User clicks logout (React)
         ↓
POST /logout sent with cookie
         ↓
Backend clears cookie
         ↓
Response with Set-Cookie: expires=0
         ↓
Browser removes cookie
         ↓
User redirected to /login
```

## 🔐 Security Details

### HTTP-Only Cookies
- ✅ Cannot be accessed by JavaScript (protects from XSS)
- ✅ Automatically sent with requests (`withCredentials: true`)
- ✅ CSRF protected with `sameSite: strict`

### CORS Settings
```javascript
// Backend CORS configuration
{
    origin: 'http://localhost:3000',    // Frontend URL
    credentials: true,                  // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
```

### Request Headers (Auto-included by browser)
```
GET /api/auth/profile HTTP/1.1
Host: localhost:8000
Cookie: token=eyJhbGc...(httpOnly)
Origin: http://localhost:3000
Content-Type: application/json
```

## ⚙️ Environment Setup

### Backend (.env)
```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=jwt_auth

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api/auth
REACT_APP_ENV=development
```

## 🚀 Startup Guide

### 1. Start Backend
```bash
cd backend
npm install      # First time only
npm run dev      # Development with auto-reload
# or
npm start        # Production
```

Expected output:
```
✅ Server running on http://localhost:8000
📱 Frontend connected from: http://localhost:3000
```

### 2. Start Frontend (in new terminal)
```bash
cd frontend-react
npm install      # First time only (might take 5+ minutes)
npm start        # Development server
```

Expected flow:
1. Browser opens to `http://localhost:3000`
2. You see the Login page
3. Try registering a new account
4. Login with credentials
5. See Dashboard with user info

## 🔄 Data Flow Examples

### Registration Flow
```
1. User fills registration form (React)
   ├─ name: "John Doe"
   ├─ email: "john@example.com"
   └─ password: "password123"

2. Frontend validates locally → sends to backend

3. Backend (POST /api/auth/register)
   ├─ Validate input
   ├─ Check if email exists
   ├─ Hash password with bcrypt
   ├─ Save to database
   └─ Return success

4. Frontend receives response
   ├─ Show success message
   └─ Redirect to login (/login)

5. User manually logs in with credentials
```

### Login Flow
```
1. User enters email & password (React)

2. Frontend (Axios)
   ├─ POST request to /api/auth/login
   ├─ Include { email, password }
   └─ withCredentials: true (auto-send cookies)

3. Backend (POST /api/auth/login)
   ├─ Validate input
   ├─ Query database for user
   ├─ Compare password hash
   ├─ Generate JWT token
   ├─ Set HTTP-only cookie response
   └─ Return user data (no token in body)

4. Browser receives response
   ├─ Automatically stores Set-Cookie header
   └─ Saves token in HTTP-only cookie

5. Frontend receives response
   ├─ Save user to sessionStorage
   ├─ Show success message
   └─ Redirect to /dashboard

6. User on Dashboard
   ├─ Can see their info
   ├─ Cookie auto-sent with logout request
   └─ Click logout to clear session
```

## 🧪 Testing Connection

### Test with cURL (from non-frontend terminal)

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -b cookies.txt
```

### Test in Browser (DevTools)

1. Open Developer Tools (F12)
2. Go to Application → Cookies → localhost:3000
3. After login, you should NOT see a `token` cookie (it's on localhost:8000)
4. Check Application → Cookies → localhost:8000 to see the HTTP-only token

## 🐛 Troubleshooting Connection

### Frontend can't reach backend
**Problem:** `CORS error` or `Cannot reach server`

**Solutions:**
- Ensure backend is running: `npm run dev` in backend folder
- Check backend port is 8000 (not 5000 or other)
- Verify `FRONTEND_URL` in backend/.env matches frontend URL
- Firewall might block port 8000 (disable temporarily for testing)

### Login succeeds but no dashboard
**Problem:** Logged in but redirect doesn't work

**Solutions:**
- Check React Router setup (`<Routes>` component)
- Verify session storage has user data (DevTools → Application → Session Storage)
- Check browser console for JavaScript errors

### Cookie not being stored
**Problem:** "No token found" (401) on logged-in requests

**Solutions:**
- Verify `withCredentials: true` in axios instance
- Check `credentials: true` in backend CORS config
- Ensure cookie is HTTP-only (try to access in console `document.cookie` - should be empty)

### Database not connecting
**Problem:** "DB connection failed" when starting backend

**Solutions:**
- Start MySQL service
- Verify database credentials in .env
- Run SQL setup script in allinone.txt
- Check MySQL is running on port 3306

## 📈 Scaling Considerations

### Single Domain (Production)
If both frontend and backend run on same domain:
```
Example: myapp.com
├── Frontend: myapp.com (served by nginx/apache)
└── Backend: myapp.com/api (proxied to :8000)

CORS config becomes simpler (same domain)
Cookie sharing is automatic
```

### Separate Domains (Production)
If frontend and backend on different domains:
```
Frontend: app.mysite.com
Backend: api.mysite.com

CORS must explicitly allow cross-domain
Cookies need domain specification
```

## 📚 Related Files

- Frontend Core: [frontend-react/README.md](../frontend-react/README.md)
- Backend Core: [backend/README.md](../backend/README.md)
- Frontend Config: [frontend-react/src/services/authService.js](../frontend-react/src/services/authService.js)
- Backend Config: [backend/data.js](../backend/data.js)
- Backend Routes: [backend/routes/auth.routes.js](../backend/routes/auth.routes.js)

## ✅ Connection Checklist

- [ ] Backend running on localhost:8000
- [ ] Frontend running on localhost:3000
- [ ] Database connection successful (MySQL running)
- [ ] `.env` files created in both folders
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Cookie appears in browser after login
- [ ] Can view dashboard after login
- [ ] Can logout successfully
- [ ] Redirected to login after logout

---

**Still having issues?** Check the individual README files in [backend/README.md](../backend/README.md) and [frontend-react/README.md](../frontend-react/README.md) for detailed troubleshooting.
