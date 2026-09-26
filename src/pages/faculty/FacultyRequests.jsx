import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await studentApi.deleteRequest(deleteTarget.id);
      setSuccess(`Request "${deleteTarget.title}" was successfully deleted.`);
      setRequests(requests.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || 'Failed to delete request.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'NEW' && req.status?.toUpperCase() === 'NEW') ||
      (filterStatus === 'IN_PROGRESS' &&
        (req.status?.toUpperCase() === 'IN_PROGRESS' || req.status?.toUpperCase() === 'ASSIGNED')) ||
      (filterStatus === 'COMPLETED' &&
        (req.status?.toUpperCase() === 'COMPLETED' || req.status?.toUpperCase() === 'RESOLVED'));

    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-list-check text-primary me-2"></i>
            Faculty Service Requests
          </h2>
          <p className="text-muted mb-0">
            View status, update open requests, or delete unnecessary submissions
          </p>
        </div>
        <Link
          to="/faculty/requests/create"
          className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2"
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>New Request</span>
        </Link>
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

      <div className="portal-card">
        {/* Filters and Search Bar */}
        <div className="portal-card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="btn-group" role="group">
            {['ALL', 'NEW', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
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

          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
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
              <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '2.5rem' }}></i>
              <h6 className="fw-bold mt-2">No Requests Found</h6>
              <p className="text-muted small mb-3">
                {searchTerm || filterStatus !== 'ALL'
                  ? 'No requests match your current filters.'
                  : 'You have not submitted any service requests yet.'}
              </p>
              <Link to="/faculty/requests/create" className="btn btn-primary btn-sm">
                Create Request
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Request ID</th>
                    <th scope="col">Category</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
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
                      <td className="fw-semibold text-secondary">{req.category}</td>
                      <td className="fw-medium text-dark">{req.title}</td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="text-muted small">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/faculty/requests/${req.id}`}
                            className="btn btn-outline-primary"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i> View
                          </Link>

                          {req.status?.toUpperCase() === 'NEW' && (
                            <>
                              <Link
                                to={`/faculty/requests/${req.id}?edit=true`}
                                className="btn btn-outline-secondary"
                                title="Edit Request"
                              >
                                <i className="bi bi-pencil"></i> Edit
                              </Link>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setDeleteTarget(req)}
                                title="Delete Request"
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to permanently delete this service request?</p>
                <div className="alert alert-light border small">
                  <strong>Title:</strong> {deleteTarget.title}
                  <br />
                  <strong>Category:</strong> {deleteTarget.category}
                </div>
                <p className="text-muted small mb-0">
                  This action cannot be undone. Only requests with status <strong>NEW</strong> can be deleted.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash"></i>
                      <span>Delete Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
