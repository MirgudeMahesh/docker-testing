import React from 'react';

const Button = ({ text, loading = false, disabled = false, onClick, type = 'submit' }) => {
    return (
        <button
            type={type}
            className={`submit-btn ${loading ? 'btn-loading' : ''}`}
            disabled={disabled || loading}
            onClick={onClick}
        >
            <span className="btn-text">{text}</span>
            {loading && <span className="loader"></span>}
        </button>
    );
};

export default Button;
