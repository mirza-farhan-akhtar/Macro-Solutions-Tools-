import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../../services/api';
import { Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { CareersVector } from '../../components/HeroVectors';
import { useSEO } from '../../utils/useSEO';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const fetchCareers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicAPI.careers();
      // Handle both plain array and wrapped { data: [...] } formats
      const raw = response.data;
      const careersData = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      setCareers(careersData);
      setDepartments([...new Set(careersData.map(c => c.department).filter(Boolean))]);
      setJobTypes([...new Set(careersData.map(c => c.type).filter(Boolean))]);
    } catch (err) {
      console.error('Careers fetch error:', err);
      setError('Failed to load job listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const filteredCareers = careers.filter(career => {
    const matchesDepartment = !selectedDepartment || career.department === selectedDepartment;
    const matchesType = !selectedType || career.type === selectedType;
    return matchesDepartment && matchesType;
  });

  const expColors = {
    entry: 'bg-emerald-100 text-emerald-700',
    mid: 'bg-blue-100 text-blue-700',
    senior: 'bg-violet-100 text-violet-700',
    executive: 'bg-rose-100 text-rose-700',
  };

  useSEO({
    title: 'Careers at MACRO Solutions | Join Our Global Tech Team',
    description: 'We\u2019re hiring software engineers, designers and technologists. Build your career at MACRO Solutions \u2014 a global team delivering world-class software across 5 countries.',
    keywords: 'software engineering jobs UK, tech jobs, IT careers, software developer jobs, MACRO Solutions careers, global tech company jobs',
    canonical: '/careers',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <button onClick={fetchCareers} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
          Try Again
        </button>
      </div>
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

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /><span>Join Our Team</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                Build the Future <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">With Us</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-slate-500 text-lg mb-10 max-w-xl">
                Discover exciting career opportunities and help us build the future of enterprise software. We are always looking for talented, passionate people.
              </motion.p>
              {/* Perks */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3">
                {['Remote-Friendly', 'Competitive Pay', 'Learning Budget', 'Great Culture', 'Health Benefits'].map((perk, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold">
                    {perk}
                  </span>
                ))}
              </motion.div>
            </div>
            {/* Right: Careers Vector */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="relative h-[460px] hidden lg:flex items-center justify-center">
              <CareersVector />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* FILTERS + JOBS */}
      <section className="py-16 bg-slate-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">

          {/* Filters */}
          {(departments.length > 0 || jobTypes.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 mb-10 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm flex-shrink-0">
                <Filter className="w-4 h-4" /> Filter by:
              </div>
              {departments.length > 0 && (
                <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700">
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
              {jobTypes.length > 0 && (
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700">
                  <option value="">All Job Types</option>
                  {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              {(selectedDepartment || selectedType) && (
                <button onClick={() => { setSelectedDepartment(''); setSelectedType(''); }}
                  className="text-sm text-slate-500 hover:text-slate-700 underline flex-shrink-0">Clear</button>
              )}
            </motion.div>
          )}

          {filteredCareers.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">
                {careers.length === 0 ? 'No Open Positions Right Now' : 'No Matching Positions'}
              </h3>
              <p className="text-slate-400 text-sm">
                {careers.length === 0 ? 'Check back soon — we are always growing.' : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredCareers.map((career, i) => (
                <motion.div key={career.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors truncate">{career.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        {career.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{career.location}</span>
                        )}
                        {career.type && (
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{career.type}</span>
                        )}
                        {career.department && (
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{career.department}</span>
                        )}
                      </div>
                    </div>
                    {career.experience_level && (
                      <span className={`ml-3 flex-shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full ${expColors[career.experience_level?.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                        {career.experience_level}
                      </span>
                    )}
                  </div>

                  {career.description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">{career.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      {career.salary_range && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />{career.salary_range}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{new Date(career.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <Link to={`/careers/${career.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors group-hover:shadow-md group-hover:shadow-indigo-500/25">
                      Apply Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.18),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Do not see the right role?</h2>
            <p className="text-white/50 mb-8">Send us your resume anyway. We are always looking for exceptional talent.</p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
