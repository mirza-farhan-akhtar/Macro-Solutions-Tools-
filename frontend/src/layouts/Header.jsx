import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, X, ChevronDown, Search, ExternalLink, Globe, Smartphone, Code, Layers, Cloud, Settings, Wrench, Shield, CheckCircle, GitBranch, MessageCircle, Building2, Rocket, ShoppingCart, Tag, Heart, CreditCard, Gamepad2, Eye, Cpu, MapPin, Truck, Hammer, Package, ArrowRight, Phone, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [socialLinks, setSocialLinks] = useState({});
  const location = useLocation();

  useEffect(() => {
    publicAPI.settings().then(res => {
      const s = res.data || {};
      setSocialLinks({
        facebook:  s.social_facebook  || '',
        instagram: s.social_instagram || '',
        linkedin:  s.social_linkedin  || '',
        twitter:   s.social_twitter   || '',
        github:    s.social_github    || '',
      });
    }).catch(() => {});
  }, []);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (searchQuery.trim().length > 2) performSearch(searchQuery);
      else { setSearchResults(null); setShowSearchResults(false); }
    }, 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) { setShowSearchResults(false); setIsSearchFocused(false); } };
    const handleEscape = (e) => { if (e.key === 'Escape') { setShowSearchResults(false); setIsSearchFocused(false); searchInputRef.current?.blur(); } };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleEscape); };
  }, []);

  useEffect(() => { setShowSearchResults(false); setIsSearchFocused(false); setMobileMenuOpen(false); setOpenMenu(null); }, [location]);

  const performSearch = async (query) => {
    if (!query.trim()) { setSearchResults(null); setShowSearchResults(false); return; }
    setSearchLoading(true);
    try { const r = await publicAPI.search(query); setSearchResults(r.data); setShowSearchResults(true); } catch { setSearchResults(null); setShowSearchResults(false); } finally { setSearchLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) { performSearch(searchQuery); setShowSearchResults(true); } };
  const handleSearchInputChange = (e) => { setSearchQuery(e.target.value); if (e.target.value.trim().length > 0) setShowSearchResults(true); else setShowSearchResults(false); };
  const clearSearch = () => { setSearchQuery(''); setSearchResults(null); setShowSearchResults(false); searchInputRef.current?.focus(); };
  const closeSearchAndNavigate = () => { setSearchQuery(''); setSearchResults(null); setShowSearchResults(false); setIsSearchFocused(false); };

  const handleMenuMouseEnter = (name) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenMenu(name); };
  const handleMenuMouseLeave = () => { closeTimer.current = setTimeout(() => setOpenMenu(null), 150); };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'What We Do', path: '/what-we-do', isMegaMenu: true,
      description: 'End-to-end technology solutions built for scale and reliability.',
      dropdown: [
        { name: 'Web Development', path: '/services/web-development', icon: Globe, color: 'bg-blue-50 text-blue-600', desc: 'Modern, responsive web apps' },
        { name: 'App Development', path: '/services/app-development', icon: Smartphone, color: 'bg-indigo-50 text-indigo-600', desc: 'iOS & Android native apps' },
        { name: 'Custom Software', path: '/services/custom-software', icon: Code, color: 'bg-violet-50 text-violet-600', desc: 'Tailored software systems' },
        { name: 'UX/UI Design', path: '/services/ux-ui-design', icon: Layers, color: 'bg-pink-50 text-pink-600', desc: 'Intuitive user experiences' },
        { name: 'Cloud Application', path: '/services/cloud-application', icon: Cloud, color: 'bg-sky-50 text-sky-600', desc: 'Cloud-native architecture' },
        { name: 'Cloud Ops & Migration', path: '/services/cloud-ops', icon: Settings, color: 'bg-cyan-50 text-cyan-600', desc: 'Seamless cloud migration' },
        { name: 'Cloud Maintenance', path: '/services/cloud-maintenance', icon: Wrench, color: 'bg-teal-50 text-teal-600', desc: '24/7 cloud support & uptime' },
        { name: 'Cyber Security', path: '/services/cyber-security', icon: Shield, color: 'bg-red-50 text-red-600', desc: 'Enterprise-grade protection' },
        { name: 'Quality Assurance', path: '/services/quality-assurance', icon: CheckCircle, color: 'bg-green-50 text-green-600', desc: 'Reliable, bug-free delivery' },
        { name: 'DevOps', path: '/services/devops', icon: GitBranch, color: 'bg-orange-50 text-orange-600', desc: 'CI/CD & automation pipelines' },
        { name: 'Consultation', path: '/services/consultation', icon: MessageCircle, color: 'bg-amber-50 text-amber-600', desc: 'Expert tech strategy' },
      ],
    },
    {
      name: 'Who We Help', path: '/who-we-help', isMegaMenu: true,
      description: 'We partner with businesses across every sector and scale.',
      dropdown: [
        { name: 'Public Sector', path: '/industries/public-sector', icon: Building2, color: 'bg-blue-50 text-blue-600', desc: 'Government & civic tech' },
        { name: 'Startups', path: '/industries/startups', icon: Rocket, color: 'bg-violet-50 text-violet-600', desc: 'MVPs to scale-up growth' },
        { name: 'Ecommerce', path: '/industries/ecommerce', icon: ShoppingCart, color: 'bg-pink-50 text-pink-600', desc: 'High-converting stores' },
        { name: 'Retail & CPG', path: '/industries/retail-cpg', icon: Tag, color: 'bg-orange-50 text-orange-600', desc: 'Omnichannel retail' },
        { name: 'Health Department', path: '/industries/health', icon: Heart, color: 'bg-red-50 text-red-600', desc: 'Digital health platforms' },
        { name: 'Banking & Fintech', path: '/industries/banking-fintech', icon: CreditCard, color: 'bg-green-50 text-green-600', desc: 'Secure financial systems' },
        { name: 'Gaming', path: '/industries/gaming', icon: Gamepad2, color: 'bg-indigo-50 text-indigo-600', desc: 'Interactive experiences' },
        { name: 'AR / VR', path: '/industries/ar-vr', icon: Eye, color: 'bg-sky-50 text-sky-600', desc: 'Immersive AR/VR solutions' },
        { name: 'AI Modules', path: '/industries/ai-modules', icon: Cpu, color: 'bg-purple-50 text-purple-600', desc: 'Smart AI integrations' },
        { name: 'Travel & Hospitality', path: '/industries/travel-hospitality', icon: MapPin, color: 'bg-teal-50 text-teal-600', desc: 'Booking & travel platforms' },
        { name: 'Transport', path: '/industries/transport', icon: Truck, color: 'bg-amber-50 text-amber-600', desc: 'Fleet & logistics' },
        { name: 'Construction', path: '/industries/construction', icon: Hammer, color: 'bg-yellow-50 text-yellow-600', desc: 'Project & site management' },
        { name: 'Artificial Intelligence', path: '/ai-services', icon: Sparkles, color: 'bg-violet-50 text-violet-600', desc: 'AI-powered solutions' },
      ],
    },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', dropdown: [
      { name: 'What We Deliver', path: '/services', icon: Package, desc: 'View all our services' },
      { name: 'Artificial Intelligence', path: '/ai-services', icon: Sparkles, desc: 'AI-powered solutions' },
    ]},
    { name: 'Blogs', path: '/blogs' },
    { name: 'Careers', path: '/careers' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  const renderSearchResults = () => {
    if (!showSearchResults || !searchResults) return null;

    // Tag each result with its type so we can build correct URLs
    const services = (searchResults?.services || []).map(i => ({ ...i, _type: 'service' }));
    const blogs    = (searchResults?.blogs    || []).map(i => ({ ...i, _type: 'blog'    }));
    const careers  = (searchResults?.careers  || []).map(i => ({ ...i, _type: 'career'  }));
    const faqs     = (searchResults?.faqs     || []).map(i => ({ ...i, _type: 'faq'     }));
    const allResults = [...services, ...blogs, ...careers, ...faqs];

    const getUrl = (item) => {
      if (item._type === 'service') return `/services/${item.slug}`;
      if (item._type === 'blog')    return `/blogs/${item.slug}`;
      if (item._type === 'career')  return `/careers`;
      if (item._type === 'faq')     return `/faqs`;
      return item.url || '#';
    };

    const typeLabel = (item) => {
      if (item._type === 'service') return { label: 'Service',  cls: 'bg-indigo-100 text-indigo-700' };
      if (item._type === 'blog')    return { label: 'Blog',     cls: 'bg-violet-100 text-violet-700' };
      if (item._type === 'career')  return { label: 'Career',   cls: 'bg-emerald-100 text-emerald-700' };
      if (item._type === 'faq')     return { label: 'FAQ',      cls: 'bg-amber-100 text-amber-700' };
      return { label: 'Page', cls: 'bg-slate-100 text-slate-600' };
    };

    return (
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden z-50 max-h-80 overflow-y-auto">
        {searchLoading ? (
          <div className="p-6 text-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-slate-400 text-sm mt-2">Searching...</p></div>
        ) : allResults.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No results for "{searchQuery}"</div>
        ) : (
          <div className="py-2">{allResults.slice(0, 8).map((item, i) => {
            const { label, cls } = typeLabel(item);
            return (
              <Link key={i} to={getUrl(item)} onClick={closeSearchAndNavigate} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <Search className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.title || item.question || item.name}</p>
                  {(item.excerpt || item.description || item.answer) && (
                    <p className="text-xs text-slate-400 line-clamp-1">{item.excerpt || item.description || item.answer}</p>
                  )}
                </div>
                <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              </Link>
            );
          })}</div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white relative z-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
              <div className="hidden sm:flex items-center gap-4">
                <a href="tel:+447386118117" className="flex items-center gap-1.5 text-white/90 hover:text-white transition"><Phone className="w-3.5 h-3.5" /> +44 7386 118 117</a>
                <span className="w-px h-4 bg-white/20" />
                <a href="mailto:info@macrosolutionstools.com" className="flex items-center gap-1.5 text-white/90 hover:text-white transition"><Mail className="w-3.5 h-3.5" /> info@macrosolutionstools.com</a>
              </div>
              <div className="flex items-center gap-3 mx-auto sm:mx-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-medium">Free Consultation Available</span>
                <Link to="/contact" className="underline underline-offset-2 font-semibold hover:text-white/90">Book Now</Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  {[
                    socialLinks.facebook  && { icon: FacebookIcon,  href: socialLinks.facebook,  label: 'Facebook' },
                    socialLinks.instagram && { icon: InstagramIcon, href: socialLinks.instagram, label: 'Instagram' },
                    socialLinks.linkedin  && { icon: Linkedin,      href: socialLinks.linkedin,  label: 'LinkedIn' },
                    socialLinks.twitter   && { icon: Twitter,       href: socialLinks.twitter,   label: 'Twitter' },
                    socialLinks.github    && { icon: Github,        href: socialLinks.github,    label: 'GitHub' },
                  ].filter(Boolean).map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"><Icon className="w-3 h-3" /></a>
                  ))}
                </div>
                <button onClick={() => setShowAnnouncement(false)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Header ── */}
      <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur-2xl transition-all duration-300 ${isScrolled ? 'border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)]' : 'border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px] gap-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-slate-200 group-hover:ring-indigo-300 transition-all">
                <img src="/logo.svg" alt="Macro Solutions" className="w-full h-full object-cover" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center">
              <nav className="flex items-center gap-0">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.name} className="relative" onMouseEnter={() => handleMenuMouseEnter(link.name)} onMouseLeave={handleMenuMouseLeave}>
                      <Link to={link.path} className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive(link.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                        <span>{link.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === link.name ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                      </Link>
                      {/* Small dropdown */}
                      {!link.isMegaMenu && (
                        <AnimatePresence>
                          {openMenu === link.name && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-2 w-60 bg-white backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden z-50 py-2">
                              {link.dropdown.map((item) => (
                                <Link key={item.path} to={item.path} onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all group/item">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover/item:bg-indigo-100 transition-colors"><item.icon className="w-4 h-4" /></div>
                                  <div><div className="text-sm font-semibold text-slate-700 group-hover/item:text-slate-900">{item.name}</div><div className="text-xs text-slate-400 mt-0.5">{item.desc}</div></div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ) : (
                    <Link key={link.name} to={link.path} className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive(link.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>{link.name}</Link>
                  )
                )}
              </nav>
            </div>

            {/* Right: Search + CTA */}
            <div className="hidden lg:flex flex-shrink-0 items-center gap-3">
              <div className="relative w-44" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="relative">
                  <input ref={searchInputRef} type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchInputChange} onFocus={() => { setIsSearchFocused(true); if (searchQuery.trim().length > 2 && searchResults) setShowSearchResults(true); }} className="w-full pl-10 pr-8 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" autoComplete="off" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  {searchQuery && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>}
                </form>
                <AnimatePresence>{renderSearchResults()}</AnimatePresence>
              </div>
              <Link to="/contact" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center gap-1.5">Get Started <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mega Menu Panels ── */}
        <AnimatePresence>
          {navLinks.filter(l => l.isMegaMenu).map((link) =>
            openMenu === link.name && (
              <motion.div key={link.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }} onMouseLeave={handleMenuMouseLeave} className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-2xl border-t border-b border-slate-200/60 shadow-xl shadow-slate-200/30 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
                  <div className="flex gap-10">
                    <div className="w-56 flex-shrink-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{link.name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">{link.description}</p>
                      <Link to={link.path} onClick={() => setOpenMenu(null)} className="text-sm text-indigo-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {link.dropdown.map((item) => (
                        <Link key={item.path} to={item.path} onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group/item">
                          <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform`}><item.icon className="w-5 h-5" /></div>
                          <div><div className="text-sm font-semibold text-slate-700 group-hover/item:text-slate-900">{item.name}</div><div className="text-xs text-slate-400">{item.desc}</div></div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-200"><img src="/logo.svg" alt="Macro" className="w-full h-full object-cover" /></div>
                    <span className="font-bold text-slate-900">MACRO</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center"><X className="w-5 h-5 text-slate-600" /></button>
                </div>
                <div className="mb-6">
                  <form onSubmit={handleSearch} className="relative">
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchInputChange} className="w-full pl-10 pr-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </form>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      {link.dropdown ? (
                        <>
                          <button onClick={() => setOpenMenu(openMenu === link.name ? null : link.name)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {link.name} <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === link.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openMenu === link.name && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="pl-4 py-2 space-y-1">
                                  {link.dropdown.map((item) => (
                                    <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition">
                                      <div className={`w-8 h-8 rounded-lg ${item.color || 'bg-indigo-50 text-indigo-600'} flex items-center justify-center flex-shrink-0`}><item.icon className="w-4 h-4" /></div>
                                      <span className="text-sm text-slate-600">{item.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link to={link.path} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}>{link.name}</Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl">Get Started <ArrowRight className="w-4 h-4" /></Link>
                  <div className="mt-4 space-y-2">
                    <a href="tel:+447386118117" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><Phone className="w-4 h-4" /> +44 7386 118 117</a>
                    <a href="mailto:info@macrosolutionstools.com" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"><Mail className="w-4 h-4" /> info@macrosolutionstools.com</a>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {[
                      socialLinks.facebook  && { icon: FacebookIcon,  href: socialLinks.facebook,  label: 'Facebook' },
                      socialLinks.instagram && { icon: InstagramIcon, href: socialLinks.instagram, label: 'Instagram' },
                      socialLinks.linkedin  && { icon: Linkedin,      href: socialLinks.linkedin,  label: 'LinkedIn' },
                      socialLinks.twitter   && { icon: Twitter,       href: socialLinks.twitter,   label: 'Twitter' },
                      socialLinks.github    && { icon: Github,        href: socialLinks.github,    label: 'GitHub' },
                    ].filter(Boolean).map(({ icon: Icon, href, label }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition"><Icon className="w-4 h-4" /></a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}