
import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = "" }: StatusBadgeProps) {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-orange-100 text-orange-800',
  };

  const dotStyles = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-orange-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
  };

  return (
    <span className={`semei-status-badge ${statusStyles[status]} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyles[status]}`} />
      {children}
    </span>
  );
}
