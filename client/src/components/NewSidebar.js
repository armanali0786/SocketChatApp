import React, { useState } from 'react'
import Header from './Header'
import UserIcon from '../assets/user.png';
import { CiChat1, CiUser } from "react-icons/ci";
import axios from 'axios';

const PATH = 'http://localhost:5000';

export default function NewSidebar({ user, onlineUsers,
    setRoomData, roomData,
    setMessageData, typingUsers
}) {
    const [value, setValue] = useState(1);
    const [selectedUser, setSelectedUser] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleChatRoom = (user) => {
        setRoomData({
            ...roomData,
            room: "test",
            receiver: user,
        })
        setSelectedUser(user.id);
        axios.get(`http://localhost:5000/api/${user.id}`)
            .then((res) => {
                console.log("Data message base on api res", res.data.data);
                setMessageData(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div>
            <button onClick={toggleSidebar} data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <aside id="sidebar-multi-level-sidebar" className={`fixed top-0 left-0 z-40 w-80 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 border-r`}>
                <div className="h-full overflow-y-auto bg-gray-50 bg-white">
                    <Header user={user}  toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-zinc-900 dark:border-gray-700">
                        <ul className="flex -mb-px">
                            <li className="me-2 w-full">
                                <div className={`inline-block p-4 ${value === 1 ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : ""} cursor-pointer flex items-center`} onClick={(e) => setValue(1)} ><span className='ml-1'><CiUser /></span> UserList </div>
                            </li>
                            <li className="me-2 w-full">
                                <div className={`inline-block p-4 border-b-2 border-transparent ${value === 0 ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : ""} cursor-pointer flex items-center `} onClick={(e) => setValue(0)}><span className='ml-1'><CiChat1 /></span> Chart List</div>
                            </li>
                        </ul>
                    </div>
                    <div className='h-[calc(100vh_-_150px)] overflow-auto'>
                        {
                            value === 1 && (
                                <ul className="space-y-2 font-medium">
                                    {
                                        onlineUsers.filter((ele) => ele.id !== user.id)
                                            .map((user) => (
                                                <li className={`cursor-pointer hover:bg-zinc-100 cursor-pointer border-b ${selectedUser === user.id ? 'bg-gray-200' : ''}`} onClick={() => handleChatRoom(user)}>
                                                    <div className="flex items-center p-2 dark:text-white">
                                                        <img src={UserIcon} alt="User" className="rounded-full w-8 h-8 mr-2" />
                                                        <span className="ms-3 text-black">{user.name}</span>
                                                    </div>
                                                    <div className='flex justify-between items-center mx-2'>
                                                        <p className="text-sm text-zinc-500">I'm looking to work with a designer that...</p>
                                                        <span className="ml-auto text-xs text-zinc-400">3:55 PM</span>
                                                    </div>
                                                </li>
                                            ))}
                                </ul>
                            )}
                    </div>
                </div>
            </aside>
        </div>
    )
}
