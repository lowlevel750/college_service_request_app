import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    location.search.includes('session_expired') ? 'Your session has expired. Please log in again.' : ''
  );
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setSuccess('Login successful! Redirecting...');

      const role = response.role?.toUpperCase();
      setTimeout(() => {
        if (role === 'STUDENT') {
          navigate('/student/dashboard');
        } else if (role === 'FACULTY') {
          navigate('/faculty/dashboard');
        } else if (role === 'SERVICE_LEAD') {
          navigate('/stafflead/dashboard');
        } else if (role === 'STAFF' || role === 'SERVICE_STAFF') {
          navigate('/staff/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="portal-card p-4 p-md-5">
            <div className="text-center mb-4">
              <i className="bi bi-mortarboard text-primary" style={{ fontSize: '3rem' }}></i>
              <h3 className="fw-bold mt-2">Portal Login</h3>
              <p className="text-muted small">
                Sign in to your College Service Request account
              </p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center small py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                <div>{error}</div>
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center small py-2" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                <div>{success}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold d-flex justify-content-center align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted small">New student or faculty? </span>
              <Link to="/register" className="small fw-semibold text-decoration-none">
                Register an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
