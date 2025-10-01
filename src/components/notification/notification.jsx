"use client";
import { useState, useEffect } from 'react';
import './notification.scss'; 

const Notification = ({ message, type = 'success', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible || !message) return null;

  return (
    <div className={`notification notification--${type}`}>
      <span className="notification__icon">
        {type === 'success' ? '✅' : '❌'}
      </span>
      {message}
    </div>
  );
};

export default Notification;