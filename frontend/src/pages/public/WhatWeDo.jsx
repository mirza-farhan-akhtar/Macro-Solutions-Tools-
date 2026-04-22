import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSEO } from '../../utils/useSEO';
import { SoftwareDevVector } from '../../components/HeroVectors';
import { Code, Smartphone, Zap, Palette, Cloud, Shield, CheckCircle, Cog, Users, GitBranch, ArrowRight } from 'lucide-react';
import { useLeadForm } from '../../context/LeadFormContext';

const services = [
  { title: 'Web Development', path: '/services/web-development', icon: Code, color: 'from-blue-500 to-cyan-500', img: '/svc-web.jpg', desc: 'Modern, responsive web applications built with cutting-edge frameworks and performance-first design.' },
  { title: 'App Development', path: '/services/app-development', icon: Smartphone, color: 'from-violet-500 to-pink-500', img: '/svc-mobile.jpg', desc: 'Native iOS and Android applications crafted for seamless user experiences across all devices.' },
  { title: 'Custom Software', path: '/services/custom-software', icon: Zap, color: 'from-orange-500 to-amber-500', img: '/svc-custom.jpg', desc: 'Tailor-made software solutions engineered precisely around your unique business needs.' },
  { title: 'UX/UI Design', path: '/services/ux-ui-design', icon: Palette, color: 'from-pink-500 to-rose-500', img: '/svc-uxui.jpg', desc: 'Intuitive, beautiful interfaces that delight users and drive measurable business outcomes.' },
  { title: 'Cloud Application', path: '/services/cloud-application', icon: Cloud, color: 'from-sky-500 to-blue-500', img: '/svc-cloud.jpg', desc: 'Scalable cloud-native architectures built for high availability and global performance.' },
  { title: 'Cloud Ops & Migration', path: '/services/cloud-ops', icon: GitBranch, color: 'from-cyan-500 to-teal-500', img: '/svc-cloud.jpg', desc: 'Seamless migration strategy and ongoing operations management for modern cloud environments.' },
  { title: 'Cloud Maintenance', path: '/services/cloud-maintenance', icon: Cog, color: 'from-teal-500 to-emerald-500', img: '/svc-cloud.jpg', desc: '24/7 proactive monitoring, maintenance, and optimization of your cloud infrastructure.' },
  { title: 'Cyber Security', path: '/services/cyber-security', icon: Shield, color: 'from-red-500 to-rose-600', img: '/svc-cyber.jpg', desc: 'Enterprise-grade security frameworks protecting your data, systems, and reputation.' },
  { title: 'Quality Assurance', path: '/services/quality-assurance', icon: CheckCircle, color: 'from-green-500 to-emerald-500', img: '/svc-qa.jpg', desc: 'Rigorous testing pipelines ensuring bug-free, high-performance software delivery.' },
  { title: 'DevOps', path: '/services/devops', icon: GitBranch, color: 'from-orange-500 to-yellow-500', img: '/svc-devops.jpg', desc: 'Automated CI/CD pipelines, containerization, and infrastructure-as-code solutions.' },
  { title: 'Consultation', path: '/services/consultation', icon: Users, color: 'from-amber-500 to-orange-500', img: '/svc-custom.jpg', desc: 'Strategic technology advisory to align your digital initiatives with business goals.' },
];

export default function WhatWeDo() {
  const { openLeadForm } = useLeadForm();
  useSEO({
    title: 'Software Development Services | MACRO Solutions Tools Ltd',
    description: 'Web development, mobile apps, custom software, cloud, cybersecurity, DevOps and AI — explore every service MACRO Solutions offers. Global delivery, UK standards.',
    keywords: 'software development services UK, web development company, mobile app development, custom software, cloud services, cybersecurity, DevOps',
    canonical: '/what-we-do',
  });
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/40">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.10),transparent)]" />

        {/* Floating orbs */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-16 right-[15%] w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-20 left-[10%] w-64 h-64 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Our Full Service Suite
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                What We{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Do
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">
                End-to-end technology solutions spanning web, mobile, cloud, security, and AI — designed to scale with your ambitions.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex gap-4 flex-wrap">
                <button onClick={() => openLeadForm()} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all">
                  Start a Project <ArrowRight className="w-4 h-4" />
                </button>
                <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 font-medium transition-all">
                  All Services
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 grid grid-cols-3 gap-8">
                {[['11+', 'Services'], ['200+', 'Projects'], ['99%', 'Uptime']].map(([val, lab]) => (
                  <div key={lab}>
                    <div className="text-3xl font-black text-slate-900 mb-1">{val}</div>
                    <div className="text-sm text-slate-500">{lab}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated service network */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative h-[520px] hidden lg:flex items-center justify-center">
              <SoftwareDevVector accent="indigo" />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade to light section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Complete Service Offering</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Every capability you need under one roof — from ideation to deployment and beyond.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }}>
                  <Link to={service.path} className="group block h-full">
                    <div className="h-full rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/60 transition-all duration-300 overflow-hidden">
                      <div className="h-36 overflow-hidden relative">
                        <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-50`} />
                        <div className={`absolute bottom-3 left-4 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Learn more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Ready to Transform Your Business?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">Tell us what you need — we'll architect the perfect solution.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all">
              Get in Touch <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
