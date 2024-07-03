// src/components/Notification.js
import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://your-backend-api.com/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notifications">
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
