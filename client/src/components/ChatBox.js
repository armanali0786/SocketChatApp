import React, { useState } from 'react'
import { IoIosCall, IoMdArrowBack, IoIosVideocam, IoMdSend } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmojiEmotions, MdDeleteOutline, MdReply } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import axios from 'axios';


export default function ChatBox({ user, roomData, handleSendMessage, messageData, handleDeleteMessage}) {

  const [message, setMessage] = useState('');

  const handleMessageInput = (e) => {
    setMessage(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      handleSendMessage(message);
    }
    setMessage('');
  }

  return (
    <>
      {roomData.room ?
        <>
          <div className="flex-1 flex flex-col bg-zinc-50">
            <div className="flex items-center justify-between p-4 bg-white border-b border-zinc-200">
              <div className="flex items-center">
                <span className='text-xl mr-4 cursor-pointer'><IoMdArrowBack /></span>
                <img src="https://placehold.co/40x40" alt="User" className="rounded-full mr-2" />
                <div>
                  <p className="font-semibold">{roomData.receiver.name}</p>
                  <p className="text-sm text-zinc-500">Active Now</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-zinc-100">
                  {/* <img src="https://placehold.co/20x20" alt="Search" /> */}
                  <span><IoIosCall /></span>
                </button>
                <button className="p-2 rounded-full hover:bg-zinc-100">
                  {/* <img src="https://placehold.co/20x20" alt="More" /> */}
                  <span><FaVideo /></span>
                </button>
                <button className="p-2 rounded-full hover:bg-zinc-100">
                  {/* <img src="https://placehold.co/20x20" alt="More" /> */}
                  <span><BsThreeDotsVertical /></span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              <div className='flex justify-center'>
                <span className="p-2 mb-2 rounded-xl bg-gray-200 text-xs text-zinc-500">Today</span>
              </div>
              {
                messageData.map((message, index) => (
                  <div
                    key={index}
                        className={`flex items-start mb-4 ${message.senderId === user.id ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.receiverId == user.id && (
                      <span className="rounded-full mr-2 bg-gray-200 p-2">
                        <CiUser />
                      </span>
                    )}
                    <div
                      className={`p-3 rounded-lg ${message.senderId === user.id ? "bg-zinc-200 ml-auto" : "bg-blue-100"
                        }`}
                    >
                      <p>{message.message}</p>
                      <div className="flex justify-between mt-1">
                        <div>
                          <span className="text-xs text-zinc-500">3:16 PM</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-lg cursor-pointer">
                            <MdReply />
                          </span>
                          <span className="cursor-pointer hover:text-red-600 text-lg" onClick={() => handleDeleteMessage(message.id)}>
                            <MdDeleteOutline />
                          </span>
                        </div>
                      </div>
                    </div>
                    {message.senderId === user.id && (
                      <span className="rounded-full ml-2 bg-gray-200 p-2">
                        <CiUser />
                      </span>
                    )}
                  </div>
                ))
              }

            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 bg-white border-t border-zinc-300">
                <div className="flex items-center">
                  <span className='text-2xl mr-2 cursor-pointer'><MdOutlineEmojiEmotions /></span>
                  <span className='text-2xl mr-2 cursor-pointer'><IoIosVideocam /></span>
                  <span className='text-2xl mr-2 cursor-pointer'><FaMicrophone /></span>
                  <input type="text" placeholder="Type a message"
                    value={message}
                    onChange={handleMessageInput}
                    className="flex-1 p-2 border border-zinc-300 rounded-lg" />
                  <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg flex items-center"><span><IoMdSend /></span></button>
                </div>
              </div>
            </form>
          </div>
        </>
        :
        <>
          <div className='w-full flex justify-center items-center text-xl'>
            Please select user to chat
          </div>
        </>
      }
    </>
  )
}
