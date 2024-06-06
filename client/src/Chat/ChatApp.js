import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import NewSidebar from '../components/NewSidebar';
import Peer from 'peerjs';

const PATH = 'http://localhost:5000';


export default function ChatApp() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

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




  const [roomData, setRoomData] = useState({
    room: null,
  });

  const socketRef = useRef();

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

  const user = jwtDecode(token);

  useEffect(() => {

    const socket = io.connect(PATH);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

  
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected');
    });
    // Cleanup on component unmount
   
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off("me");
      socket.off("callUser");
    };

  }, []);


  useEffect(() => {
    if (isConnected) {
      socketRef.current.emit('ADD_USER', user);
      socketRef.current.on('USER_ADDED', (data) => {
        setOnlineUsers(data);
      });

      socketRef.current.on('RECEIVE_MESSAGE', (data) => {
        setMessageData((prevState) => [...prevState, data]);
      });

      socketRef.current.on('DELETED_MESSAGE', (data) => {
        setMessageData((prevState) => prevState.filter((item) => item.id !== data.message.id));
      });

      socketRef.current.on('TYPING', (data) => {
        setTypingUsers((prev) => [...prev, data]);
      });

      socketRef.current.on('STOP_TYPING', (data) => {
        setTypingUsers((prev) => prev.filter((user) => user.id !== data.id));
      });

      socketRef.current.on('USER_JOINED', (data) => {
        setOnlineUsers(data);
      });

      socketRef.current.on('USER_LEFT', (data) => {
        setOnlineUsers(data);
      });

      return () => socketRef.current.disconnect();

    }
  }, [isConnected]);



  const handleSendMessage = (message) => {
    if (socketRef.current.connected) {
      let sender = user;
      sender.socketId = socketRef.current.id;
      const timestamp = new Date().toISOString();
      const data = {
        message: message,
        receiver: roomData.receiver,
        sender: sender,
        timestamp: timestamp,
      }
      if (replyMessage) {
        data.replyMessage = replyMessage;
      }
      socketRef.current.emit('SEND_MESSAGE', data);
      setMessageData((prevState) => [...prevState, data]);
    }
  }

  const handleDeleteMessage = (messageId) => {
    axios.delete(`http://localhost:5000/api/${messageId}`)
      .then((res) => {
        if (socketRef.current.connected) {
          const data = {
            message: res.data.data,
            receiver: roomData.receiver,
          }
          socketRef.current.emit('DELETE_MESSAGE', data);
          setMessageData((prevState) => prevState.filter((data) => data.id != res.data.data.id));
        }
      }).catch((error) => {
        console.log(error)
      });
  }

  const handleTyping = () => {
    socketRef.current.emit('TYPING', user);
  };

  const handleStopTyping = () => {
    socketRef.current.emit('STOP_TYPING', user);
  };


  
	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			if (myVideo.current) {
				myVideo.current.srcObject = stream
			}
		})
		socketRef.current.on("me", (id) => {
			setMe(id)
			console.log("Me id",id);
		})
		socketRef.current.on("callUser", (data) => {
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
			socketRef.current.emit("callUser", {
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
		socketRef.current.on("callAccepted", (signal) => {
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
			socketRef.current.emit("answerCall", { signal: data, to: caller })
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
    <div className='flex'>
      <Sidebar
        user={user}
        onlineUsers={onlineUsers}
        setRoomData={setRoomData}
        roomData={roomData}
        setMessageData={setMessageData}
        handleTyping={handleTyping}
        handleStopTyping={handleStopTyping}
        typingUsers={typingUsers}
      />

      <ChatBox
        user={user}
        roomData={roomData}
        handleSendMessage={handleSendMessage}
        messageData={messageData}
        handleDeleteMessage={handleDeleteMessage}
        handleTyping={handleTyping}
        handleStopTyping={handleStopTyping}
        typingUsers={typingUsers}
        setReplyMessage={setReplyMessage}
        replyMessage={replyMessage}
        callUser={callUser}
        stream = {stream}
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
        me={me}
        setMe={setMe}
        setIdToCall={setIdToCall}
      />

    </div>
  )
}
