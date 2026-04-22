import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Briefcase, Award, Github, Linkedin, Twitter, Instagram, Globe, Sparkles, Users } from 'lucide-react';
import { publicAPI, getImageUrl } from '../../services/api';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await publicAPI.team();
        setTeamMembers(response.data || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const empColors = {
    'full-time': 'bg-emerald-100 text-emerald-700',
    'part-time': 'bg-blue-100 text-blue-700',
    'contract': 'bg-violet-100 text-violet-700',
    'internship': 'bg-amber-100 text-amber-700',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.07),transparent)]" />
        <Orb size="500px" x="-5%" y="-10%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" />
        <Orb size="350px" x="65%" y="30%" delay={3} gradient="radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%)" opacity={0.22} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /><span>The People Behind MACRO</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
            Meet Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Amazing Team</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto">
            Talented individuals united by a passion for innovation. Our diverse team brings years of expertise to every project we take on.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* TEAM GRID */}
      <section className="py-16 bg-slate-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {teamMembers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">Team Coming Soon</h3>
              <p className="text-slate-400 text-sm">Our team information will be available here shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div key={member.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 hover:-translate-y-1 text-center">

                  {/* Avatar */}
                  <div className="mb-5 flex justify-center">
                    {member.avatar ? (
                      <img src={getImageUrl(member.avatar)} alt={member.name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                        <span className="text-white text-xl font-bold">{getInitials(member.name)}</span>
                      </div>
                    )}
                  </div>

                  {/* Name + Role */}
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">{member.name}</h3>
                  <p className="text-indigo-600 text-sm font-semibold mb-1">{member.position}</p>
                  {member.department && <p className="text-slate-400 text-xs mb-3">{member.department}</p>}
                  {member.employment_type && (
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-4 ${empColors[member.employment_type?.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                      {member.employment_type.replace('-', ' ')}
                    </span>
                  )}

                  {member.bio && <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">{member.bio}</p>}

                  {/* Skills */}
                  {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {member.skills.slice(0, 3).map((s, si) => (
                        <span key={si} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">{s}</span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded-full">+{member.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 mb-4">
                    {member.experience_level && (
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{member.experience_level}</span>
                    )}
                    {member.education && (
                      <span className="flex items-center gap-1"><Award className="w-3 h-3" /><span className="line-clamp-1">{member.education}</span></span>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-1 pt-4 border-t border-slate-100">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={`https://twitter.com/${member.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-lg hover:bg-sky-50">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {member.portfolio_url && (
                      <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-violet-600 transition-colors rounded-lg hover:bg-violet-50">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
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
