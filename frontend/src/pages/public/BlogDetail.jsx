import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI, getImageUrl } from '../../services/api';
import { Calendar, Eye, Tag, User, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO, injectJSONLD } from '../../utils/useSEO';

const SITE_URL = 'https://macrosolutionstools.com';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [blogRes, blogsRes] = await Promise.all([
          publicAPI.blogDetail(slug),
          publicAPI.blogs()
        ]);
        setBlog(blogRes.data);
        setRelatedBlogs((blogsRes.data.data || blogsRes.data).filter(b => b.slug !== slug).slice(0, 3));
      } catch {
        toast.error('Failed to load blog post');
      }
      setLoading(false);
    })();
  }, [slug]);

  // Article JSON-LD for Google rich results
  useEffect(() => {
    if (!blog) return;
    return injectJSONLD('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: (blog.meta_title || blog.title).slice(0, 110),
      description: blog.meta_description || blog.excerpt || '',
      image: blog.featured_image ? `${SITE_URL}${blog.featured_image.startsWith('/') ? '' : '/'}${blog.featured_image}` : `${SITE_URL}/og-image.png`,
      datePublished: blog.created_at,
      dateModified: blog.updated_at || blog.created_at,
      author: {
        '@type': 'Organization',
        name: 'MACRO Solutions Tools Ltd',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'MACRO Solutions Tools Ltd',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blogs/${blog.slug}` },
    });
  }, [blog]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  useSEO({
    title: blog ? `${blog.meta_title || blog.title} | MACRO Solutions Blog` : 'Blog Post | MACRO Solutions Tools Ltd',
    description: blog?.meta_description || blog?.excerpt || 'Read the latest technology insights and software development articles from the MACRO Solutions global team.',
    keywords: Array.isArray(blog?.tags) ? blog.tags.join(', ') : (blog?.tags || 'software blog, tech insights, MACRO Solutions'),
    canonical: blog ? `/blogs/${blog.slug}` : '/blogs',
    ogType: 'article',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-700 mb-3">Post Not Found</h1>
        <p className="text-slate-400 mb-6">The blog post you are looking for does not exist.</p>
        <Link to="/blogs" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-3xl mx-auto px-6 sm:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/blogs" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Link>
          </motion.div>

          {blog.category && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 mb-5">
              {blog.category}
            </motion.span>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            {blog.title}
          </motion.h1>

          {blog.excerpt && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg leading-relaxed mb-8">{blog.excerpt}</motion.p>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-5 text-sm text-white/40 border-t border-white/10 pt-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{fmt(blog.published_at || blog.created_at)}</span>
            {blog.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{blog.author.name || 'Admin'}</span>}
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{blog.views || 0} views</span>
          </motion.div>

          {blog.tags?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-2 mt-5">
              <Tag className="w-3.5 h-3.5 text-white/30" />
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/8 border border-white/12 text-white/50 text-xs rounded-full">{tag}</span>
              ))}
            </motion.div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ARTICLE CONTENT */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          {blog.image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
              <img src={getImageUrl(blog.image)} alt={blog.title} className="w-full rounded-2xl object-cover max-h-[480px] shadow-xl shadow-slate-200" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-indigo-600 prose-strong:text-slate-800"
            dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </section>

      {/* RELATED BLOGS */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedBlogs.map((rb, i) => (
                <motion.div key={rb.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/blogs/${rb.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/8 transition-all duration-300 hover:-translate-y-0.5">
                    {rb.image ? (
                      <img src={getImageUrl(rb.image)} alt={rb.title} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-indigo-200" />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm mb-2">{rb.title}</h4>
                      <span className="inline-flex items-center gap-1 text-indigo-600 text-xs font-semibold">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
