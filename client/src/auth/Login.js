import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosChatbubbles } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ChatICon from '../assets/chat-icon.png'

export default function Login() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });


    const onSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', values);
            if (response.status === 200) {
                const token = sessionStorage.setItem('token', response.data.token);
                toast.success(response.data.message);
                navigate('/app');
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
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <ToastContainer />
                <div class="min-h-screen flex items-center justify-center bg-zinc-100 ">
                    <div class=" flex flex-col md:flex-row max-w-4xl w-full p-6 md:p-12">
                        <div class="flex-1 flex items-center justify-center">
                            <img src={ChatICon} alt="Illustration" class="w-full h-auto" />
                        </div>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {({ isSubmitting }) => (
                                <div class="flex-1 mt-6 md:mt-0 md:ml-6">
                                    <h2 class="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-700">Log<span class="text-green-500">in</span></h2>
                                    <Form>
                                        <div class="mb-4">
                                            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Email</label>
                                            <Field type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="arman@gmail.com" />
                                            <ErrorMessage name="email" component="span" className="super text-sm text-red-500" />
                                        </div>
                                        <div class="mb-4 relative">
                                            <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Password</label>
                                            <Field type={showPassword ? "text" : "password"} id="password" name="password" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="123456" />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 top-0 pr-3 flex items-center text-sm leading-5"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </button>
                                            <ErrorMessage name="password" component="span" className="super text-sm text-red-600" />
                                        </div>
                                        <div class="flex items-center justify-between mb-4">
                                            <label class="flex items-center">
                                                <Field type="checkbox" class="h-4 w-4 text-green-600 border-zinc-300 rounded focus:ring-green-500" />
                                                <span class="ml-2 block text-sm text-zinc-900 dark:text-zinc-700">I accept the terms and conditions</span>
                                            </label>
                                            <a href="#" class="text-sm text-green-500 hover:underline">Forgot Password?</a>
                                        </div>
                                        <button type="submit" class="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Login</button>
                                    </Form>
                                    <p class="text-sm font-light text-black dark:text-black mt-1">
                                        Don’t have an account yet? <Link to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                                    </p>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
        </>
    )
}