import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { staffApi, getUser } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function StaffLeadDashboard() {
  const user = getUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Status update
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await staffApi.getRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch service requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    setError('');
    setSuccess('');
    try {
      await staffApi.updateStatus(requestId, newStatus);
      setSuccess(`Request status updated to "${newStatus}".`);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const total = requests.length;
  const newCount = requests.filter((r) => r.status?.toUpperCase() === 'NEW').length;
  const assignedCount = requests.filter(
    (r) => r.status?.toUpperCase() === 'ASSIGNED'
  ).length;
  const inProgressCount = requests.filter(
    (r) => r.status?.toUpperCase() === 'IN_PROGRESS'
  ).length;
  const completedCount = requests.filter(
    (r) => r.status?.toUpperCase() === 'COMPLETED' || r.status?.toUpperCase() === 'RESOLVED'
  ).length;

  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'NEW' && req.status?.toUpperCase() === 'NEW') ||
      (filterStatus === 'ASSIGNED' && req.status?.toUpperCase() === 'ASSIGNED') ||
      (filterStatus === 'IN_PROGRESS' && req.status?.toUpperCase() === 'IN_PROGRESS') ||
      (filterStatus === 'COMPLETED' &&
        (req.status?.toUpperCase() === 'COMPLETED' || req.status?.toUpperCase() === 'RESOLVED'));

    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.user_id && req.user_id.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="portal-card p-4 mb-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-shield-check text-primary me-2"></i>
            Service Lead Portal — <span className="text-primary">{user?.name || 'Service Lead'}</span>
          </h2>
          <p className="text-muted mb-0">
            Oversee service operations, assign requests to staff, and manage request workflows
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise"></i>
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-6"></i>
          <div>{success}</div>
        </div>
      )}

      {/* Metrics Row - 5 cards for lead-specific overview */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg">
          <div className="portal-card p-3 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Total</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : total}</h3>
              </div>
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary">
                <i className="bi bi-inbox-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="portal-card p-3 border-start border-4 border-danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Unassigned</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : newCount}</h3>
              </div>
              <div className="rounded-circle bg-danger bg-opacity-10 p-3 text-danger">
                <i className="bi bi-exclamation-circle-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="portal-card p-3 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Assigned</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : assignedCount}</h3>
              </div>
              <div className="rounded-circle bg-info bg-opacity-10 p-3 text-info">
                <i className="bi bi-person-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="portal-card p-3 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">In Progress</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : inProgressCount}</h3>
              </div>
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 text-warning">
                <i className="bi bi-arrow-repeat fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="portal-card p-3 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Completed</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : completedCount}</h3>
              </div>
              <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-check2-all fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Management Table */}
      <div className="portal-card">
        <div className="portal-card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="btn-group" role="group">
            {['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn btn-sm ${
                  filterStatus === status ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search category, title, user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle text-muted" style={{ fontSize: '2.5rem' }}></i>
              <h6 className="fw-bold mt-2">No Requests Found</h6>
              <p className="text-muted small mb-0">
                {searchTerm || filterStatus !== 'ALL'
                  ? 'No requests match your current filters.'
                  : 'There are currently no service requests in the system.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Request ID</th>
                    <th scope="col">Category</th>
                    <th scope="col">Title</th>
                    <th scope="col">Assigned To</th>
                    <th scope="col">Status</th>
                    <th scope="col">Update Status</th>
                    <th scope="col" className="text-end pe-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="ps-4">
                        <span className="badge bg-light text-dark font-monospace">
                          #{req.id.slice(-6)}
                        </span>
                      </td>
                      <td className="fw-semibold text-secondary">
                        <i className="bi bi-tag text-primary me-1"></i>
                        {req.category}
                      </td>
                      <td className="fw-medium text-dark">{req.title}</td>
                      <td>
                        {req.assigned_to ? (
                          <span className="badge bg-info text-dark">
                            <i className="bi bi-person-fill me-1"></i>
                            {req.assigned_to}
                          </span>
                        ) : (
                          <span className="text-muted small">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            style={{ width: '150px' }}
                            value={req.status}
                            disabled={updatingId === req.id}
                            onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          >
                            <option value="NEW">NEW</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="ON_HOLD">ON_HOLD</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                          {updatingId === req.id && (
                            <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                          )}
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <Link
                          to={`/stafflead/requests/${req.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-arrow-right-circle me-1"></i> View
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
