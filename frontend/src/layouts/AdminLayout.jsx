import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Bot, FileText, HelpCircle, 
  UsersRound, Building2, Mail, Calendar, FileCode, Settings,
  Menu, X, LogOut, ChevronDown, Sparkles, Bell, Shield, Key, DollarSign,
  BarChart3, TrendingUp, PieChart, Receipt, Clock, Video, Lock, FolderKanban,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../context/PermissionContext';
import { dashboardAPI, adminChatAPI } from '../services/api';
import departmentAPI from '../services/departmentAPI';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [chatHumanRequested, setChatHumanRequested] = useState(0);
  const [expanded, setExpanded] = useState({
    'Main': true,
    'Content': true,
    'HR': true,
    'Workspace': true,
    'System': true,
  });
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasPermission, loading: permissionsLoading, isSuperAdmin, roles, permissions } = usePermission();

  // Use stored roles from localStorage as an instant fallback
  // (PermissionContext loads async, this prevents "MACRO Admin" flash)
  const storedRoles = (() => {
    try { return JSON.parse(localStorage.getItem('user_roles') || '[]'); } catch { return []; }
  })();
  const storedIsSuperAdmin = (() => {
    try { return JSON.parse(localStorage.getItem('user_is_super_admin') || 'false'); } catch { return false; }
  })();
  // While permissionsLoading, prefer storedRoles so title is correct from first render
  const effectiveRoles = permissionsLoading
    ? storedRoles
    : (roles && roles.length > 0 ? roles : storedRoles);
  const effectiveIsSuperAdmin = isSuperAdmin || storedIsSuperAdmin;

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close notifications on route change
  useEffect(() => {
    setShowNotifications(false);
  }, [location]);

  // Fetch departments for workspace menu
  const fetchDepartmentsData = async () => {
    try {
      const res = await departmentAPI.getDepartments();
      
      // Handle different possible response structures
      let deptData = [];
      
      // Try different possible structures
      if (Array.isArray(res?.data)) {
        // Direct array response
        deptData = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        // Nested in .data.data
        deptData = res.data.data;
      } else if (res?.data && typeof res.data === 'object') {
        // Try common property names
        if (Array.isArray(res.data.departments)) {
          deptData = res.data.departments;
        } else if (Array.isArray(res.data.items)) {
          deptData = res.data.items;
        }
      }
      
      setDepartments(deptData || []);
      
      // Auto-expand workspace items on initial load
      if (Array.isArray(deptData) && deptData.length > 0) {
        setExpanded(prev => ({ ...prev, 'Workspace': true }));
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setDepartments([]);
    }
  };

  // Fetch departments on initial load
  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  // Refresh departments when location changes (especially when creating new departments)
  useEffect(() => {
    // Refresh departments every time route changes
    if (location.pathname.includes('/admin/hr')) {
      fetchDepartmentsData();
    }
  }, [location.pathname]);

  // Also refresh departments periodically (every 10 seconds) to catch newly created departments
  useEffect(() => {
    const interval = setInterval(fetchDepartmentsData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expand the section that contains the currently active route
  useEffect(() => {
    // baseMenuSections is defined later, so we inline the path → section mapping here
    const pathSectionMap = [
      { prefix: '/admin/finance', section: 'Finance' },
      { prefix: '/admin/crm', section: 'CRM' },
      { prefix: '/admin/hr', section: 'HR' },
      { prefix: '/workspace', section: 'Workspace' },
      { prefix: '/employee', section: 'Employee' },
      { prefix: '/admin/content', section: 'Content' },
      { prefix: '/admin/blog', section: 'Content' },
      { prefix: '/admin/faq', section: 'Content' },
      { prefix: '/admin/pages', section: 'Content' },
      { prefix: '/admin/services', section: 'Content' },
      { prefix: '/admin/ai-services', section: 'Content' },
      { prefix: '/admin/team', section: 'Content' },
      { prefix: '/admin/projects', section: 'Project Management' },
      { prefix: '/admin/users', section: 'System' },
      { prefix: '/admin/roles', section: 'System' },
      { prefix: '/admin/permissions', section: 'System' },
      { prefix: '/admin/settings', section: 'System' },
      { prefix: '/admin/crm/leads', section: 'CRM' },
      { prefix: '/admin/crm/clients', section: 'CRM' },
      { prefix: '/admin/crm/deals', section: 'CRM' },
      { prefix: '/admin/leads', section: 'Business' },
      { prefix: '/admin/appointments', section: 'Business' },
    ];
    const match = pathSectionMap.find(({ prefix }) => location.pathname.startsWith(prefix));
    if (match) {
      setExpanded(prev => {
        if (prev[match.section]) return prev; // already open, no re-render
        return { ...prev, [match.section]: true };
      });
    }
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await dashboardAPI.notifications();
      setNotifications(res.data);
    } catch (err) {
      // silently fail
    }
  };

  const fetchChatStats = async () => {
    try {
      const res = await adminChatAPI.getStats();
      setChatHumanRequested(res.data?.human_requested || 0);
    } catch {
      // silently fail
    }
  };

  // Poll chat stats for notification badge
  useEffect(() => {
    fetchChatStats();
    const interval = setInterval(fetchChatStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalNotifs = notifications?.counts?.total || 0;

  // ── "Mark as read" tracking (per user, survives page reload within session) ──
  const [lastSeenTotal, setLastSeenTotal] = useState(0);
  useEffect(() => {
    if (user?.id) {
      const stored = parseInt(sessionStorage.getItem(`notif_seen_${user.id}`) || '0', 10);
      setLastSeenTotal(stored);
    }
  }, [user?.id]);
  const unreadCount = Math.max(0, totalNotifs - lastSeenTotal);
  const markNotificationsRead = () => {
    setLastSeenTotal(totalNotifs);
    if (user?.id) {
      sessionStorage.setItem(`notif_seen_${user.id}`, String(totalNotifs));
    }
  };

  const baseMenuSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, permission: 'dashboard.view', excludeForRoles: ['hr-manager', 'hr-executive'] },
      ]
    },
    {
      title: 'Content',
      items: [
        { name: 'Services', path: '/admin/services', icon: Briefcase, permission: 'services.view' },
        { name: 'Artificial Intelligence', path: '/admin/ai-services', icon: Bot, permission: 'ai-services.view' },
        { name: 'Blogs', path: '/admin/blogs', icon: FileText, permission: 'blogs.view' },
        { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle, permission: 'faqs.view' },
        { name: 'Team', path: '/admin/team', icon: UsersRound, permission: 'team.view' },
        { name: 'Pages', path: '/admin/pages', icon: FileCode, permission: 'pages.view' },
        { name: 'Client Logos', path: '/admin/client-logos', icon: Building2, permission: 'pages.view' },
      ]
    },
    {
      title: 'Business',
      items: [
        { name: 'Careers', path: '/admin/careers', icon: Building2, permission: 'careers.view', excludeForRoles: ['hr-manager', 'hr-executive'] },
        { name: 'Applications', path: '/admin/applications', icon: Mail, permission: 'applications.view', excludeForRoles: ['hr-manager', 'hr-executive'] },
        { name: 'Leads', path: '/admin/crm/leads', icon: Users, permission: 'crm.lead.manage' },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar, permission: 'appointments.view' },
        { name: 'Live Chat', path: '/admin/chat', icon: MessageCircle, permission: 'appointments.view', badge: chatHumanRequested > 0 ? chatHumanRequested : null },
      ]
    },
    {
      title: 'Project Management',
      items: [
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban, permission: 'projects.view' },
      ]
    },
    {
      title: 'CRM',
      items: [
        { name: 'Dashboard', path: '/admin/crm/dashboard', icon: LayoutDashboard, permission: 'crm.dashboard' },
        { name: 'Leads', path: '/admin/crm/leads', icon: Users, permission: 'crm.lead.manage' },
        { name: 'Clients', path: '/admin/crm/clients', icon: Building2, permission: 'crm.client.manage' },
        { name: 'Deals', path: '/admin/crm/deals', icon: Briefcase, permission: 'crm.deal.manage' },
        { name: 'Proposals', path: '/admin/crm/proposals', icon: FileText, permission: 'crm.proposal.manage' },
        { name: 'Activities', path: '/admin/crm/activities', icon: Calendar, permission: 'crm.activity.manage' },
        { name: 'Reports', path: '/admin/crm/reports', icon: BarChart3, permission: 'crm.report.view' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { name: 'Dashboard', path: '/admin/finance/dashboard', icon: DollarSign, permission: 'finance.view' },
        { name: 'Invoices', path: '/admin/finance/invoices', icon: Receipt, permission: 'finance.view' },
        { name: 'Expenses', path: '/admin/finance/expenses', icon: TrendingUp, permission: 'finance.view' },
        { name: 'Income', path: '/admin/finance/income', icon: DollarSign, permission: 'finance.view' },
        { name: 'Reports', path: '/admin/finance/reports', icon: BarChart3, permission: 'finance.reports' },
      ]
    },
    {
      title: 'HR',
      items: [
        { name: 'Dashboard', path: '/admin/hr/dashboard', icon: LayoutDashboard, permission: 'hr.view' },
        { name: 'Recruitment', path: '/admin/hr/recruitment', icon: Building2, permission: 'hr.recruitment' },
        { name: 'Employees', path: '/admin/hr/employees', icon: Users, permission: 'hr.employees' },
        { name: 'Departments', path: '/admin/hr/departments', icon: Building2, permission: 'hr.view' },
        { name: 'Meetings', path: '/admin/meetings', icon: Video, permission: 'hr.view' },
        { name: 'Attendance', path: '/admin/hr/attendance', icon: Calendar, permission: 'hr.attendance' },
        { name: 'Leaves', path: '/admin/hr/leaves', icon: Mail, permission: 'hr.leave' },
        { name: 'Performance', path: '/admin/hr/performance', icon: TrendingUp, permission: 'hr.performance' },
        { name: 'Reports', path: '/admin/hr/reports', icon: BarChart3, permission: 'hr.reports' },
      ]
    },
    {
      title: 'Employee',
      items: [
        { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
        { name: 'My Attendance', path: '/employee/attendance', icon: Clock },
        { name: 'My Leaves', path: '/employee/leaves', icon: Calendar },
        { name: 'My Meetings', path: '/employee/meetings', icon: Video },
        { name: 'Change Password', path: '/employee/change-password', icon: Lock },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Users', path: '/admin/users', icon: Users, permission: 'users.view' },
        { name: 'Roles', path: '/admin/roles', icon: Shield, permission: 'roles.view' },
        { name: 'Permissions', path: '/admin/permissions', icon: Key, permission: 'permissions.view' },
        { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'settings.view' },
      ]
    },
  ];

  // Always add Workspace section (even if empty)
  const workspaceItems = Array.isArray(departments) && departments.length > 0
    ? departments.map(dept => {
        if (!dept || !dept.id) {
          console.warn('Invalid department data:', dept);
          return null;
        }
        const deptSlug = dept.slug || dept.id;
        return {
          name: dept.name || 'Department',
          icon: Building2,
          submenu: [
            { name: 'Workspace', path: `/workspace/${deptSlug}` },
            { name: 'Overview', path: `/admin/hr/departments/${deptSlug}` },
            { name: 'Members', path: `/admin/hr/departments/${deptSlug}/members` },
            { name: 'Budget', path: `/admin/hr/departments/${deptSlug}/budget` },
            { name: 'Settings', path: `/admin/hr/departments/${deptSlug}/settings` },
            { name: 'Projects', path: `/admin/hr/departments/${deptSlug}/projects` },
            { name: 'Tasks', path: `/admin/hr/departments/${deptSlug}/tasks` },
            { name: 'Meetings', path: `/admin/hr/departments/${deptSlug}/meetings` },
            { name: 'Project Requests', path: `/admin/hr/departments/${deptSlug}/project-requests` },
            { name: 'Analytics', path: `/admin/hr/departments/${deptSlug}/analytics` },
            { name: 'Timeline', path: `/admin/hr/departments/${deptSlug}/timeline` },
          ]
        };
      }).filter(Boolean) // Remove null values
    : [];

  const menuSections = [
    ...baseMenuSections.slice(0, -1), // All sections except System
    {
      title: 'Workspace',
      items: workspaceItems.length > 0 
        ? workspaceItems
        : [
            {
              name: 'No departments',
              icon: Building2,
              path: '/admin/hr/departments',
              noSubmenu: true
            }
          ]
    },
    baseMenuSections[baseMenuSections.length - 1] // System section at end
  ];

  // Filter menu items based on permissions and roles
  // Show all menus if: Super Admin OR permissions are still loading OR no permissions data yet
  const shouldShowAllMenus = effectiveIsSuperAdmin || permissionsLoading || (permissions.length === 0 && !storedRoles.length);

  // Use effectiveRoles (from PermissionContext OR localStorage fallback) for instant title
  const userRoleSlugs = Array.isArray(effectiveRoles)
    ? effectiveRoles.map(r => (typeof r === 'object' ? r.slug : r))
    : [];

  // Get all role-specific menu section names to match against user roles
  const roleBasedSections = {
    'finance-manager': ['Finance'],
    'accountant': ['Finance'],
    'hr-manager': ['HR'],
    'hr-executive': ['HR'],
    'sales-manager': ['Business'],
    'content-manager': ['Content'],
    'employee': ['Employee'],
    'developer': ['Employee'],
    'finance-employee': ['Employee'],
  };

  // Determine which sections user should see based on their roles
  const allowedSectionsByRole = new Set();
  userRoleSlugs.forEach(role => {
    if (roleBasedSections[role]) {
      roleBasedSections[role].forEach(section => allowedSectionsByRole.add(section));
    }
  });

  // If no roles/permissions loaded, default to showing main sections
  if (allowedSectionsByRole.size === 0 && userRoleSlugs.length === 0) {
    ['Main', 'Content', 'Business', 'CRM', 'Finance', 'HR', 'Workspace', 'System'].forEach(section => 
      allowedSectionsByRole.add(section)
    );
  }

  // Employee section should ONLY show for users with an employee-type role
  const employeeRoles = ['employee', 'developer', 'finance-employee'];
  const hasEmployeeRole = userRoleSlugs.some(r => employeeRoles.includes(r));

  const filteredMenuSections = (shouldShowAllMenus
    ? menuSections
    : menuSections.map(section => ({
        ...section,
        items: section.items.filter(item => {
          // Always show Workspace section items (departments)
          if (section.title === 'Workspace') {
            return true;
          }
          if (item.excludeForRoles && item.excludeForRoles.some(r => userRoleSlugs.includes(r))) {
            return false;
          }
          if (!item.permission) {
            return allowedSectionsByRole.has(section.title) || section.title === 'Main' || section.title === 'System' || section.title === 'Workspace';
          }
          // If we don't have permission data yet, allow the item
          if (permissions.length === 0 && permissionsLoading) {
            return true;
          }
          return hasPermission(item.permission);
        })
      }))
  )
  .filter(section => section.title !== 'Employee' || hasEmployeeRole)
  .filter(section => section.items.length > 0 || section.title === 'Workspace');

  // FINAL SAFETY CHECK: If menu is completely empty, show all sections
  // This prevents blank sidebar in any scenario
  const finalMenuSections = filteredMenuSections.length === 0 ? menuSections : filteredMenuSections;

  // Role-based portal identity (uses effectiveRoles for instant render)
  const employeeOnlyRoleSlugs = ['employee', 'developer', 'finance-employee'];
  const hrRoleSlugs      = ['hr-manager', 'hr-executive'];
  const financeRoleSlugs = ['finance-manager', 'accountant'];

  const isEmployeeOnly = !effectiveIsSuperAdmin &&
    userRoleSlugs.length > 0 &&
    userRoleSlugs.every(slug => employeeOnlyRoleSlugs.includes(slug));

  const isHROnly = !effectiveIsSuperAdmin &&
    userRoleSlugs.length > 0 &&
    userRoleSlugs.every(slug => hrRoleSlugs.includes(slug));

  const isFinanceOnly = !effectiveIsSuperAdmin &&
    userRoleSlugs.length > 0 &&
    userRoleSlugs.every(slug => financeRoleSlugs.includes(slug));

  const sidebarTitle = isEmployeeOnly
    ? (user?.name || 'Employee Portal')
    : isHROnly
      ? 'HR Admin'
      : isFinanceOnly
        ? 'Finance Admin'
        : 'MACRO Admin';

  const sidebarHomeLink = isEmployeeOnly
    ? '/employee/dashboard'
    : isHROnly
      ? '/admin/hr/dashboard'
      : isFinanceOnly
        ? '/admin/finance/dashboard'
        : '/admin';

  // Notification bell link — send each role to their own dashboard
  const notifBellLink = isEmployeeOnly
    ? '/employee/dashboard'
    : isHROnly
      ? '/admin/hr/dashboard'
      : isFinanceOnly
        ? '/admin/finance/dashboard'
        : '/admin/crm/leads';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    const currentPath = location.pathname;
    
    // Exact match first
    if (currentPath === path) {
      return true;
    }
    
    // For paths with potential trailing variations or query parameters
    // Remove trailing slashes and query strings for comparison
    const normalizedCurrent = currentPath.split('?')[0].replace(/\/$/, '');
    const normalizedPath = path.replace(/\/$/, '');
    
    if (normalizedCurrent === normalizedPath) {
      return true;
    }
    
    return false;
  };

  // Check if any submenu item is active for auto-expanding parent
  const hasActiveSubmenuItem = (item) => {
    if (!item.submenu || !Array.isArray(item.submenu)) {
      return false;
    }
    return item.submenu.some(subitem => isActive(subitem.path));
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block glass-sidebar fixed left-0 top-0 h-full transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
          {!sidebarCollapsed && (
            <Link to={sidebarHomeLink} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/40 group-hover:ring-blue-300 transition-all flex-shrink-0">
                <img src="/logo.svg" alt="Macro" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold truncate max-w-[130px] text-[15px]" title={sidebarTitle}>
                {isEmployeeOnly ? (user?.name || 'Employee Portal') : 'MACRO Admin'}
              </span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link to={sidebarHomeLink} className="flex items-center justify-center w-full group">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/40 group-hover:ring-blue-300 transition-all">
                <img src="/logo.svg" alt="Macro" className="w-full h-full object-cover" />
              </div>
            </Link>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/20 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-4 right-1 p-1.5 rounded-lg hover:bg-white/20"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Menu */}
        <div className="overflow-y-auto h-[calc(100vh-8rem)] py-4">
          {finalMenuSections.map((section, idx) => (
            <div key={idx} className="mb-2">
              {!sidebarCollapsed ? (
                <>
                  {/* Section Header - Collapsible */}
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-white/20 rounded-lg transition-all"
                  >
                    <span>{section.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded[section.title] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Section Items - Expandable */}
                  {expanded[section.title] && (
                    <div className="space-y-1 px-2 mt-2">
                      {section.items.map((item) => (
                        item.submenu ? (
                          <div key={item.name}>
                            <button
                              onClick={() => setExpanded(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                                hasActiveSubmenuItem(item)
                                  ? 'bg-blue-100/30 text-blue-600 font-medium hover:bg-blue-100/40'
                                  : 'hover:bg-white/30'
                              }`}
                            >
                              <item.icon className="w-5 h-5 flex-shrink-0" />
                              <span className="flex-1 text-left">{item.name}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expanded[item.name] || hasActiveSubmenuItem(item) ? 'rotate-180' : ''}`} />
                            </button>
                            {(expanded[item.name] || hasActiveSubmenuItem(item)) && (
                              <div className="ml-7 mt-1 space-y-1 border-l border-white/20 pl-3">
                                {item.submenu.map((subitem) => (
                                  <Link
                                    key={subitem.path}
                                    to={subitem.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-all border-l-2 ${
                                      isActive(subitem.path)
                                        ? 'bg-blue-100/30 text-blue-600 font-medium border-l-blue-500 bg-blue-50/50'
                                        : 'border-l-transparent hover:bg-white/20'
                                    }`}
                                  >
                                    <span>{subitem.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm border-l-2 ${
                              isActive(item.path)
                                ? 'bg-blue-100/30 text-blue-600 font-medium border-l-blue-500 bg-blue-50/50'
                                : 'border-l-transparent hover:bg-white/30'
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {item.badge > 9 ? '9+' : item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Collapsed sidebar - just show icons
                <div className="flex flex-col items-center space-y-1 px-2">
                  {section.items.slice(0, 1).map((item) => (
                    <button
                      key={item.name}
                      title={section.title}
                      className="p-2 rounded-lg hover:bg-white/20 transition-all"
                      onClick={() => setExpanded(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
                    >
                      <item.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] flex items-center justify-center text-white font-semibold">
              {user?.name?.[0] || 'A'}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden glass-header fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50">
        <Link to={sidebarHomeLink} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/40 group-hover:ring-blue-300 transition-all">
            <img src="/logo.svg" alt="Macro" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold truncate max-w-[160px] text-[15px]">
            {isEmployeeOnly ? (user?.name || 'Employee Portal') : 'MACRO Admin'}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to={notifBellLink} className="relative p-2 rounded-lg hover:bg-white/20">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/20"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="lg:hidden fixed inset-0 z-40 glass-sidebar"
          >
            <div className="pt-20 pb-4 overflow-y-auto h-full">
              {finalMenuSections.map((section, idx) => (
                <div key={idx} className="mb-2">
                  {/* Section Header - Collapsible */}
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-white/20 rounded-lg transition-all mx-2"
                  >
                    <span>{section.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded[section.title] ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Section Items - Expandable */}
                  {expanded[section.title] && (
                    <div className="space-y-1 px-2 mt-2">
                      {section.items.map((item) => (
                        item.submenu ? (
                          <div key={item.name}>
                            <button
                              onClick={() => setExpanded(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                                hasActiveSubmenuItem(item)
                                  ? 'bg-blue-100/30 text-blue-600 font-medium hover:bg-blue-100/40'
                                  : 'hover:bg-white/30'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="flex-1 text-left">{item.name}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expanded[item.name] || hasActiveSubmenuItem(item) ? 'rotate-180' : ''}`} />
                            </button>
                            {(expanded[item.name] || hasActiveSubmenuItem(item)) && (
                              <div className="ml-7 mt-1 space-y-1 border-l border-white/20 pl-3">
                                {item.submenu.map((subitem) => (
                                  <Link
                                    key={subitem.path}
                                    to={subitem.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-all border-l-2 ${
                                      isActive(subitem.path)
                                        ? 'bg-blue-100/30 text-blue-600 font-medium border-l-blue-500 bg-blue-50/50'
                                        : 'border-l-transparent hover:bg-white/20'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <span>{subitem.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm border-l-2 ${
                              isActive(item.path)
                                ? 'bg-blue-100/30 text-blue-600 font-medium border-l-blue-500 bg-blue-50/50'
                                : 'border-l-transparent hover:bg-white/30'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {item.badge > 9 ? '9+' : item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        } pt-16 lg:pt-0`}
      >
        {/* Top Bar with Notifications */}
        <div className="hidden lg:flex items-center justify-end h-14 px-6 border-b border-gray-200/60 bg-white/60 backdrop-blur-sm sticky top-0 z-30">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                const opening = !showNotifications;
                setShowNotifications(opening);
                if (opening) markNotificationsRead();
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">{totalNotifs} new items need your attention</p>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">

                    {/* ── Employee notifications ── */}
                    {notifications?.type === 'employee' && (
                      <>
                        {/* Attendance reminder */}
                        {notifications.recent?.not_checked_in && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                              <span className="text-xs font-semibold text-orange-700 uppercase">Attendance Reminder</span>
                            </div>
                            <Link
                              to="/employee/attendance"
                              onClick={() => setShowNotifications(false)}
                              className="block px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <p className="text-sm font-medium text-gray-800">You haven't checked in today</p>
                              <p className="text-xs text-gray-500">Tap to mark your attendance</p>
                            </Link>
                          </div>
                        )}

                        {/* Pending leave requests */}
                        {notifications.counts?.leaves > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span className="text-xs font-semibold text-yellow-700 uppercase">Pending Leaves ({notifications.counts.leaves})</span>
                            </div>
                            {notifications.recent?.leaves?.map((lv) => (
                              <Link
                                key={lv.id}
                                to="/employee/leaves"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-yellow-50 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{lv.leave_type}</p>
                                <p className="text-xs text-gray-500">{lv.start_date} → {lv.end_date}</p>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Upcoming meetings */}
                        {notifications.counts?.meetings > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="text-xs font-semibold text-blue-700 uppercase">Upcoming Meetings ({notifications.counts.meetings})</span>
                            </div>
                            {notifications.recent?.meetings?.map((mt) => (
                              <Link
                                key={mt.id}
                                to="/employee/meetings"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{mt.title}</p>
                                <p className="text-xs text-gray-500">{mt.meeting_date} {mt.meeting_time ? `at ${mt.meeting_time}` : ''}{mt.location ? ` · ${mt.location}` : ''}</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* ── Admin / HR notifications ── */}
                    {notifications?.type !== 'employee' && (
                      <>
                        {/* Leads */}
                        {notifications?.counts?.leads > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="text-xs font-semibold text-green-700 uppercase">New Leads ({notifications.counts.leads})</span>
                            </div>
                            {notifications.recent?.leads?.map((lead) => (
                              <Link
                                key={lead.id}
                                to="/admin/crm/leads"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-green-50 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                                <p className="text-xs text-gray-500">{lead.subject || lead.email}</p>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Applications */}
                        {notifications?.counts?.applications > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              <span className="text-xs font-semibold text-purple-700 uppercase">New Applications ({notifications.counts.applications})</span>
                            </div>
                            {notifications.recent?.applications?.map((app) => (
                              <Link
                                key={app.id}
                                to="/admin/applications"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{app.applicant_name}</p>
                                <p className="text-xs text-gray-500">{app.career?.title || app.applicant_email}</p>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Appointments */}
                        {notifications?.counts?.appointments > 0 && (
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="text-xs font-semibold text-blue-700 uppercase">New Appointments ({notifications.counts.appointments})</span>
                            </div>
                            {notifications.recent?.appointments?.map((apt) => (
                              <Link
                                key={apt.id}
                                to="/admin/appointments"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{apt.name}</p>
                                <p className="text-xs text-gray-500">{apt.service} — {apt.date}</p>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Live Chat Requests */}
                        {notifications?.counts?.chat_requests > 0 && (
                          <div className="p-4 bg-amber-50/60">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                              <span className="text-xs font-semibold text-amber-700 uppercase">Chat Requests ({notifications.counts.chat_requests})</span>
                            </div>
                            {notifications.recent?.chat_requests?.map((chat) => (
                              <Link
                                key={chat.id}
                                to="/admin/chat"
                                onClick={() => setShowNotifications(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors mb-1"
                              >
                                <p className="text-sm font-medium text-gray-800">{chat.visitor_name || 'Anonymous Visitor'}</p>
                                <p className="text-xs text-gray-500">{chat.visitor_email || 'No email'} — wants to connect</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {totalNotifs === 0 && (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">All caught up!</p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <Link
                      to={notifications?.type === 'employee' ? '/employee/dashboard' : '/admin'}
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Dashboard →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
