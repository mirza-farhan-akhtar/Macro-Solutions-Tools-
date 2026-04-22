import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSEO } from '../../utils/useSEO';
import { publicAPI, getImageUrl } from '../../services/api';
import {
  Users, Award, Globe, Zap, ArrowRight, Sparkles,
  Rocket, Shield, Heart, Star, Code, Target, Eye,
  Building2, Linkedin, Twitter, Mail, CheckCircle,
  TrendingUp, Clock, DollarSign, Lightbulb
} from 'lucide-react';

/* ─── Animated Counter ───────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  return (
    <motion.span
      onViewportEnter={() => {
        if (started.current) return;
        started.current = true;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / (duration * 1000), 1);
          setCount(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }}
      viewport={{ once: true }}
    >
      {count}{suffix}
    </motion.span>
  );
}

/* ─── Floating Orb ───────────────────────────────────────────────── */
function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function About() {
  const [pageContent, setPageContent] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'About MACRO Solutions Tools Ltd | Global UK Software Company',
    description: 'MACRO Solutions Tools Ltd is a global software development company headquartered in Bristol, UK with offices in Pakistan, Somaliland, Ethiopia, and Dubai. 500+ clients, 1000+ projects delivered across 5 continents.',
    keywords: 'about MACRO Solutions, software company UK Bristol, IT company Pakistan, tech firm Dubai, Ethiopia software development, Somaliland technology, global software house',
    canonical: '/about',
  });

  useEffect(() => {
    (async () => {
      try {
        const [aboutRes, teamRes] = await Promise.allSettled([
          publicAPI.about(),
          publicAPI.team(),
        ]);
        if (aboutRes.status === 'fulfilled') setPageContent(aboutRes.value.data);
        if (teamRes.status === 'fulfilled') setTeamMembers(teamRes.value.data?.data || teamRes.value.data || []);
        try {
          const logosRes = await publicAPI.clientLogos();
          setClientLogos(logosRes.data?.data || logosRes.data || []);
        } catch {}
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  const milestones = [
    { year: '2015', title: 'Company Founded', desc: 'MACRO Solutions Tools Ltd launched in Bristol, UK with a mission to deliver world-class software to global enterprises.' },
    { year: '2017', title: 'First International Clients', desc: 'Expanded beyond the UK, delivering solutions for clients across Europe, the Middle East, and Africa.' },
    { year: '2019', title: 'Pakistan Office Opened', desc: 'Established our South Asia hub to harness elite engineering talent and serve a rapidly growing global market.' },
    { year: '2021', title: 'East Africa Expansion', desc: 'Opened dedicated offices in Hargeisa, Somaliland and Addis Ababa, Ethiopia — bringing enterprise technology to East Africa.' },
    { year: '2022', title: 'Dubai Office Launched', desc: 'Entered the MENA market with our Dubai, UAE office, serving the booming Gulf technology ecosystem.' },
    { year: '2024', title: '1000+ Projects & Recognition', desc: 'Crossed 1,000 successful deliveries across 5 continents with 98% client satisfaction and industry awards.' },
  ];

  const values = [
    { icon: Lightbulb, title: 'Innovation', desc: 'We relentlessly pursue new ideas and embrace emerging technology to stay ahead of the curve.', col: 'indigo' },
    { icon: Heart, title: 'Integrity', desc: 'Honesty and transparency guide every decision we make with our clients and team.', col: 'rose' },
    { icon: Users, title: 'Collaboration', desc: 'Great outcomes come from working together — we treat every client as a true partner.', col: 'violet' },
    { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in every line of code and every interaction.', col: 'amber' },
    { icon: Globe, title: 'Global Mindset', desc: 'Our teams span three continents — bringing genuine local insight from the UK, South Asia, East Africa, and the Gulf to every problem we solve. Diversity of perspective is one of our greatest technical assets.', col: 'cyan' },
    { icon: Rocket, title: 'Growth', desc: 'We help our clients, our people, and our company grow — continuously and sustainably.', col: 'emerald' },
  ];

  const palettes = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-600', ring: 'ring-indigo-100', text: 'text-indigo-600' },
    rose: { bg: 'bg-rose-50', icon: 'bg-rose-600', ring: 'ring-rose-100', text: 'text-rose-600' },
    violet: { bg: 'bg-violet-50', icon: 'bg-violet-600', ring: 'ring-violet-100', text: 'text-violet-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-600', ring: 'ring-amber-100', text: 'text-amber-600' },
    cyan: { bg: 'bg-cyan-50', icon: 'bg-cyan-600', ring: 'ring-cyan-100', text: 'text-cyan-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', ring: 'ring-emerald-100', text: 'text-emerald-600' },
  };

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_40%_20%,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,rgba(6,182,212,0.08),transparent)]" />
        <Orb size="600px" x="-8%" y="-15%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.2) 55%, transparent 70%)" />
        <Orb size="400px" x="65%" y="40%" delay={3} gradient="radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Who We Are</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-slate-900">We Build</span><br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Extraordinary</span><br />
                <span className="text-slate-700">Software</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
                className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
                Founded in Bristol and built for the world. We combine the rigour of UK engineering standards with the creativity and drive of teams across South Asia, East Africa, and the Gulf — delivering technology that creates real, measurable outcomes for every client we work with.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex gap-10 pt-8 border-t border-slate-200">
                {[{ n: 500, s: '+', label: 'Clients' }, { n: 1000, s: '+', label: 'Projects' }, { n: 98, s: '%', label: 'CSAT' }].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-black text-slate-900"><Counter to={stat.n} suffix={stat.s} /></p>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Crystal Prism + Values Network */}
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
              className="relative flex items-center justify-center h-80 w-full">

              {/* SVG connection lines from center to value nodes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 320" preserveAspectRatio="xMidYMid meet">
                {[
                  { x2: 210, y2: 20 },   /* top */
                  { x2: 370, y2: 90 },   /* top-right */
                  { x2: 370, y2: 230 },  /* bottom-right */
                  { x2: 210, y2: 300 },  /* bottom */
                  { x2: 50, y2: 230 },   /* bottom-left */
                  { x2: 50, y2: 90 },    /* top-left */
                ].map(({ x2, y2 }, i) => (
                  <motion.line key={i} x1="210" y1="160" x2={x2} y2={y2}
                    stroke={['rgba(99,102,241,0.35)','rgba(6,182,212,0.35)','rgba(139,92,246,0.35)','rgba(245,158,11,0.35)','rgba(16,185,129,0.35)','rgba(244,63,94,0.35)'][i]}
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                  />
                ))}
              </svg>

              {/* Value nodes orbiting */}
              {[
                { icon: Lightbulb, label: 'Innovation', angle: 270, col: 'border-indigo-400/50 bg-indigo-500/10 text-indigo-300' },
                { icon: Code, label: 'Dev Team', angle: 330, col: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300' },
                { icon: Shield, label: 'Security', angle: 30, col: 'border-violet-400/50 bg-violet-500/10 text-violet-300' },
                { icon: Star, label: 'Excellence', angle: 90, col: 'border-amber-400/50 bg-amber-500/10 text-amber-300' },
                { icon: Globe, label: 'Global', angle: 150, col: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300' },
                { icon: Heart, label: 'Integrity', angle: 210, col: 'border-rose-400/50 bg-rose-500/10 text-rose-300' },
              ].map(({ icon: Icon, label, angle, col }, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <motion.div key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className={`absolute flex flex-col items-center gap-1`}
                    style={{ left: `calc(50% + ${Math.cos(rad) * 135}px - 22px)`, top: `calc(50% + ${Math.sin(rad) * 130}px - 22px)` }}
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${col}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] text-white/50 font-medium whitespace-nowrap">{label}</span>
                  </motion.div>
                );
              })}

              {/* Central prism diamond */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-24 h-24 flex items-center justify-center"
              >
                {/* Prism shape using clip-path */}
                <div className="absolute inset-0 rounded-2xl rotate-45" style={{
                  background: 'linear-gradient(135deg, rgba(165,180,252,0.9) 0%, rgba(99,102,241,0.85) 35%, rgba(109,40,217,0.9) 70%, rgba(6,182,212,0.6) 100%)',
                  boxShadow: '0 0 60px rgba(99,102,241,0.7), 0 0 120px rgba(139,92,246,0.3)',
                }} />
                {/* Shine on prism */}
                <div className="absolute inset-0 rounded-2xl rotate-45 overflow-hidden">
                  <div className="absolute top-[5%] left-[5%] w-[40%] h-[35%] bg-white/30 blur-sm" />
                </div>
                {/* Zap/brand icon */}
                <Zap className="relative z-10 w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>

              {/* Pulsing glow rings */}
              {[80, 110].map((r, i) => (
                <motion.div key={r}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.08, 0.3] }}
                  transition={{ duration: 2.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                  className="absolute rounded-full border border-indigo-400/40"
                  style={{ width: r * 2, height: r * 2 }}
                />
              ))}

              {/* Rotating dashed ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-56 h-56 rounded-full border border-dashed border-indigo-400/20"
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ══ STATS BAR ══════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, n: 500, s: '+', label: 'Global Clients', col: 'text-indigo-600' },
              { icon: Award, n: 1000, s: '+', label: 'Projects Delivered', col: 'text-violet-600' },
              { icon: Globe, n: 25, s: '+', label: 'Countries Served', col: 'text-cyan-600' },
              { icon: TrendingUp, n: 98, s: '%', label: 'Client Satisfaction', col: 'text-emerald-600' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`text-4xl font-black ${stat.col} mb-1`}><Counter to={stat.n} suffix={stat.s} /></div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR STORY / TIMELINE ═════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
              A Decade of <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Innovation</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-transparent -translate-x-px" />

            <div className="space-y-10 md:space-y-0">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: isLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`md:flex md:items-center md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} mb-10`}>
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
                        <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">{m.year}</span>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{m.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                    {/* Center dot */}
                    <div className="hidden md:flex flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-4 border-white shadow-lg z-10" />
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ VISION & MISSION ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative group bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Vision</p>
                <h3 className="text-3xl font-black mb-4 leading-tight">Shaping Technology's Future</h3>
                <p className="text-white/75 leading-relaxed">
                  To be the global leader in innovative technology, transforming businesses through cutting-edge software and AI-powered automation that drives sustainable growth worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative group bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Mission</p>
                <h3 className="text-3xl font-black mb-4 leading-tight">Delivering Exceptional Value</h3>
                <p className="text-white/75 leading-relaxed">
                  To deliver exceptional software solutions that empower businesses to achieve their full potential through innovative, scalable, and secure technologies.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CORE VALUES ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
              Our Core <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Values</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => {
              const p = palettes[val.col];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className={`${p.bg} rounded-2xl p-7 border border-transparent hover:border-slate-200 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl ${p.icon} ring-4 ${p.ring} flex items-center justify-center mb-5`}>
                    <val.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TEAM ═══════════════════════════════════════════════════════ */}
      {teamMembers.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">The People Behind Macro</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
                Meet Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Team</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    {member.photo ? (
                      <img src={getImageUrl(member.photo)} alt={member.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:shadow-indigo-500/20 transition-shadow" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-black text-2xl">{member.name?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                  <p className="text-indigo-600 text-xs font-semibold mb-3">{member.role || member.position}</p>
                  {member.bio && <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{member.bio}</p>}
                  {/* Social links */}
                  <div className="flex justify-center gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center text-slate-400 transition-colors">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-colors">
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CLIENT LOGOS ═══════════════════════════════════════════════ */}
      {clientLogos.length > 0 && (
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center mb-10">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Trusted By</p>
            <h2 className="text-3xl font-black text-slate-900">Companies That Trust <span className="text-indigo-600">Macro</span></h2>
          </div>
          {clientLogos.length >= 5 ? (
            /* Marquee scroll for many logos */
            <div className="relative">
              <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="flex gap-12 items-center" style={{ width: 'max-content' }}>
                {[...clientLogos, ...clientLogos].map((logo, i) => (
                  <div key={i} className="flex-shrink-0 bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    {logo.logo_full_url ? (
                      <img src={getImageUrl(logo.logo_full_url)} alt={logo.name} className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm px-2">
                        <Building2 className="w-5 h-5 flex-shrink-0" />{logo.name}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            /* Centered grid for few logos */
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <div className="flex flex-wrap justify-center gap-6">
                {clientLogos.map((logo, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    {logo.logo_full_url ? (
                      <img src={getImageUrl(logo.logo_full_url)} alt={logo.name} className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm px-2">
                        <Building2 className="w-5 h-5 flex-shrink-0" />{logo.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══ CTA ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.2),transparent)]" />
        <Orb size="500px" x="5%" y="-5%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)" opacity={0.28} />
        <Orb size="300px" x="65%" y="30%" delay={2} gradient="radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)" opacity={0.2} />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-4">Join Our Story</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Ready to Be Part of <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Something Great?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you are looking for a technology partner, career opportunities, or simply want to learn more about what we do — we would love to connect.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300 hover:-translate-y-0.5">
                Get In Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 border border-white/15 text-white/80 hover:bg-white/12 hover:text-white font-semibold rounded-xl transition-all duration-300">
                View Careers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
