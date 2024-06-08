

import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import '../style/style.css'
import { FaVideo } from "react-icons/fa"
import Bitmoji2 from '../assets/bitmoji2.png';
import Bitmoji1 from '../assets/bitmoji1.jpg';


const socket = io.connect('http://localhost:5000')
function App() {

	const [me, setMe] = useState("")
	const [stream, setStream] = useState()
	const [receivingCall, setReceivingCall] = useState(false)
	const [caller, setCaller] = useState("")
	const [callerSignal, setCallerSignal] = useState()
	const [callAccepted, setCallAccepted] = useState(false)
	const [idToCall, setIdToCall] = useState("")
	const [callEnded, setCallEnded] = useState(false)
	const [name, setName] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef = useRef()


	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			if (myVideo.current) {
				myVideo.current.srcObject = stream
			}
		})
		socket.on("me", (id) => {
			setMe(id)
			console.log("Me id", id);
		})
		socket.on("callUser", (data) => {
			console.log("call user data asjknsdnjksn", data);
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

	const callUser = (id) => {
		console.log("Id inside call function", id)
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
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

	const answerCall = () => {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			if (userVideo.current) {
				userVideo.current.srcObject = stream
			}
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
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
							{stream && <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />}
							<div className="absolute  left-4 bg-zinc-800 text-white px-2 py-1 rounded-lg">Arman</div>
						</div>
						<div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
							{callAccepted && !callEnded ?
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
		</>
	)
}

export default App
