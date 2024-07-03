// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import JobListing from './components/JobListing';
import JobPosting from './components/JobPosting';
import JobApplication from './components/JobApplication';
import Payment from './components/Payment';
import Notification from './components/Notification';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Assume the user is authenticated if there's a token
            setUser({ token });
        }
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleLogin = (user) => {
        setUser(user);
        showNotification('Successfully logged in', 'success');
    };

    const handleRegister = (user) => {
        setUser(user);
        showNotification('Successfully registered', 'success');
    };

    const handleJobPost = (job) => {
        console.log('Job posted:', job);
        showNotification('Job successfully posted', 'success');
    };

    const handlePayment = (payment) => {
        console.log('Payment successful:', payment);
        showNotification('Payment successful', 'success');
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Notification message={notification.message} type={notification.type} />
                <Switch>
                    <Route path="/" exact component={LandingPage} />
                    <Route path="/login">
                        {user ? <Redirect to="/" /> : <Login onLogin={handleLogin} />}
                    </Route>
                    <Route path="/register">
                        {user ? <Redirect to="/" /> : <Register onRegister={handleRegister} />}
                    </Route>
                    <Route path="/jobs" component={JobListing} />
                    <Route path="/post-job">
                        {user ? <JobPosting onJobPost={handleJobPost} /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/apply-job">
                        {user ? <JobApplication /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/payment">
                        {user ? <Payment onPayment={handlePayment} /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
