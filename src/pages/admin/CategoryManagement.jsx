import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await adminApi.createCategory(newCategoryName.trim());
      setSuccess(`Category "${newCategoryName}" created successfully.`);
      setShowAddModal(false);
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedCategory.name.trim()) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await adminApi.updateCategory(selectedCategory.id, selectedCategory.name.trim());
      setSuccess('Category updated successfully.');
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to update category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await adminApi.deleteCategory(selectedCategory.id);
      setSuccess(`Category "${selectedCategory.name}" deleted.`);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-tags text-primary me-2"></i>
            Service Categories
          </h2>
          <p className="text-muted mb-0">Configure service categories available for campus service requests</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Dashboard
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-semibold"
          >
            <i className="bi bi-plus-circle"></i> Add Category
          </button>
        </div>
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
        <div className="portal-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">Categories List ({filteredCategories.length})</h5>
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-tags text-muted" style={{ fontSize: '2.5rem' }}></i>
              <h6 className="fw-bold mt-2">No Categories Found</h6>
              <p className="text-muted small">No service categories found in the system.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Category ID</th>
                    <th scope="col">Category Name</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr key={c.id}>
                      <td className="ps-4">
                        <span className="badge bg-light text-dark font-monospace">
                          #{c.id.slice(-6)}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark">
                        <i className="bi bi-bookmark-fill text-primary me-2"></i>
                        {c.name}
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setSelectedCategory(c);
                              setShowEditModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                              setSelectedCategory(c);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
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

      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Add Service Category</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                    disabled={actionLoading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hostel Maintenance"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowAddModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-semibold"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedCategory && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Edit Category</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                    disabled={actionLoading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedCategory.name}
                      onChange={(e) =>
                        setSelectedCategory({ ...selectedCategory, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowEditModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-semibold"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCategory && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">Delete Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete category <strong>{selectedCategory.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteSubmit}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
