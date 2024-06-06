import React from 'react'
import whatsppAvtar from '../assets/whatsapp.jpg';
import { useNavigate } from 'react-router-dom';
import { ImCross } from "react-icons/im";


export default function Header({ user, toggleSidebar, isSidebarOpen }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        // const logout = sessionStorage.removeItem('token');
        // navigate('/');
    }

    return (
        <div class="w-full p-2 bg-blue-600 shadow sm:p-4">
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <li class="pt-2 pb-0 sm:pt-2">
                        <div class="flex items-center ">
                            <div class="flex-shrink-0">
                                <img class="w-8 h-8 rounded-full" src={whatsppAvtar} alt="Thomas image" />
                            </div>
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {user.name}
                                </p>
                                <p class="text-sm text-gray-500 truncate dark:text-white">
                                    {user.email}
                                </p>
                            </div>
                            {
                                isSidebarOpen && (
                                    <div className="text-sm text-red-500 bg-white p-2 rounded-md hover:text-red-600 inline-flex items-center cursor-pointer" onClick={toggleSidebar}>
                                        <ImCross />
                                    </div>
                                )
                            }
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
