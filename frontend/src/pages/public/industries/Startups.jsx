import { motion } from 'framer-motion';
import { Rocket, Zap, ArrowRight, TrendingUp, Lightbulb, Users, Target } from 'lucide-react';
import { IndustryVector } from '../../../components/HeroVectors';
import { useLeadForm } from '../../../context/LeadFormContext';

export default function Startups() {
  const { openLeadForm } = useLeadForm();
  const solutions = [
    { title: 'MVP Development', description: 'Build your product quickly' },
    { title: 'Cloud Integration', description: 'Scalable infrastructure' },
    { title: 'Mobile Apps', description: 'Reach your users' },
    { title: 'Backend Services', description: 'Robust API development' },
    { title: 'DevOps Setup', description: 'Streamlined deployment' },
    { title: 'Growth Tools', description: 'Analytics and monitoring' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-red-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-300 text-sm font-medium mb-6"><Lightbulb className="w-4 h-4" /> Startup Solutions</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Launch Your<span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Vision</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Turn your idea into a market-ready product with proven technical expertise — rapid MVP development, scalable cloud infrastructure, and growth-focused engineering tailored for startups.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow">Build Together <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">300+</div><div className="text-sm text-slate-500">Products Built</div></div>
                <div><div className="text-2xl font-black text-slate-900">Series A+</div><div className="text-sm text-slate-500">Success Rate</div></div>
                <div><div className="text-2xl font-black text-slate-900">Fast</div><div className="text-sm text-slate-500">MVP Delivery</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-72 h-80 flex items-center justify-center">
                {/* Rocket trajectory arc */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 320">
                  <path d="M60,280 Q100,200 144,140 Q188,80 230,40" fill="none" stroke="rgba(249,115,22,0.25)" strokeWidth="2" strokeDasharray="6,4" />
                  {/* Particle dots along path */}
                  {[0.2, 0.4, 0.6, 0.8].map((p, i) => {
                    const x = 60 + (230 - 60) * p; const y = 280 - (280 - 40) * p;
                    return <motion.circle key={i} cx={x} cy={y} r={3} fill="rgba(249,115,22,0.6)" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />;
                  })}
                </svg>
                {/* Stars */}
                {[[40,30],[200,60],[60,120],[240,140],[30,200]].map(([x,y],i) => (
                  <motion.div key={i} animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-orange-300/60"
                    style={{ left: x, top: y }}
                  />
                ))}
                {/* Rocket icon at top of trajectory */}
                <motion.div animate={{ y: [-8, 0, -8], rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/40 flex items-center justify-center"
                  style={{ top: 30, right: 20 }}
                >
                  <Zap className="w-10 h-10 text-orange-400" />
                </motion.div>
                {/* Launch pad at bottom */}
                <div className="absolute bottom-4 left-8 w-24 h-2 bg-orange-200/40 border border-orange-400/20 rounded-full" />
                {/* Idea bulb at base */}
                <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center"
                  style={{ bottom: 8, left: 24 }}
                >
                  <Lightbulb className="w-6 h-6 text-orange-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Empower Your Startup</h2>
            <p className="text-lg text-gray-600">
              We help startups accelerate development, reduce time-to-market, and build scalable products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Fast', desc: 'Quick development' },
              { icon: TrendingUp, title: 'Scalable', desc: 'Grow rapidly' },
              { icon: Target, title: 'Focused', desc: 'Goal-oriented' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-xl text-center"
              >
                <item.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            What We Offer
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-l-4 border-orange-500 pl-6 py-4"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 rounded-2xl text-center border border-white/20"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Let's Build Your Dream</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join other successful startups we've helped
            </p>
            <button
              onClick={() => openLeadForm()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
