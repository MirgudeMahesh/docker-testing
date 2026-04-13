# Setup Instructions for React Frontend

## Quick Start

```bash
# 1. Navigate to the frontend-react directory
cd frontend-react

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will automatically open at `http://localhost:3000`

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Backend running on `http://localhost:8000`

## Project Architecture

### Components (Reusable)
- **InputField.js** - Form input with icon, label, error handling, and password toggle
- **Button.js** - Submit button with loading state
- **Message.js** - Alert for success/error messages with auto-hide
- **BackgroundElements.js** - Animated background with gradient spheres

### Pages (Routes)
- **LoginPage** (`/`) - Login form with email/password
- **SignupPage** (`/signup`) - Registration form with validation
- **DashboardPage** (`/dashboard`) - User profile and logout

### Services
- **authService.js** - API calls and session management

## Key Features

✅ **Form Validation** - Real-time field-level validation  
✅ **Password Toggle** - Show/hide password functionality  
✅ **Loading States** - Button feedback during API calls  
✅ **Error Handling** - Field-level and form-level errors  
✅ **Session Management** - User data stored in sessionStorage  
✅ **HTTP-Only Cookies** - JWT token stored securely  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Modern UI** - Glassmorphism design with animations  

## File Structure

```
frontend-react/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── BackgroundElements.js  # Animated background
│   │   ├── Button.js              # Submit button component
│   │   ├── InputField.js          # Form input component
│   │   └── Message.js             # Alert message component
│   ├── pages/
│   │   ├── LoginPage.js           # Login page (route: /)
│   │   ├── SignupPage.js          # Signup page (route: /signup)
│   │   └── DashboardPage.js       # Dashboard (route: /dashboard)
│   ├── services/
│   │   └── authService.js         # API and session management
│   ├── App.js                     # Main app with routing
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints Expected

Your backend should provide:

```
POST   /api/auth/login       - { email, password } → { success, message, data }
POST   /api/auth/register    - { name, email, password } → { success, message, data }
POST   /api/auth/logout      - { } → { success, message }
```

## Usage Examples

### Using InputField Component
```jsx
<InputField
    label="Email"
    type="email"
    name="email"
    value={email}
    onChange={handleChange}
    placeholder="user@example.com"
    error={errors.email}
    autoComplete="email"
/>
```

### Using Button Component
```jsx
<Button
    text="Sign In"
    loading={isLoading}
    disabled={isLoading}
    onClick={onSubmit}
/>
```

### Using Message Component
```jsx
<Message 
    text="Login successful!" 
    type="success" 
    autoHide={true}
    duration={3000}
/>
```

## Environment Variables (Optional)

Create a `.env` file if you need custom API URL:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Then update authService.js:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth';
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in the `build/` folder.

## Troubleshooting

**Error: "Cannot connect to server"**
- Make sure backend is running on port 8000
- Check CORS is enabled on backend
- Verify API endpoints are correct

**Form not submitting**
- Check browser console for errors
- Ensure all required fields are filled
- Verify form validation logic

**Styles not applying**
- Restart dev server: `npm start`
- Clear browser cache: Ctrl+Shift+Delete
- Check that index.css is imported in index.js

## Next Steps

1. Set up protected routes (redirect unauthenticated users)
2. Add password reset functionality
3. Add email verification
4. Implement refresh token rotation
5. Add 2FA support
6. Connect to additional backend endpoints
