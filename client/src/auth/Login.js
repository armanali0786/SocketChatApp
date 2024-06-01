import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosChatbubbles } from "react-icons/io";
import { FaEye , FaEyeSlash} from "react-icons/fa";

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
            <div className='bg-gray-50 dark:bg-[#467F8E] min-h-screen'>
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({ isSubmitting }) => (
                            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#f8f2ee] dark:border-gray-700">
                                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black flex items-start space-x-2">
                                        Welcome Back <span className='ml-2'><IoIosChatbubbles /></span>
                                    </h1>
                                    <Form className="space-y-4 md:space-y-6">
                                        <div>
                                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                id="email"
                                                class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:text-black dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="name@gmail.com"
                                                required=""
                                            />
                                            <ErrorMessage name="email" component="span" className="super text-red-700" />
                                        </div>
                                        <div className='relative'>
                                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                                            <Field
                                               type={showPassword ? "text" : "password"}
                                                name="password"
                                                id="password"
                                                placeholder="••••••••"
                                                class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required=""
                                            />
                                            <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <FaEye/> : <FaEyeSlash/>}
                                                </button>
                                            <ErrorMessage name="password" component="span" className="super text-red-700" />
                                        </div>
                                        <button type="submit" class="w-full text-white bg-sky-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login in</button>
                                        <p class="text-sm font-light text-black dark:text-black">
                                            Don’t have an account yet? <Link to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
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