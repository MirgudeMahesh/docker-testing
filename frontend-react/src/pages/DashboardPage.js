import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const DashboardPage = () => {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Redirect if not authenticated
    if (!user) {
        navigate('/');
        return null;
    }

    const handleLogout = async () => {
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await authService.logout();
            
            setMessage({
                text: response.message || 'Logged out successfully!',
                type: 'success'
            });

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Logout error:', error);
            setMessage({
                text: error.message || 'Logout failed',
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
                        <h2>Welcome, {user?.name}! 👋</h2>
                        <p>Your account is secure and authenticated</p>
                    </div>

                    <div style={{ 
                        marginBottom: '30px', 
                        padding: '20px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                EMAIL ADDRESS
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-main)' }}>
                                {user?.email}
                            </p>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                FULL NAME
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-main)' }}>
                                {user?.name}
                            </p>
                        </div>

                        {user?.created_at && (
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    MEMBER SINCE
                                </p>
                                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-main)' }}>
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    {message.text && (
                        <div
                            className={`message ${message.type} show`}
                            style={{ marginBottom: '20px' }}
                            role="alert"
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className={`submit-btn ${loading ? 'btn-loading' : ''}`}
                        style={{ marginTop: '20px' }}
                    >
                        <span className="btn-text">
                            {loading ? 'Logging out...' : 'Sign Out'}
                        </span>
                        {loading && <span className="loader"></span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
