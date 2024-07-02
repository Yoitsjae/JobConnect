// src/components/JobListing.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import JobListing from './JobListing';

test('renders job listing component', () => {
    render(<JobListing />);
    const linkElement = screen.getByText(/Job Listings/i);
    expect(linkElement).toBeInTheDocument();
});
