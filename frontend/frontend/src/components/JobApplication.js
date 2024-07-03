// frontend/src/components/JobApplication.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const JobApplication = ({ jobId, onApplicationSubmit }) => {
    const initialValues = {
        name: '',
        email: '',
        coverLetter: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        coverLetter: Yup.string().required('Cover letter is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`https://your-backend-api.com/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to apply for job');
            }

            const data = await response.json();
            onApplicationSubmit(data.application);
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
                    <h2>Apply for Job</h2>
                    {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
                    <div>
                        <label>Name</label>
                        <Field type="text" name="name" />
                        <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <label>Email</label>
                        <Field type="email" name="email" />
                        <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <label>Cover Letter</label>
                        <Field as="textarea" name="coverLetter" />
                        <ErrorMessage name="coverLetter" component="div" style={{ color: 'red' }} />
                    </div>
                    <button type="submit" disabled={isSubmitting}>Apply</button>
                </Form>
            )}
        </Formik>
    );
};

export default JobApplication;
