import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Code, Brain, Cloud, Shield, Globe, Smartphone,
  Cpu, BarChart3, CheckCircle, Zap, Users, Star, Eye, Wrench,
  Target, Layers, ChevronDown, Building2, Clock,
  Award, TrendingUp, Sparkles, MessageCircle, Phone,
  ChevronLeft, ChevronRight, Play
} from 'lucide-react';
import { useLeadForm } from '../../context/LeadFormContext';
import { publicAPI, getImageUrl } from '../../services/api';
import { useSEO } from '../../utils/useSEO';
import { SoftwareDevVector, AIVector, CloudVector } from '../../components/HeroVectors';

const GlassCard = ({ children, className = '' }) => (
  <div className={`relative bg-white/70 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.10),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/30 to-indigo-50/40 pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    <div className="relative z-10">{children}</div>
  </div>
);

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / 60);
    const id = setInterval(() => { start += step; if (start >= num) { setCount(num); clearInterval(id); } else setCount(start); }, 20);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const FloatOrb = ({ className }) => (
  <motion.div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.1, 0.95, 1] }}
    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
);

const slides = [
  {
    badge: 'Global Software Company',
    title: 'We Build',
    highlight: 'Digital Excellence',
    desc: 'From startups to enterprises — we design, engineer, and scale technology products that drive real business growth across 5 global offices.',
    bg: 'from-indigo-50/80 via-white to-violet-50/60',
    bgImage: '/hero-slide-1.jpg',
    orb1: 'bg-indigo-200/50 w-96 h-96 top-[-5%] right-[5%]',
    orb2: 'bg-violet-200/40 w-80 h-80 bottom-[5%] left-[-5%]',
    accent: 'from-indigo-600 to-violet-600',
    ctaText: 'Start a Project', ctaLink: '/contact',
    cards: [
      { icon: Code, label: 'Web & App Dev', value: '300+ Projects', bg: 'bg-indigo-50', txt: 'text-indigo-600', ring: 'ring-indigo-100' },
      { icon: Brain, label: 'AI Solutions', value: 'ML Powered', bg: 'bg-violet-50', txt: 'text-violet-600', ring: 'ring-violet-100' },
      { icon: Cloud, label: 'Cloud Native', value: 'AWS / GCP', bg: 'bg-cyan-50', txt: 'text-cyan-600', ring: 'ring-cyan-100' },
      { icon: Shield, label: 'Cyber Security', value: 'Enterprise Grade', bg: 'bg-rose-50', txt: 'text-rose-600', ring: 'ring-rose-100' },
    ],
  },
  {
    badge: 'Artificial Intelligence',
    title: 'Intelligence',
    highlight: 'That Transforms',
    desc: 'Harness AI and machine learning to automate workflows, predict outcomes, and unlock new revenue streams — delivering measurable ROI from day one.',
    bg: 'from-violet-50/80 via-white to-cyan-50/60',
    bgImage: '/hero-slide-2.jpg',
    orb1: 'bg-violet-200/50 w-96 h-96 top-[-5%] right-[5%]',
    orb2: 'bg-cyan-200/40 w-80 h-80 bottom-[5%] left-[-5%]',
    accent: 'from-violet-600 to-cyan-600',
    ctaText: 'Explore AI', ctaLink: '/ai-services',
    cards: [
      { icon: Brain, label: 'Machine Learning', value: 'Custom Models', bg: 'bg-violet-50', txt: 'text-violet-600', ring: 'ring-violet-100' },
      { icon: Cpu, label: 'NLP & Vision', value: 'State-of-the-Art', bg: 'bg-indigo-50', txt: 'text-indigo-600', ring: 'ring-indigo-100' },
      { icon: BarChart3, label: 'Predictive Analytics', value: 'Data Driven', bg: 'bg-cyan-50', txt: 'text-cyan-600', ring: 'ring-cyan-100' },
      { icon: Zap, label: 'Automation', value: '40% Cost Savings', bg: 'bg-emerald-50', txt: 'text-emerald-600', ring: 'ring-emerald-100' },
    ],
  },
  {
    badge: 'Cloud & DevOps',
    title: 'Scale Without',
    highlight: 'Limits',
    desc: 'Cloud-native architecture, CI/CD pipelines, and 24/7 managed operations — built for any scale, from MVP to million-user platforms with 99.9% uptime.',
    bg: 'from-cyan-50/80 via-white to-emerald-50/60',
    bgImage: '/hero-slide-3.jpg',
    orb1: 'bg-cyan-200/50 w-96 h-96 top-[-5%] right-[5%]',
    orb2: 'bg-emerald-200/40 w-80 h-80 bottom-[5%] left-[-5%]',
    accent: 'from-cyan-600 to-emerald-600',
    ctaText: 'Cloud Solutions', ctaLink: '/services/cloud-application',
    cards: [
      { icon: Cloud, label: 'Multi-Cloud', value: 'AWS / GCP / Azure', bg: 'bg-cyan-50', txt: 'text-cyan-600', ring: 'ring-cyan-100' },
      { icon: Wrench, label: 'DevOps', value: 'Full CI/CD', bg: 'bg-emerald-50', txt: 'text-emerald-600', ring: 'ring-emerald-100' },
      { icon: Globe, label: '5 Offices', value: 'Global Delivery', bg: 'bg-blue-50', txt: 'text-blue-600', ring: 'ring-blue-100' },
      { icon: Clock, label: 'Uptime SLA', value: '99.9% Guaranteed', bg: 'bg-violet-50', txt: 'text-violet-600', ring: 'ring-violet-100' },
    ],
  },
];

const slideVars = {
  enter: (d) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -100 : 100, opacity: 0 }),
};

export default function Home() {
  const { openLeadForm } = useLeadForm();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const timerRef = useRef(null);

  useSEO({
    title: 'MACRO Solutions Tools Ltd | Global Software Development Company',
    description: 'MACRO Solutions Tools Ltd is a global software company. Custom software, AI, cloud, and cybersecurity across 5 global offices.',
    keywords: 'software development, AI solutions, cloud services, cybersecurity, web development, app development',
    canonical: '/',
  });

  useEffect(() => {
    publicAPI.home().then(r => {
      setServices(r.data?.data?.services || r.data?.services || []);
      setBlogs(r.data?.data?.blogs || r.data?.blogs || []);
    }).catch(() => {});
    publicAPI.faqs().then(r => setFaqs((r.data?.data || r.data || []).slice(0, 6))).catch(() => {});
  }, []);

  const goTo = (i, d) => { setDir(d); setIdx(i); };
  const nextSlide = () => goTo((idx + 1) % slides.length, 1);
  const prevSlide = () => goTo((idx - 1 + slides.length) % slides.length, -1);
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5500);
    return () => clearInterval(timerRef.current);
  }, [idx]);

  const s = slides[idx];

  const stats = [
    { n: '500', suf: '+', label: 'Clients Served' },
    { n: '1000', suf: '+', label: 'Projects Delivered' },
    { n: '25', suf: '+', label: 'Countries' },
    { n: '98', suf: '%', label: 'Satisfaction Rate' },
  ];
  const pillars = [
    { icon: Target, title: 'Strategy First', desc: 'Every project starts with deep understanding of your business goals and KPIs.', g: 'from-indigo-500 to-blue-600' },
    { icon: Layers, title: 'Scalable Architecture', desc: 'Built to grow with you — from startup to enterprise at any scale.', g: 'from-violet-500 to-purple-600' },
    { icon: Zap, title: 'Rapid Delivery', desc: 'Agile sprints and CI/CD pipelines for faster time-to-market.', g: 'from-cyan-500 to-teal-600' },
  ];
  const whyUs = [
    { icon: Award, title: 'Proven Track Record', desc: '1000+ projects delivered across 25+ industries worldwide.' },
    { icon: Users, title: 'Dedicated Teams', desc: 'Your own engineering team, fully embedded in your workflow.' },
    { icon: Clock, title: 'On-Time Delivery', desc: '98% on-time delivery with transparent project management.' },
    { icon: TrendingUp, title: 'ROI Focused', desc: 'Every solution designed to maximize your return on investment.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2, GDPR, and ISO 27001 compliant practices.' },
    { icon: Globe, title: 'Global Presence', desc: '5 offices across 4 continents for round-the-clock delivery.' },
  ];
  const offices = [
    { city: 'London', country: 'United Kingdom', flag: 'gb', tz: 'GMT+0' },
    { city: 'Lahore', country: 'Pakistan', flag: 'pk', tz: 'GMT+5' },
    { city: 'Hargeisa', country: 'Somaliland', flag: 'so', tz: 'GMT+3' },
    { city: 'Addis Ababa', country: 'Ethiopia', flag: 'et', tz: 'GMT+3' },
    { city: 'Dubai', country: 'UAE', flag: 'ae', tz: 'GMT+4' },
  ];
  const svcGrid = [
    { icon: Globe, title: 'Web Development', desc: 'High-performance web apps with modern frameworks.', to: '/services/web-development', g: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', txt: 'text-blue-600', img: '/svc-web.jpg' },
    { icon: Smartphone, title: 'App Development', desc: 'Native iOS and Android apps users will love.', to: '/services/app-development', g: 'from-violet-500 to-pink-500', bg: 'bg-violet-50', txt: 'text-violet-600', img: '/svc-mobile.jpg' },
    { icon: Code, title: 'Custom Software', desc: 'Bespoke solutions tailored to your business.', to: '/services/custom-software', g: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50', txt: 'text-indigo-600', img: '/svc-custom.jpg' },
    { icon: Cloud, title: 'Cloud Services', desc: 'Scalable cloud-native apps and migration.', to: '/services/cloud-application', g: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-50', txt: 'text-cyan-600', img: '/svc-cloud.jpg' },
    { icon: Shield, title: 'Cyber Security', desc: 'Enterprise-grade security for your digital assets.', to: '/services/cyber-security', g: 'from-rose-500 to-red-500', bg: 'bg-rose-50', txt: 'text-rose-600', img: '/svc-cyber.jpg' },
    { icon: Cpu, title: 'AI Solutions', desc: 'Intelligent automation and machine learning.', to: '/ai-services', g: 'from-violet-500 to-indigo-500', bg: 'bg-violet-50', txt: 'text-violet-600', img: '/svc-ai.jpg' },
    { icon: Eye, title: 'UX/UI Design', desc: 'Beautiful user-centred interfaces that convert.', to: '/services/ux-ui-design', g: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', txt: 'text-pink-600', img: '/svc-uxui.jpg' },
    { icon: Wrench, title: 'DevOps', desc: 'Automated CI/CD pipelines and infra as code.', to: '/services/devops', g: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', txt: 'text-orange-600', img: '/svc-devops.jpg' },
    { icon: CheckCircle, title: 'Quality Assurance', desc: 'Comprehensive testing to ship bug-free software.', to: '/services/quality-assurance', g: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', txt: 'text-emerald-600', img: '/svc-qa.jpg' },
  ];

  return (
    <div className="bg-white overflow-x-hidden">

      {/* HERO SLIDER */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* ── Background layer ── */}
        <AnimatePresence mode="wait">
          <motion.div key={idx + '-bg'} className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${s.bgImage})` }}
              initial={{ scale: 1.07 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'easeOut' }}
            />
            {/* Directional overlay: dark left (text) → semi-dark right (shows image) */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(8,8,20,0.90) 0%, rgba(8,8,20,0.75) 45%, rgba(8,8,20,0.45) 100%)' }} />
            {/* Accent colour wash */}
            <motion.div key={idx + '-tint'} className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-[0.09]`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.09 }} transition={{ duration: 1.2 }} />
          </motion.div>
        </AnimatePresence>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-10">
            <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-center min-h-[72vh]">

              {/* LEFT */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={idx + '-txt'} custom={dir} variants={slideVars} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.5, ease: 'easeOut' }}>

                  {/* Eyebrow */}
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="flex items-center gap-3 mb-7 flex-wrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${s.accent} text-white text-sm font-bold shadow-xl`}>
                      <Sparkles className="w-3.5 h-3.5" /> {s.badge}
                    </span>
                    <span className="flex items-center gap-2 text-white/50 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                      Available for new projects
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black text-white leading-[1.0] tracking-tight mb-6">
                    {s.title}<br />
                    <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>{s.highlight}</span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="text-lg text-white/65 leading-relaxed max-w-lg mb-9">{s.desc}</motion.p>

                  {/* CTA buttons */}
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-4 mb-10">
                    <button
                      onClick={() => openLeadForm()}
                      className={`px-8 py-4 bg-gradient-to-r ${s.accent} text-white font-bold rounded-2xl shadow-2xl hover:-translate-y-0.5 hover:shadow-xl transition-all inline-flex items-center gap-2 text-base`}
                    >
                      {s.ctaText} <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link to="/about" className="px-8 py-4 border border-white/25 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all inline-flex items-center gap-2 text-base backdrop-blur-sm">
                      <Play className="w-4 h-4" /> Our Story
                    </Link>
                  </motion.div>

                  {/* Inline trust metrics */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                    className="flex items-center gap-0 flex-wrap">
                    {[
                      { n: '500', suf: '+', label: 'Clients' },
                      { n: '1000', suf: '+', label: 'Projects' },
                      { n: '25', suf: '+', label: 'Countries' },
                      { n: '98', suf: '%', label: 'Satisfaction' },
                    ].map((st, i) => (
                      <div key={i} className="flex items-center">
                        <div className="px-5 first:pl-0 text-center">
                          <div className="text-2xl font-black text-white leading-tight"><Counter target={st.n} suffix={st.suf} /></div>
                          <div className="text-xs text-white/45 font-medium mt-0.5">{st.label}</div>
                        </div>
                        {i < 3 && <div className="w-px h-8 bg-white/15" />}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* RIGHT: Capability cards */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={idx + '-cards'} custom={dir} variants={slideVars} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                  className="hidden lg:grid grid-cols-2 gap-3.5 self-center">
                  {s.cards.map((card, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.09, duration: 0.5 }}
                      className="relative bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 hover:bg-white/12 hover:border-white/25 transition-all duration-300 group overflow-hidden">
                      {/* Card glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent pointer-events-none" />
                      {/* Accent bottom border */}
                      <div className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r ${s.accent} opacity-50 group-hover:opacity-90 transition-opacity`} />
                      <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.txt} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">{card.label}</p>
                      <p className="text-white font-bold text-sm leading-snug">{card.value}</p>
                    </motion.div>
                  ))}

                  {/* 5th card: globe visual */}
                  <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="col-span-2 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/12 hover:border-white/25 transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent pointer-events-none" />
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">Global Delivery</p>
                      <p className="text-white font-bold text-sm">5 Offices · 25+ Countries · 24/7 Support</p>
                    </div>
                    <div className="ml-auto flex -space-x-1.5">
                      {['🇬🇧','🇵🇰','🇦🇪','🇪🇹','🇸🇴'].map((f, i) => (
                        <span key={i} className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">{f}</span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-8 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > idx ? 1 : -1)}
                className={`transition-all duration-300 rounded-full ${i === idx ? `w-8 h-2 bg-gradient-to-r ${s.accent}` : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
            ))}
          </div>
          {/* Counter + nav */}
          <div className="flex items-center gap-4">
            <span className="text-white/35 text-sm font-mono tabular-nums">
              {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-10 h-10 rounded-xl border border-white/18 bg-white/6 hover:bg-white/14 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextSlide} className={`w-10 h-10 rounded-xl bg-gradient-to-r ${s.accent} flex items-center justify-center text-white shadow-lg hover:-translate-y-0.5 transition-all`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Auto-play progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/8">
          <motion.div key={idx} className={`h-full bg-gradient-to-r ${s.accent}`}
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: 'linear' }} />
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative py-24 overflow-hidden bg-slate-50">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60" />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          {/* Section label */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-14">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400" />
            <span className="text-indigo-600 text-sm font-semibold uppercase tracking-[0.2em]">By the numbers</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-400" />
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '500', suf: '+', label: 'Clients Served', sub: 'Across 25+ countries', icon: Users, accent: 'from-indigo-500 to-indigo-600', glow: 'shadow-indigo-500/20', trend: '+18% YoY' },
              { n: '1000', suf: '+', label: 'Projects Delivered', sub: 'On time, on budget', icon: CheckCircle, accent: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/20', trend: '+24% YoY' },
              { n: '25', suf: '+', label: 'Countries Reached', sub: '5 global offices', icon: Globe, accent: 'from-cyan-500 to-cyan-600', glow: 'shadow-cyan-500/20', trend: '6 new markets' },
              { n: '98', suf: '%', label: 'Satisfaction Rate', sub: 'Based on 500+ reviews', icon: Star, accent: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/20', trend: 'Industry-leading' },
            ].map((st, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative bg-white backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-indigo-100/60 transition-all duration-300 shadow-lg ${st.glow} overflow-hidden`}>
                {/* Card glow overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${st.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`} />
                {/* Top accent bar */}
                <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${st.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.accent} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <st.icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                </div>

                {/* Number */}
                <div className="text-4xl xl:text-5xl font-black text-slate-900 leading-none mb-1.5 tabular-nums">
                  <Counter target={st.n} suffix={st.suf} />
                </div>
                <p className="text-slate-700 font-semibold text-sm mb-1">{st.label}</p>
                <p className="text-slate-400 text-xs">{st.sub}</p>

                {/* Trend badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">{st.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trusted-by strip */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-16 pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-6">
            <span className="text-slate-400 text-sm font-medium whitespace-nowrap">Trusted by teams at</span>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              {['Fortune 500', 'Startups', 'Governments', 'NGOs', 'Enterprise'].map((name, i) => (
                <span key={i} className="text-slate-400 font-bold text-sm tracking-wide hover:text-slate-700 transition-colors cursor-default select-none">{name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-28 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 relative overflow-hidden">
        <FloatOrb className="bg-indigo-100/50 w-96 h-96 top-0 right-[-10%] opacity-60" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Approach</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">How We <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Deliver Value</span></h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">A proven methodology to build software that drives real, measurable business outcomes.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <GlassCard className="p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.g} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <p.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{p.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{p.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Build</p>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Services</span></h2>
            </div>
            <p className="text-slate-500 max-w-md text-lg">End-to-end technology solutions to build, scale, and protect your digital products.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {svcGrid.map((sv, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={sv.to} className="block h-full">
                  <GlassCard className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group h-full">
                    {/* Image thumbnail */}
                    <div className="h-40 overflow-hidden relative">
                      <img src={sv.img} alt={sv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${sv.g} opacity-50`} />
                      <div className="absolute bottom-3 left-4">
                        <div className={`w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center`}>
                          <sv.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-black text-slate-900 mb-1.5">{sv.title}</h3>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">{sv.desc}</p>
                      <span className={`text-sm font-bold inline-flex items-center gap-1 ${sv.txt} group-hover:gap-2 transition-all`}>
                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/what-we-do" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VISION / MISSION — dark contrast section */}
      <section className="py-28 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <FloatOrb className="bg-indigo-500/20 w-96 h-96 top-[-10%] left-[-5%] opacity-100" />
        <FloatOrb className="bg-violet-500/20 w-80 h-80 bottom-[-5%] right-[-5%] opacity-100" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Vision & <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mission</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Our Vision', icon: Eye, desc: 'To be the most trusted global technology partner — empowering businesses of every size to harness innovation and thrive in a digital-first world.', g: 'from-indigo-500 to-blue-600' },
              { title: 'Our Mission', icon: Target, desc: 'We deliver world-class software solutions with integrity, agility, and relentless focus on quality — turning complex challenges into competitive advantages.', g: 'from-violet-500 to-purple-600' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="relative bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-indigo-500/10 pointer-events-none rounded-2xl" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.g} flex items-center justify-center mb-6 shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-28 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 relative overflow-hidden">
        <FloatOrb className="bg-violet-100/60 w-80 h-80 bottom-0 right-[-5%] opacity-70" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Why MACRO</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">The MACRO <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Advantage</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200/50">
                      <w.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 mb-2">{w.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL OFFICES */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Worldwide</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Global Offices</span></h2>
            <p className="mt-4 text-slate-500 text-lg">5 offices across 4 continents — delivering around the clock.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {offices.map((o, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-10 rounded-lg overflow-hidden mx-auto mb-4 shadow-md border border-slate-100">
                    <img src={`https://flagcdn.com/w80/${o.flag}.png`} alt={o.country} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm mb-0.5">{o.city}</h3>
                  <p className="text-slate-400 text-xs">{o.country}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">{o.tz}</span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      {blogs.length > 0 && (
        <section className="py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <FloatOrb className="bg-indigo-100/50 w-96 h-96 top-0 left-[-5%] opacity-50" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Latest Insights</p>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900">From Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Blog</span></h2>
              </div>
              <Link to="/blogs" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">All Articles <ArrowRight className="w-4 h-4" /></Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((b, i) => (
                <motion.div key={b.id || i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blogs/${b.slug}`} className="group block h-full">
                    <GlassCard className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                      <div className="h-52 overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 relative">
                        {b.image
                          ? <img src={getImageUrl(b.image)} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="absolute inset-0 flex items-center justify-center"><MessageCircle className="w-16 h-16 text-indigo-200" /></div>
                        }
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold shadow-sm">{b.category || 'Technology'}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{b.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{b.excerpt || b.description}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold group-hover:gap-2 transition-all">Read More <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-28 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Got Questions?</p>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Frequently <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Asked</span></h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={faq.id || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <GlassCard className="overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                      <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-indigo-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="px-6 pb-5 text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <FloatOrb className="bg-white/10 w-80 h-80 top-[-20%] left-[-5%] opacity-100" />
        <FloatOrb className="bg-violet-300/20 w-96 h-96 bottom-[-20%] right-[-5%] opacity-100" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-8 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Free consultation available
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">Ready to Build Something <span className="text-indigo-200">Amazing?</span></h2>
            <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto">Let's turn your vision into reality. Get a free consultation with our senior engineers — no strings attached.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 text-lg">
                Start a Project <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+447386118117" className="px-10 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5" /> Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}