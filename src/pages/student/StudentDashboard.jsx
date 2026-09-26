import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi, getUser } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function StudentDashboard() {
  const user = getUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentApi.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load your service requests.');
    } finally {
      setLoading(false);
    }
  };

  const total = requests.length;
  const newCount = requests.filter((r) => r.status?.toUpperCase() === 'NEW').length;
  const inProgressCount = requests.filter(
    (r) => r.status?.toUpperCase() === 'IN_PROGRESS' || r.status?.toUpperCase() === 'ASSIGNED'
  ).length;
  const completedCount = requests.filter(
    (r) => r.status?.toUpperCase() === 'COMPLETED' || r.status?.toUpperCase() === 'RESOLVED'
  ).length;

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="portal-card p-4 mb-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            Welcome, <span className="text-primary">{user?.name || 'Student'}</span>!
          </h2>
          <p className="text-muted mb-0">
            Track and manage your college service and facility requests
          </p>
        </div>
        <div>
          <Link
            to="/student/requests/create"
            className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Create New Request</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="portal-card p-3 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Total Requests</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : total}</h3>
              </div>
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary">
                <i className="bi bi-collection-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="portal-card p-3 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">New / Submitted</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : newCount}</h3>
              </div>
              <div className="rounded-circle bg-info bg-opacity-10 p-3 text-info">
                <i className="bi bi-file-earmark-plus-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="portal-card p-3 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">In Progress</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : inProgressCount}</h3>
              </div>
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 text-warning">
                <i className="bi bi-hourglass-split fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="portal-card p-3 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Completed</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : completedCount}</h3>
              </div>
              <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-check-circle-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="portal-card">
        <div className="portal-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Recent Requests
          </h5>
          <Link to="/student/requests" className="btn btn-sm btn-outline-primary">
            View All ({total})
          </Link>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading your service requests...</p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
              <h6 className="fw-bold mt-2">No Requests Submitted Yet</h6>
              <p className="text-muted small mb-3">
                Have an issue or need assistance? Create your first request now.
              </p>
              <Link to="/student/requests/create" className="btn btn-primary btn-sm">
                <i className="bi bi-plus me-1"></i> Submit Request
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Category</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created Date</th>
                    <th scope="col" className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="ps-4 fw-semibold text-secondary">
                        <i className="bi bi-tag me-1 text-primary"></i>
                        {req.category}
                      </td>
                      <td className="fw-medium text-dark">{req.title}</td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="text-muted small">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="text-end pe-4">
                        <Link
                          to={`/student/requests/${req.id}`}
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                        >
                          <i className="bi bi-eye"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
