import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Register() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        name:'',
        email: '',
        password: '',
        phoneno: '',

    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        phoneno: Yup.string().required('Phone Number is required'),
        name: Yup.string().required('Name is required'),
    });


    const onSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://localhost:5000/auth/register', values);
            console.log(response);
            console.log(response.data);
            console.log(response.status);
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                const validationErrors = response.data.validation;
                if (validationErrors) {
                    setErrors(validationErrors);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const validationErrors = error.response.data.msg;
                    toast.error(validationErrors);
                    setErrors(validationErrors);
                } else {
                    // Handle other types of errors
                    setErrors({ server: 'An unexpected error occurred' });
                    console.error('Unexpected error:', error.message);
                }
            } else {
                // The request was made but no response was received
                console.error('Error submitting form:', error.message);
                setErrors({ server: 'An unexpected error occurred' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    /*********Password Hide and show*******************/
    // const togglePasswordVisibility = () => {
    //     setShowPassword(!showPassword);
    // };

    return (
        <>
            <ToastContainer />
            <div className='bg-gray-50 dark:bg-gray-200 min-h-screen'>
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({ isSubmitting }) => (
                            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
                                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>Register Page</h1>
                                    <Form className="space-y-4 md:space-y-6">
                                    <div>
                                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                            <Field 
                                                type="text" 
                                                name="name" 
                                                id="name" 
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Daniel" 
                                                required=""
                                             />
                                            <ErrorMessage name="name" component="span" className="super text-red-700" />
                                        </div>
                                        <div>
                                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                            <Field 
                                                type="email" 
                                                name="email" 
                                                id="email" 
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="name@gmail.com" 
                                                required=""
                                             />
                                            <ErrorMessage name="email" component="span" className="super text-red-700" />
                                        </div>
                                        <div>
                                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <Field
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="••••••••"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required="" 
                                            />
                                            <ErrorMessage name="password" component="span" className="super text-red-700" />
                                        </div>
                                        <div>
                                            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                            <Field
                                                type="text"
                                                name="phoneno"
                                                id="phoneno"
                                                placeholder="73****"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required="" 
                                            />
                                            <ErrorMessage name="phoneno" component="span" className="super text-red-700" />
                                        </div>
                                       
                                        <button type="submit" class="w-full text-white bg-sky-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Register</button>
                                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                          Already account? <Link to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                                        </p>
                                    </Form>
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}