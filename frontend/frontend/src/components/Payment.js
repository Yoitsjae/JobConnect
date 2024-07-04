// frontend/src/components/Payment.js
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Payment = ({ onPayment }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleApprove = (details, data) => {
        // Call your backend to finalize the payment
        fetch('https://your-backend-api.com/paypal-transaction-complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                orderID: data.orderID,
                payerID: data.payerID
            }),
        })
        .then(response => response.json())
        .then(data => {
            onPayment(data);
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
            <form>
                <h2>Payment</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: amount
                                }
                            }]
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            handleApprove(details, data);
                        });
                    }}
                />
            </form>
        </PayPalScriptProvider>
    );
};

export default Payment;
