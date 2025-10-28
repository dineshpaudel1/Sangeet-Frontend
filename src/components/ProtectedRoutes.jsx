// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SpotifyAuthContext } from '../context/SpotifyAuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(SpotifyAuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
