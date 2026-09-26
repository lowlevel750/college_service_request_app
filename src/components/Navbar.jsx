import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getUser, authApi } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const role = user?.role?.toUpperCase();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark portal-navbar sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-mortarboard-fill fs-4"></i>
          <span>College Service Portal</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Student Navigation */}
            {role === 'STUDENT' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/student/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/student/requests/create">
                    <i className="bi bi-plus-circle me-1"></i> Create Request
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/student/requests">
                    <i className="bi bi-list-task me-1"></i> My Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Faculty Navigation */}
            {role === 'FACULTY' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/faculty/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/faculty/requests/create">
                    <i className="bi bi-plus-circle me-1"></i> New Request
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/faculty/requests">
                    <i className="bi bi-list-task me-1"></i> My Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Staff Navigation */}
            {(role === 'STAFF' || role === 'SERVICE_STAFF') && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/staff/requests">
                    <i className="bi bi-inbox me-1"></i> Process Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Staff Lead Navigation */}
            {role === 'SERVICE_LEAD' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/stafflead/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/stafflead/requests">
                    <i className="bi bi-clipboard-data me-1"></i> Manage Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Navigation */}
            {role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users">
                    <i className="bi bi-people me-1"></i> Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/categories">
                    <i className="bi bi-tags me-1"></i> Categories
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="text-white d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark fw-bold text-uppercase px-2 py-1">
                    {user.role}
                  </span>
                  <span className="fw-semibold">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-light btn-sm text-primary fw-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
