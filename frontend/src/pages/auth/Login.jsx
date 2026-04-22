import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { refreshPermissions } = usePermission();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Trim whitespace from inputs
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      if (!trimmedEmail || !trimmedPassword) {
        toast.error('Email and password are required');
        setLoading(false);
        return;
      }

      const data = await login({ email: trimmedEmail, password: trimmedPassword });
      
      // Refresh permissions after successful login
      refreshPermissions();
      
      toast.success('Welcome back!');
      
      // Employee-only roles — redirect to employee portal
      const employeeOnlyRoles = ['employee', 'developer', 'finance-employee'];
      const hrRoles = ['hr-manager', 'hr-executive'];
      const financeRoles = ['finance-manager', 'accountant'];
      const userRoleSlugs = (data.roles || []).map(r => r.slug || r);

      const isEmployeeOnly =
        userRoleSlugs.length > 0 &&
        userRoleSlugs.every(slug => employeeOnlyRoles.includes(slug));

      const isHROnly =
        !data.is_super_admin &&
        userRoleSlugs.length > 0 &&
        userRoleSlugs.every(slug => hrRoles.includes(slug));

      const isFinanceOnly =
        !data.is_super_admin &&
        userRoleSlugs.length > 0 &&
        userRoleSlugs.every(slug => financeRoles.includes(slug));

      if (isEmployeeOnly) {
        navigate('/employee/dashboard');
      } else if (isHROnly) {
        navigate('/admin/hr/dashboard');
      } else if (isFinanceOnly) {
        navigate('/admin/finance/dashboard');
      } else if (data.roles?.length > 0 || data.is_super_admin || data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Backend server is not running! Please start Laravel backend with: php artisan serve');
      } else if (error.response?.status === 500) {
        toast.error('Backend error. Make sure database is migrated and seeded.');
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials. Try: admin@macro.com / password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] gradient-blob"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--accent-purple)] gradient-blob"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-md">
            <img src="/logo.svg" alt="Macro" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-10 w-full"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-10 pr-10 w-full"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--primary)] hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Demo Credentials - Only show in development */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 glass-card border border-orange-300">
            <p className="text-sm font-medium mb-2 text-orange-600">📝 Demo Credentials (Dev Only):</p>
            <p className="text-sm text-gray-600">
              Admin: admin@macro.com / password
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
