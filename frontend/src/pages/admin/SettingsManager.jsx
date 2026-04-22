import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function SettingsManager() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    company_name: '',
    company_description: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    social_instagram: '',
    footer_text: '',
    meta_title: '',
    meta_description: '',
    google_analytics: '',
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    maintenance_mode: false
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.list();
      const settingsData = response.data.data || response.data;
      
      // Check if it's already an object (new format) or array (old format)
      let settingsObj = {};
      if (Array.isArray(settingsData)) {
        // Array format - convert to object
        settingsData.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
      } else {
        // Object format - use directly
        settingsObj = settingsData;
      }
      
      setSettings(settingsObj);
      setFormData(prev => ({
        ...prev,
        ...settingsObj
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await settingsAPI.updateBulk(formData);
      toast.success('Settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'contact', name: 'Contact Info', icon: Phone },
    { id: 'social', name: 'Social Media', icon: Globe },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'advanced', name: 'Advanced', icon: Edit }
  ];

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <CanView permission="settings.manage">
          <button onClick={handleSave} className="glass-button">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </button>
        </CanView>
      </div>

      <div className="glass-card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-semibold">General Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Name</label>
                  <input
                    type="text"
                    value={formData.site_name || ''}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    className="glass-input w-full"
                    placeholder="Your Site Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className="glass-input w-full"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Description</label>
                <textarea
                  value={formData.site_description || ''}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  className="glass-input w-full"
                  rows="3"
                  placeholder="Brief description of your site"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Description</label>
                <textarea
                  value={formData.company_description || ''}
                  onChange={(e) => handleInputChange('company_description', e.target.value)}
                  className="glass-input w-full"
                  rows="4"
                  placeholder="About your company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Footer Text</label>
                <textarea
                  value={formData.footer_text || ''}
                  onChange={(e) => handleInputChange('footer_text', e.target.value)}
                  className="glass-input w-full"
                  rows="2"
                  placeholder="Footer copyright text"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="glass-input w-full"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="glass-input w-full"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Contact Address
                </label>
                <textarea
                  value={formData.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  className="glass-input w-full"
                  rows="3"
                  placeholder="Your business address"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-semibold">Social Media Links</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.social_facebook || ''}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    className="glass-input w-full"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.social_twitter || ''}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    className="glass-input w-full"
                    placeholder="https://twitter.com/youraccount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.social_linkedin || ''}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    className="glass-input w-full"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.social_instagram || ''}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    className="glass-input w-full"
                    placeholder="https://instagram.com/youraccount"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'seo' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-xl font-semibold">SEO Settings</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  className="glass-input w-full"
                  placeholder="Your Site Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  className="glass-input w-full"
                  rows="3"
                  placeholder="Brief description for search engines (160 characters max)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Google Analytics Tracking ID</label>
                <input
                  type="text"
                  value={formData.google_analytics || ''}
                  onChange={(e) => handleInputChange('google_analytics', e.target.value)}
                  className="glass-input w-full"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-semibold">Advanced Settings</h2>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={formData.smtp_host || ''}
                      onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                      className="glass-input w-full"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Port</label>
                    <input
                      type="number"
                      value={formData.smtp_port || ''}
                      onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                      className="glass-input w-full"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Username</label>
                    <input
                      type="text"
                      value={formData.smtp_username || ''}
                      onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                      className="glass-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Password</label>
                    <input
                      type="password"
                      value={formData.smtp_password || ''}
                      onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                      className="glass-input w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Settings</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.maintenance_mode || false}
                    onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Enable Maintenance Mode</label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
