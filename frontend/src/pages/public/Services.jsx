import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../../services/api';
import { ArrowRight, Code, Globe, Shield, Zap, Server, Rocket, Sparkles, Search } from 'lucide-react';
import { useSEO } from '../../utils/useSEO';
import { SoftwareDevVector } from '../../components/HeroVectors';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    publicAPI.services().then(r => setServices(r.data?.data || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const grads = [
    'from-indigo-500 to-blue-600', 'from-violet-500 to-purple-600',
    'from-cyan-500 to-teal-600', 'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-500', 'from-emerald-500 to-green-600',
  ];
  const icons = [Code, Globe, Shield, Zap, Server, Rocket];

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    (s.excerpt || s.description || '').toLowerCase().includes(search.toLowerCase())
  );

  useSEO({
    title: 'Our Services | Custom Software & Technology Solutions | MACRO Solutions',
    description: 'Browse MACRO Solutions\u2019 full service catalog: web & mobile apps, custom software, cloud, AI automation, cybersecurity. Expert global engineering, delivered on time.',
    keywords: 'software services UK, custom software development, web development company, mobile app developers, cloud solutions, AI services, cybersecurity',
    canonical: '/services',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent)]" />
        <Orb size="500px" x="-5%" y="-10%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" />
        <Orb size="350px" x="65%" y="30%" delay={3} gradient="radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /><span>What We Offer</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-slate-500 text-lg mb-8 max-w-xl">
                End-to-end technology solutions tailored for modern enterprises — from concept to deployment and beyond.
              </motion.p>
              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-300 focus:bg-white transition-all" />
              </motion.div>
            </div>
            {/* Right: Software Dev Vector */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="relative h-[480px] hidden lg:flex items-center justify-center">
              <SoftwareDevVector accent="indigo" />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-50/40 to-transparent" />
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No services found matching &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <motion.div key={service.id}
                    initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group relative bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grads[i % grads.length]} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">{service.excerpt || service.description}</p>
                    <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition">
                      Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] bg-gradient-to-br ${grads[i % grads.length]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.18),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Can not find what you need?
            </h2>
            <p className="text-white/50 mb-8">We build custom solutions. Tell us your challenge and we will craft the perfect fit.</p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
