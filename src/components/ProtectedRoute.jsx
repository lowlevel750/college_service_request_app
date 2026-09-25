import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser } from '../services/api';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toUpperCase();

  if (allowedRoles.length > 0 && !allowedRoles.map((r) => r.toUpperCase()).includes(role)) {
    if (role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (role === 'FACULTY') {
      return <Navigate to="/faculty/dashboard" replace />;
    } else if (role === 'SERVICE_LEAD') {
      return <Navigate to="/stafflead/dashboard" replace />;
    } else if (role === 'STAFF' || role === 'SERVICE_STAFF') {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
