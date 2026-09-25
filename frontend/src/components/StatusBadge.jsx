import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();

  let badgeClass = 'bg-secondary';
  let label = status || 'UNKNOWN';

  switch (normalized) {
    case 'NEW':
      badgeClass = 'bg-primary';
      label = 'NEW';
      break;
    case 'ASSIGNED':
      badgeClass = 'bg-info text-dark';
      label = 'ASSIGNED';
      break;
    case 'IN_PROGRESS':
      badgeClass = 'bg-warning text-dark';
      label = 'IN PROGRESS';
      break;
    case 'COMPLETED':
    case 'RESOLVED':
      badgeClass = 'bg-success';
      label = 'COMPLETED';
      break;
    case 'ON_HOLD':
      badgeClass = 'bg-secondary';
      label = 'ON HOLD';
      break;
    case 'CLOSED':
      badgeClass = 'bg-dark';
      label = 'CLOSED';
      break;
    default:
      badgeClass = 'bg-secondary';
  }

  return <span className={`badge ${badgeClass} badge-status`}>{label}</span>;
}
