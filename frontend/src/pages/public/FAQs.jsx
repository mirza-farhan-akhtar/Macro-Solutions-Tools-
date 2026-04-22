import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicAPI } from '../../services/api';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { useSEO, injectJSONLD } from '../../utils/useSEO';
import { FAQVector } from '../../components/HeroVectors';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await publicAPI.faqs();
        const faqsData = response.data || [];
        setFaqs(faqsData);
        setCategories([...new Set(faqsData.map(f => f.category).filter(Boolean))]);
      } catch {}
      setLoading(false);
    })();
  }, []);

  // FAQPage JSON-LD — Google can show FAQ accordion in search results
  useEffect(() => {
    if (!faqs.length) return;
    return injectJSONLD('ld-faqpage', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.slice(0, 20).map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }, [faqs]);

  const toggleItem = (id) => setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (!selectedCategory || faq.category === selectedCategory);
  });

  useSEO({
    title: 'Frequently Asked Questions | MACRO Solutions Tools Ltd',
    description: 'Find answers about MACRO Solutions — our services, development process, global offices, pricing and how we work with clients worldwide.',
    keywords: 'MACRO Solutions FAQ, software company questions, development process, global software house, how does MACRO work',
    canonical: '/faqs',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
        <Orb size="500px" x="-5%" y="-10%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" />
        <Orb size="350px" x="65%" y="30%" delay={4} gradient="radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /><span>Got Questions?</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                Frequently Asked <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-slate-500 text-lg mb-8 max-w-xl">
                Find answers to common questions about our services, process, and how we can help your business.
              </motion.p>
              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search questions…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" />
                </div>
                {categories.length > 0 && (
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-48">
                    <option value="" className="bg-white">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat} className="bg-white">{cat}</option>)}
                  </select>
                )}
              </motion.div>
            </div>
            {/* Right: FAQ Vector */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="relative h-[480px] hidden lg:flex items-center justify-center">
              <FAQVector />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* FAQ LIST */}
      <section className="py-16 bg-slate-50 min-h-[400px]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">
                {faqs.length === 0 ? 'No FAQs Available Yet' : 'No Results Found'}
              </h3>
              <p className="text-slate-400 text-sm">
                {faqs.length === 0 ? 'FAQs will appear here once added through the admin panel.' : 'Try adjusting your search or category filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, i) => (
                <motion.div key={faq.id}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-colors">
                  <button onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group">
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openItems[faq.id] ? 'rotate-180 text-indigo-500' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openItems[faq.id] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
