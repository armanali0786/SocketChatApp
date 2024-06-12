import React, { useEffect, useRef, useState } from "react"
import { FaVideo } from "react-icons/fa"
import Bitmoji2 from '../assets/bitmoji2.png';
import Bitmoji1 from '../assets/bitmoji1.jpg';
import io from "socket.io-client"
import Peer from "simple-peer"

const socket = io.connect('http://localhost:5000')

function App() {
    const [stream, setStream] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [name, setName] = useState("")
    const [idToCall, setIdToCall] = useState("")
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                setStream(stream)
            })
            .catch((error) => {
                console.error('Error capturing audio.', error);
            });

    }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                name: name
            })
        })

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream
            }
        })

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallAccepted(false)
        connectionRef.current.destroy()
    }


    return (
        <>
            <div className="flex flex-col h-screen">

                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 shadow-md">
                    <div className="flex items-center space-x-2">
                        <img src={Bitmoji2} alt="Logo" className="w-8 h-8" />
                        <span className="text-lg font-semibold text-zinc-800 dark:text-white">Arman</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-zinc-600 dark:text-zinc-300">
                            <img src={Bitmoji1} alt="Full screen" className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    <div className="flex flex-1 flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                            {stream && <video playsInline muted  autoPlay className="w-full h-full object-cover" />}
                            <div className="absolute  left-4 bg-zinc-800 text-white px-2 py-1 rounded-lg">Arman</div>
                        </div>
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                            {callAccepted  ?
                                <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" /> :
                                null}
                            <div className="absolute bottom-[110px] right-0 bg-zinc-800 text-white px-2 py-1 rounded-lg">{name}</div>
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
                <div className="flex items-center justify-center p-4 bg-white dark:bg-zinc-800 shadow-md space-x-4">
                    <button className="bg-white p-3 rounded  text-green-500 " onClick={() => callUser(idToCall)}>
                        <FaVideo />
                    </button>
                    <button className="text-red-500 bg-white p-2 rounded" variant="contained" color="secondary" onClick={leaveCall}>
                        End Call
                    </button>
                   
                </div>

            </div>
        </>
    )
}

export default App
