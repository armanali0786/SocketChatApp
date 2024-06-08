import React, { useState, useCallback, useRef, useEffect } from 'react'
import { IoIosCall, IoMdArrowBack, IoIosVideocam, IoMdSend } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineEmojiEmotions, MdDeleteOutline, MdReply } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Bitmoji from '../assets/bitmoji.jpg';
import Bitmoji1 from '../assets/bitmoji1.jpg';
import Bitmoji2 from '../assets/bitmoji2.png';
import chatUser from '../assets/chat.png';


import EmojiPickers from 'emoji-picker-react';
import VideoComp from './VideoComp';
import AudioComp from './AudioComp';

export default function ChatBox({ user, roomData,
  handleSendMessage, messageData,
  handleDeleteMessage, handleTyping,
  handleStopTyping, typingUsers, setReplyMessage,
  replyMessage, callUser, stream, callEnded, userVideo,
  myVideo, callAccepted, receivingCall, answerCall,
  leaveCall, name, setName, idToCall, me, setMe, setIdToCall, userAudio, myAudio
}) {
  const [message, setMessage] = useState('');
  const typingRef = useRef(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupAudio, setIsAudioPopup] = useState(false);


  const chatContainerRef = useRef(null);

  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedHandleStopTyping = useCallback(debounce(() => {
    handleStopTyping();
    typingRef.current = false;
  }, 1000), []);

  const handleMessageInput = (e) => {
    setMessage(e.target.value);
    if (e.target.value) {
      if (!typingRef.current) {
        handleTyping();
        typingRef.current = true;
      }
      debouncedHandleStopTyping();
    } else {
      handleStopTyping();
      typingRef.current = false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      handleSendMessage(message);
    }
    setMessage('');
    handleStopTyping();
    typingRef.current = false;
  }

  const handleVideoCallUser = (idToCall) => {
    callUser(idToCall)
    setIsPopupVisible(true);
  }

  const handleEmogi = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageData]);


  const handleAudioCallUser = () => {
    setIsAudioPopup(!isPopupAudio);
  }

  useEffect(() => {
    if (receivingCall && !callAccepted) {
      setIsPopupVisible(true);
    }
  }, [receivingCall, callAccepted]);

  return (
    <>
      {roomData.room ?
        <>
          <div className="flex-1 flex flex-col bg-zinc-50 overflow-auto h-screen min-h-[300px]">
            <div className="flex items-center justify-between p-4 bg-white border-b border-zinc-200">
              <div className="flex items-center">
                <span className='text-xl mr-4 cursor-pointer'><IoMdArrowBack /></span>
                <img src={Bitmoji1} alt="User" className="rounded-full w-10 mr-2" />
                <div>
                  <p className="font-semibold">{roomData.receiver.name}</p>
                  <p className="text-sm text-zinc-500">Active Now</p>
                </div>
                <div>
                  {receivingCall && !callAccepted ? (
                    <div className="bg-white p-2">
                      <h1 className=" text-green-500">{name} is calling...</h1>
                      <button className=" text-green-500" variant="contained" color="primary" onClick={answerCall}>
                        Answer
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-zinc-100" onClick={() => handleAudioCallUser(roomData.receiver.socketId)}>
                  <span><IoIosCall /></span>
                </button>
                <button className="p-2 rounded-full hover:bg-zinc-100"
                  onClick={() => handleVideoCallUser(roomData.receiver.socketId)}
                >
                  <span><FaVideo /></span>
                </button>
                <button className="p-2 rounded-full hover:bg-zinc-100" >
                  <span><BsThreeDotsVertical /></span>
                </button>
              </div>
              {
                isPopupVisible && (
                  <>
                    <VideoComp
                      callUser={callUser}
                      stream={stream} 
                      callAccepted={callAccepted}
                      callEnded={callEnded}
                      myVideo={myVideo}
                      userVideo={userVideo}
                      receivingCall={receivingCall}
                      answerCall={answerCall}
                      leaveCall={leaveCall}
                      name={roomData.receiver.name}
                      setName={setName}
                      idToCall={idToCall}
                      setIdToCall={setIdToCall}
                      isPopupVisible={isPopupVisible}
                      setIsPopupVisible={setIsPopupVisible}
                    />
                  </>
                )
              }

              {
                isPopupAudio && (
                  <>
                    <AudioComp
                      callUser={callUser}
                      stream={stream}
                      callAccepted={callAccepted}
                      callEnded={callEnded}
                      myVideo={myVideo}
                      userVideo={userVideo}
                      receivingCall={receivingCall}
                      answerCall={answerCall}
                      leaveCall={leaveCall}
                      name={name}
                      setName={setName}
                      idToCall={idToCall}
                      setIdToCall={setIdToCall}
                      isPopupAudio={isPopupAudio}
                      setIsAudioPopup={setIsAudioPopup}
                      userAudio={userAudio}
                      myAudio={myAudio}
                    />
                  </>
                )
              }
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-zinc-300" ref={chatContainerRef}>
              <div className='flex justify-center'>
                <span className="p-2 mb-2 rounded-xl bg-gray-200 text-xs text-zinc-500">Today{roomData.receiver.socketId} </span>
              </div>
              {
                messageData.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${message.senderId === user.id ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.receiverId == user.id && (
                      <span className="rounded-full mr-2 bg-gray-200">
                        {/* <CiUser /> */}
                        <img src={Bitmoji1} alt="User" className="rounded-full w-10" />
                      </span>
                    )}
                    <div
                      className={`relative p-3 rounded-lg ${message.senderId === user.id ? "bg-zinc-50 ml-auto" : "bg-[#77D098]"
                        }`}
                    >
                      {message.replyMessage && (
                        <div className="p-2 border-l-2 border-blue-500 bg-gray-200 rounded ml-2">
                          <p className="text-sm text-blue-600">{message?.replyMessage}</p>
                        </div>
                      )}
                      <p className='max-w-[550px]'>{message.message}</p>
                      <div className="flex justify-between mt-1">
                        <div>
                          {/* <span className="text-xs text-zinc-700">3:16 PM</span> */}
                          <span className="text-xs text-zinc-700">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-lg cursor-pointer" onClick={() => setReplyMessage(message)}>
                            <MdReply />
                          </span>
                          <span className="cursor-pointer hover:text-red-600 text-lg" onClick={() => handleDeleteMessage(message.id)}>
                            <MdDeleteOutline />
                          </span>
                        </div>
                      </div>
                    </div>
                    {message.senderId === user.id && (
                      <span className="rounded-full ml-2 bg-gray-200">
                        {/* <CiUser /> */}
                        <img src={Bitmoji2} alt="User" className="rounded-full w-10" />

                      </span>
                    )}
                  </div>
                ))
              }
              {typingUsers.map((typingUser, index) => (
                <div key={index} className='absolute bottom-24 text-sm text-zinc-500'>
                  {typingUser.name} is typing...
                </div>
              ))}
            </div>
            {replyMessage && (
              <div className='flex justify-between items-center border-2 text-sm text-zinc-500'>
                <div className='w-full p-2'>Replying to: "{replyMessage.message}"</div>
                <div>
                  <button className='text-red-400 rounded-lg mr-7 hover:text-red-600' onClick={() => setReplyMessage(null)}><span><ImCross /></span></button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="p-4 bg-white border-t border-zinc-300">
                {showEmojiPicker && <EmojiPickers onEmojiClick={handleEmojiSelect} />}
                <div className="flex items-center">
                  <span className='text-2xl mr-2 cursor-pointer' onClick={handleEmogi}><MdOutlineEmojiEmotions /></span>
                  <span className='text-2xl mr-2 cursor-pointer' ><IoIosVideocam /></span>
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
            <div className='text-white font-bold'>
              Please select user to chat
            </div>
            <img src={chatUser} className='' />
          </div>
        </>
      }
    </>
  )
}
