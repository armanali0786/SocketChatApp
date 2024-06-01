import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
const PATH = 'http://localhost:5000';


export default function ChatApp() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const [roomData, setRoomData] = useState({
    room: null,
  });

  const socketRef = useRef();

  const token = sessionStorage.getItem('token');

  useEffect(()=>{
    if(!token){
      navigate('/');
    }
  },[token]);
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
     
    };
  }, []);


  useEffect(() => {
    if(isConnected) {
      socketRef.current.emit('ADD_USER', user);
      socketRef.current.on('USER_ADDED', (data) => {
        setOnlineUsers(data);
      });

      socketRef.current.on('RECEIVE_MESSAGE', (data) => {
        setMessageData((prevState)=> [...prevState, data] );
      });

      socketRef.current.on('DELETED_MESSAGE', (data) => {
        setMessageData((prevState)=> prevState.filter((item)=> item.id !== data.message.id) );
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
  },[isConnected]);
  
  const handleSendMessage = (message) => {
    if(socketRef.current.connected){
      let sender = user;
      sender.socketId = socketRef.current.id;
      const data ={
        message: message,
        receiver: roomData.receiver,
        sender: sender,
      }
      socketRef.current.emit('SEND_MESSAGE', data);
      setMessageData((prevState) => [...prevState, data]);
    }
  }

  const handleDeleteMessage = (messageId) =>{
    axios.delete(`http://localhost:5000/api/${messageId}`)
    .then((res)=>{
      if(socketRef.current.connected){
        const data ={
          message: res.data.data,
          receiver: roomData.receiver,
        }
        socketRef.current.emit('DELETE_MESSAGE', data);
        setMessageData((prevState) => prevState.filter((data)=> data.id != res.data.data.id));
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
       />
    </div>
  )
}
