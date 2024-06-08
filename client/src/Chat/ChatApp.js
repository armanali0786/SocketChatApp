import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Peer from 'simple-peer';

const PATH = 'http://localhost:5000';

export default function ChatApp() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef(null); // Ensure the ref is initialized with null
  const userVideo = useRef(null); // Ensure the ref is initialized with null
  
  const connectionRef = useRef();
  const peerRef = useRef();

  const myAudio = useRef();
  const userAudio = useRef();

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

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      console.log("call user data", data);
    });

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
        console.log("Data ", data);
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

      socketRef.current.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peerRef.current.signal(signal);
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
      };
      if (replyMessage) {
        data.replyMessage = replyMessage;
      }
      socketRef.current.emit('SEND_MESSAGE', data);
      setMessageData((prevState) => [...prevState, data]);
    }
  };

  const handleDeleteMessage = (messageId) => {
    axios.delete(`http://localhost:5000/api/${messageId}`)
      .then((res) => {
        if (socketRef.current.connected) {
          const data = {
            message: res.data.data,
            receiver: roomData.receiver,
          };
          socketRef.current.emit('DELETE_MESSAGE', data);
          setMessageData((prevState) => prevState.filter((data) => data.id !== res.data.data.id));
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  const handleTyping = () => {
    socketRef.current.emit('TYPING', user);
  };

  const handleStopTyping = () => {
    socketRef.current.emit('STOP_TYPING', user);
  };

  
  const callUser = (id) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
  
      peer.on("signal", (data) => {
        socketRef.current.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
          name: name,
        });
      });
  
      peer.on("stream", (userStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = userStream;
        }
      });
  
      peerRef.current = peer;
      connectionRef.current = peer;
    }).catch((err) => {
      console.error("Error accessing media devices:", err);
    });
  };
  
  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
  
      peer.on("signal", (data) => {
        socketRef.current.emit("answerCall", { signal: data, to: caller });
      });
  
      peer.on("stream", (userStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = userStream;
        }
      });
  
      peer.signal(callerSignal);
      peerRef.current = peer;
      connectionRef.current = peer;
      setCallAccepted(true);
    }).catch((err) => {
      console.error("Error accessing media devices:", err);
    });
  };
  
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    setStream(null);
  };

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
        me={me}
        setMe={setMe}
        setIdToCall={setIdToCall}
        myAudio={myAudio}
        userAudio={userAudio}
      />
    </div>
  );
}
