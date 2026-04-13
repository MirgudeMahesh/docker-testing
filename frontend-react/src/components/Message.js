import React, { useEffect, useState } from 'react';

const Message = ({ text, type, autoHide = true, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(!!text);

    useEffect(() => {
        if (text && autoHide) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [text, autoHide, duration]);

    useEffect(() => {
        setIsVisible(!!text);
    }, [text]);

    return (
        <div
            className={`message ${isVisible ? 'show' : 'hidden'} ${type}`}
            role="alert"
        >
            {text}
        </div>
    );
};

export default Message;
