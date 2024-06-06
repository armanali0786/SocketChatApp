import React from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { FaPhone } from "react-icons/fa6";


export default function VideoComp({ isPopupVisible, setIsPopupVisible, callUser,
    stream, callEnded, userVideo, myVideo, callAccepted, receivingCall, answerCall, leaveCall,
    name, setName, idToCall, me, setMe, setIdToCall }) {


    const handleCallUser = () => {
        console.log("Id handleCallUser",idToCall)
        callUser(idToCall);
    };

    return (
        <>
            {isPopupVisible && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="popup-content bg-gray-300 p-4 rounded relative max-h-[450px] w-[850px]">
                        <button
                            className="close-button absolute top-2 right-2"
                            onClick={() => setIsPopupVisible(false)}
                        >
                            X
                        </button>
                        <div className="video-container relative">
                            <div className="">
                                {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                            </div>
                            <div className="">
                                {callAccepted && !callEnded ? (
                                    <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                                ) : null}
                            </div>
                        </div>
                        <button className='p-2 text-red-500 bg-black' onClick={leaveCall}>
                            End Call
                        </button>
                    </div>
                    <div className="myId">
                        <input
                            id="filled-basic"
                            label="Name"
                            variant="filled"
                            value={name}
                            placeholder='Enter your Name'
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginBottom: "20px" }}
                        />
                        
                        <input
                            id="filled-basic"
                            label="ID to call"
                            variant="filled"
                            value={idToCall}
                            placeholder='Enter your Call ID'
                            onChange={(e) => setIdToCall(e.target.value)}
                        />
                        <div className="call-button">
                            {callAccepted && !callEnded ? (
                                <button variant="contained" color="secondary" onClick={leaveCall}>
                                    End Call
                                </button>
                            ) : (
                                <button color="primary" aria-label="call" onClick={handleCallUser}>
                                    <FaPhone fontSize="large" />
                                </button>
                            )}
                            {idToCall}
                        </div>
                    <div>
                        {receivingCall && !callAccepted ? (
                            <div className="caller bg-white p-2">
                                <h1 className=" text-black">{name} is calling...</h1>
                                <button className=" text-black" variant="contained" color="primary" onClick={answerCall}>
                                    Answer
                                </button>
                            </div>
                        ) : null}
                    </div>
                    </div>
                </div>
            )}
        </>
    )
}
