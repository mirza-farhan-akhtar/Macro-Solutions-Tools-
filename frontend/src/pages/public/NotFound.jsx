import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  // Tell search engines this is a real 404 (as much as client-side can)
  useEffect(() => {
    document.title = '404 — Page Not Found | MACRO Solutions Tools Ltd';
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.setAttribute('content', 'noindex, follow');
    return () => {
      if (meta) meta.setAttribute('content', 'index, follow');
    };
  }, []);

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'AI Services', to: '/ai-services' },
    { label: 'About Us', to: '/about' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg"
      >
        {/* 404 number */}
        <div className="text-[9rem] font-black leading-none bg-gradient-to-b from-indigo-400 to-indigo-600/30 bg-clip-text text-transparent select-none mb-2">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.<br />
          Let's get you back on track.
        </p>

        {/* Primary actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Quick nav */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Explore</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
