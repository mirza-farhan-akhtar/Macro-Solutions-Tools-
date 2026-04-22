/**
 * HeroVectors.jsx
 * Advanced 3D animated SVG illustration components for hero sections.
 * Each vector is thematic to its page and uses Framer Motion for animation.
 * All vectors maintain the liquid-glass design system.
 */
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────
   Shared Glass Panel wrapper (liquid glass effect)
───────────────────────────────────────────────── */
export function GlassPanel({ children, className = '', style = {} }) {
  return (
    <div
      className={`relative bg-white/70 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden ${className}`}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/30 to-indigo-50/40 pointer-events-none rounded-2xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   1. SOFTWARE DEVELOPMENT VECTOR (Home slide 1 / WhatWeDo)
   Depicts: Code editor window + floating UI components
───────────────────────────────────────────────── */
export function SoftwareDevVector({ accent = 'indigo' }) {
  const colors = {
    indigo: { a: '#6366f1', b: '#8b5cf6', c: '#3b82f6', line1: '#a5b4fc', line2: '#c4b5fd' },
    violet: { a: '#7c3aed', b: '#4f46e5', c: '#06b6d4', line1: '#c4b5fd', line2: '#a5b4fc' },
    cyan: { a: '#0891b2', b: '#10b981', c: '#6366f1', line1: '#67e8f9', line2: '#6ee7b7' },
  };
  const c = colors[accent] || colors.indigo;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, ${c.a}, transparent 70%)` }} />

      {/* Main code editor glass panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="relative"
      >
        <GlassPanel className="w-80 p-0 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/40" style={{ background: `linear-gradient(135deg, ${c.a}15, ${c.b}10)` }}>
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-slate-400 font-mono">App.tsx</span>
          </div>
          {/* Code lines */}
          <div className="p-5 font-mono text-xs space-y-1.5">
            {[
              { indent: 0, color: c.a, text: 'export function App() {' },
              { indent: 1, color: c.b, text: '  const [data, setData] = useState([]);' },
              { indent: 1, color: '#10b981', text: '  useEffect(() => {' },
              { indent: 2, color: '#64748b', text: '    fetchData().then(setData);' },
              { indent: 1, color: '#10b981', text: '  }, []);' },
              { indent: 1, color: c.a, text: '  return <Dashboard data={data} />' },
              { indent: 0, color: c.a, text: '}' },
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <span className="text-slate-300 w-4 text-right text-[10px]">{i + 1}</span>
                <span style={{ color: line.color }}>{line.text}</span>
              </motion.div>
            ))}
            {/* Cursor blink */}
            <motion.div
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-4 ml-2" style={{ background: c.a }}
            />
          </div>
        </GlassPanel>
      </motion.div>

      {/* Floating metric cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-2"
      >
        <GlassPanel className="px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">Build Passing</span>
        </GlassPanel>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-8 left-2"
      >
        <GlassPanel className="px-3 py-2">
          <div className="text-xs font-black text-slate-900">300+</div>
          <div className="text-[10px] text-slate-400">Projects Live</div>
        </GlassPanel>
      </motion.div>

      {/* Git branch indicator */}
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2"
      >
        <GlassPanel className="px-3 py-2 flex items-center gap-2">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill={c.a}>
            <circle cx="4" cy="4" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="4" r="1.5" />
            <path d="M4 5.5v5M5.5 4h5M12 5.5v5" stroke={c.a} strokeWidth="1.5" fill="none" />
          </svg>
          <span className="text-xs font-semibold text-slate-700">main</span>
        </GlassPanel>
      </motion.div>

      {/* Animated connection dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = 175;
        const x = Math.cos((deg - 90) * Math.PI / 180) * r;
        const y = Math.sin((deg - 90) * Math.PI / 180) * r;
        return (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
            style={{ position: 'absolute', left: `calc(50% + ${x}px - 4px)`, top: `calc(50% + ${y}px - 4px)` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: i % 2 === 0 ? c.a : c.b }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   2. AI / BRAIN VECTOR (Home slide 2 / AI Services)
   Depicts: Neural network + data streams
───────────────────────────────────────────────── */
export function AIVector({ accent = 'violet' }) {
  const nodes = [
    // Input layer
    { id: 0, x: 60, y: 80 }, { id: 1, x: 60, y: 160 }, { id: 2, x: 60, y: 240 },
    // Hidden layer 1
    { id: 3, x: 180, y: 60 }, { id: 4, x: 180, y: 140 }, { id: 5, x: 180, y: 220 }, { id: 6, x: 180, y: 300 },
    // Hidden layer 2
    { id: 7, x: 300, y: 80 }, { id: 8, x: 300, y: 160 }, { id: 9, x: 300, y: 240 },
    // Output
    { id: 10, x: 400, y: 160 },
  ];
  const edges = [
    [0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],
    [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,8],[6,9],
    [7,10],[8,10],[9,10],
  ];
  const c = accent === 'violet' ? { a: '#7c3aed', b: '#06b6d4', node: '#8b5cf6' } : { a: '#6366f1', b: '#8b5cf6', node: '#6366f1' };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: `radial-gradient(circle, ${c.a}, transparent 70%)` }} />

      <GlassPanel className="p-4">
        <svg viewBox="0 0 460 360" width="100%" style={{ maxWidth: 420, maxHeight: 320 }}>
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c.a} stopOpacity="0.3" />
              <stop offset="100%" stopColor={c.b} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map(([from, to], i) => (
            <motion.line
              key={i}
              x1={nodes[from].x} y1={nodes[from].y} x2={nodes[to].x} y2={nodes[to].y}
              stroke="url(#edgeGrad)" strokeWidth="1.5" strokeOpacity="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
            />
          ))}

          {/* Animated data pulse along edges */}
          {edges.slice(0, 8).map(([from, to], i) => (
            <motion.circle
              key={`pulse-${i}`}
              r="3" fill={i % 2 === 0 ? c.a : c.b} filter="url(#glow)"
              animate={{
                cx: [nodes[from].x, nodes[to].x],
                cy: [nodes[from].y, nodes[to].y],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'linear' }}
            />
          ))}

          {/* Nodes */}
          {nodes.map((n, i) => (
            <g key={n.id}>
              <motion.circle
                cx={n.x} cy={n.y} r={i === 10 ? 14 : 10}
                fill={i === 10 ? c.a : 'rgba(255,255,255,0.9)'}
                stroke={c.a} strokeWidth="2"
                animate={{ r: [i === 10 ? 14 : 10, i === 10 ? 16 : 12, i === 10 ? 14 : 10] }}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                filter="url(#glow)"
              />
              {i === 10 && (
                <motion.circle
                  cx={n.x} cy={n.y} r="20"
                  fill="none" stroke={c.a} strokeWidth="2" strokeOpacity="0.5"
                  animate={{ r: [20, 28, 20], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </g>
          ))}

          {/* Layer labels */}
          {[{ x: 60, label: 'Input' }, { x: 180, label: 'Layer 1' }, { x: 300, label: 'Layer 2' }, { x: 400, label: 'Output' }].map((l, i) => (
            <text key={i} x={l.x} y="330" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="monospace">{l.label}</text>
          ))}
        </svg>
      </GlassPanel>

      {/* Floating accuracy badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 right-4"
      >
        <GlassPanel className="px-3 py-2 text-center">
          <div className="text-lg font-black" style={{ color: c.a }}>97.4%</div>
          <div className="text-[10px] text-slate-400">Accuracy</div>
        </GlassPanel>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-4 left-4"
      >
        <GlassPanel className="px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.b }} />
          <span className="text-xs font-bold text-slate-700">Model Training</span>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   3. CLOUD / DEVOPS VECTOR (Home slide 3)
   Depicts: Infrastructure topology + CI/CD pipeline
───────────────────────────────────────────────── */
export function CloudVector({ accent = 'cyan' }) {
  const c = accent === 'cyan' ? { a: '#0891b2', b: '#10b981', c: '#6366f1' } : { a: '#6366f1', b: '#0891b2', c: '#10b981' };
  const nodes = [
    { label: 'Git', icon: '⬡', x: 50, y: 80, color: '#f97316' },
    { label: 'Build', icon: '⚙', x: 160, y: 80, color: c.a },
    { label: 'Test', icon: '✓', x: 270, y: 80, color: '#10b981' },
    { label: 'Deploy', icon: '▲', x: 380, y: 80, color: c.b },
    { label: 'Monitor', icon: '◉', x: 380, y: 200, color: '#8b5cf6' },
    { label: 'AWS', icon: '☁', x: 160, y: 200, color: '#f59e0b' },
    { label: 'DB', icon: '⊕', x: 270, y: 200, color: '#06b6d4' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: `radial-gradient(circle, ${c.a}, transparent 70%)` }} />

      <GlassPanel className="p-5 w-[440px]">
        {/* Pipeline header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">CI/CD Pipeline</span>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-600 font-semibold">Live</span>
          </motion.div>
        </div>

        <svg viewBox="0 0 440 300" width="100%" height="220">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill={c.a} opacity="0.6" />
            </marker>
          </defs>

          {/* Pipeline arrows (row 1) */}
          {[[50,80,160,80],[160,80,270,80],[270,80,380,80]].map(([x1,y1,x2,y2],i) => (
            <motion.line key={`arr-${i}`}
              x1={x1+20} y1={y1} x2={x2-20} y2={y2}
              stroke={c.a} strokeWidth="2" strokeOpacity="0.5"
              markerEnd="url(#arrow)" strokeDasharray="4 3"
              animate={{ strokeDashoffset: [0, -14] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: i * 0.25 }}
            />
          ))}

          {/* Vertical connectors */}
          {[[380,80,380,200],[270,80,270,200],[160,80,160,200]].map(([x1,y1,x2,y2],i) => (
            <line key={`vert-${i}`} x1={x1} y1={y1+20} x2={x2} y2={y2-20}
              stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
          ))}

          {/* Nodes */}
          {nodes.map((n, i) => (
            <motion.g key={n.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: 'backOut' }}
            >
              <rect x={n.x - 26} y={n.y - 22} width="52" height="44" rx="10"
                fill="rgba(255,255,255,0.85)" stroke={n.color} strokeWidth="2"
                filter="url(#gshadow)"
              />
              <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="16" fill={n.color}>{n.icon}</text>
              <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600" fontFamily="sans-serif">{n.label}</text>

              {/* Pulse ring on "Deploy" node */}
              {n.label === 'Deploy' && (
                <motion.circle cx={n.x} cy={n.y} r="30"
                  fill="none" stroke={n.color} strokeWidth="1.5" opacity="0"
                  animate={{ r: [25, 40], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.g>
          ))}

          {/* Stats row */}
          {[
            { x: 50, label: 'Uptime', value: '99.9%', color: '#10b981' },
            { x: 180, label: 'Deploy', value: '2.1min', color: c.a },
            { x: 310, label: 'Coverage', value: '94%', color: '#8b5cf6' },
          ].map((s, i) => (
            <motion.g key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <rect x={s.x - 38} y="240" width="76" height="46" rx="10"
                fill="rgba(255,255,255,0.7)" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x={s.x} y="260" textAnchor="middle" fontSize="13" fontWeight="800" fill={s.color} fontFamily="sans-serif">{s.value}</text>
              <text x={s.x} y="276" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">{s.label}</text>
            </motion.g>
          ))}
        </svg>
      </GlassPanel>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   4. GLOBE / INDUSTRIES VECTOR (WhoWeHelp)
   Depicts: World map dots + orbiting industry icons
───────────────────────────────────────────────── */
export function GlobeVector({ industries = [], accent = 'emerald' }) {
  const c = { a: '#10b981', b: '#06b6d4' };
  const ringData = [
    { w: 320, dur: 22, ccw: false },
    { w: 230, dur: 16, ccw: true },
    { w: 150, dur: 10, ccw: false },
  ];
  const orbitItems = industries.slice(0, 8);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, ${c.a}, transparent 70%)` }} />

      {/* Rotating orbit rings */}
      {ringData.map((r, i) => (
        <motion.div
          key={i}
          animate={{ rotate: r.ccw ? -360 : 360 }}
          transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border"
          style={{ width: r.w, height: r.w, borderColor: `${i === 0 ? c.a : c.b}25` }}
        />
      ))}

      {/* Latitude lines (globe wireframe) */}
      {[-50, 0, 50].map((offset, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 280, height: 80,
            borderColor: `${c.a}15`,
            transform: `rotateX(70deg) translateY(${offset}px)`,
          }}
        />
      ))}

      {/* Central globe icon */}
      <GlassPanel className="w-20 h-20 flex items-center justify-center absolute z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
          </svg>
        </div>
      </GlassPanel>

      {/* Orbiting industry icons */}
      {orbitItems.map((ind, i) => {
        const angle = (i / orbitItems.length) * 360;
        const radius = 150;
        const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
        const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
        const Icon = ind.icon;
        return (
          <motion.div
            key={ind.name}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            style={{ position: 'absolute', left: `calc(50% + ${x}px - 22px)`, top: `calc(50% + ${y}px - 22px)`, zIndex: 10 }}
          >
            <GlassPanel className="w-11 h-11 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center shadow-md`}>
                {Icon && <Icon className="w-4 h-4 text-white" />}
              </div>
            </GlassPanel>
          </motion.div>
        );
      })}

      {/* Client count badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-4 right-8"
      >
        <GlassPanel className="px-3 py-2 text-center">
          <div className="text-lg font-black" style={{ color: c.a }}>50+</div>
          <div className="text-[10px] text-slate-400">Countries</div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   5. ABOUT / COMPANY VECTOR
   Depicts: Org chart + team collaboration
───────────────────────────────────────────────── */
export function CompanyVector() {
  const members = [
    { label: 'CEO', x: 200, y: 40, color: '#6366f1' },
    { label: 'CTO', x: 100, y: 130, color: '#8b5cf6' },
    { label: 'COO', x: 300, y: 130, color: '#0891b2' },
    { label: 'Dev', x: 40, y: 220, color: '#10b981' },
    { label: 'Dev', x: 140, y: 220, color: '#10b981' },
    { label: 'Design', x: 250, y: 220, color: '#f97316' },
    { label: 'PM', x: 350, y: 220, color: '#ec4899' },
  ];
  const connections = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

      <GlassPanel className="p-4 w-[420px]">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Our Global Team</div>
        <svg viewBox="0 0 400 300" width="100%" height="240">
          {connections.map(([from, to], i) => (
            <motion.line
              key={i}
              x1={members[from].x} y1={members[from].y + 18}
              x2={members[to].x} y2={members[to].y - 18}
              stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
          ))}
          {members.map((m, i) => (
            <motion.g key={i}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, ease: 'backOut' }}
            >
              <circle cx={m.x} cy={m.y} r="22" fill="rgba(255,255,255,0.9)" stroke={m.color} strokeWidth="2.5" />
              {/* Avatar initials */}
              <text x={m.x} y={m.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={m.color} fontFamily="sans-serif">
                {m.label.slice(0, 2)}
              </text>
              <text x={m.x} y={m.y + 38} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">{m.label}</text>

              {/* Online indicator */}
              <motion.circle
                cx={m.x + 16} cy={m.y - 14} r="5"
                fill="#10b981"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.g>
          ))}

          {/* Stats band */}
          {[
            { x: 60, n: '150+', l: 'Engineers' },
            { x: 200, n: '5', l: 'Offices' },
            { x: 340, n: '25+', l: 'Countries' },
          ].map((s, i) => (
            <motion.g key={s.l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
              <text x={s.x} y="270" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6366f1" fontFamily="sans-serif">{s.n}</text>
              <text x={s.x} y="284" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">{s.l}</text>
            </motion.g>
          ))}
        </svg>
      </GlassPanel>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   6. CAREERS VECTOR
   Depicts: Job pipeline / talent funnel
───────────────────────────────────────────────── */
export function CareersVector() {
  const stages = ['Apply', 'Review', 'Interview', 'Offer', 'Welcome!'];
  const colors = ['#6366f1', '#8b5cf6', '#0891b2', '#10b981', '#f59e0b'];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

      <GlassPanel className="p-6 w-80">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 text-center">Hiring Pipeline</div>
        <div className="space-y-3">
          {stages.map((s, i) => (
            <motion.div
              key={s}
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[(i+1)%colors.length]})` }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700">{s}</span>
                  {i < 4 && <span className="text-xs text-slate-400">{[120, 45, 12, 6][i]} candidates</span>}
                </div>
                <motion.div
                  className="h-1.5 rounded-full overflow-hidden bg-slate-100"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors[i]}, ${colors[(i+1)%colors.length]})` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${[100, 38, 10, 5, 0][i]}%` }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="mt-5 p-3 rounded-xl text-center"
          style={{ background: 'linear-gradient(135deg, #6366f115, #8b5cf615)' }}
        >
          <div className="text-lg font-black text-indigo-600">🎉 We're Hiring!</div>
          <div className="text-xs text-slate-500 mt-1">Join 150+ talented engineers</div>
        </motion.div>
      </GlassPanel>

      {/* Floating perks */}
      {[
        { label: 'Remote OK', color: '#10b981', top: '10%', right: '-5%' },
        { label: '£ Competitive', color: '#6366f1', bottom: '15%', left: '-5%' },
      ].map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }} transition={{ duration: 3 + i, repeat: Infinity }}
          className="absolute"
          style={{ top: p.top, right: p.right, bottom: p.bottom, left: p.left }}
        >
          <GlassPanel className="px-3 py-1.5">
            <span className="text-xs font-bold" style={{ color: p.color }}>{p.label}</span>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   7. CONTACT VECTOR
   Depicts: World map with office pins
───────────────────────────────────────────────── */
export function ContactVector() {
  const offices = [
    { city: 'Bristol', x: '22%', y: '30%', color: '#6366f1' },
    { city: 'Lahore', x: '62%', y: '42%', color: '#8b5cf6' },
    { city: 'Dubai', x: '56%', y: '50%', color: '#f97316' },
    { city: 'Addis Ababa', x: '50%', y: '60%', color: '#10b981' },
    { city: 'Hargeisa', x: '53%', y: '58%', color: '#0891b2' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <GlassPanel className="w-80 h-72 p-4 overflow-hidden">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Our Global Offices</div>
        <div className="relative w-full h-52">
          {/* Simplified world map SVG */}
          <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full opacity-30">
            <path d="M50,80 Q100,60 150,70 Q200,80 250,65 Q300,55 350,70 L350,150 Q300,160 250,155 Q200,150 150,160 Q100,155 50,140 Z" fill="#e2e8f0" />
            <path d="M80,95 Q120,85 160,90 Q200,95 240,88 Q280,82 320,92" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
          </svg>

          {/* Office pins */}
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              className="absolute flex flex-col items-center"
              style={{ left: o.x, top: o.y, transform: 'translate(-50%,-100%)' }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              {/* Pulse rings */}
              <motion.div
                className="absolute w-8 h-8 rounded-full"
                style={{ background: `${o.color}20`, top: 8, left: -4 }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
              {/* Pin */}
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[8px] font-black"
                style={{ background: o.color }}>●</div>
              <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap shadow"
                style={{ background: o.color }}>{o.city}</div>
            </motion.div>
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {offices.slice(1).map((o, i) => (
              <motion.line
                key={i}
                x1="22%" y1="30%"
                x2={o.x} y2={o.y}
                stroke={o.color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3"
                animate={{ strokeDashoffset: [0, -12] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </svg>
        </div>
      </GlassPanel>

      {/* Response time badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute top-4 right-0"
      >
        <GlassPanel className="px-3 py-2 text-center">
          <div className="text-sm font-black text-indigo-600">24h</div>
          <div className="text-[10px] text-slate-400">Response</div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   8. BLOGS / CONTENT VECTOR
   Depicts: Article cards + reading metrics
───────────────────────────────────────────────── */
export function BlogsVector() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-56 h-56 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

      <div className="relative space-y-3 w-72">
        {[
          { title: 'The Future of AI in Enterprise', tag: 'AI', color: '#8b5cf6', read: '5 min' },
          { title: 'Cloud Architecture Best Practices', tag: 'Cloud', color: '#0891b2', read: '8 min' },
          { title: 'Building Scalable React Apps', tag: 'Dev', color: '#10b981', read: '6 min' },
        ].map((post, i) => (
          <motion.div
            key={i}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, y: [0, i % 2 === 0 ? -4 : 4, 0] }}
            transition={{ delay: i * 0.2, duration: 0.5, y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 } }}
          >
            <GlassPanel className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${post.color}, ${post.color}bb)` }}>
                {post.tag}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 leading-tight truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">{post.read} read</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} className="w-2 h-2 rounded-sm" style={{ background: s <= 4 ? post.color : '#e2e8f0' }} />
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   9. GENERIC INDUSTRY VECTOR (for industry pages)
   Takes a primary icon, label, and color
───────────────────────────────────────────────── */
export function IndustryVector({ Icon, label, color = '#6366f1', secondaryColor = '#8b5cf6', stats = [] }) {
  const hexPoints = (cx, cy, r) => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />

      {/* Hexagon grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 400">
        {[0,1,2,3].map(row => [0,1,2,3].map(col => (
          <polygon
            key={`${row}-${col}`}
            points={hexPoints(70 + col * 80 + (row % 2) * 40, 60 + row * 70, 30)}
            fill="none" stroke={color} strokeWidth="1"
          />
        )))}
      </svg>

      {/* Main glass card */}
      <GlassPanel className="p-8 text-center w-72">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl relative"
          style={{ background: `linear-gradient(135deg, ${color}, ${secondaryColor})` }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4), transparent 60%)' }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {Icon && <Icon className="w-12 h-12 text-white relative z-10" />}
        </motion.div>

        <h3 className="text-xl font-black text-slate-900 mb-1">{label}</h3>
        <p className="text-sm text-slate-400 mb-6">Industry Solutions</p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-2 rounded-xl"
                style={{ background: `${color}10` }}
              >
                <div className="text-base font-black" style={{ color }}>{s.value}</div>
                <div className="text-[9px] text-slate-500 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Orbiting dots */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const r = 180;
        const x = Math.cos((deg - 90) * Math.PI / 180) * r;
        const y = Math.sin((deg - 90) * Math.PI / 180) * r;
        return (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            style={{ position: 'absolute', left: `calc(50% + ${x}px - 5px)`, top: `calc(50% + ${y}px - 5px)` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: i % 2 === 0 ? color : secondaryColor }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   10. FAQ VECTOR
───────────────────────────────────────────────── */
export function FAQVector() {
  const faqs = ['How long does a project take?', 'What technologies do you use?', 'Do you offer support?'];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="space-y-4 w-72">
        {faqs.map((q, i) => (
          <motion.div
            key={i}
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <GlassPanel className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-black text-xs">Q</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-snug">{q}</p>
              </div>
              {i === 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-3 pl-10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-black text-xs">A</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">Typically 6-16 weeks depending on complexity and scope.</p>
                  </div>
                </motion.div>
              )}
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   11. SERVICE DETAIL VECTOR (generic service)
───────────────────────────────────────────────── */
export function ServiceDetailVector({ Icon, label, color = '#6366f1', features = [] }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-60 h-60 rounded-full blur-3xl opacity-15" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />

      <GlassPanel className="p-7 w-72">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
          >
            {Icon && <Icon className="w-8 h-8 text-white" />}
          </motion.div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{label}</h3>
            <p className="text-xs text-slate-400">Enterprise Service</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {(features.length > 0 ? features : ['Custom Development', 'Agile Delivery', 'Quality Assured', 'Post-launch Support']).map((f, i) => (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                <svg className="w-3 h-3" fill={color} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-slate-600 font-medium">{f}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
          className="mt-5 px-4 py-2.5 rounded-xl text-center text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          Get a Free Quote →
        </motion.div>
      </GlassPanel>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   12. AI SERVICES 3D VECTOR (AI Services hero)
   Depicts: 3D glowing AI brain sphere + orbiting
   capability nodes with animated data streams
───────────────────────────────────────────────── */
export function AIServicesVector() {
  const cx = 250, cy = 250, sr = 78;
  const orbitR = 175;

  // 6 capability nodes orbiting the sphere
  const caps = [
    { label: 'Machine Learning', angle: -90,  color: '#7c3aed', bg: '#ede9fe', sym: 'ML' },
    { label: 'Computer Vision',  angle: -30,  color: '#0891b2', bg: '#e0f2fe', sym: 'CV' },
    { label: 'NLP',              angle:  30,  color: '#06b6d4', bg: '#cffafe', sym: 'NL' },
    { label: 'Predictive AI',    angle:  90,  color: '#10b981', bg: '#d1fae5', sym: 'PA' },
    { label: 'Automation',       angle: 150,  color: '#f59e0b', bg: '#fef3c7', sym: 'AU' },
    { label: 'Generative AI',    angle: 210,  color: '#ec4899', bg: '#fce7f3', sym: 'GA' },
  ].map(cap => ({
    ...cap,
    x: cx + orbitR * Math.cos((cap.angle * Math.PI) / 180),
    y: cy + orbitR * Math.sin((cap.angle * Math.PI) / 180),
  }));

  // Latitude rings on sphere (simulate 3D)
  const latRings = [-3, -1.5, 0, 1.5, 3].map(offset => {
    const dy = offset * 18;
    const rx = Math.sqrt(Math.max(0, sr * sr - dy * dy)) * 0.98;
    const ry = Math.max(3, 6 + Math.abs(offset) * 1.5);
    return { dy, rx, ry };
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.10), rgba(236,72,153,0.06), transparent)' }} />

      <svg viewBox="0 0 500 500" width="100%" style={{ maxWidth: 480, maxHeight: 480 }}>
        <defs>
          {/* Sphere radial gradient – simulates top-left lighting */}
          <radialGradient id="aiSphereGrad" cx="35%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#c4b5fd" />
            <stop offset="38%"  stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2e1065" />
          </radialGradient>
          {/* Ring gradient */}
          <linearGradient id="aiRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#ec4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          {/* Soft glow filter */}
          <filter id="aiGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="aiGlowStrong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer ambient halo */}
        <circle cx={cx} cy={cy} r="115" fill="rgba(124,58,237,0.07)" filter="url(#aiGlowStrong)" />

        {/* Connecting lines from sphere to nodes */}
        {caps.map((cap, i) => (
          <motion.line
            key={`line-${i}`}
            x1={cx} y1={cy} x2={cap.x} y2={cap.y}
            stroke={cap.color} strokeWidth="1.5" strokeDasharray="7 5"
            animate={{ strokeOpacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
          />
        ))}

        {/* Animated data pulses along each connection */}
        {caps.map((cap, i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="4.5" fill={cap.color} filter="url(#aiGlow)"
            animate={{
              cx: [cx, cap.x],
              cy: [cy, cap.y],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.55 + 0.3, ease: 'easeIn' }}
          />
        ))}

        {/* Sphere latitude rings (3D illusion) */}
        {latRings.map(({ dy, rx, ry }, i) => (
          <ellipse key={`lat-${i}`}
            cx={cx} cy={cy + dy} rx={rx} ry={ry}
            fill="none" stroke="rgba(196,181,253,0.22)" strokeWidth="1"
          />
        ))}
        {/* Sphere meridian rings */}
        <ellipse cx={cx} cy={cy} rx={28} ry={sr} fill="none" stroke="rgba(196,181,253,0.18)" strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx={55} ry={sr} fill="none" stroke="rgba(196,181,253,0.13)" strokeWidth="1" />

        {/* Main sphere body */}
        <circle cx={cx} cy={cy} r={sr} fill="url(#aiSphereGrad)" filter="url(#aiGlow)" />

        {/* Specular highlight */}
        <ellipse cx={cx - 20} cy={cy - 22} rx={22} ry={14} fill="rgba(255,255,255,0.18)" />
        <ellipse cx={cx - 12} cy={cy - 28} rx={8} ry={5} fill="rgba(255,255,255,0.25)" />

        {/* Animated equatorial ring */}
        <motion.g style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}>
          <ellipse cx={cx} cy={cy} rx={94} ry={22}
            fill="none" stroke="url(#aiRingGrad)" strokeWidth="3" strokeDasharray="22 8" strokeLinecap="round" />
        </motion.g>

        {/* Secondary tilted ring */}
        <motion.g style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
          <ellipse cx={cx} cy={cy} rx={100} ry={32} fill="none"
            stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" strokeDasharray="14 10"
            transform={`rotate(30, ${cx}, ${cy})`} />
        </motion.g>

        {/* Pulse ring expanding outward */}
        <motion.circle cx={cx} cy={cy} r={sr + 5} fill="none"
          stroke="rgba(124,58,237,0.4)" strokeWidth="2"
          animate={{ r: [sr + 5, sr + 30, sr + 5], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* "AI" text in sphere center */}
        <text x={cx} y={cy + 5} textAnchor="middle" dominantBaseline="middle"
          fontSize="32" fontWeight="900" fill="rgba(255,255,255,0.92)"
          fontFamily="'Inter', system-ui, sans-serif" letterSpacing="2">
          AI
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="rgba(196,181,253,0.8)" fontFamily="monospace" letterSpacing="3">
          NEURAL
        </text>

        {/* Capability node cards */}
        {caps.map((cap, i) => (
          <motion.g key={`cap-${i}`}
            animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 3 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}>
            {/* Node background rect */}
            <rect x={cap.x - 30} y={cap.y - 20} width="60" height="40" rx="10"
              fill={cap.bg} stroke={cap.color} strokeWidth="1.5" filter="url(#aiGlow)" />
            {/* Symbol */}
            <text x={cap.x} y={cap.y - 4} textAnchor="middle" fontSize="11" fontWeight="900"
              fill={cap.color} fontFamily="'Inter', system-ui, monospace">{cap.sym}</text>
            {/* Label */}
            <text x={cap.x} y={cap.y + 10} textAnchor="middle" fontSize="7.5"
              fill="#64748b" fontFamily="system-ui">{cap.label.split(' ')[0]}</text>
            {/* Active indicator dot */}
            <motion.circle cx={cap.x + 24} cy={cap.y - 14} r="3" fill={cap.color}
              animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
          </motion.g>
        ))}
      </svg>

      {/* Floating metric badges */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity }}
        className="absolute top-3 right-3 pointer-events-none">
        <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 shadow-xl shadow-violet-500/20 border border-violet-100 text-center backdrop-blur-sm">
          <div className="text-xl font-black text-violet-600">99.2%</div>
          <div className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Accuracy</div>
        </div>
      </motion.div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.8, repeat: Infinity, delay: 0.6 }}
        className="absolute bottom-3 left-3 pointer-events-none">
        <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 shadow-xl shadow-pink-500/20 border border-pink-100 text-center backdrop-blur-sm">
          <div className="text-xl font-black text-pink-600">50+</div>
          <div className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">AI Models</div>
        </div>
      </motion.div>

      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1.2 }}
        className="absolute top-3 left-3 pointer-events-none">
        <div className="px-3 py-2 rounded-2xl bg-white/95 shadow-xl shadow-emerald-500/20 border border-emerald-100 flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">Real-time</span>
        </div>
      </motion.div>

      <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
        className="absolute bottom-3 right-3 pointer-events-none">
        <div className="px-3 py-2 rounded-2xl bg-white/95 shadow-xl shadow-cyan-500/20 border border-cyan-100 flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-xs font-bold text-slate-700">24/7 Active</span>
        </div>
      </motion.div>
    </div>
  );
}
