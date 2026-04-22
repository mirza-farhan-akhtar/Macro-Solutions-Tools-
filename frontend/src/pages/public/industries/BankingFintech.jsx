import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, Shield, Lock, TrendingUp, CreditCard } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function BankingFintech() {
  const solutions = [
    { title: 'Digital Banking', description: 'Complete online banking platforms' },
    { title: 'Payment Solutions', description: 'Secure payment processing systems' },
    { title: 'Fraud Detection', description: 'AI-powered fraud prevention' },
    { title: 'Regulatory Compliance', description: 'PCI-DSS, KYC, AML compliance' },
    { title: 'Blockchain Integration', description: 'Distributed ledger solutions' },
    { title: 'Financial Analytics', description: 'Risk modeling and insights' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium mb-6"><Landmark className="w-4 h-4" /> Banking & Fintech</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Future of<span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Finance</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Build secure, compliant financial platforms with bank-grade encryption, real-time transactions, and regulatory adherence across every layer of your fintech stack.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow">Innovate Finance <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">$1B+</div><div className="text-sm text-slate-500">Transactions</div></div>
                <div><div className="text-2xl font-black text-slate-900">PCI-DSS</div><div className="text-sm text-slate-500">Compliant</div></div>
                <div><div className="text-2xl font-black text-slate-900">24/7</div><div className="text-sm text-slate-500">Support</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-80 h-72 flex items-end justify-center pb-8 gap-3">
                {/* Animated chart bars */}
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div key={i}
                    initial={{ height: 0 }}
                    animate={{ height: h * 1.8 }}
                    transition={{ duration: 1, delay: i * 0.12, ease: 'easeOut' }}
                    className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600/60 to-indigo-400/80 border border-indigo-400/30 relative"
                    style={{ minHeight: 8 }}
                  >
                    {i === 5 && (
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-300 whitespace-nowrap"
                      >+18%</motion.div>
                    )}
                  </motion.div>
                ))}
                {/* Coin circle decoration */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-4 right-8 w-20 h-20 rounded-full border-2 border-dashed border-purple-400/30 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-400/40 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-indigo-400" />
                  </div>
                </motion.div>
                {/* X-axis line */}
                <div className="absolute bottom-8 left-4 right-4 h-px bg-white/10" />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Future of Finance</h2>
            <p className="text-lg text-gray-600">Build secure, scalable financial platforms that meet the highest regulatory standards.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Secure', desc: 'Bank-grade security' },
              { icon: Shield, title: 'Compliant', desc: 'Full regulatory' },
              { icon: TrendingUp, title: 'Scalable', desc: 'Grows with you' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">Fintech Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-indigo-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Build the Future of Finance</h2>
            <p className="text-lg text-gray-600 mb-8">Secure, innovative solutions for financial services</p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Let's Talk <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
