import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Search, Send, Bot, User, UserCheck, Loader2,
  Clock, CheckCircle2, AlertCircle, XCircle, RefreshCw,
  Phone, Mail, Globe, Inbox, Filter, Trash2, X, ChevronRight,
  Users, Activity, MessageSquare, UserX
} from 'lucide-react';
import { adminChatAPI } from '../../services/api';
import toast from 'react-hot-toast';

// ── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active:           { label: 'Active',           color: 'bg-sky-100 text-sky-700 border-sky-200',     dot: 'bg-sky-500'     },
  human_requested:  { label: 'Human Requested',  color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500 animate-pulse' },
  assigned:         { label: 'Assigned',         color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  resolved:         { label: 'Resolved',         color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400'  },
  closed:           { label: 'Closed',           color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-300'  },
};

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border bg-white`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800">{value ?? '—'}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ── Session list item ─────────────────────────────────────────────────────────
function SessionItem({ session, active, onClick }) {
  const cfg   = STATUS_CONFIG[session.status] || STATUS_CONFIG.active;
  const latest = session.latest_message?.[0];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors ${active ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold
            ${session.visitor_name ? 'bg-indigo-500' : 'bg-slate-400'}`}>
            {session.visitor_name ? session.visitor_name[0].toUpperCase() : <User className="w-4 h-4" />}
          </div>
          {session.unread_count > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {session.unread_count > 9 ? '9+' : session.unread_count}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {session.visitor_name || 'Anonymous Visitor'}
            </p>
            <span className="text-[10px] text-slate-400 flex-shrink-0">{timeAgo(session.last_activity_at || session.created_at)}</span>
          </div>
          {session.visitor_email && (
            <p className="text-xs text-slate-400 truncate">{session.visitor_email}</p>
          )}
          {latest && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{latest.message?.replace(/<[^>]+>/g, '').substring(0, 60)}</p>
          )}
          <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function AdminMessageBubble({ msg }) {
  const isVisitor = msg.sender === 'visitor';
  const isBot     = msg.sender === 'bot';

  return (
    <div className={`flex items-end gap-2 ${isVisitor ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs
        ${isVisitor ? 'bg-slate-500' : isBot ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
        {isVisitor ? <User className="w-3.5 h-3.5" /> : isBot ? <Bot className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
      </div>
      <div className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isVisitor
          ? 'bg-slate-100 text-slate-800 rounded-br-sm'
          : isBot
            ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-bl-sm'
            : 'bg-emerald-600 text-white rounded-bl-sm'}`}>
        {msg.sender === 'agent' && (
          <p className="text-[10px] font-semibold text-emerald-200 mb-1 uppercase tracking-wide">
            {msg.agent_name || 'You'}
          </p>
        )}
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.message) }}
        />
        <p className={`text-[10px] mt-1 ${isVisitor ? 'text-slate-400' : isBot ? 'text-indigo-400' : 'text-emerald-200'}`}>
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ChatManager() {
  const [sessions, setSessions]         = useState([]);
  const [stats, setStats]               = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [replyText, setReplyText]       = useState('');
  const [replying, setReplying]         = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);
  const [pagination, setPagination]     = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef        = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [activeMessages]);

  // ── Fetch sessions ─────────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    try {
      const res = await adminChatAPI.getSessions({ status: statusFilter, search, page });
      setSessions(res.data.data || res.data);
      setPagination(res.data);
    } catch {}
    finally { setLoading(false); }
  }, [statusFilter, search, page]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminChatAPI.getStats();
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchSessions(); fetchStats(); }, [fetchSessions, fetchStats]);

  // Poll for new sessions / messages every 15s
  useEffect(() => {
    pollRef.current = setInterval(() => { fetchSessions(); fetchStats(); }, 15000);
    return () => clearInterval(pollRef.current);
  }, [fetchSessions, fetchStats]);

  // Poll active session messages every 5s
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(async () => {
      try {
        const res = await adminChatAPI.getSession(activeSession.id);
        setActiveMessages(res.data.messages);
        setActiveSession(res.data);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSession?.id]);

  // ── Open session ───────────────────────────────────────────────────────────
  const openSession = async (session) => {
    try {
      const res = await adminChatAPI.getSession(session.id);
      setActiveSession(res.data);
      setActiveMessages(res.data.messages || []);
      setReplyText('');
      // Refresh list to clear unread badge
      fetchSessions();
    } catch {
      toast.error('Failed to load session');
    }
  };

  // ── Send reply ─────────────────────────────────────────────────────────────
  const sendReply = async () => {
    if (!replyText.trim() || !activeSession) return;
    setReplying(true);
    try {
      const res = await adminChatAPI.reply(activeSession.id, { message: replyText.trim() });
      setActiveMessages(prev => [...prev, res.data]);
      setReplyText('');
      // Update session status if it was human_requested
      if (activeSession.status === 'human_requested') {
        setActiveSession(prev => ({ ...prev, status: 'assigned' }));
        fetchSessions();
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  // ── Update status ──────────────────────────────────────────────────────────
  const updateStatus = async (sessionId, status) => {
    try {
      await adminChatAPI.updateStatus(sessionId, { status });
      setActiveSession(prev => ({ ...prev, status }));
      fetchSessions();
      toast.success(`Session marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ── Delete session ─────────────────────────────────────────────────────────
  const deleteSession = async (sessionId) => {
    if (!confirm('Delete this chat session? This cannot be undone.')) return;
    try {
      await adminChatAPI.deleteSession(sessionId);
      if (activeSession?.id === sessionId) { setActiveSession(null); setActiveMessages([]); }
      fetchSessions();
      toast.success('Session deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const cfg = activeSession ? STATUS_CONFIG[activeSession.status] || STATUS_CONFIG.active : null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 -mt-4 -mx-6">
      {/* Page header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              Live Chat
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage visitor conversations and support requests</p>
          </div>
          <button onClick={() => { fetchSessions(); fetchStats(); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            <StatCard icon={MessageSquare} label="Total Sessions"     value={stats.total}           color="bg-slate-100 text-slate-600" />
            <StatCard icon={Activity}      label="Active Bot Chats"   value={stats.active}          color="bg-sky-100 text-sky-600"     />
            <StatCard icon={AlertCircle}   label="Human Requested"    value={stats.human_requested} color="bg-amber-100 text-amber-600" />
            <StatCard icon={CheckCircle2}  label="Resolved Today"     value={stats.resolved}        color="bg-emerald-100 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Session list ── */}
        <div className="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
          {/* Filters */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['all', 'human_requested', 'assigned', 'active', 'resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors
                    ${statusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  {s === 'all' ? 'All' : s === 'human_requested' ? 'Needs Help' : s.charAt(0).toUpperCase() + s.slice(1)}
                  {s === 'human_requested' && stats?.human_requested > 0 && (
                    <span className="ml-1 bg-amber-500 text-white rounded-full px-1">{stats.human_requested}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                <Inbox className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">No chat sessions</p>
                <p className="text-xs text-slate-400 mt-1">Conversations will appear here as visitors start chatting.</p>
              </div>
            ) : (
              sessions.map(s => (
                <SessionItem
                  key={s.id}
                  session={s}
                  active={activeSession?.id === s.id}
                  onClick={() => openSession(s)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Chat panel ── */}
        {activeSession ? (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
            {/* Chat header */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${activeSession.visitor_name ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                {activeSession.visitor_name ? activeSession.visitor_name[0].toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{activeSession.visitor_name || 'Anonymous Visitor'}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {activeSession.visitor_email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{activeSession.visitor_email}</span>
                  )}
                  {activeSession.visitor_phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{activeSession.visitor_phone}</span>
                  )}
                  {activeSession.page_url && (
                    <span className="flex items-center gap-1 truncate max-w-[160px]"><Globe className="w-3 h-3 flex-shrink-0" />{activeSession.page_url}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
                {/* Status actions */}
                {activeSession.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(activeSession.id, 'resolved')}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Resolve
                  </button>
                )}
                {activeSession.status === 'resolved' && (
                  <button
                    onClick={() => updateStatus(activeSession.id, 'active')}
                    className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reopen
                  </button>
                )}
                <button
                  onClick={() => deleteSession(activeSession.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Human request alert */}
            {activeSession.status === 'human_requested' && (
              <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span><strong>{activeSession.visitor_name || 'Visitor'}</strong> has requested to speak with a real person. Reply below to take ownership of this chat.</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {activeMessages.map((msg, i) => (
                <AdminMessageBubble key={msg.id || i} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            {activeSession.status !== 'closed' && (
              <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4">
                {activeSession.status === 'resolved' ? (
                  <div className="text-center text-sm text-slate-500 py-2">
                    This session is resolved. <button onClick={() => updateStatus(activeSession.id, 'active')} className="text-indigo-600 underline">Reopen to reply.</button>
                  </div>
                ) : (
                  <div className="flex gap-3 items-end">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
                      }}
                      placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                      rows={2}
                      className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
                      style={{ maxHeight: '120px' }}
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || replying}
                      className="flex-shrink-0 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-sm transition-colors flex items-center gap-1.5"
                    >
                      {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-12">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-sm">
              <MessageCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Select a Conversation</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Choose a chat session from the left to view messages and reply to visitors. Sessions requiring human assistance are highlighted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
