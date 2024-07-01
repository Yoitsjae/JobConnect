// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // Reloads the page after logout
    };

    return (
        <nav className="navbar">
            <h1>My React App</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                {token ? ( // If token exists (user logged in)
                    <>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : ( // If token doesn't exist (user not logged in)
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
