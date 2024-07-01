// src/components/JobListing.js
import React, { useState, useEffect } from 'react';
import JobApplication from './JobApplication';

const JobListing = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetch('https://your-backend-api.com/jobs')
            .then((response) => response.json())
            .then((data) => setJobs(data))
            .catch((error) => console.error('Error fetching job listings:', error));
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleLocationFilter = (e) => {
        setLocationFilter(e.target.value);
    };

    const handleJobTypeFilter = (e) => {
        setJobTypeFilter(e.target.value);
    };

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        job.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
        job.jobType.toLowerCase().includes(jobTypeFilter.toLowerCase())
    );

    return (
        <div>
            <h2>Job Listings</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <input
                    type="text"
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChange={handleLocationFilter}
                />
                <select value={jobTypeFilter} onChange={handleJobTypeFilter}>
                    <option value="">All Job Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                </select>
            </div>
            <ul>
                {filteredJobs.map((job) => (
                    <li key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.location}</p>
                        <p>{job.jobType}</p>
                        <button onClick={() => setSelectedJob(job)}>Apply</button>
                    </li>
                ))}
            </ul>
            {selectedJob && (
                <JobApplication jobId={selectedJob.id} onApplicationSubmit={(application) => {
                    console.log('Application submitted:', application);
                    setSelectedJob(null);
                }} />
            )}
        </div>
    );
};

export default JobListing;
