import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, TrendingUp, CreditCard, Users, BarChart3 } from 'lucide-react';
import { IndustryVector } from '../../../components/HeroVectors';
import { useLeadForm } from '../../../context/LeadFormContext';

export default function Ecommerce() {
  const { openLeadForm } = useLeadForm();
  const solutions = [
    { title: 'Custom Storefronts', description: 'Beautiful, conversion-optimized online stores' },
    { title: 'Payment Integration', description: 'Secure multi-gateway payment processing' },
    { title: 'Inventory Management', description: 'Real-time stock tracking and management' },
    { title: 'Order Fulfillment', description: 'Automated order processing workflows' },
    { title: 'Analytics Dashboard', description: 'Sales insights and customer behavior' },
    { title: 'Multi-Channel Selling', description: 'Sell across all platforms seamlessly' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 right-[12%] w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-24 left-[8%] w-60 h-60 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6"><ShoppingCart className="w-4 h-4" /> Ecommerce Solutions</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">Grow Your<span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Online Store</span></h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">Build, scale, and optimize your ecommerce platform for maximum revenue — from multi-gateway payments and inventory management to personalized shopping experiences and analytics.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow">Boost Your Sales <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/who-we-help" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors">Learn More</Link>
              </div>
              <div className="flex gap-8">
                <div><div className="text-2xl font-black text-slate-900">5M+</div><div className="text-sm text-slate-500">Orders Processed</div></div>
                <div><div className="text-2xl font-black text-slate-900">200%</div><div className="text-sm text-slate-500">Avg Growth</div></div>
                <div><div className="text-2xl font-black text-slate-900">Multi</div><div className="text-sm text-slate-500">Platform</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="flex items-center justify-center">
              <div className="relative w-80 h-72 flex items-center justify-center">
                {/* Rotating outer ring */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute w-72 h-72 rounded-full border border-dashed border-emerald-500/20" />
                {/* Central cart */}
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 w-28 h-28 rounded-3xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center"
                >
                  <ShoppingCart className="w-14 h-14 text-emerald-400" />
                </motion.div>
                {/* Floating product badges */}
                {[
                  { angle: 0, label: '50% OFF', color: 'bg-emerald-500/80' },
                  { angle: 72, label: 'New', color: 'bg-teal-500/80' },
                  { angle: 144, label: '5★ Rated', color: 'bg-emerald-200/40' },
                  { angle: 216, label: 'Free Ship', color: 'bg-teal-200/40' },
                  { angle: 288, label: 'Trending', color: 'bg-emerald-500/80' },
                ].map(({ angle, label, color }, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <motion.div key={i}
                      animate={{ opacity: [0.6, 1, 0.6], y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                      className={`absolute px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${color}`}
                      style={{ left: `calc(50% + ${Math.cos(rad) * 115}px - 28px)`, top: `calc(50% + ${Math.sin(rad) * 100}px - 12px)` }}
                    >{label}</motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <section className="py-20 bg-gradient-to-b from-transparent to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Sell More, Sell Smarter</h2>
            <p className="text-lg text-gray-600">End-to-end ecommerce solutions that drive conversions and delight customers.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CreditCard, title: 'Secure Payments', desc: 'Multi-gateway support' },
              { icon: TrendingUp, title: 'Growth Focused', desc: 'Conversion optimization' },
              { icon: BarChart3, title: 'Data Driven', desc: 'Actionable insights' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card p-8 rounded-xl text-center">
                <item.icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
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
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-l-4 border-emerald-500 pl-6 py-4">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Grow Online?</h2>
            <p className="text-lg text-gray-600 mb-8">Let's build your perfect ecommerce experience</p>
            <button onClick={() => openLeadForm()} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
