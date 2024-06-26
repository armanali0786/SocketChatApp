import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatApp from './Chat/ChatApp';
import Login from './auth/Login';
import Register from './auth/Register';
import ProtectedRoute from './auth/ProtectedRoute';
import { isLoggedIn } from './auth/auth';
import VideoCall from './Chat/VideoCall';
import AudioCall from './Chat/AudioCall';
function App() {
  
  return (
    <>
        <Routes>
          <Route path="/app" element={<ProtectedRoute element={<ChatApp />} />} />
          <Route path="/apps" element={<ProtectedRoute element={<VideoCall />} />} />
          <Route path="/appss" element={<ProtectedRoute element={<AudioCall />} />} />
          <Route path="/" element={isLoggedIn() ? <Navigate to="/app" /> : <Login />} />
          <Route path="/register" element={isLoggedIn() ? <Navigate to="/app" /> : <Register />} />
          <Route path="/login" element={isLoggedIn() ? <Navigate to="/app" /> : <Login />} />
        <Route path="/*" element={isLoggedIn() ? <Navigate to="/app" /> : <Login />} />
        </Routes>
    </>
  );
}

export default App;
