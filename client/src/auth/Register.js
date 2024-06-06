import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatICon1 from '../assets/chat-icon1.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        name: '',
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
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <ToastContainer />
            <div class="min-h-screen flex items-center justify-center bg-zinc-100 ">
                <div class=" flex flex-col md:flex-row max-w-4xl w-full p-6 md:p-12">
                    <div class="flex-1 flex items-center justify-center">
                        <img src={ChatICon1} alt="Illustration" class="w-full h-auto" />
                    </div>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({ isSubmitting }) => (
                            <div class="flex-1 mt-6 md:mt-0 md:ml-6">
                                <h2 class="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-700">Sign<span class="text-green-500">Up</span></h2>
                                <Form>
                                    <div class="mb-4">
                                        <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Full Name</label>
                                        <Field type="text" id="name" name="name" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="Enter Your Name" />
                                        <ErrorMessage name="name" component="span" className="super text-sm text-red-500" />
                                    </div>
                                    <div class="mb-4">
                                        <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Email</label>
                                        <Field type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="arman@gmail.com" />
                                        <ErrorMessage name="email" component="span" className="super text-sm text-red-500" />
                                    </div>
                                    <div class="mb-4">
                                        <label for="phoneno" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Mobile No</label>
                                        <Field type="number" id="phoneno" name="phoneno" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="Enter Your Name" />
                                        <ErrorMessage name="phoneno" component="span" className="super text-sm text-red-500" />
                                    </div>
                                    <div class="mb-4 relative">
                                        <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-700">Password</label>
                                        <Field type={showPassword ? "text" : "password"} id="password" name="password" class="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm  dark:text-zinc-700" placeholder="Enter your password" />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 top-0 pr-3 flex items-center text-sm leading-5"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                        <ErrorMessage name="password" component="span" className="super text-sm text-red-600" />
                                    </div>
                                    <button type="submit" class="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">SignUp</button>
                                </Form>
                                <p class="text-sm font-light text-black dark:text-black mt-1">
                                   Already Account? <Link to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                                </p>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}