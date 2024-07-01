// src/components/JobPosting.js
import React, { useState } from 'react';

const JobPosting = ({ onJobPost }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://your-backend-api.com/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, description, location, jobType }),
            });

            if (!response.ok) {
                throw new Error('Failed to post job');
            }

            const data = await response.json();
            onJobPost(data.job);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Post a Job</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Job Type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                    <option value="">Select Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                </select>
            </div>
            <button type="submit">Post Job</button>
        </form>
    );
};

export default JobPosting;
