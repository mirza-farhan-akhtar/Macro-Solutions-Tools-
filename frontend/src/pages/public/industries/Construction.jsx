import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HardHat, ArrowRight, Building2, ClipboardCheck, Ruler } from 'lucide-react';
import { IndustryVector } from '../../../components/HeroVectors';
import { useLeadForm } from '../../../context/LeadFormContext';

export default function Construction() {
  const { openLeadForm } = useLeadForm();
  const solutions = [
    { title: 'Project Management', description: 'End-to-end construction project tools' },
    { title: 'BIM Solutions', description: 'Building information modeling' },
    { title: 'Safety Compliance', description: 'Digital safety management systems' },
    { title: 'Resource Planning', description: 'Equipment and labor scheduling' },
    { title: 'Site Monitoring', description: 'IoT-based real-time site tracking' },
    { title: 'Cost Estimation', description: 'AI-powered accurate budgeting' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-red-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-sm font-medium mb-6"><HardHat className="w-4 h-4" /> Construction Technology</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Build Smarter<span className="block bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">With Digital</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Modern digital tools for construction management — from real-time project dashboards and compliance tracking to BIM integration and smart site safety systems.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-shadow">Build Smarter <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">300+</div><div className="text-sm text-slate-500">Projects</div></div>
                <div><div className="text-2xl font-black text-slate-900">30%</div><div className="text-sm text-slate-500">Cost Savings</div></div>
                <div><div className="text-2xl font-black text-slate-900">On-time</div><div className="text-sm text-slate-500">Delivery</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-80 h-72 overflow-hidden">
                {/* Blueprint grid */}
                <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(202,138,4,1) 1px, transparent 1px), linear-gradient(90deg, rgba(202,138,4,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                {/* Animated blueprint drawing lines */}
                {[
                  { x1:40, y1:60, x2:240, y2:60, delay:0.2 },
                  { x1:40, y1:60, x2:40, y2:200, delay:0.6 },
                  { x1:40, y1:200, x2:240, y2:200, delay:1.0 },
                  { x1:240, y1:60, x2:240, y2:200, delay:1.4 },
                  { x1:100, y1:60, x2:100, y2:200, delay:1.8 },
                  { x1:40, y1:130, x2:240, y2:130, delay:2.2 },
                ].map(({ x1, y1, x2, y2, delay }, i) => (
                  <svg key={i} className="absolute inset-0 w-full h-full" viewBox="0 0 320 288">
                    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="rgba(234,179,8,0.7)" strokeWidth="2"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay, repeat: Infinity, repeatDelay: 4 }}
                    />
                  </svg>
                ))}
                {/* Central HardHat badge */}
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-20 h-20 rounded-2xl bg-yellow-200/40 border border-yellow-400/40 flex items-center justify-center"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <HardHat className="w-10 h-10 text-yellow-400" />
                </motion.div>
                {/* Corner markers */}
                {[[40,60],[240,60],[40,200],[240,200]].map(([x,y], i) => (
                  <div key={i} className="absolute w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-400" style={{ left: x - 6, top: y - 6 }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Building the Future</h2>
            <p className="text-lg text-gray-600">Technology that brings construction projects on time and under budget.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: 'Planned', desc: 'Complete project visibility' },
              { icon: ClipboardCheck, title: 'Compliant', desc: 'Safety-first approach' },
              { icon: Ruler, title: 'Precise', desc: 'Accurate estimations' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">Construction Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-yellow-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Digitize Construction</h2>
            <p className="text-lg text-gray-600 mb-8">Modern tools for modern building</p>
            <button onClick={() => openLeadForm()} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
