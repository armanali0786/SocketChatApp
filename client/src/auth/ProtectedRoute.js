import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth';

const ProtectedRoute = ({ element }) => {
  return isLoggedIn() ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
