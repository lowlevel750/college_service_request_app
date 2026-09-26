import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { staffApi, getUser } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function StaffLeadRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [isCustomStaff, setIsCustomStaff] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequest();
    fetchStaffMembers();
  }, [id]);

  const fetchStaffMembers = async () => {
    setLoadingStaff(true);
    try {
      const data = await staffApi.getStaffMembers();
      setStaffMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load staff directory:', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await staffApi.getRequest(id);
      setRequest(data);
      setStatus(data.status);
      setStaffId(data.assigned_to || '');
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

  const handleAssignToMe = () => {
    const myName = currentUser?.name || 'Service Lead';
    setStaffId(myName);
    setIsCustomStaff(false);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!staffId.trim()) {
      setError('Please select or specify a staff member.');
      return;
    }
    setAssigning(true);
    setError('');
    setSuccess('');
    try {
      await staffApi.assignRequest(id, staffId.trim());
      setSuccess(`Request successfully assigned to ${staffId.trim()}.`);
      fetchRequest();
    } catch (err) {
      setError(err.message || 'Failed to assign request.');
    } finally {
      setAssigning(false);
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
      navigate('/stafflead/dashboard');
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
        <Link to="/stafflead/dashboard" className="btn btn-primary btn-sm">
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
            <Link to="/stafflead/dashboard" className="btn btn-outline-secondary btn-sm">
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
                  <p className="text-muted small mb-1">Requester ID</p>
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

            {/* Lead Operations: Status & Assignment */}
            <div className="row g-4">
              {/* Update Status */}
              <div className="col-md-6">
                <div className="portal-card p-3 h-100 border">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-arrow-repeat text-primary me-2"></i>
                    Update Status
                  </h5>
                  <form onSubmit={handleStatusUpdate}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">New Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
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
                      className="btn btn-primary btn-sm w-100 fw-semibold"
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Assign Request */}
              <div className="col-md-6">
                <div className="portal-card p-3 h-100 border">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-person-check text-primary me-2"></i>
                      Assign to Staff
                    </h5>
                    {loadingStaff && (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    )}
                  </div>
                  <form onSubmit={handleAssign}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small fw-semibold mb-0">Select Service Staff</label>
                        {!isCustomStaff ? (
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-decoration-none small text-muted"
                            onClick={() => {
                              setIsCustomStaff(true);
                              setStaffId('');
                            }}
                          >
                            <i className="bi bi-pencil-square me-1"></i>Custom ID/Name
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-decoration-none small text-primary"
                            onClick={() => {
                              setIsCustomStaff(false);
                              setStaffId(staffMembers[0]?.name || '');
                            }}
                          >
                            <i className="bi bi-list-ul me-1"></i>Choose from Staff List
                          </button>
                        )}
                      </div>

                      {!isCustomStaff ? (
                        <select
                          className="form-select"
                          value={staffId}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              setIsCustomStaff(true);
                              setStaffId('');
                            } else {
                              setStaffId(e.target.value);
                            }
                          }}
                          required
                          disabled={assigning || loadingStaff}
                        >
                          <option value="">-- Choose Existing Service Staff --</option>
                          {staffMembers.map((member) => (
                            <option key={member.id || member.email} value={member.name}>
                              {member.name} ({member.role ? member.role.replace(/_/g, ' ') : 'STAFF'}) - {member.email}
                            </option>
                          ))}
                          {request?.assigned_to &&
                            !staffMembers.some((m) => m.name === request.assigned_to) && (
                              <option value={request.assigned_to}>
                                {request.assigned_to} (Current Assignee)
                              </option>
                            )}
                          <option value="__custom__">➕ Other / Enter Custom Name or ID...</option>
                        </select>
                      ) : (
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter staff name or user ID..."
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setIsCustomStaff(false);
                              setStaffId(staffMembers[0]?.name || '');
                            }}
                            title="Back to dropdown options"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <div className="form-text small mt-1">
                        Pick an existing staff member from the dropdown or click Custom ID/Name.
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleAssignToMe}
                        disabled={assigning}
                      >
                        <i className="bi bi-person-fill me-1"></i>
                        Assign to Me
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm flex-fill fw-semibold"
                        disabled={assigning || !staffId.trim()}
                      >
                        {assigning ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Assigning...
                          </>
                        ) : (
                          'Save Assignment'
                        )}
                      </button>
                    </div>
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
