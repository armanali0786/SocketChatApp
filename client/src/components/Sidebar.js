import React, { useState } from 'react'
import Header from './Header'
import UserIcon from '../assets/user.png';
import { CiChat1, CiUser } from "react-icons/ci";
import ChatBox from './ChatBox';
import axios from 'axios';

export default function Sidebar({ user, onlineUsers , setRoomData, roomData, setMessageData}) {
    const [value, setValue] = useState(1);
    const [selectedUser, setSelectedUser] = useState(false);
    const handleChatRoom = (user)=> {
        setRoomData({
            ...roomData,
            room:"test",
            receiver: user,
        })
        setSelectedUser(user.id);
        axios.get(`http://localhost:5000/api/${user.id}`)
        .then((res)=>{
            console.log("Data message base on api res",res.data.data);
            setMessageData(res.data.data);
        })
        .catch((error) =>{
            console.log(error);
        })
    }
    return (
        <>
            <div>
                <Header user={user} />
                <div className="flex h-screen w-[330px]  bg-white p-0 border-r border-zinc-200 hidden md:block">
                    {/* <input type="text" placeholder="Search..." className="w-full p-2 mb-4 border rounded-lg" /> */}

                    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-zinc-900 dark:border-gray-700">
                        <ul class="flex -mb-px">
                            <li class="me-2 w-full">
                                <div class={`inline-block p-4 ${value === 1 ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : ""} cursor-pointer flex items-center`} onClick={(e) => setValue(1)} ><span className='ml-1'><CiUser /></span> UserList </div>
                            </li>
                            <li class="me-2 w-full">
                                <div class={`inline-block p-4 border-b-2 border-transparent ${value === 0 ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : ""} cursor-pointer flex items-center `} onClick={(e) => setValue(0)}><span className='ml-1'><CiChat1 /></span> Chart List</div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {value === 0 && (
                            <>
                                <ul className='overflow-auto'>
                                    <li className="flex items-center p-2 mb-2 hover:bg-zinc-100 cursor-pointer border-b">
                                        <img src={UserIcon} alt="User" className="rounded-full w-8 h-8 mr-2" />
                                        <div>
                                            <p className="font-semibold">Arman Ali Chat List</p>
                                            <p className="text-sm text-zinc-500">I'm looking to work with a designer that...</p>
                                        </div>
                                        <span className="ml-auto text-xs text-zinc-400">3:55 PM</span>
                                    </li>

                                </ul>
                            </>
                        )
                        }

                        {value === 1 && (
                            <>
                                <ul className='overflow-auto'>
                                    {
                                        onlineUsers.filter((ele)=> ele.id !== user.id)
                                        .map((user) => (
                                            <li key={user.id} className={`flex items-center p-2 mb-2 hover:bg-zinc-100 cursor-pointer border-b ${selectedUser === user.id ? 'bg-gray-200':''}`} onClick={() => handleChatRoom(user)}>
                                                <img src={UserIcon} alt="User" className="rounded-full w-8 h-8 mr-2" />
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-zinc-500">I'm looking to work with a designer that...</p>
                                                </div>
                                                <span className="ml-auto text-xs text-zinc-400">3:55 PM</span>
                                            </li>
                                        ))
                                    }

                                </ul>
                            </>
                        )
                        }
                    </div>


                </div>
            </div>

        </>
    )
}
