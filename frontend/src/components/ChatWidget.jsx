import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, User, Bot, Loader2,
  UserCheck, Phone, Mail, ChevronDown, Minimize2,
  Sparkles, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { chatAPI } from '../services/api';

// ── Markdown-lite renderer ────────────────────────────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// ── Quick suggestion chips ────────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: '💼 Our Services', text: 'What services do you offer?' },
  { label: '💰 Pricing', text: 'How much do your services cost?' },
  { label: '⏱️ Timeline', text: 'How long does a project take?' },
  { label: '🚀 Get Started', text: 'How do I get started with a project?' },
  { label: '📞 Contact', text: 'How can I contact you?' },
  { label: '🤖 AI Services', text: 'Tell me about your AI services' },
];

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isVisitor = msg.sender === 'visitor';
  const isAgent   = msg.sender === 'agent';
  const isBot     = msg.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isVisitor ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs
        ${isVisitor ? 'bg-indigo-500' : isAgent ? 'bg-emerald-500' : 'bg-slate-600'}`}>
        {isVisitor ? <User className="w-3.5 h-3.5" /> : isAgent ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isVisitor
          ? 'bg-indigo-600 text-white rounded-br-sm'
          : isAgent
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-bl-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm'}`}>
        {isAgent && (
          <p className="text-[10px] font-semibold text-emerald-600 mb-1 uppercase tracking-wide">
            {msg.agent_name || 'Support Agent'}
          </p>
        )}
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.message) }}
        />
        <p className={`text-[10px] mt-1.5 ${isVisitor ? 'text-indigo-200' : 'text-slate-400'}`}>
          {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2"
    >
      <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-400"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Human request form ────────────────────────────────────────────────────────
function HumanRequestForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inp = 'w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-3 mb-3 bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <UserCheck className="w-4 h-4 text-indigo-600" />
        <p className="text-sm font-semibold text-slate-800">Connect with a person</p>
      </div>
      <p className="text-xs text-slate-500 mb-3">Leave your details and our team will join this chat shortly.</p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <input
            type="text" placeholder="Your full name *" value={form.name}
            onChange={set('name')} className={inp + (errors.name ? ' border-rose-400' : ' border-slate-200')}
          />
          {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email" placeholder="Email address *" value={form.email}
            onChange={set('email')} className={inp + (errors.email ? ' border-rose-400' : ' border-slate-200')}
          />
          {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <input
          type="tel" placeholder="Phone (optional)" value={form.phone}
          onChange={set('phone')} className={inp + ' border-slate-200'}
        />
        <div className="flex gap-2 pt-1">
          <button
            type="button" onClick={onCancel}
            className="flex-1 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit" disabled={loading}
            className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
            Notify Team
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ── Inner widget (stateful) ───────────────────────────────────────────────────
function ChatWidgetInner() {
  const [open, setOpen]               = useState(false);
  const [minimized, setMinimized]     = useState(false);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [botTyping, setBotTyping]     = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [chatStatus, setChatStatus]   = useState('active');
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanLoading, setHumanLoading]   = useState(false);
  const [initError, setInitError]     = useState(false);
  const [unread, setUnread]           = useState(0);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, botTyping]);

  // ── Load / init session ───────────────────────────────────────────────────
  const initSession = useCallback(async () => {
    const storedToken = localStorage.getItem('chat_session_token');
    try {
      const res = await chatAPI.startSession({
        session_token: storedToken || undefined,
        page_url: window.location.href,
      });
      const { session_token, status, messages: msgs, visitor_name, assigned_agent } = res.data;
      localStorage.setItem('chat_session_token', session_token);
      setSessionToken(session_token);
      setChatStatus(status);
      setMessages(msgs || []);
      if (assigned_agent) setAssignedAgent(assigned_agent);
      setInitError(false);
    } catch {
      setInitError(true);
    }
  }, []);

  useEffect(() => {
    if (open && !sessionToken) {
      initSession();
    }
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // ── Poll for new messages when human/agent chat is active ─────────────────
  const fetchMessages = useCallback(async (token) => {
    try {
      const res = await chatAPI.getMessages(token);
      const { messages: msgs, status, assigned_agent } = res.data;
      setMessages(msgs);
      setChatStatus(status);
      if (assigned_agent) setAssignedAgent(assigned_agent);
    } catch {}
  }, []);

  useEffect(() => {
    if (!sessionToken || !open) return;
    if (!['human_requested', 'assigned'].includes(chatStatus)) return;

    // Fetch immediately on status change
    fetchMessages(sessionToken);

    // Then poll every 3 seconds
    const intervalId = setInterval(() => fetchMessages(sessionToken), 3000);
    return () => clearInterval(intervalId);
  }, [sessionToken, chatStatus, open, fetchMessages]);

  // Track unread when chat is closed
  useEffect(() => {
    if (!open && messages.length > 0) {
      const agentMessages = messages.filter(m => m.sender !== 'visitor');
      const lastSeen = parseInt(localStorage.getItem('chat_last_seen') || '0', 10);
      const newCount = agentMessages.filter(m => new Date(m.created_at).getTime() > lastSeen).length;
      if (newCount > 0) setUnread(newCount);
    }
    if (open) {
      localStorage.setItem('chat_last_seen', String(Date.now()));
    }
  }, [messages, open]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || !sessionToken || loading) return;
    setInput('');

    // Optimistic UI
    const optimistic = { id: Date.now(), sender: 'visitor', message: msg, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);

    if (['human_requested', 'assigned'].includes(chatStatus)) {
      // Just send — then immediately re-fetch so the thread stays live
      try {
        await chatAPI.sendMessage({ session_token: sessionToken, message: msg });
        await fetchMessages(sessionToken);
      } catch {}
      return;
    }

    setBotTyping(true);
    setLoading(true);
    try {
      const res = await chatAPI.sendMessage({ session_token: sessionToken, message: msg });
      if (res.data.reply) {
        // Small delay so typing indicator shows
        await new Promise(r => setTimeout(r, 600));
        setBotTyping(false);
        setMessages(prev => [...prev, res.data.reply]);
      } else {
        setBotTyping(false);
      }
    } catch {
      setBotTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot',
        message: "I'm having trouble responding right now. Please try again or connect with our team.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ── Human request submit ─────────────────────────────────────────────────
  const handleHumanRequest = async (form) => {
    setHumanLoading(true);
    try {
      await chatAPI.requestHuman({
        session_token: sessionToken,
        visitor_name:  form.name,
        visitor_email: form.email,
        visitor_phone: form.phone,
      });
      setChatStatus('human_requested');
      setShowHumanForm(false);
      // Refresh messages to show bot confirmation
      const res = await chatAPI.getMessages(sessionToken);
      setMessages(res.data.messages);
    } catch {
      // silently fail
    } finally {
      setHumanLoading(false);
    }
  };

  const handleOpen = () => { setOpen(true); setMinimized(false); setUnread(0); };

  const statusBanner = () => {
    if (chatStatus === 'human_requested') return (
      <div className="flex items-center gap-1.5 bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-700">
        <AlertCircle className="w-3.5 h-3.5" />
        Waiting for an agent to join… we'll be with you shortly.
      </div>
    );
    if (chatStatus === 'assigned') return (
      <div className="flex items-center gap-1.5 bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-700">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {assignedAgent ? `${assignedAgent} has joined the chat` : 'A support agent has joined your chat!'}
      </div>
    );
    if (chatStatus === 'resolved') return (
      <div className="flex items-center gap-2 bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs text-slate-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        Chat resolved. <button onClick={() => { localStorage.removeItem('chat_session_token'); setSessionToken(null); setMessages([]); setChatStatus('active'); initSession(); }} className="text-indigo-600 underline ml-1 inline-flex items-center gap-0.5"><RefreshCw className="w-3 h-3" />Start new chat</button>
      </div>
    );
    return null;
  };

  return (
    <>
      {/* ── FAB button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[9990] w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-300 hover:shadow-xl hover:shadow-indigo-400 flex items-center justify-center text-white transition-shadow"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[9990] w-[360px] rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col bg-slate-50"
            style={{ maxHeight: minimized ? 60 : '520px' }}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-4 py-3.5 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Mac — MACRO Assistant</p>
                <p className="text-[11px] text-white/70">
                  {chatStatus === 'assigned' ? `Chatting with ${assignedAgent || 'support agent'}` :
                   chatStatus === 'human_requested' ? 'Agent joining soon…' : 'Online · Typically replies instantly'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(m => !m)} className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                  {minimized ? <ChevronDown className="w-3.5 h-3.5 rotate-180" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Status banner */}
                {statusBanner()}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0" style={{ maxHeight: '320px' }}>
                  {initError ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center gap-3">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <p className="text-sm text-slate-500">Couldn't connect. Please check your internet.</p>
                      <button onClick={initSession} className="text-xs text-indigo-600 underline">Try again</button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                    </div>
                  ) : (
                    messages.map((msg, i) => <MessageBubble key={msg.id || i} msg={msg} />)
                  )}
                  <AnimatePresence>{botTyping && <TypingIndicator />}</AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions — show only for active bot chat and few messages */}
                {chatStatus === 'active' && messages.length <= 2 && !showHumanForm && (
                  <div className="px-3 pb-1 flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => sendMessage(s.text)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Human request form */}
                <AnimatePresence>
                  {showHumanForm && (
                    <HumanRequestForm
                      onSubmit={handleHumanRequest}
                      onCancel={() => setShowHumanForm(false)}
                      loading={humanLoading}
                    />
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-slate-200 bg-white px-3 py-2.5 space-y-2">
                  {/* Connect with person button — always visible unless form open or already connected/resolved */}
                  {!showHumanForm && !['assigned', 'resolved'].includes(chatStatus) && (
                    <button
                      onClick={() => chatStatus === 'active' && setShowHumanForm(true)}
                      disabled={chatStatus === 'human_requested'}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-colors
                        ${chatStatus === 'human_requested'
                          ? 'text-amber-700 bg-amber-50 border-amber-200 cursor-default'
                          : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer'}`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {chatStatus === 'human_requested' ? 'Waiting for support agent…' : 'Connect with a real person'}
                    </button>
                  )}

                  {/* Input */}
                  {chatStatus !== 'resolved' && (
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                        }}
                        placeholder={
                          chatStatus === 'human_requested' ? 'Type while you wait for an agent…' :
                          chatStatus === 'assigned' ? 'Message your agent…' : 'Type a message…'
                        }
                        className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
                        style={{ maxHeight: '80px' }}
                        disabled={loading}
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || loading}
                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center text-white transition-colors"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Powered by MACRO AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Public export — only renders on public pages ──────────────────────────────
export default function ChatWidget() {
  const location = useLocation();
  const isAdminOrAuth = /^\/(admin|employee|login|signup)/.test(location.pathname);
  if (isAdminOrAuth) return null;
  return <ChatWidgetInner />;
}
