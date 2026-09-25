import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { studentApi, adminApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function FacultyRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(location.search.includes('edit=true'));
  const [categories, setCategories] = useState([]);

  // Edit fields
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequest();
    fetchCategories();
  }, [id]);

  const fetchRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentApi.getRequest(id);
      setRequest(data);
      setCategory(data.category);
      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      setError(err.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      if (data && data.length > 0) {
        setCategories(data.map((c) => c.name));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await studentApi.updateRequest(id, {
        category,
        title: title.trim(),
        description: description.trim(),
      });
      setSuccess('Request updated successfully.');
      setIsEditing(false);
      fetchRequest();
    } catch (err) {
      setError(err.message || 'Failed to update request.');
    } finally {
      setSaving(false);
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
        <p className="text-muted">The requested service request could not be found or you do not have permission.</p>
        <Link to="/faculty/requests" className="btn btn-primary btn-sm">
          Back to My Requests
        </Link>
      </div>
    );
  }

  const isNew = request.status?.toUpperCase() === 'NEW';

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Link to="/faculty/requests" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Back to Requests
            </Link>
            {isNew && !isEditing && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-1"></i> Edit Request
              </button>
            )}
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

          <div className="portal-card p-4 p-md-5">
            {isEditing ? (
              // Edit Form
              <form onSubmit={handleUpdate}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-pencil-square text-primary me-2"></i>
                    Edit Service Request
                  </h4>
                  <span className="badge bg-light text-dark font-monospace">#{request.id}</span>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.length > 0 ? (
                      categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))
                    ) : (
                      <option value={request.category}>{request.category}</option>
                    )}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Description</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setCategory(request.category);
                      setTitle(request.title);
                      setDescription(request.description);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg"></i>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // View Details
              <div>
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
                  <div className="col-sm-6">
                    <div className="p-3 border rounded">
                      <p className="text-muted small mb-1">Submitted</p>
                      <h6 className="mb-0 fw-semibold">
                        <i className="bi bi-calendar3 me-1 text-primary"></i>
                        {request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}
                      </h6>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 border rounded">
                      <p className="text-muted small mb-1">Last Updated</p>
                      <h6 className="mb-0 fw-semibold">
                        <i className="bi bi-clock-history me-1 text-primary"></i>
                        {request.updated_at ? new Date(request.updated_at).toLocaleString() : 'N/A'}
                      </h6>
                    </div>
                  </div>
                </div>

                {!isNew && (
                  <div className="alert alert-info d-flex align-items-center small mb-0" role="alert">
                    <i className="bi bi-info-circle-fill me-2 fs-6"></i>
                    <div>
                      This request has been processed and is currently <strong>{request.status}</strong>.
                      Modifications are no longer permitted once processing starts.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
