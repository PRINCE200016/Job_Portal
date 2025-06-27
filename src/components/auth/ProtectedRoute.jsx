import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading state if auth state is being determined
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and user's role is not included, redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the outlet (child routes)
  return <Outlet />;
};

export default ProtectedRoute;