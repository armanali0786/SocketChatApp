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

      return () => socketRef.current.disconnect();
      
      // socketRef.current.on('typing', (typing) => {
      //   console.log('User is typing:', typing);
      // });
      // socketRef.current.on('stop typing', (typing) => {
      //   console.log('User stopped typing:', typing);
      // });
      // socketRef.current.on('user joined', (user) => {
      //   console.log('User joined:', user);
      // });
      // socketRef.current.on('user left', (user) => {
      //   console.log('User left:', user);
      // });
      // socketRef.current.on('disconnect', () => {
      //   console.log('Disconnected from server');
      // });
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


  return (
    <div className='flex'>
      <Sidebar
       user={user}
       onlineUsers={onlineUsers}
       setRoomData={setRoomData}
       roomData={roomData}
       setMessageData={setMessageData}
       />
      <ChatBox 
      user={user}
      roomData={roomData} 
      handleSendMessage={handleSendMessage}
      messageData={messageData}
      handleDeleteMessage={handleDeleteMessage}
       />
    </div>
  )
}