import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, ArrowRight, TrendingUp, BarChart3, Users, ShoppingBag } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function RetailCPG() {
  const solutions = [
    { title: 'POS Integration', description: 'Unified point-of-sale systems' },
    { title: 'Supply Chain', description: 'End-to-end visibility' },
    { title: 'Customer Analytics', description: 'Deep consumer insights' },
    { title: 'Loyalty Programs', description: 'Retain and reward customers' },
    { title: 'Omnichannel Experience', description: 'Seamless across all channels' },
    { title: 'Demand Forecasting', description: 'AI-powered predictions' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-sm font-medium mb-6"><Store className="w-4 h-4" /> Retail & CPG</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Retail Innovation<span className="block bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">At Scale</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Transform retail and CPG operations with intelligent technology — omnichannel experiences, smart inventory systems, loyalty programs, and consumer behavior analytics.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow">Transform Retail <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">500+</div><div className="text-sm text-slate-500">Brands</div></div>
                <div><div className="text-2xl font-black text-slate-900">40%</div><div className="text-sm text-slate-500">Revenue Lift</div></div>
                <div><div className="text-2xl font-black text-slate-900">Omni</div><div className="text-sm text-slate-500">Channel</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Floating price tag shapes */}
                {[
                  { x: -110, y: -80, label: '$24.99', angle: -15, delay: 0 },
                  { x: 80, y: -100, label: 'SALE -30%', angle: 10, delay: 0.4 },
                  { x: -100, y: 60, label: 'New Season', angle: -8, delay: 0.8 },
                  { x: 70, y: 70, label: 'Best Seller', angle: 12, delay: 1.2 },
                ].map(({ x, y, label, angle, delay }, i) => (
                  <motion.div key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay }}
                    className="absolute px-3 py-1.5 rounded-lg bg-white/8 border border-pink-400/30 text-pink-200 text-xs font-semibold backdrop-blur-sm"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, rotate: `${angle}deg` }}
                  >
                    {label}
                  </motion.div>
                ))}
                {/* Barcode decoration */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {Array.from({ length: 20 }, (_, i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                      className="bg-pink-400/50" style={{ width: i % 3 === 0 ? 3 : 2, height: i % 5 === 0 ? 24 : 18 }}
                    />
                  ))}
                </div>
                {/* Central Store icon */}
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 w-24 h-24 rounded-3xl bg-pink-500/15 border border-pink-400/30 flex items-center justify-center"
                >
                  <Store className="w-12 h-12 text-pink-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Reinvent Retail</h2>
            <p className="text-lg text-gray-600">Digital solutions that connect brands with consumers across every touchpoint.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Omnichannel', desc: 'Unified experience' },
              { icon: TrendingUp, title: 'Growth', desc: 'Revenue increase' },
              { icon: BarChart3, title: 'Intelligence', desc: 'Smart analytics' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-pink-500 pl-6 py-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card p-12 rounded-2xl text-center border border-white/20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Elevate Retail?</h2>
            <p className="text-lg text-gray-600 mb-8">Modern solutions for modern retail challenges</p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
