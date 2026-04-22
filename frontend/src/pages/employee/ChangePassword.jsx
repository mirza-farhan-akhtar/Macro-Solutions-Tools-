import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';

// Defined OUTSIDE the parent so React never remounts it on re-render (fixes focus-loss bug)
function PasswordField({ id, label, value, showVal, onToggle, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showVal ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          required
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {showVal ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [show, setShow] = useState({ current_password: false, password: false, password_confirmation: false });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (id, value) => setForm(f => ({ ...f, [id]: value }));
  const handleToggle = (id) => setShow(s => ({ ...s, [id]: !s[id] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setSaving(true);
      await apiClient.put('/auth/profile', {
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setDone(true);
      setForm({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lock size={22} className="text-blue-600" /> Change Password
          </h1>
          <p className="text-slate-500 text-sm mt-1">Update your account password. You'll continue to use your email to login.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-slate-200 p-6">

          {done && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 text-green-700 text-sm">
              <CheckCircle size={16} />
              <span>Password updated successfully! Use your new password on next login.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField id="current_password" label="Current Password"
              value={form.current_password} showVal={show.current_password}
              onToggle={() => handleToggle('current_password')}
              onChange={handleChange} placeholder="Your current password" />
            <PasswordField id="password" label="New Password"
              value={form.password} showVal={show.password}
              onToggle={() => handleToggle('password')}
              onChange={handleChange} placeholder="At least 6 characters" />
            <PasswordField id="password_confirmation" label="Confirm New Password"
              value={form.password_confirmation} showVal={show.password_confirmation}
              onToggle={() => handleToggle('password_confirmation')}
              onChange={handleChange} placeholder="Repeat new password" />

            <div className="pt-2">
              <button type="submit" disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2">
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><Lock size={15} /> Update Password</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Login uses your <span className="font-semibold text-slate-600">email address</span> as the username.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
