import { Navigate } from 'react-router-dom';
import { usePermission } from '../context/PermissionContext';

export default function PermissionGuard({ children, permission, anyPermission, allPermissions, fallback = '/admin' }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermission();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <Navigate to={fallback} replace />;
  }

  // Check any permission from list
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return <Navigate to={fallback} replace />;
  }

  // Check all permissions from list
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}

// Conditional rendering component (doesn't redirect, just hides)
export function CanView({ children, permission, anyPermission, allPermissions }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermission();

  if (loading) return null;

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return null;
  }

  // Check any permission from list
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return null;
  }

  // Check all permissions from list
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    return null;
  }

  return children;
}
