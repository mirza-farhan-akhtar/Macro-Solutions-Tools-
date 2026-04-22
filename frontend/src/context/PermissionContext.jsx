import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const PermissionContext = createContext();

export function PermissionProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    // Only try to fetch once per component mount
    if (!fetchAttempted.current) {
      fetchAttempted.current = true;
      fetchUserPermissions();
    }
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getUser();
      const fetchedRoles = response.data.roles || [];
      const fetchedIsSuperAdmin = response.data.is_super_admin || false;
      const fetchedPermissions = response.data.permissions || [];
      
      setPermissions(fetchedPermissions);
      setRoles(fetchedRoles);
      setIsSuperAdmin(fetchedIsSuperAdmin);
      
      // Keep localStorage in sync so AdminLayout can read correct roles on next render
      localStorage.setItem('user_roles', JSON.stringify(fetchedRoles));
      localStorage.setItem('user_is_super_admin', JSON.stringify(fetchedIsSuperAdmin));
      localStorage.setItem('user_permissions', JSON.stringify(fetchedPermissions));
    } catch (error) {
      // Silently fail if backend is down - don't spam console
      // Console.debug('Failed to fetch permissions:', error.message);
      // Try to load from localStorage as fallback
      const storedPerms = localStorage.getItem('user_permissions');
      if (storedPerms) {
        try {
          setPermissions(JSON.parse(storedPerms));
        } catch {
          setPermissions([]);
        }
      } else {
        setPermissions([]);
      }
      setRoles([]);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    if (isSuperAdmin) return true;
    return permissionList.some((permission) => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    if (isSuperAdmin) return true;
    return permissionList.every((permission) => permissions.includes(permission));
  };

  const hasRole = (role) => {
    return roles.some((r) => r.slug === role || r.name === role);
  };

  const hasAnyRole = (roleList) => {
    return roleList.some((role) => hasRole(role));
  };

  const refreshPermissions = () => {
    fetchAttempted.current = false;
    fetchUserPermissions();
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        isSuperAdmin,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within PermissionProvider');
  }
  return context;
}
