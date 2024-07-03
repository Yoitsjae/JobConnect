// frontend/src/components/Payment.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Payment from './Payment';

test('renders Payment form and handles submission', async () => {
    const onPayment = jest.fn();

    render(<Payment onPayment={onPayment} />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });

    fireEvent.click(screen.getByText(/pay/i));

    // Add further assertions based on your form submission logic
});
