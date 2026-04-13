import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Message from '../components/Message';
import authService from '../services/authService';

const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const passwordIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);
            
            if (response.success) {
                if (response.data?.user) {
                    authService.setUser(response.data.user);
                }
                setMessage({ 
                    text: response.message || 'Login successful! Redirecting...', 
                    type: 'success' 
                });
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMessage({ 
                    text: response.message || 'Login failed. Please check your credentials.', 
                    type: 'error' 
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage({ 
                text: error.message || 'Unable to connect to server. Is your backend running on port 8000?', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <InputField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            error={errors.email}
                            icon={emailIcon}
                            autoComplete="email"
                            required
                        />

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.password}
                            icon={passwordIcon}
                            autoComplete="current-password"
                            required
                            showPasswordToggle
                        />

                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <button type="button" className="forgot-password" onClick={(e) => e.preventDefault()}>
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            text="Sign In"
                            loading={loading}
                            disabled={loading}
                        />
                    </form>

                    <Message text={message.text} type={message.type} />

                    <p className="switch-page">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
