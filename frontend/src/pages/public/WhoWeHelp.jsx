import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/useSEO';
import { GlobeVector } from '../../components/HeroVectors';
import { Building2, Rocket, ShoppingCart, Store, Heart, Landmark, Gamepad2, Glasses, Brain, Plane, Truck, HardHat, ArrowRight, Globe } from 'lucide-react';

const industries = [
  { name: 'Public Sector', path: '/industries/public-sector', icon: Building2, color: 'from-blue-600 to-indigo-600', desc: 'Digital transformation for government and public organizations' },
  { name: 'Startups', path: '/industries/startups', icon: Rocket, color: 'from-purple-600 to-pink-600', desc: 'Agile tech solutions to accelerate startup growth' },
  { name: 'Ecommerce', path: '/industries/ecommerce', icon: ShoppingCart, color: 'from-emerald-500 to-green-600', desc: 'Scalable online commerce platforms and experiences' },
  { name: 'Retail & CPG', path: '/industries/retail-cpg', icon: Store, color: 'from-orange-500 to-red-500', desc: 'Omnichannel retail and consumer goods solutions' },
  { name: 'Health Department', path: '/industries/health', icon: Heart, color: 'from-rose-500 to-red-600', desc: 'Secure, compliant healthcare technology' },
  { name: 'Banking & Fintech', path: '/industries/banking-fintech', icon: Landmark, color: 'from-indigo-600 to-purple-600', desc: 'Secure financial technology and digital banking' },
  { name: 'Gaming', path: '/industries/gaming', icon: Gamepad2, color: 'from-violet-600 to-fuchsia-600', desc: 'High-performance gaming technology solutions' },
  { name: 'AR / VR', path: '/industries/ar-vr', icon: Glasses, color: 'from-cyan-600 to-blue-600', desc: 'Immersive augmented and virtual reality experiences' },
  { name: 'AI Modules', path: '/industries/ai-modules', icon: Brain, color: 'from-amber-500 to-orange-600', desc: 'Intelligent AI-powered application modules' },
  { name: 'Travel & Hospitality', path: '/industries/travel-hospitality', icon: Plane, color: 'from-teal-500 to-emerald-600', desc: 'Digital solutions for travel and hospitality' },
  { name: 'Transport', path: '/industries/transport', icon: Truck, color: 'from-sky-600 to-blue-700', desc: 'Smart logistics and fleet management' },
  { name: 'Construction', path: '/industries/construction', icon: HardHat, color: 'from-yellow-600 to-amber-600', desc: 'Digital tools for modern construction' },
];

export default function WhoWeHelp() {
  useSEO({
    title: 'Industries We Serve | Software for Every Sector | MACRO Solutions',
    description: 'MACRO Solutions delivers technology for public sector, healthcare, fintech, ecommerce, startups, gaming, AR/VR, transport and more. Find solutions for your industry.',
    keywords: 'software for government UK, healthcare technology, fintech software, ecommerce platform development, startup technology, banking software, gaming development',
    canonical: '/who-we-help',
  });
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/40">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        {/* Radial glow — emerald/teal tint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent)]" />

        {/* Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-24 right-[12%] w-80 h-80 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }} className="absolute bottom-32 left-[8%] w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Industries We Serve
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                Who We{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Help
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">
                We partner with organizations across every sector — from ambitious startups to large enterprises — delivering transformative digital solutions.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex gap-4 flex-wrap">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all">
                  Work With Us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 font-medium transition-all">
                  Our Services
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 grid grid-cols-3 gap-8">
                {[['12+', 'Industries'], ['50+', 'Countries'], ['500+', 'Happy Clients']].map(([val, lab]) => (
                  <div key={lab}>
                    <div className="text-3xl font-black text-white mb-1">{val}</div>
                    <div className="text-sm text-white/40">{lab}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated Globe */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative h-[520px] hidden lg:flex items-center justify-center">
              <GlobeVector industries={industries} accent="emerald" />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </section>

      {/* ── INDUSTRIES GRID ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Specialized expertise across every major sector — we speak your industry's language.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, i) => (
              <motion.div key={industry.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.04 }} viewport={{ once: true }}>
                <Link to={industry.path} className="group block h-full">
                  <div className="h-full p-7 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50/60 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${industry.color} p-3 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                      <industry.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{industry.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{industry.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Don't See Your Industry?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">We work across all sectors. Get in touch to discuss how we can help your specific industry.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
