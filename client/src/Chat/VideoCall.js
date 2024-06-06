// import React, { useRef, useState, useEffect } from 'react';
// import  ReactPlayer  from 'react-player';
// import Peer from 'peerjs';
// import SimplePeer from 'simple-peer';
// import io from 'socket.io-client';

// export default function VideoCall() {
//   const videoRef = useRef(null);
//   const audioRef = useRef(null);
//   const [peerId, setPeerId] = useState(null);
//   const [roomId, setRoomId] = useState(null); // Optional for room-based calls
//   const [connectedPeerId, setConnectedPeerId] = useState(null);

//   useEffect(() => {
//     const peer = new Peer({ /* options */ }); // Configure PeerJS options if needed
//     peer.on('open', (id) => setPeerId(id));
//     peer.on('error', (err) => console.error('PeerJS error:', err));

//     return () => peer.destroy(); // Cleanup PeerJS on component unmount
//   }, []);

//   const startVideoCall = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     handleVideoStream(stream);
//     handleAudioStream(stream);

//     const callPeer = (remotePeerId) => {
//     const peer = new Peer({ /* options */ }); // Configure PeerJS options if needed
//       const call = peer.call(remotePeerId, stream);
//       call.on('stream', (receivedStream) => {
//         handleVideoStream(receivedStream);
//       });
//       call.on('close', () => setConnectedPeerId(null));
//     };

//     if (roomId) {
//       // Room-based call:
//       const socket = io('http://localhost:5000'); // Replace with your server address
//       socket.on('connect', () => {
//         socket.emit('JOIN_ROOM', roomId);
//         socket.on('USER_ADDED', (remotePeerId) => {
//           callPeer(remotePeerId);
//           setConnectedPeerId(remotePeerId);
//         });
//       });
//     } else {
//       // One-to-one call:
//       // Share your peer ID with the other user for connection
//     }
//   };

//   const joinVideoCall = async (remotePeerId) => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     handleVideoStream(stream);
//     handleAudioStream(stream);

//     const call = new SimplePeer({ initiator: false, trickle: false, stream });
//     call.on('signal', (data) => {
//       // Send the signal data to the other user to establish connection
//     });
//     call.on('stream', (receivedStream) => {
//       handleVideoStream(receivedStream);
//     });
//     call.signal(remotePeerId); // Replace with received signal data
//     setConnectedPeerId(remotePeerId);
//   };

//   const endVideoCall = async () => {
//     if (connectedPeerId) {
//       const peer = new Peer({ /* options */ }); // Create a new Peer for ending call
//       peer.on('open', (id) => peer.destroy()); // Immediately destroy the Peer
//     }
//   };

//   const handleVideoStream = (stream) => {
//     videoRef.current.srcObject = stream;
//   };

//   const handleAudioStream = (stream) => {
//     audioRef.current.srcObject = stream;
//   };
//   return (
//     <div>
//     <ReactPlayer ref={videoRef} />
//     <audio ref={audioRef} autoPlay />
//     <button onClick={startVideoCall}>Start Video Call</button> <br/>
//     {roomId ? (
//       <button disabled={connectedPeerId}>Join Call</button> 
//     ) : (
//       <button onClick={() => joinVideoCall(/* remote peer ID */)}>Join Video Call</button>
//     )}
//     <button onClick={endVideoCall}>End Video Call</button>
//   </div>
//   )
// }

// import Button from "@material-ui/core/Button"
// import IconButton from "@material-ui/core/IconButton"
// import TextField from "@material-ui/core/TextField"
// import AssignmentIcon from "@material-ui/icons/Assignment"
// import PhoneIcon from "@material-ui/icons/Phone"


import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import '../style/style.css'
import { FaVideo } from "react-icons/fa"

const socket = io.connect('http://localhost:5000')
function App() {

	const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()


	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			if (myVideo.current) {
				myVideo.current.srcObject = stream
			}
		})
		socket.on("me", (id) => {
			setMe(id)
			console.log("Me id",id);
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
			<h1 style={{ textAlign: "center", color: '#fff' }}>Arman</h1>
			<div className="container bg-gray-300 relative min-h-screen">
				<div className="video-container">
					<div className="video absolute top-5">
						{stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
					</div>
					<div className="video  absolute top-5 right-10">
						{callAccepted && !callEnded ?
							<video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
							null}
					</div>
				</div>
				<div className="myId">
					<input
						id="filled-basic"
						label="Name"
						variant="filled"
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ marginBottom: "20px" }}
					/>
					<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
						<button variant="contained" color="primary">
							Copy ID
						</button>
					</CopyToClipboard>

					<input
						id="filled-basic"
						label="ID to call"
						variant="filled"
						value={idToCall}
						onChange={(e) => setIdToCall(e.target.value)}
					/>
					<div className="call-button">
						{callAccepted && !callEnded ? (
							<button variant="contained" color="secondary" onClick={leaveCall}>
								End Call
							</button>
						) : (
							<button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
								<FaVideo fontSize="large" />
							</button>
						)}
						{idToCall}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div className="caller bg-white p-2">
							<h1 className=" text-green-500">{name} is calling...</h1>
							<button className=" text-green-500" variant="contained" color="primary" onClick={answerCall}>
								Answer
							</button>
						</div>
					) : null}
				</div>
			</div>
		</>
	)
}

export default App
