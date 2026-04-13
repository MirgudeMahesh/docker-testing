import axios from 'axios';

// ── API Configuration ──
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/auth";

// ── Create Axios Instance ──
// withCredentials: true allows cookies to be sent with requests
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ── Auth Service ──
const authService = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Response with user data
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            
            if (response.data.success && response.data.data?.user) {
                authService.setUser(response.data.data.user);
            }
            
            return response.data;
        } catch (error) {
            const errorData = error.response?.data || {
                success: false,
                message: 'Login failed. Unable to connect to server.'
            };
            throw errorData;
        }
    },

    /**
     * Register new user
     * @param {string} name - User full name
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Response with user data
     */
    register: async (name, email, password) => {
        try {
            const response = await api.post('/register', { name, email, password });
            return response.data;
        } catch (error) {
            const errorData = error.response?.data || {
                success: false,
                message: 'Registration failed. Unable to connect to server.'
            };
            throw errorData;
        }
    },

    /**
     * Logout user and clear session
     * @returns {Promise} Response
     */
    logout: async () => {
        try {
            const response = await api.post('/logout');
            
            // Clear user data from session storage
            authService.setUser(null);
            
            return response.data;
        } catch (error) {
            // Even if logout fails, clear local data
            authService.setUser(null);
            
            const errorData = error.response?.data || {
                success: false,
                message: 'Logout failed'
            };
            return errorData;
        }
    },

    /**
     * Get user from session storage
     * @returns {Object|null} User object or null
     */
    getUser: () => {
        try {
            const user = sessionStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (err) {
            console.error('Error reading user from session:', err);
            return null;
        }
    },

    /**
     * Set user in session storage
     * @param {Object|null} user - User object or null to clear
     */
    setUser: (user) => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user exists in session
     */
    isAuthenticated: () => {
        return !!authService.getUser();
    },

    /**
     * Clear all authentication data
     */
    clearAuth: () => {
        authService.setUser(null);
        sessionStorage.clear();
    }
};

export default authService;

