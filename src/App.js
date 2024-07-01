// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import JobListing from './components/JobListing';
import JobPosting from './components/JobPosting';
import PaymentForm from './components/PaymentForm';
import Notification from './components/Notification';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (user) => {
        setUser(user);
    };

    const handleRegister = (user) => {
        setUser(user);
    };

    const handleJobPost = (job) => {
        console.log('Job posted:', job);
    };

    const handlePaymentSuccess = (paymentResult) => {
        console.log('Payment successful:', paymentResult);
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
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
                    <Route path="/payment">
                        {user ? <PaymentForm onPaymentSuccess={handlePaymentSuccess} /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/notifications">
                        {user ? <Notification /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
