import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Users, BarChart3, TrendingUp, Shield, Zap } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function PublicSector() {
  const solutions = [
    { title: 'Digital Transformation', description: 'Modernize government services' },
    { title: 'Citizen Portals', description: 'Easy access to services' },
    { title: 'Data Management', description: 'Secure data handling' },
    { title: 'Compliance & Security', description: 'Meet regulatory requirements' },
    { title: 'Workflow Automation', description: 'Streamline operations' },
    { title: 'Analytics & Reporting', description: 'Data-driven decisions' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6"><Building2 className="w-4 h-4" /> Public Sector Solutions</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Modernize<span className="block bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Government</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Empower government agencies with modern, citizen-centric technology — from digital service portals and compliance management to secure data infrastructure and workflow automation.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow">Partner With Us <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">50+</div><div className="text-sm text-slate-500">Agencies Served</div></div>
                <div><div className="text-2xl font-black text-slate-900">100%</div><div className="text-sm text-slate-500">Compliant</div></div>
                <div><div className="text-2xl font-black text-slate-900">24/7</div><div className="text-sm text-slate-500">Support</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-72 h-72 flex items-end justify-center gap-4 pb-4">
                {/* Government columns */}
                {[{h:160,w:32},{h:200,w:40},{h:180,w:32}].map(({h,w},i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                    className="bg-gradient-to-t from-blue-700/60 to-blue-400/40 border border-blue-400/30 rounded-t-sm"
                    style={{ width: w }}
                  >
                    <div className="h-4 bg-blue-300/30 border-b border-blue-400/30 mx-1 rounded-t-sm" />
                  </motion.div>
                ))}
                {/* Pediment (triangular roof line) */}
                <div className="absolute" style={{ bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
                  <div style={{ width: 0, height: 0, borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderBottom: '40px solid rgba(59,130,246,0.3)' }} />
                </div>
                {/* Base platform */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-200/40 border border-blue-400/20 rounded-sm" />
                {/* Building2 icon */}
                <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center"
                >
                  <Building2 className="w-5 h-5 text-blue-300" />
                </motion.div>
                {/* Rotating outer ring */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-72 h-72 rounded-full border border-dashed border-blue-500/15"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Overview Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Serving Government Excellence</h2>
            <p className="text-lg text-gray-600">
              We help public sector organizations modernize operations, improve citizen services, and achieve digital transformation goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Citizen-Centric', desc: 'User-focused solutions' },
              { icon: Shield, title: 'Secure', desc: 'Enterprise security' },
              { icon: TrendingUp, title: 'Compliant', desc: 'Regulatory adherence' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-xl text-center"
              >
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Our Solutions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-l-4 border-blue-600 pl-6 py-4"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Government Experience', desc: 'Years of public sector expertise' },
              { title: 'Compliance Expert', desc: 'Meet all regulatory standards' },
              { title: 'Scalable Solutions', desc: 'Grow with your agency' },
              { title: 'Security First', desc: 'Protect citizen data' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl border-l-4 border-blue-600"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 rounded-2xl text-center border border-white/20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let's modernize your government agency
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
