# JWT Authentication React App

A modern React-based authentication application with login and signup functionality using JWT tokens and secure HTTP-only cookies.

## Features

✅ User login with email and password  
✅ User registration with validation  
✅ Password visibility toggle  
✅ Form validation with error messages  
✅ Loading states and feedback messages  
✅ HTTP-only cookie authentication  
✅ Dashboard with user info  
✅ Modern glassmorphism UI design  
✅ Responsive layout  
✅ Protected routes (ready to implement)  

## Project Structure

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BackgroundElements.js
│   │   ├── Button.js
│   │   ├── InputField.js
│   │   └── Message.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   └── DashboardPage.js
│   ├── services/
│   │   └── authService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation

```bash
cd frontend-react
npm install
```

## Running the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Make sure your backend is running

Backend should be running on `http://localhost:8000` with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

## Components Overview

### InputField
Reusable input component with icon, label, error handling, and password visibility toggle.

### Button
Reusable button component with loading state and disabled state.

### Message
Alert component for displaying success and error messages with auto-hide functionality.

### BackgroundElements
Decorative animated background with gradient spheres.

## Pages

### LoginPage
- Email and password input
- Remember me checkbox
- Forgot password link
- Loading state
- Success/error messages
- Link to signup page
- Redirects to dashboard on successful login

### SignupPage
- Full name input
- Email input
- Password input with strength indicator
- Confirm password input
- Form validation with field-level errors
- Loading state
- Success/error messages
- Link to login page
- Redirects to login on successful signup

### DashboardPage
- Displays logged-in user information
- Logout button

## Authentication Flow

1. User enters credentials on Login/Signup page
2. Credentials are sent to backend API
3. Backend validates and returns JWT token (in HTTP-only cookie)
4. User data is saved to sessionStorage
5. User is redirected to dashboard
6. Protected routes can check user session

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm build`
Builds the app for production to the `build` folder

### `npm test`
Runs the test suite

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.0
- CSS3 with custom properties
- Inter font from Google Fonts

## Notes

- Token is stored in HTTP-only cookie (more secure)
- User data is stored in sessionStorage for quick access
- All forms have real-time validation
- Loading states prevent duplicate submissions
- Error messages are scoped to individual fields
- Responsive design works on all screen sizes
