import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentApi, adminApi } from '../../services/api';

export default function CreateRequest() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const defaultCategories = [
    'Bonafide Certificate',
    'ID Card Replacement',
    'Lab Equipment Issue',
    'Library Clearance',
    'Hostel Maintenance',
    'WiFi / Network Support'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      if (data && data.length > 0) {
        setCategories(data.map((c) => c.name));
        setCategory(data[0].name);
      } else {
        setCategories(defaultCategories);
        setCategory(defaultCategories[0]);
      }
    } catch (e) {
      setCategories(defaultCategories);
      setCategory(defaultCategories[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalCategory = category === 'OTHER' ? customCategory.trim() : category;

    if (!finalCategory) {
      setError('Please select or specify a category.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please provide both title and description.');
      return;
    }

    setLoading(true);

    try {
      await studentApi.createRequest({
        category: finalCategory,
        title: title.trim(),
        description: description.trim(),
      });

      setSuccess('Service request created successfully!');
      setTimeout(() => {
        navigate('/student/requests');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit service request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Link to="/student/dashboard" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </Link>
          </div>

          <div className="portal-card p-4 p-md-5">
            <div className="mb-4">
              <h3 className="fw-bold mb-1">
                <i className="bi bi-file-earmark-plus text-primary me-2"></i>
                Create Service Request
              </h3>
              <p className="text-muted small">
                Submit an inquiry or service request to the college administration or service department
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
                <label className="form-label fw-semibold small">Service Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="OTHER">Other (Specify Below)</option>
                </select>
              </div>

              {category === 'OTHER' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Specify Category Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small">Request Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Need Bonafide Certificate for Scholarship"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Detailed Description *</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Provide specific details about your request, requirements, or issues..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <div className="form-text">
                  Be as specific as possible so staff can process your request quickly.
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/student/requests" className="btn btn-outline-secondary px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill"></i>
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
