// frontend/src/components/JobPosting.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const JobPosting = ({ onJobPost }) => {
    const initialValues = {
        title: '',
        description: '',
        location: '',
        jobType: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        location: Yup.string().required('Location is required'),
        jobType: Yup.string().required('Job type is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch('https://your-backend-api.com/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to post job');
            }

            const data = await response.json();
            onJobPost(data.job);
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
                    <h2>Post a Job</h2>
                    {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
                    <div>
                        <label>Title</label>
                        <Field type="text" name="title" />
                        <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <label>Description</label>
                        <Field as="textarea" name="description" />
                        <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <label>Location</label>
                        <Field type="text" name="location" />
                        <ErrorMessage name="location" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <label>Job Type</label>
                        <Field as="select" name="jobType">
                            <option value="">Select Job Type</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                        </Field>
                        <ErrorMessage name="jobType" component="div" style={{ color: 'red' }} />
                    </div>
                    <button type="submit" disabled={isSubmitting}>Post Job</button>
                </Form>
            )}
        </Formik>
    );
};

export default JobPosting;
