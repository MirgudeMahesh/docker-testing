import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Message from '../components/Message';
import authService from '../services/authService';

const nameIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

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

const shieldIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match.';
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
            const response = await authService.register(
                formData.name.trim(),
                formData.email.trim(),
                formData.password
            );

            if (response.success) {
                setMessage({ 
                    text: response.message || 'Account created! Redirecting to login...', 
                    type: 'success' 
                });
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setMessage({ 
                    text: response.message || 'Registration failed. Try again.', 
                    type: 'error' 
                });
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage({ 
                text: error.message || 'Cannot connect to server. Is your backend running on port 8000?', 
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
                        <h2>Create Account</h2>
                        <p>Sign up to get started today</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <InputField
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            error={errors.name}
                            icon={nameIcon}
                            autoComplete="name"
                            required
                        />

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
                            placeholder="Min. 6 characters"
                            error={errors.password}
                            icon={passwordIcon}
                            autoComplete="new-password"
                            required
                            showPasswordToggle
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            error={errors.confirmPassword}
                            icon={shieldIcon}
                            autoComplete="new-password"
                            required
                            showPasswordToggle
                        />

                        <Button
                            text="Create Account"
                            loading={loading}
                            disabled={loading}
                        />
                    </form>

                    <Message text={message.text} type={message.type} />

                    <p className="switch-page">
                        Already have an account? <Link to="/">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
