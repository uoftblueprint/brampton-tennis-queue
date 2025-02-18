import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useContext(AuthContext);

  // If auth context isn't ready yet, show nothing or a loading spinner
  if (!auth) {
    return null; // or return <LoadingSpinner />
  }

  const { currentUser, loading } = auth;

  // Don't navigate away while still loading
  if (loading) {
    return null; // or return <LoadingSpinner />
  }

  return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;