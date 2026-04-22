import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { publicAPI } from '../../services/api';
import { Mail, Phone, MapPin, Send, Sparkles, User, AtSign, Building2, MessageSquare, FileText, ArrowRight, Clock, CheckCircle2, RotateCcw, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO, injectJSONLD } from '../../utils/useSEO';
import { ContactVector } from '../../components/HeroVectors';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: 'Contact MACRO Solutions Tools Ltd | UK, Pakistan, Dubai, Ethiopia, Somaliland',
    description: 'Contact MACRO Solutions Tools Ltd. Our teams in the UK, Pakistan, Somaliland, Ethiopia, and Dubai are ready to help you build world-class software. Get in touch today.',
    keywords: 'contact MACRO Solutions, software company UK contact, Pakistan IT company contact, Dubai tech firm, reach MACRO Solutions, global software enquiry',
    canonical: '/contact',
  });

  // LocalBusiness JSON-LD — boosts Google Maps and knowledge panel
  useEffect(() => {
    return injectJSONLD('ld-localbusiness', {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'MACRO Solutions Tools Ltd',
      description: 'Global software development company delivering custom software, AI, cloud, and cybersecurity solutions.',
      url: 'https://macrosolutionstools.com',
      logo: 'https://macrosolutionstools.com/logo.svg',
      image: 'https://macrosolutionstools.com/og-image.png',
      telephone: '+447386118117',
      email: 'info@macrosolutionstools.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '73 Chequers Court, Palmers Leaze',
        addressLocality: 'Bristol',
        addressRegion: 'England',
        postalCode: 'BS32 0HJ',
        addressCountry: 'GB',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.5461,
        longitude: -2.5788,
      },
      openingHours: 'Mo-Fr 09:00-18:00',
      priceRange: '££',
      areaServed: 'Worldwide',
      sameAs: ['https://macrosolutionstools.com'],
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicAPI.contact(formData);
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'info@macrosolutionstools.com',
      sub: 'We reply within 24 hours',
      gradient: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: 'mailto:info@macrosolutionstools.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+44 7386 118117',
      sub: 'Mon–Fri, 9 AM – 6 PM GMT',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      href: 'tel:+447386118117',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: '73 Chequers Court, Palmers Leaze',
      sub: 'Bradley Stoke, Bristol BS32 0HJ, GB',
      gradient: 'from-purple-600 to-pink-600',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: 'https://maps.google.com/?q=73+Chequers+Court+Palmers+Leaze+Bradley+Stoke+Bristol+BS32+0HJ',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
        <Orb size="500px" x="-5%" y="-10%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" />
        <Orb size="350px" x="65%" y="20%" delay={3} gradient="radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /><span>Get in Touch</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                Let{"'s"} Build Something <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Amazing Together</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-slate-500 text-lg mb-8 max-w-xl">
                Whether you're in London, Dubai, Lahore, Hargeisa, or Addis Ababa — we have a team near you. Tell us about your project and we'll get back within 24 hours.
              </motion.p>
              {/* Contact Cards */}
              <div className="flex flex-col gap-3">
                {contactCards.map((card, i) => (
                  <motion.a key={card.title} href={card.href}
                    target={card.title === 'Visit Us' ? '_blank' : undefined}
                    rel={card.title === 'Visit Us' ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{card.title}</h3>
                      <p className="text-slate-600 text-sm">{card.detail}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            {/* Right: Contact Vector */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="relative h-[480px] hidden lg:flex items-center justify-center">
              <ContactVector />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Form + Map Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                      <p className="text-gray-500 mb-2 max-w-sm mx-auto">Thank you for reaching out. Our team will review your message and get back to you within 24 hours.</p>
                      <p className="text-sm text-gray-400 mb-8">A confirmation has been sent to your email.</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-500">Fill out the form below and we'll get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          placeholder="+44 7386 118117"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Our Location</h3>
                      <p className="text-sm text-gray-500">Bradley Stoke, Bristol, UK</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-[400px]">
                  <iframe
                    title="Macro Solutions Tools Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.7!2d-2.5572!3d51.5363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48719254a1f6c26d%3A0x0!2s73+Chequers+Court%2C+Palmers+Leaze%2C+Bradley+Stoke%2C+Bristol+BS32+0HJ!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="p-5 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Full Address:</span> 73 Chequers Court, Palmers Leaze, Bradley Stoke, Bristol, England BS32 0HJ, GB
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ GLOBAL OFFICES ══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.18),transparent)]" />
        <motion.div className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8), transparent 70%)', top: '10%', left: '-5%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8), transparent 70%)', bottom: '10%', right: '5%' }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-5">
              <Globe className="w-4 h-4" /><span>Our Global Presence</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              5 Offices.<span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"> One Global Team.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Strategically located across three continents to serve you in your timezone with local expertise.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { code: 'gb', city: 'Bristol', country: 'United Kingdom', role: 'Headquarters', addr: '73 Chequers Court, Bradley Stoke, BS32 0HJ', grad: 'from-indigo-500 to-blue-600', glow: 'rgba(99,102,241,0.3)', href: 'https://maps.google.com/?q=73+Chequers+Court+Palmers+Leaze+Bradley+Stoke+Bristol+BS32+0HJ' },
              { code: 'pk', city: 'Pakistan', country: 'South Asia', role: 'South Asia Office', addr: 'Serving South Asian & global markets', grad: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)', href: 'mailto:info@macrosolutionstools.com' },
              { code: 'so', city: 'Hargeisa', country: 'Somaliland', role: 'East Africa Office', addr: 'Serving East Africa & Horn of Africa', grad: 'from-orange-500 to-amber-600', glow: 'rgba(245,158,11,0.3)', href: 'mailto:info@macrosolutionstools.com' },
              { code: 'et', city: 'Addis Ababa', country: 'Ethiopia', role: 'Africa Office', addr: 'Serving Sub-Saharan Africa & East Africa', grad: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)', href: 'mailto:info@macrosolutionstools.com' },
              { code: 'ae', city: 'Dubai', country: 'UAE', role: 'Middle East Office', addr: 'Serving MENA & Gulf region', grad: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)', href: 'mailto:info@macrosolutionstools.com' },
            ].map((office, i) => (
              <motion.a key={i} href={office.href}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-white/4 border border-white/8 hover:border-white/20 hover:bg-white/8 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className={`w-full h-[3px] bg-gradient-to-r ${office.grad}`} />
                <div className="p-6 flex flex-col items-center flex-1 relative">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 80% at 50% 120%, ${office.glow}, transparent)` }} />
                  <div className="relative mb-4">
                    <img
                      src={`https://flagcdn.com/w80/${office.code}.png`}
                      srcSet={`https://flagcdn.com/w160/${office.code}.png 2x`}
                      alt={`${office.country} flag`}
                      className="w-16 h-auto object-contain rounded shadow-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">{office.role}</p>
                    <h3 className="text-lg font-black text-white mb-0.5">{office.city}</h3>
                    <p className="text-sm text-white/60 font-medium mb-2">{office.country}</p>
                    <p className="text-xs text-white/35 leading-relaxed">{office.addr}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="text-center mt-10">
            <p className="text-white/40 text-sm">All offices share one unified team — your project gets full global collaboration.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
