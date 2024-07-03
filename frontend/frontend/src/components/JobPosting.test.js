// frontend/src/components/JobPosting.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobPosting from './JobPosting';

test('renders JobPosting form and handles submission', async () => {
    const onJobPost = jest.fn();

    render(<JobPosting onJobPost={onJobPost} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Job Description' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Remote' } });
    fireEvent.change(screen.getByLabelText(/job type/i), { target: { value: 'full-time' } });

    fireEvent.click(screen.getByText(/post job/i));

    // Add further assertions based on your form submission logic
});
