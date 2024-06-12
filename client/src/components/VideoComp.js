import React, { useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FaPhone , FaVideoSlash} from "react-icons/fa6";
import { FaVideo, FaMicrophoneAlt,FaMicrophoneSlash } from "react-icons/fa"
import Bitmoji2 from '../assets/bitmoji2.png';
import Bitmoji1 from '../assets/bitmoji1.jpg';


export default function VideoComp({ isPopupVisible, setIsPopupVisible, callUser,
    stream, callEnded, userVideo, myVideo, callAccepted, receivingCall, answerCall, leaveCall,
    name, setName, idToCall, setIdToCall, toggleAudio, toggleVideo, isAudioMuted, isVideoMuted
 }) {

    if (stream && myVideo.current) {
        myVideo.current.srcObject = stream;
    }
 

    return (
        <>
            {isPopupVisible && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="popup-content bg-gray-300 p-4 rounded relative  w-full">

                        <div className="flex flex-col h-screen">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-300 shadow-md">
                                <div className="flex items-center space-x-2">
                                    <img src={Bitmoji2} alt="Logo" className="w-8 h-8" />
                                    <span className="text-lg font-semibold text-zinc-300 dark:text-black">Arman</span>
                                </div>
                                <p className='text-green-600 font-bold'> Video Calling </p>
                                <div className="flex justify-center items-center space-x-4 relative bg-black w-6 h-6 rounded ">
                                    <button
                                        className="close-button font-bold text-white hover:text-red-700"
                                        onClick={() => setIsPopupVisible(false)}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-1 overflow-hidden">
                                <div className="flex flex-1 flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden relative">
                                        {stream && <video playsInline  ref={myVideo} autoPlay  className="w-full h-full object-cover" />}
                                        <div className="absolute left-4 bottom-4 bg-zinc-800 text-white px-2 py-1 rounded-lg">Arman</div>
                                    </div>

                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden relative">
                                        {callAccepted && !callEnded ? (
                                            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                                        ) : null}
                                        <div className="absolute right-4 bottom-4 bg-zinc-800 text-white px-2 py-1 rounded-lg">{name}</div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center items-center p-4'>
                                <div className='p-2 rounded-lg bg-slate-100 mr-6 text-blue-600 text-lg' onClick={toggleVideo}>
                                    <span> {isVideoMuted ?    <FaVideoSlash/> : <FaVideo />} </span>
                                </div>
                                <div className='p-2 rounded-lg bg-slate-100 text-red-700 text-lg' onClick={toggleAudio}>
                                    <span>{isAudioMuted ?  <FaMicrophoneSlash/> : <FaMicrophoneAlt />}</span>
                                </div>
                            </div>

                            <div className='flex justify-center rounded-lg'>
                                <button className="text-red-500 bg-white p-2 rounded" variant="contained" color="secondary" onClick={leaveCall}>
                                    <FaPhone />
                                </button>
                            </div>


                            <div className="flex items-center justify-center p-2 bg-white dark:bg-zinc-300 shadow-md space-x-4">
                                <div>
                                    {receivingCall && !callAccepted ? (
                                        <div className="bg-white p-2">
                                            <h1 className=" text-green-500">{name} is calling...</h1>
                                            <button className=" text-green-500" onClick={answerCall}>
                                                <span>Recieve<FaPhone /></span>
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
