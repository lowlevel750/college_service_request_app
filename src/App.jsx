import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { getUser, getToken } from './services/api';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CreateRequest from './pages/student/CreateRequest';
import MyRequests from './pages/student/MyRequests';
import RequestDetails from './pages/student/RequestDetails';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyCreateRequest from './pages/faculty/FacultyCreateRequest';
import FacultyRequests from './pages/faculty/FacultyRequests';
import FacultyRequestDetails from './pages/faculty/FacultyRequestDetails';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffRequestDetails from './pages/staff/StaffRequestDetails';

// Staff Lead Pages
import StaffLeadDashboard from './pages/stafflead/StaffLeadDashboard';
import StaffLeadRequestDetails from './pages/stafflead/StaffLeadRequestDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

// Dynamic Root Redirect based on user authentication and role
function RootRedirect() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toUpperCase();
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

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/requests" element={<MyRequests />} />
            <Route path="/student/requests/create" element={<CreateRequest />} />
            <Route path="/student/requests/:id" element={<RequestDetails />} />
          </Route>

          {/* Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/requests" element={<FacultyRequests />} />
            <Route path="/faculty/requests/create" element={<FacultyCreateRequest />} />
            <Route path="/faculty/requests/:id" element={<FacultyRequestDetails />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STAFF', 'SERVICE_STAFF']} />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/requests" element={<StaffDashboard />} />
            <Route path="/staff/requests/:id" element={<StaffRequestDetails />} />
          </Route>

          {/* Staff Lead Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SERVICE_LEAD']} />}>
            <Route path="/stafflead/dashboard" element={<StaffLeadDashboard />} />
            <Route path="/stafflead/requests" element={<StaffLeadDashboard />} />
            <Route path="/stafflead/requests/:id" element={<StaffLeadRequestDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} College Service Request Management System. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
