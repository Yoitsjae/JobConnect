// frontend/src/components/JobApplication.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobApplication from './JobApplication';

test('renders JobApplication form and handles submission', async () => {
    const onApplicationSubmit = jest.fn();

    render(<JobApplication jobId={1} onApplicationSubmit={onApplicationSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/cover letter/i), { target: { value: 'Cover Letter' } });

    fireEvent.click(screen.getByText(/apply/i));

    // Add further assertions based on your form submission logic
});
