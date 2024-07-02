// src/components/PaymentForm.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const response = await fetch('https://your-backend-api.com/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payment_method_id: paymentMethod.id }),
        });

        const paymentResult = await response.json();

        if (paymentResult.error) {
            setError(paymentResult.error);
        } else {
            onPaymentSuccess(paymentResult);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Payment</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
        </form>
    );
};

const PaymentForm = ({ onPaymentSuccess }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </Elements>
);

export default PaymentForm;
