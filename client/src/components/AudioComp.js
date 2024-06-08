import React,{useEffect} from 'react'
import { FaPhone } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa"
import Bitmoji2 from '../assets/bitmoji2.png';
import Bitmoji1 from '../assets/bitmoji1.jpg';
export default function AudioComp({
    isPopupAudio, setIsAudioPopup, name, setName, callUser,
    stream, callEnded, callAccepted,
    receivingCall, answerCall, leaveCall,
    idToCall, setIdToCall, userAudio, myAudio
}) {
    useEffect(() => {
        if (myAudio.current && stream) {
            myAudio.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <>
            {isPopupAudio && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="popup-content bg-gray-300 p-4 rounded relative  w-full">

                        <div className="flex flex-col h-screen">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-300 shadow-md">
                                <div className="flex items-center space-x-2">
                                    <img src={Bitmoji2} alt="Logo" className="w-8 h-8" />
                                    <span className="text-lg font-semibold text-zinc-300 dark:text-white">Arman</span>
                                </div>
                                <p className='text-green-800'> Audio Call </p>
                                <div className="flex items-center space-x-4 relative">
                                    <button
                                        className="close-button font-bold text-red-700"
                                        onClick={() => setIsAudioPopup(false)}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                <div className="flex flex-1 flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                                    {stream && <audio playsInline muted ref={myAudio} autoPlay className="w-full h-full object-cover" />}
                                        <div className="absolute  left-4 bg-zinc-800 text-white px-2 py-1 rounded-lg">Arman</div>
                                    </div>
                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden relative">
                                        {callAccepted && !callEnded ?
                                            <audio playsInline ref={userAudio} autoPlay className="w-full h-full object-cover" /> :
                                            null}
                                        <div className="absolute right-0 bottom-0 bg-zinc-800 text-white px-2 py-1 rounded-lg">{name}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center mb-5">
                                <label>Enter name:</label>
                                <input
                                    id="filled-basic"
                                    label="Name"
                                    variant="filled"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label>Enter Id : </label>

                                <input
                                    id="filled-basic"
                                    label="ID to call"
                                    variant="filled"
                                    value={idToCall}
                                    onChange={(e) => setIdToCall(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white dark:bg-zinc-300 shadow-md space-x-4">
                                <button className="bg-white p-3 rounded  text-green-500 " onClick={() => callUser(idToCall)}>
                                    <FaPhone />
                                </button>
                                <button className="text-red-500 bg-white p-2 rounded" variant="contained" color="secondary" onClick={leaveCall}>
                                    End Call
                                </button>
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

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
