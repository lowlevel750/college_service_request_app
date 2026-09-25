import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, getUser } from '../../services/api';

export default function AdminDashboard() {
  const user = getUser();
  const [usersCount, setUsersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [users, categories] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getCategories(),
      ]);
      setUsersCount(users.length);
      setCategoriesCount(categories.length);
    } catch (err) {
      setError(err.message || 'Failed to load administrative overview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="portal-card p-4 mb-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            Administrator Portal: <span className="text-primary">{user?.name || 'Admin'}</span>
          </h2>
          <p className="text-muted mb-0">
            System administration, user access management, and service categories configuration
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise"></i>
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="portal-card p-3 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Total Users</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : usersCount}</h3>
              </div>
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="portal-card p-3 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">Service Categories</p>
                <h3 className="fw-bold mb-0">{loading ? '...' : categoriesCount}</h3>
              </div>
              <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-tags-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="portal-card p-3 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-semibold text-uppercase mb-1">System Status</p>
                <h3 className="fw-bold mb-0 text-success fs-4">
                  <i className="bi bi-check-circle-fill me-1"></i> Online
                </h3>
              </div>
              <div className="rounded-circle bg-info bg-opacity-10 p-3 text-info">
                <i className="bi bi-hdd-network-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="portal-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary">
                  <i className="bi bi-person-gear fs-3"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-1">User Management</h4>
                  <p className="text-muted small mb-0">
                    Create, view, update roles, or delete system users across all roles.
                  </p>
                </div>
              </div>
              <ul className="text-muted small ps-3 mb-4">
                <li>Manage Students, Faculty, Staff, and Administrators</li>
                <li>Assign or update access roles</li>
                <li>Manage user credentials and department access</li>
              </ul>
            </div>
            <Link to="/admin/users" className="btn btn-primary fw-semibold w-100">
              <i className="bi bi-people me-1"></i> Manage Users ({usersCount})
            </Link>
          </div>
        </div>

        <div className="col-md-6">
          <div className="portal-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                  <i className="bi bi-bookmark-plus fs-3"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Category Management</h4>
                  <p className="text-muted small mb-0">
                    Define and update standard service request categories available to students.
                  </p>
                </div>
              </div>
              <ul className="text-muted small ps-3 mb-4">
                <li>Create categories for certificates, facilities, IT, etc.</li>
                <li>Rename or update category titles</li>
                <li>Delete obsolete categories</li>
              </ul>
            </div>
            <Link to="/admin/categories" className="btn btn-success fw-semibold w-100">
              <i className="bi bi-tags me-1"></i> Manage Categories ({categoriesCount})
            </Link>
          </div>
        </div>
      </div>

      {/* System Infrastructure Information */}
      <div className="portal-card p-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-shield-check text-primary me-2"></i>
          System Environment & Infrastructure
        </h5>
        <div className="row g-3 small">
          <div className="col-md-4">
            <div className="p-3 bg-light rounded border">
              <strong>Application Server:</strong>
              <div className="text-muted mt-1">FastAPI Core Gateway</div>
              <div className="text-muted">Status: <span className="text-success fw-semibold">Healthy (Online)</span></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-light rounded border">
              <strong>Database Cluster:</strong>
              <div className="text-muted mt-1">MongoDB Enterprise Service</div>
              <div className="text-muted">Connection: <span className="text-success fw-semibold">Active & Synced</span></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-light rounded border">
              <strong>Security Protocol:</strong>
              <div className="text-muted mt-1">JWT Bearer Authorization</div>
              <div className="text-muted">Algorithm: <span className="text-primary fw-semibold">HS256 Standard</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
