import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Send, CheckCircle2, Clock } from 'lucide-react';
import crmAPI from '../../../services/crmAPI';
import toast from 'react-hot-toast';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const ProposalModal = ({ onClose, onSave, isSaving, clients }) => {
  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    description: '',
    total_amount: '',
    items: [{ description: '', quantity: '', unit_price: '' }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client_id) {
      toast.error('Title and client are required');
      return;
    }
    await onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: '', unit_price: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative"
        >
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold text-white">New Proposal</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              type="button"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Proposal Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  placeholder="e.g., Website Design Project"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Client *</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="">Select a client</option>
                  {Array.isArray(clients) && clients.length > 0
                    ? clients.map(c => (
                        <option key={c.id} value={String(c.id)}>
                          {c.company_name || c.name}
                        </option>
                      ))
                    : null
                  }
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                rows="3"
                placeholder="Proposal description..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-16 px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm"
                      min="1"
                      step="1"
                    />
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      placeholder="Unit Price"
                      className="w-28 px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 outline-none text-sm"
                      min="0"
                      step="0.01"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Amount</label>
              <input
                type="number"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : 'Create Proposal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [searchTerm, filterStatus]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      const [proposalsRes, clientsRes] = await Promise.all([
        crmAPI.getProposals(params),
        crmAPI.getClients({ per_page: 100 }),
      ]);
      setProposals(proposalsRes.data?.data || []);
      setClients(clientsRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleSendProposal = async (id) => {
    try {
      await crmAPI.sendProposal(id);
      toast.success('Proposal sent successfully');
      await loadProposals();
    } catch (error) {
      toast.error('Failed to send proposal');
    }
  };

  const handleAccept = async (id) => {
    try {
      await crmAPI.acceptProposal(id);
      toast.success('Proposal accepted!');
      await loadProposals();
    } catch (error) {
      toast.error('Failed to accept proposal');
    }
  };

  const handleReject = async (id) => {
    try {
      await crmAPI.rejectProposal(id);
      toast.success('Proposal rejected');
      await loadProposals();
    } catch (error) {
      toast.error('Failed to reject proposal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this proposal?')) {
      try {
        await crmAPI.deleteProposal(id);
        toast.success('Proposal deleted');
        await loadProposals();
      } catch (error) {
        toast.error('Failed to delete proposal');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      const proposalData = {
        title: formData.title.trim(),
        client_id: parseInt(formData.client_id),
        description: formData.description?.trim() || null,
        total_amount: parseFloat(formData.total_amount) || 0,
        items: formData.items.filter(item => item.description.trim() && item.quantity).map(item => ({
          description: item.description.trim(),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price) || 0,
        })),
      };
      await crmAPI.createProposal(proposalData);
      toast.success('Proposal created successfully');
      setShowProposalForm(false);
      await loadProposals();
    } catch (error) {
      console.error('Error saving proposal:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create proposal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Proposals</h1>
            <p className="text-slate-600 mt-2">Create and manage client proposals</p>
          </div>
          <button
            onClick={() => setShowProposalForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Proposal
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          <div className="flex-1 min-w-[250px] relative">
            <Search size={20} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </motion.div>

        {/* Proposals Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full" />
            </div>
          </div>
        ) : proposals.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {proposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition truncate break-words">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 truncate">{proposal.client?.company_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${statusColors[proposal.status]}`}>
                    {proposal.status?.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{proposal.description}</p>

                <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-600">${proposal.total_amount?.toLocaleString()}</p>
                </div>

                {proposal.items?.length > 0 && (
                  <div className="mb-4 border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Items ({proposal.items.length})</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      {proposal.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate">{item.description}</span>
                          <span className="font-medium">${item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  {proposal.status === 'draft' && (
                    <button
                      onClick={() => handleSendProposal(proposal.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium transition"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  )}
                  {proposal.status === 'sent' && (
                    <>
                      <button
                        onClick={() => handleAccept(proposal.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 font-medium transition"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(proposal.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {proposal.status === 'draft' && (
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      className="px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No proposals found</p>
          </div>
        )}

        {/* Proposal Modal */}
        {showProposalForm && (
          <ProposalModal
            onClose={() => setShowProposalForm(false)}
            onSave={handleSave}
            isSaving={isSaving}
            clients={clients}
          />
        )}
      </div>
    </div>
  );
}
