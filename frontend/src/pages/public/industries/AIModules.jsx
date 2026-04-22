import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight, Cpu, BarChart3, Sparkles } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function AIModules() {
  const solutions = [
    { title: 'Machine Learning', description: 'Custom ML model development' },
    { title: 'Natural Language', description: 'NLP and text analysis solutions' },
    { title: 'Computer Vision', description: 'Image and video processing AI' },
    { title: 'Predictive Analytics', description: 'Forecasting and trend analysis' },
    { title: 'AI Chatbots', description: 'Intelligent conversational agents' },
    { title: 'AI Integration', description: 'Embed AI into existing systems' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6"><Brain className="w-4 h-4" /> AI & Machine Learning</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Intelligent AI<span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">For Your Apps</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Supercharge your applications with plug-and-play AI modules — from natural language processing and computer vision to predictive analytics and autonomous agents.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow">Explore AI <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">50+</div><div className="text-sm text-slate-500">AI Projects</div></div>
                <div><div className="text-2xl font-black text-slate-900">99%</div><div className="text-sm text-slate-500">Model Accuracy</div></div>
                <div><div className="text-2xl font-black text-slate-900">Real-time</div><div className="text-sm text-slate-500">Inference</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <IndustryVector Icon={Brain} label="AI Modules" color="#f59e0b" secondaryColor="#f97316" stats={[{value:"50+",label:"AI Projects"},{value:"99%",label:"Accuracy"},{value:"24/7",label:"Support"}]} />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">AI-Powered Innovation</h2>
            <p className="text-lg text-gray-600">Plug-and-play AI modules to accelerate your digital transformation.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'Smart', desc: 'Self-learning systems' },
              { icon: BarChart3, title: 'Insightful', desc: 'Data-driven decisions' },
              { icon: Sparkles, title: 'Adaptive', desc: 'Evolves with your data' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">AI Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-amber-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Integrate AI Today</h2>
            <p className="text-lg text-gray-600 mb-8">Smarter applications with our AI modules</p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Let's Talk <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
