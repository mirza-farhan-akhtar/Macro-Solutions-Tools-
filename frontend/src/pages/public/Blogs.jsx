import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI, getImageUrl } from '../../services/api';
import { Calendar, Eye, Sparkles, ArrowRight, BookOpen }from 'lucide-react';
import { useSEO } from '../../utils/useSEO';
import { BlogsVector } from '../../components/HeroVectors';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const params = selectedCategory ? { category: selectedCategory } : {};
        const response = await publicAPI.blogs(params);
        const blogsData = response.data.data || response.data || [];
        setBlogs(blogsData);
        if (!selectedCategory) setCategories([...new Set(blogsData.map(b => b.category).filter(Boolean))]);
      } catch {}
      setLoading(false);
    })();
  }, [selectedCategory]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  useSEO({
    title: 'Blog & Tech Insights | Software Development News | MACRO Solutions',
    description: 'Stay ahead with the latest on software engineering, AI, cloud, and digital transformation. Articles and insights from the MACRO Solutions global team.',
    keywords: 'software development blog, tech insights UK, AI articles, cloud computing blog, digital transformation, MACRO Solutions news',
    canonical: '/blogs',
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
        <Orb size="350px" x="65%" y="30%" delay={3} gradient="radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" /><span>Insights & Updates</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
            Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
            Explore ideas, insights, and innovations from our team Ã¢â‚¬â€ covering enterprise software, AI, and digital transformation.
          </motion.p>

          {categories.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white border border-slate-200 text-slate-600 hover:bg-white/12'}`}>
                All
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white border border-slate-200 text-slate-600 hover:bg-white/12'}`}>
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* BLOG GRID */}
      <section className="py-16 bg-slate-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No Posts Found</h3>
              <p className="text-slate-400 text-sm">Check back soon Ã¢â‚¬â€ content is on its way.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.div key={blog.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 hover:-translate-y-1">
                  {blog.image ? (
                    <img src={getImageUrl(blog.image)} alt={blog.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-indigo-200" />
                    </div>
                  )}
                  <div className="p-6">
                    {blog.category && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-3">{blog.category}</span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{blog.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{fmt(blog.published_at || blog.created_at)}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{blog.views || 0}</span>
                      </div>
                      <Link to={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
