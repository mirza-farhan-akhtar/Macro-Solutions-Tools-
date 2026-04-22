import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Users, Shield, Clock, Zap, Star,
  MessageCircle, Globe, Award, Rocket, Phone
} from 'lucide-react';
import { useLeadForm } from '../context/LeadFormContext';

/* ─── Reusable Glass Card ─── */
function GlassCard({ children, className = '' }) {
  return (
    <div className={`relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_40px_rgba(99,102,241,0.06)] rounded-2xl ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 via-white/40 to-indigo-50/30 pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceHero — Light professional hero for all service pages
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceHero({ badge, title, highlight, description, accentColor = 'indigo', icon: HeroIcon, image, children }) {
  const { openLeadForm } = useLeadForm();
  const colors = {
    indigo:  { gradient: 'from-indigo-500 to-blue-600',   bg: 'from-indigo-50/50 via-white to-blue-50/30',   badge: 'bg-indigo-50 border-indigo-100 text-indigo-600', dot: 'bg-indigo-500', orb1: 'from-indigo-200/30', orb2: 'from-blue-200/20' },
    violet:  { gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50/50 via-white to-purple-50/30', badge: 'bg-violet-50 border-violet-100 text-violet-600', dot: 'bg-violet-500', orb1: 'from-violet-200/30', orb2: 'from-purple-200/20' },
    cyan:    { gradient: 'from-cyan-500 to-teal-600',     bg: 'from-cyan-50/50 via-white to-teal-50/30',     badge: 'bg-cyan-50 border-cyan-100 text-cyan-600',       dot: 'bg-cyan-500',   orb1: 'from-cyan-200/30',   orb2: 'from-teal-200/20' },
    blue:    { gradient: 'from-blue-500 to-cyan-600',     bg: 'from-blue-50/50 via-white to-cyan-50/30',     badge: 'bg-blue-50 border-blue-100 text-blue-600',       dot: 'bg-blue-500',   orb1: 'from-blue-200/30',   orb2: 'from-cyan-200/20' },
    emerald: { gradient: 'from-emerald-500 to-teal-600',  bg: 'from-emerald-50/50 via-white to-teal-50/30',  badge: 'bg-emerald-50 border-emerald-100 text-emerald-600', dot: 'bg-emerald-500', orb1: 'from-emerald-200/30', orb2: 'from-teal-200/20' },
    rose:    { gradient: 'from-rose-500 to-pink-600',     bg: 'from-rose-50/50 via-white to-pink-50/30',     badge: 'bg-rose-50 border-rose-100 text-rose-600',       dot: 'bg-rose-500',   orb1: 'from-rose-200/30',   orb2: 'from-pink-200/20' },
    amber:   { gradient: 'from-amber-500 to-orange-600',  bg: 'from-amber-50/50 via-white to-orange-50/30',  badge: 'bg-amber-50 border-amber-100 text-amber-600',    dot: 'bg-amber-500',  orb1: 'from-amber-200/30',  orb2: 'from-orange-200/20' },
    pink:    { gradient: 'from-pink-500 to-rose-600',     bg: 'from-pink-50/50 via-white to-rose-50/30',     badge: 'bg-pink-50 border-pink-100 text-pink-600',       dot: 'bg-pink-500',   orb1: 'from-pink-200/30',   orb2: 'from-rose-200/20' },
    orange:  { gradient: 'from-orange-500 to-amber-600',  bg: 'from-orange-50/50 via-white to-amber-50/30',  badge: 'bg-orange-50 border-orange-100 text-orange-600', dot: 'bg-orange-500', orb1: 'from-orange-200/30', orb2: 'from-amber-200/20' },
    green:   { gradient: 'from-green-500 to-emerald-600', bg: 'from-green-50/50 via-white to-emerald-50/30', badge: 'bg-green-50 border-green-100 text-green-600',    dot: 'bg-green-500',  orb1: 'from-green-200/30',  orb2: 'from-emerald-200/20' },
    red:     { gradient: 'from-red-500 to-rose-600',      bg: 'from-red-50/50 via-white to-rose-50/30',      badge: 'bg-red-50 border-red-100 text-red-600',          dot: 'bg-red-500',    orb1: 'from-red-200/30',    orb2: 'from-rose-200/20' },
  };
  const c = colors[accentColor] || colors.indigo;
  const dark = !!image;

  return (
    <section className={`relative py-28 lg:py-36 overflow-hidden ${dark ? 'bg-slate-900' : `bg-gradient-to-br ${c.bg}`}`}>
      {/* Background image with Ken Burns zoom */}
      {dark && (
        <>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/70 to-slate-900/30" />
          <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-10`} />
        </>
      )}
      {/* Light-mode decorations */}
      {!dark && (
        <>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <motion.div animate={{ x: [0, 20, -15, 0], y: [0, -20, 15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-[10%] right-[10%] w-72 h-72 bg-gradient-to-br ${c.orb1} to-transparent rounded-full blur-3xl pointer-events-none`} />
          <motion.div animate={{ x: [0, -15, 10, 0], y: [0, 15, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className={`absolute bottom-[15%] left-[5%] w-60 h-60 bg-gradient-to-br ${c.orb2} to-transparent rounded-full blur-3xl pointer-events-none`} />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-8 ${dark ? 'bg-white/10 border-white/20 text-white' : c.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dark ? 'bg-white' : c.dot}`} /> {badge}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className={`text-4xl md:text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}>
              {title}{' '}<span className={`bg-gradient-to-r ${c.gradient} bg-clip-text text-transparent`}>{highlight}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-lg leading-relaxed mb-10 max-w-xl ${dark ? 'text-white/70' : 'text-slate-500'}`}>{description}</motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 flex-wrap">
              <button onClick={() => openLeadForm({ service: badge })} className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r ${c.gradient} text-white font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all`}>
                Start Your Project <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/services" className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all ${dark ? 'border border-white/25 text-white/80 hover:bg-white/10 hover:text-white' : 'border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-700 hover:border-indigo-200 hover:bg-white'}`}>
                All Services
              </Link>
            </motion.div>
          </div>
          {/* RIGHT: Always shows animated icon vector */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center h-[400px]">
            {children || (
              <>
                <div className={`absolute w-56 h-56 bg-gradient-to-br ${c.orb1} to-transparent rounded-full blur-3xl`} />
                <GlassCard className="p-10 text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    {HeroIcon && <HeroIcon className="w-10 h-10 text-white" />}
                  </motion.div>
                  <p className="text-slate-900 font-black text-lg">{badge}</p>
                  <p className="text-slate-400 text-sm mt-1">Enterprise-grade solutions</p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0, 0.3, 0.6].map((d, i) => (
                      <motion.span key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: d }}
                        className={`w-2 h-2 rounded-full bg-gradient-to-br ${c.gradient} inline-block`} />
                    ))}
                  </div>
                </GlassCard>
              </>
            )}
          </motion.div>
        </div>
      </div>
      {dark && <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceProcess — Timeline process section
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceProcess({ steps, accentColor = 'indigo' }) {
  const gradients = {
    indigo: 'from-indigo-500 to-blue-600', violet: 'from-violet-500 to-purple-600',
    cyan: 'from-cyan-500 to-teal-600', blue: 'from-blue-500 to-cyan-600',
    emerald: 'from-emerald-500 to-teal-600', rose: 'from-rose-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600', pink: 'from-pink-500 to-rose-600',
    orange: 'from-orange-500 to-amber-600', green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-rose-600',
  };
  const g = gradients[accentColor] || gradients.indigo;

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Process</p>
          <h2 className="text-4xl font-black text-slate-900">How We <span className={`bg-gradient-to-r ${g} bg-clip-text text-transparent`}>Deliver</span></h2>
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-transparent hidden md:block" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200/40 flex-shrink-0`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <GlassCard className="flex-1 p-6 hover:shadow-lg transition-all">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceTechStack — Technologies/tools section
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceTechStack({ title = 'Technologies We Use', technologies }) {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Tech Stack</p>
          <h2 className="text-4xl font-black text-slate-900">{title}</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {technologies.map((tech, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-2xl mb-2">{tech.icon}</div>
                <p className="text-sm font-bold text-slate-700">{tech.name}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceWhyChoose — Why choose us section
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceWhyChoose({ reasons, accentColor = 'indigo' }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
          <h2 className="text-4xl font-black text-slate-900">The <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">MACRO</span> Advantage</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon || CheckCircle;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{reason.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{reason.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceTestimonials — Social proof section
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceTestimonials() {
  const testimonials = [
    { name: 'Sarah Mitchell', role: 'CTO, TechVentures', text: 'MACRO Solutions delivered our platform 3 weeks ahead of schedule. Their engineering quality is exceptional.', rating: 5 },
    { name: 'Ahmed Hassan', role: 'Founder, FinFlow', text: 'Working with MACRO transformed our business. Their AI integration saved us 40% in operational costs.', rating: 5 },
    { name: 'Emily Zhang', role: 'VP Engineering, CloudScale', text: 'Professional, reliable, and innovative. MACRO is our go-to partner for all software projects.', rating: 5 },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-black text-slate-900">What Our <span className="text-indigo-600">Clients</span> Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-7 h-full flex flex-col hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ServiceCTA — Bottom call-to-action
   ═══════════════════════════════════════════════════════════════════ */
export function ServiceCTA({ title = 'Ready to Get Started?', description = 'Let us help you build something amazing.', accentColor = 'indigo', service = '' }) {
  const { openLeadForm } = useLeadForm();
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{title}</h2>
          <p className="text-white/60 mb-8">{description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openLeadForm({ service })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              Start a Project <ArrowRight className="w-4 h-4" />
            </button>
            <a href="tel:+447386118117" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { GlassCard };
