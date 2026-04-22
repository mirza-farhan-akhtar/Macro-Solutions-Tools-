import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, Navigation, Clock, BarChart3 } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function Transport() {
  const solutions = [
    { title: 'Fleet Management', description: 'Real-time vehicle tracking & optimization' },
    { title: 'Route Optimization', description: 'AI-powered routing algorithms' },
    { title: 'Logistics Platforms', description: 'End-to-end supply chain software' },
    { title: 'Last-Mile Delivery', description: 'Efficient delivery management' },
    { title: 'Driver Management', description: 'Scheduling, compliance & safety' },
    { title: 'Transport Analytics', description: 'Operational insights & reporting' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-sm font-medium mb-6"><Truck className="w-4 h-4" /> Transport & Logistics</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Optimize Your<span className="block bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Fleet & Routes</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Smart logistics and transport technology solutions — real-time GPS tracking, route optimization, predictive maintenance, and last-mile delivery intelligence.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow">Optimize Fleet <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">1M+</div><div className="text-sm text-slate-500">Trips Tracked</div></div>
                <div><div className="text-2xl font-black text-slate-900">Real-time</div><div className="text-sm text-slate-500">GPS</div></div>
                <div><div className="text-2xl font-black text-slate-900">Zero</div><div className="text-sm text-slate-500">Delays</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <IndustryVector Icon={Truck} label="Transport" color="#0284c7" secondaryColor="#1d4ed8" stats={[{value:"GPS",label:"Tracking"},{value:"Fleet",label:"Management"},{value:"Real",label:"Time"}]} />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Moving Smarter</h2>
            <p className="text-lg text-gray-600">Technology that optimizes every mile of your transportation network.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Navigation, title: 'Tracked', desc: 'Real-time GPS tracking' },
              { icon: Clock, title: 'On-Time', desc: 'Delivery optimization' },
              { icon: BarChart3, title: 'Efficient', desc: 'Cost-saving analytics' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-sky-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">Transport Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-sky-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Modernize Your Fleet</h2>
            <p className="text-lg text-gray-600 mb-8">Smart transport tech for operational excellence</p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
