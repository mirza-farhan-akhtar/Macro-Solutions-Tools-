import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, ArrowRight, MapPin, Star, Calendar } from 'lucide-react';

import { IndustryVector } from '../../../components/HeroVectors';

export default function TravelHospitality() {
  const solutions = [
    { title: 'Booking Platforms', description: 'End-to-end reservation systems' },
    { title: 'Property Management', description: 'Hotel & accommodation management' },
    { title: 'Guest Experience', description: 'Personalized digital concierge' },
    { title: 'Revenue Management', description: 'Dynamic pricing optimization' },
    { title: 'Loyalty Programs', description: 'Rewards and retention platforms' },
    { title: 'Travel Analytics', description: 'Demand forecasting & insights' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-sm font-medium mb-6"><Plane className="w-4 h-4" /> Travel & Hospitality</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Unforgettable<span className="block bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Travel Experiences</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Digital solutions that transform the traveler journey — from intelligent booking engines and personalized recommendations to hotel management systems and loyalty platforms.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow">Explore Solutions <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">50+</div><div className="text-sm text-slate-500">Countries</div></div>
                <div><div className="text-2xl font-black text-slate-900">1M+</div><div className="text-sm text-slate-500">Bookings</div></div>
                <div><div className="text-2xl font-black text-slate-900">5★</div><div className="text-sm text-slate-500">Rated</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Compass rose outer ring */}
                <div className="absolute w-64 h-64 rounded-full border border-teal-500/30" />
                <div className="absolute w-48 h-48 rounded-full border border-teal-400/20" />
                {/* Cardinal direction labels */}
                {[{label:'N',dx:0,dy:-130},{label:'S',dx:0,dy:130},{label:'E',dx:130,dy:0},{label:'W',dx:-130,dy:0}].map(({label,dx,dy},i) => (
                  <div key={i} className="absolute text-teal-400/70 text-xs font-black"
                    style={{ left: `calc(50% + ${dx}px - 5px)`, top: `calc(50% + ${dy}px - 8px)` }}
                  >{label}</div>
                ))}
                {/* Rotating compass needle */}
                <motion.div animate={{ rotate: [0, 30, -15, 45, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-64 h-64 flex items-start justify-center"
                >
                  <div className="w-1 h-24 bg-gradient-to-b from-teal-400 to-transparent rounded-full" />
                </motion.div>
                <motion.div animate={{ rotate: [180, 210, 165, 225, 180] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-64 h-64 flex items-start justify-center"
                >
                  <div className="w-1 h-20 bg-gradient-to-b from-rose-400/60 to-transparent rounded-full" />
                </motion.div>
                {/* Center */}
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center"
                >
                  <Plane className="w-8 h-8 text-teal-400" />
                </motion.div>
                {/* Destination badges */}
                {[
                  { label: 'Dubai 🇺🇦', x: -150, y: -60, delay: 0 },
                  { label: 'Paris 🇫🇷', x: 60, y: -100, delay: 0.6 },
                  { label: 'Bali 🇮🇩', x: 70, y: 60, delay: 1.2 },
                ].map(({ label, x, y, delay }, i) => (
                  <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay }}
                    className="absolute px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-400/30 text-teal-200 text-xs font-medium"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  >{label}</motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Elevate Guest Experiences</h2>
            <p className="text-lg text-gray-600">Technology that transforms every touchpoint of the traveler journey.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Connected', desc: 'Seamless travel journey' },
              { icon: Star, title: 'Personalized', desc: 'Tailored recommendations' },
              { icon: Calendar, title: 'Efficient', desc: 'Streamlined operations' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold text-gray-900 mb-12 text-center">Hospitality Solutions</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-teal-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Transform Travel Experiences</h2>
            <p className="text-lg text-gray-600 mb-8">Digital innovation for hospitality excellence</p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Let's Talk <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
