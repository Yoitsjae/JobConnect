// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';  // Ensure the import path is correct

const Navbar = () => {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <h1>My React App</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                {token ? (
                    <>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
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
