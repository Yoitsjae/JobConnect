// src/components/JobApplication.js
import React, { useState } from 'react';

const JobApplication = ({ jobId, onApplicationSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`https://your-backend-api.com/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name, email, coverLetter }),
            });

            if (!response.ok) {
                throw new Error('Failed to apply for job');
            }

            const data = await response.json();
            onApplicationSubmit(data.application);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Apply for Job</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Cover Letter</label>
                <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Apply</button>
        </form>
    );
};

export default JobApplication;
