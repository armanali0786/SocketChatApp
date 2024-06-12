import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { jwtDecode } from "jwt-decode";
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

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const myVideo = useRef(null); // Ensure the ref is initialized with null
  const userVideo = useRef(null); // Ensure the ref is initialized with null

  const connectionRef = useRef();
  const peerRef = useRef();

  const myAudio = useRef();
  const userAudio = useRef();

  const mediaRecorderRef = useRef();
  const audioChunksRef = useRef([]);

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
      });

      socketRef.current.on('RECEIVE_MESSAGE', (data) => {
        // setMessageData((prevState) => [...prevState, data]);
        setMessageData((prevState) => [...prevState, { ...data, audioUrl: data.audioUrl }]);

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


      socketRef.current.on('receiveVoice', (data) => {
        const audio = new Audio(data);
        audio.play();
      });

      socketRef.current.on('RECEIVE_AUDIO_MESSAGE', (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
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
      if (audioUrl) {
        data.audioUrl = audioUrl;
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

  // const leaveCall = () => {
  //   setCallEnded(true);
  //   connectionRef.current.destroy();
  //   setStream(null);
  // };

  const leaveCall = () => {
    setCallEnded(true);
    // Destroy the peer connection
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    // Reset video elements
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    // Reset state
    setStream(null);
    setReceivingCall(false);
    setCallAccepted(false);
    setCaller("");
    setCallerSignal(null);
    setIdToCall("");
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      audioChunksRef.current = [];
    };
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
    }
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
        startRecording={startRecording}
        stopRecording={stopRecording}
        isRecording={isRecording}
        audioUrl={audioUrl}
        setAudioUrl={setAudioUrl}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
      />
    </div>
  );
}
