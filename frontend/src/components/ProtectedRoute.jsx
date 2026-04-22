import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../context/PermissionContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: permLoading, isSuperAdmin } = usePermission();

  // While loading authentication or permissions, show loading screen
  if (authLoading || permLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="glass-card p-8 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Grant access if user has admin role or is super admin
  const hasAdminAccess = isSuperAdmin || user?.role === 'admin' || (user?.roles && user.roles.length > 0);
  
  if (!hasAdminAccess) {
    // User is logged in but doesn't have admin access - redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
