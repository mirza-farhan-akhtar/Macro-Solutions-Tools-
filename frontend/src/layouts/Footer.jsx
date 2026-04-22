import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Mail, Phone, MapPin, Twitter, Linkedin, Github,
  ArrowRight, Zap, Globe, Smartphone, Code, Cloud, Shield,
  Heart, Cpu, Rocket, ShoppingCart, Building2,
} from 'lucide-react';
import { publicAPI } from '../services/api';

// Inline SVGs for platforms not in lucide-react
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

function useSocialLinks() {
  const [links, setLinks] = useState({});
  useEffect(() => {
    publicAPI.settings().then(res => {
      const s = res.data || {};
      setLinks({
        facebook:  s.social_facebook  || '',
        twitter:   s.social_twitter   || '',
        linkedin:  s.social_linkedin  || '',
        instagram: s.social_instagram || '',
        github:    s.social_github    || '',
      });
    }).catch(() => {});
  }, []);
  return links;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const social = useSocialLinks();

  const company = [
    { label: 'About Us', to: '/about' },
    { label: 'What We Do', to: '/what-we-do' },
    { label: 'Who We Help', to: '/who-we-help' },
    { label: 'Careers', to: '/careers' },
    { label: 'Blog', to: '/blogs' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Contact', to: '/contact' },
  ];

  const services = [
    { label: 'Web Development', to: '/services/web-development', icon: Globe },
    { label: 'App Development', to: '/services/app-development', icon: Smartphone },
    { label: 'Custom Software', to: '/services/custom-software', icon: Code },
    { label: 'Cloud Services', to: '/services/cloud-application', icon: Cloud },
    { label: 'Cyber Security', to: '/services/cyber-security', icon: Shield },
    { label: 'AI Solutions', to: '/ai-services', icon: Cpu },
  ];

  const industries = [
    { label: 'Startups', to: '/industries/startups', icon: Rocket },
    { label: 'Ecommerce', to: '/industries/ecommerce', icon: ShoppingCart },
    { label: 'Health', to: '/industries/health', icon: Heart },
    { label: 'Banking & Fintech', to: '/industries/banking-fintech', icon: Building2 },
    { label: 'Public Sector', to: '/industries/public-sector', icon: Building2 },
    { label: 'AR / VR', to: '/industries/ar-vr', icon: Globe },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-white overflow-hidden border-t border-slate-200/60">
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── CTA Banner ── */}
        <div className="py-16 border-b border-slate-200/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl px-10 py-10">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Ready to build something great?
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                Let's turn your idea into <span className="text-indigo-200">reality.</span>
              </h2>
              <p className="text-white/60 mt-3 max-w-xl">From concept to launch — we build software that scales with your ambitions.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/contact" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">Start a Project <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/services" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all whitespace-nowrap">Explore Services</Link>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-slate-200/60">

          {/* Brand */}
          <div className="lg:col-span-3">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-200 group-hover:ring-indigo-300 transition-all">
                <img src="/logo.svg" alt="Macro Solutions" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-slate-900 font-bold text-sm leading-tight">MACRO</div>
                <div className="text-slate-400 text-[10px] font-medium tracking-wider uppercase">Solutions Tools</div>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Empowering businesses with cutting-edge technology solutions and AI-powered innovations that scale.</p>
            <div className="space-y-3 mb-6">
              <a href="mailto:info@macrosolutionstools.com" className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><Mail className="w-3.5 h-3.5" /></div>
                info@macrosolutionstools.com
              </a>
              <a href="tel:+447386118117" className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><Phone className="w-3.5 h-3.5" /></div>
                +44 7386 118 117
              </a>
              <div className="flex items-start gap-2.5 text-slate-500 text-sm">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                  <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">HQ — United Kingdom</span><br />
                  <span>73 Chequers Court, Bradley Stoke, Bristol, BS32 0HJ</span>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Regional Offices</span>
                    <div className="flex items-center gap-2">
                      {[['pk','Pakistan'],['so','Somaliland'],['et','Ethiopia'],['ae','Dubai']].map(([code, label]) => (
                        <div key={code} title={label} className="w-6 h-auto rounded-sm overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
                          <img src={`https://flagcdn.com/w40/${code}.png`} alt={`${label}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                social.facebook  && { icon: FacebookIcon,  label: 'Facebook',  href: social.facebook,  hover: 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600' },
                social.instagram && { icon: InstagramIcon, label: 'Instagram', href: social.instagram, hover: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-500' },
                social.linkedin  && { icon: Linkedin,      label: 'LinkedIn',  href: social.linkedin,  hover: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' },
                social.twitter   && { icon: Twitter,       label: 'Twitter',   href: social.twitter,   hover: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500' },
                social.github    && { icon: Github,        label: 'GitHub',    href: social.github,    hover: 'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700' },
              ].filter(Boolean).map(({ icon: Icon, label, href, hover }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 transition-all ${hover}`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-semibold text-sm mb-5 flex items-center gap-2"><span className="w-5 h-px bg-indigo-400" />Company</h3>
            <ul className="space-y-3">
              {company.map(({ label, to }) => (
                <li key={to}><Link to={to} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-1.5 group/l"><span className="w-0 group-hover/l:w-3 h-px bg-indigo-400 transition-all duration-200 flex-shrink-0" />{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 font-semibold text-sm mb-5 flex items-center gap-2"><span className="w-5 h-px bg-violet-400" />Services</h3>
            <ul className="space-y-3">
              {services.map(({ label, to, icon: Icon }) => (
                <li key={to}><Link to={to} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-2 group/l"><Icon className="w-3.5 h-3.5 text-slate-300 group-hover/l:text-violet-500 transition-colors flex-shrink-0" />{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-semibold text-sm mb-5 flex items-center gap-2"><span className="w-5 h-px bg-cyan-400" />Industries</h3>
            <ul className="space-y-3">
              {industries.map(({ label, to, icon: Icon }) => (
                <li key={to}><Link to={to} className="text-slate-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-2 group/l"><Icon className="w-3.5 h-3.5 text-slate-300 group-hover/l:text-cyan-500 transition-colors flex-shrink-0" />{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-semibold text-sm mb-5 flex items-center gap-2"><span className="w-5 h-px bg-emerald-400" />By the Numbers</h3>
            <div className="space-y-4">
              {[
                { n: '500+', label: 'Global Clients', col: 'text-indigo-600' },
                { n: '1000+', label: 'Projects Delivered', col: 'text-violet-600' },
                { n: '25+', label: 'Countries Served', col: 'text-cyan-600' },
                { n: '98%', label: 'Client Satisfaction', col: 'text-emerald-600' },
              ].map(({ n, label, col }) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className={`text-xl font-black ${col}`}>{n}</span>
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            &copy; {currentYear} MACRO Solutions Tools Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/about" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}