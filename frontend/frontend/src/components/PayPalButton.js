// src/components/PayPalButton.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess, onError }) => {
    const paypalOptions = {
        'client-id': 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal Client ID
        currency: 'USD', // Change currency as needed
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                            },
                        }],
                    });
                }}
                onApprove={(data, actions) => onSuccess(data)}
                onError={(err) => onError(err)}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
