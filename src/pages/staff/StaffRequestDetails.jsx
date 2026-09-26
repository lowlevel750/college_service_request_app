import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { staffApi, getUser } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function StaffRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await staffApi.getRequest(id);
      setRequest(data);
      setStatus(data.status);
    } catch (err) {
      setError(err.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    setError('');
    setSuccess('');
    try {
      await staffApi.updateStatus(id, status);
      setSuccess(`Status successfully changed to ${status}.`);
      fetchRequest();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service request?')) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await staffApi.deleteRequest(id);
      alert('Request deleted successfully.');
      navigate('/staff/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete request.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
        <h4 className="fw-bold mt-2">Request Not Found</h4>
        <p className="text-muted">The requested request does not exist or has been removed.</p>
        <Link to="/staff/dashboard" className="btn btn-primary btn-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Link to="/staff/dashboard" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              disabled={deleting}
            >
              <i className="bi bi-trash"></i> Delete Request
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center small py-2 mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center small py-2 mb-3" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-6"></i>
              <div>{success}</div>
            </div>
          )}

          <div className="portal-card p-4 p-md-5 mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-4 pb-3 border-bottom">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-light text-dark font-monospace">#{request.id}</span>
                  <span className="text-muted small">
                    <i className="bi bi-tag text-primary me-1"></i>
                    {request.category}
                  </span>
                </div>
                <h3 className="fw-bold mb-0 text-dark">{request.title}</h3>
              </div>
              <div>
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-semibold text-muted text-uppercase small">Request Description</h6>
              <div className="p-3 bg-light rounded border">
                <p className="mb-0 text-break" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {request.description}
                </p>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-sm-4">
                <div className="p-3 border rounded">
                  <p className="text-muted small mb-1">Student / User ID</p>
                  <h6 className="mb-0 font-monospace text-truncate" title={request.user_id}>
                    {request.user_id}
                  </h6>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 border rounded">
                  <p className="text-muted small mb-1">Assigned Staff</p>
                  <h6 className="mb-0 fw-semibold text-primary">
                    {request.assigned_to || 'Unassigned'}
                  </h6>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-3 border rounded">
                  <p className="text-muted small mb-1">Created Date</p>
                  <h6 className="mb-0 fw-semibold">
                    {request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}
                  </h6>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Staff Operations: Status Update Only */}
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="portal-card p-4 border">
                  <h5 className="fw-bold mb-2">
                    <i className="bi bi-arrow-repeat text-primary me-2"></i>
                    Update Status
                  </h5>
                  <p className="text-muted small mb-3">
                    As service staff, update the lifecycle status as you work on this request.
                  </p>
                  <form onSubmit={handleStatusUpdate}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Lifecycle Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        disabled={updatingStatus}
                      >
                        <option value="NEW">NEW</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="ON_HOLD">ON_HOLD</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 fw-semibold"
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Updating Status...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
