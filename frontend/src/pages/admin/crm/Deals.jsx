import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Trash2, CheckCircle2, X, DollarSign } from 'lucide-react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import crmAPI from '../../../services/crmAPI';
import toast from 'react-hot-toast';

const stages = ['qualification', 'proposal', 'negotiation', 'won', 'lost'];
const stageColors = {
  qualification: 'from-blue-500 to-blue-600',
  proposal: 'from-cyan-500 to-cyan-600',
  negotiation: 'from-orange-500 to-orange-600',
  won: 'from-green-500 to-green-600',
  lost: 'from-red-500 to-red-600',
};

const stageLabels = {
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const DealModal = ({ onClose, onSave, isSaving, clients, leads, salesUsers }) => {
  const [formData, setFormData] = useState({
    deal_name: '',
    client_id: '',
    lead_id: '',
    value: '',
    stage: 'qualification',
    probability: 50,
    expected_closing_date: '',
    assigned_to: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deal_name.trim() || !formData.client_id) {
      toast.error('Deal name and client are required');
      return;
    }
    await onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
            <h2 className="text-2xl font-bold text-white">New Deal</h2>
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deal Name *</label>
                <input
                  type="text"
                  value={formData.deal_name}
                  onChange={(e) => setFormData({ ...formData, deal_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  placeholder="e.g., Enterprise Contract"
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Related Lead</label>
                <select
                  value={formData.lead_id}
                  onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="">None</option>
                  {Array.isArray(leads) && leads.length > 0
                    ? leads.map(l => (
                        <option key={l.id} value={String(l.id)}>
                          {l.name}
                        </option>
                      ))
                    : null
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deal Value *</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  placeholder="50000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stage *</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Probability (%)</label>
                <input
                  type="number"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  min="0"
                  max="100"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Closing Date</label>
                <input
                  type="date"
                  value={formData.expected_closing_date}
                  onChange={(e) => setFormData({ ...formData, expected_closing_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To</label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="">-- Unassigned --</option>
                  {Array.isArray(salesUsers) && salesUsers.map(u => (
                    <option key={u.id} value={String(u.id)}>
                      {u.name}{u.designation ? ` — ${u.designation}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                rows="3"
                placeholder="Add any notes..."
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
                {isSaving ? 'Creating...' : 'Create Deal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export function Deals() {
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDealForm, setShowDealForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStage, setSelectedStage] = useState('qualification');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pipelineRes, clientsRes, leadsRes, salesUsersRes] = await Promise.all([
        crmAPI.getPipeline(),
        crmAPI.getClients({ per_page: 100 }),
        crmAPI.getCRMLeads({ per_page: 100 }),
        crmAPI.getSalesUsers(),
      ]);
      const data = pipelineRes.data?.data || {};
      setPipeline(data);
      setClients(clientsRes.data?.data || []);
      setLeads(leadsRes.data?.data || []);
      setSalesUsers(salesUsersRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      const cleanData = {
        deal_name: formData.deal_name.trim(),
        client_id: parseInt(formData.client_id),
        lead_id: formData.lead_id ? parseInt(formData.lead_id) : null,
        value: parseFloat(formData.value) || 0,
        stage: formData.stage || 'qualification',
        probability: parseInt(formData.probability) || 50,
        expected_closing_date: formData.expected_closing_date || null,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        notes: formData.notes?.trim() || null,
      };
      await crmAPI.createDeal(cleanData);
      toast.success('Deal created successfully');
      setShowDealForm(false);
      await loadData();
    } catch (error) {
      console.error('Error saving deal:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create deal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    try {
      await crmAPI.updateDeal(dealId, { stage: newStage });
      toast.success(`Deal moved to ${stageLabels[newStage]}`);
      await loadData();
    } catch (error) {
      toast.error('Failed to update deal');
    }
  };

  const handleDelete = async (dealId) => {
    if (window.confirm('Delete this deal?')) {
      try {
        await crmAPI.deleteDeal(dealId);
        toast.success('Deal deleted');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleMarkWon = async (dealId) => {
    try {
      await crmAPI.markDealWon(dealId);
      toast.success('Deal marked as won! Invoice draft created.');
      await loadData();
    } catch (error) {
      toast.error('Failed to mark deal as won');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full" />
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Sales Pipeline</h1>
            <p className="text-slate-600 mt-2">Drag cards to move deals through stages</p>
          </div>
          <button
            onClick={() => setShowDealForm(!showDealForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Deal
          </button>
        </motion.div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {stages.map((stage) => {
              const deals = pipeline[stage]?.deals || [];
              const totalValue = pipeline[stage]?.total_value || 0;

              return (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                >
                  {/* Column Header */}
                  <div className={`bg-gradient-to-r ${stageColors[stage]} rounded-t-2xl p-4 text-white`}>
                    <h2 className="text-lg font-bold">{stageLabels[stage]}</h2>
                    <p className="text-sm text-white/80 mt-1">{deals.length} deals</p>
                    <p className="text-sm font-semibold text-white/90 mt-1">${totalValue.toLocaleString()}</p>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={stage} isDropDisabled={['won', 'lost'].includes(stage)}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/30 rounded-b-2xl p-4 min-h-[600px] transition ${
                          snapshot.isDraggingOver ? 'bg-purple-50 border-purple-300' : ''
                        }`}
                      >
                        <div className="space-y-3">
                          {deals.map((deal, index) => (
                            <Draggable key={deal.id} draggableId={String(deal.id)} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className={`bg-white rounded-xl p-4 shadow-md border border-slate-200 hover:shadow-lg transition cursor-grab active:cursor-grabbing ${
                                    snapshot.isDragging ? 'shadow-2xl ring-2 ring-purple-400' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900 flex-1">{deal.deal_name}</h3>
                                    <div className="flex gap-1">
                                      {stage !== 'won' && stage !== 'lost' && (
                                        <button
                                          onClick={() => handleMarkWon(deal.id)}
                                          className="p-1.5 hover:bg-green-50 text-green-600 rounded transition"
                                          title="Mark as won"
                                        >
                                          <CheckCircle2 size={16} />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDelete(deal.id)}
                                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-slate-600 mb-2">{deal.client?.company_name}</p>
                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1 text-purple-600 font-semibold">
                                      <DollarSign size={14} />
                                      ${deal.value?.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">{deal.probability}%</div>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Deal Modal */}
        {showDealForm && (
          <DealModal
            onClose={() => setShowDealForm(false)}
            onSave={handleSave}
            isSaving={isSaving}
            clients={clients}
            leads={leads}
            salesUsers={salesUsers}
          />
        )}
      </div>
    </div>
  );
}
