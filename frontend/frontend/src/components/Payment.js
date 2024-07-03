// frontend/src/components/Payment.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Payment = ({ onPayment }) => {
    const initialValues = {
        amount: '',
    };

    const validationSchema = Yup.object({
        amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch('https://your-backend-api.com/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const data = await response.json();
            onPayment(data.payment);
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors }) => (
                <Form>
                    <h2>Payment</h2>
                    {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
                    <div>
                        <label>Amount</label>
                        <Field type="number" name="amount" />
                        <ErrorMessage name="amount" component="div" style={{ color: 'red' }} />
                    </div>
                    <button type="submit" disabled={isSubmitting}>Pay</button>
                </Form>
            )}
        </Formik>
    );
};

export default Payment;
