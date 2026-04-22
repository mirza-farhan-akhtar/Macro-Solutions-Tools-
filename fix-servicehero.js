const fs = require('fs');
const path = 'e:/MACRO/frontend/src/components/ServiceSections.jsx';
const content = fs.readFileSync(path, 'utf8');

const heroStart = content.indexOf('export function ServiceHero');
const nextExportComment = content.lastIndexOf('\n/* ', content.indexOf('\nexport function ServiceProcess'));
console.log('heroStart:', heroStart, 'nextExportComment:', nextExportComment);

const newHero = `export function ServiceHero({ badge, title, highlight, description, accentColor = 'indigo', icon: HeroIcon, image, children }) {
  const colors = {
    indigo:  { gradient: 'from-indigo-500 to-blue-600',   bg: 'from-indigo-50/50 via-white to-blue-50/30',   badge: 'bg-indigo-50 border-indigo-100 text-indigo-600', dot: 'bg-indigo-500', orb1: 'from-indigo-200/30', orb2: 'from-blue-200/20' },
    violet:  { gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50/50 via-white to-purple-50/30', badge: 'bg-violet-50 border-violet-100 text-violet-600', dot: 'bg-violet-500', orb1: 'from-violet-200/30', orb2: 'from-purple-200/20' },
    cyan:    { gradient: 'from-cyan-500 to-teal-600',     bg: 'from-cyan-50/50 via-white to-teal-50/30',     badge: 'bg-cyan-50 border-cyan-100 text-cyan-600',       dot: 'bg-cyan-500',   orb1: 'from-cyan-200/30',   orb2: 'from-teal-200/20' },
    blue:    { gradient: 'from-blue-500 to-cyan-600',     bg: 'from-blue-50/50 via-white to-cyan-50/30',     badge: 'bg-blue-50 border-blue-100 text-blue-600',       dot: 'bg-blue-500',   orb1: 'from-blue-200/30',   orb2: 'from-cyan-200/20' },
    emerald: { gradient: 'from-emerald-500 to-teal-600',  bg: 'from-emerald-50/50 via-white to-teal-50/30',  badge: 'bg-emerald-50 border-emerald-100 text-emerald-600', dot: 'bg-emerald-500', orb1: 'from-emerald-200/30', orb2: 'from-teal-200/20' },
    rose:    { gradient: 'from-rose-500 to-pink-600',     bg: 'from-rose-50/50 via-white to-pink-50/30',     badge: 'bg-rose-50 border-rose-100 text-rose-600',       dot: 'bg-rose-500',   orb1: 'from-rose-200/30',   orb2: 'from-pink-200/20' },
    amber:   { gradient: 'from-amber-500 to-orange-600',  bg: 'from-amber-50/50 via-white to-orange-50/30',  badge: 'bg-amber-50 border-amber-100 text-amber-600',    dot: 'bg-amber-500',  orb1: 'from-amber-200/30',  orb2: 'from-orange-200/20' },
    pink:    { gradient: 'from-pink-500 to-rose-600',     bg: 'from-pink-50/50 via-white to-rose-50/30',     badge: 'bg-pink-50 border-pink-100 text-pink-600',       dot: 'bg-pink-500',   orb1: 'from-pink-200/30',   orb2: 'from-rose-200/20' },
    orange:  { gradient: 'from-orange-500 to-amber-600',  bg: 'from-orange-50/50 via-white to-amber-50/30',  badge: 'bg-orange-50 border-orange-100 text-orange-600', dot: 'bg-orange-500', orb1: 'from-orange-200/30', orb2: 'from-amber-200/20' },
    green:   { gradient: 'from-green-500 to-emerald-600', bg: 'from-green-50/50 via-white to-emerald-50/30', badge: 'bg-green-50 border-green-100 text-green-600',    dot: 'bg-green-500',  orb1: 'from-green-200/30',  orb2: 'from-emerald-200/20' },
    red:     { gradient: 'from-red-500 to-rose-600',      bg: 'from-red-50/50 via-white to-rose-50/30',      badge: 'bg-red-50 border-red-100 text-red-600',          dot: 'bg-red-500',    orb1: 'from-red-200/30',    orb2: 'from-rose-200/20' },
  };
  const c = colors[accentColor] || colors.indigo;
  const dark = !!image;

  return (
    <section className={\`relative py-28 lg:py-36 overflow-hidden \${dark ? 'bg-slate-900' : \`bg-gradient-to-br \${c.bg}\`}\`}>
      {/* Background image with Ken Burns zoom */}
      {dark && (
        <>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: \`url(\${image})\` }}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/70 to-slate-900/30" />
          <div className={\`absolute inset-0 bg-gradient-to-br \${c.gradient} opacity-10\`} />
        </>
      )}
      {/* Light-mode decorations */}
      {!dark && (
        <>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <motion.div animate={{ x: [0, 20, -15, 0], y: [0, -20, 15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className={\`absolute top-[10%] right-[10%] w-72 h-72 bg-gradient-to-br \${c.orb1} to-transparent rounded-full blur-3xl pointer-events-none\`} />
          <motion.div animate={{ x: [0, -15, 10, 0], y: [0, 15, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className={\`absolute bottom-[15%] left-[5%] w-60 h-60 bg-gradient-to-br \${c.orb2} to-transparent rounded-full blur-3xl pointer-events-none\`} />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className={\`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-8 \${dark ? 'bg-white/10 border-white/20 text-white' : c.badge}\`}>
              <span className={\`w-1.5 h-1.5 rounded-full animate-pulse \${dark ? 'bg-white' : c.dot}\`} /> {badge}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className={\`text-4xl md:text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight mb-6 \${dark ? 'text-white' : 'text-slate-900'}\`}>
              {title}{' '}<span className={\`bg-gradient-to-r \${c.gradient} bg-clip-text text-transparent\`}>{highlight}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className={\`text-lg leading-relaxed mb-10 max-w-xl \${dark ? 'text-white/70' : 'text-slate-500'}\`}>{description}</motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 flex-wrap">
              <Link to="/contact" className={\`inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r \${c.gradient} text-white font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all\`}>
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className={\`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all \${dark ? 'border border-white/25 text-white/80 hover:bg-white/10 hover:text-white' : 'border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-700 hover:border-indigo-200 hover:bg-white'}\`}>
                All Services
              </Link>
            </motion.div>
          </div>
          {/* RIGHT: Always shows animated icon vector */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center h-[400px]">
            {children || (
              <>
                <div className={\`absolute w-56 h-56 bg-gradient-to-br \${c.orb1} to-transparent rounded-full blur-3xl\`} />
                <GlassCard className="p-10 text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={\`w-20 h-20 rounded-2xl bg-gradient-to-br \${c.gradient} flex items-center justify-center mx-auto mb-4 shadow-xl\`}>
                    {HeroIcon && <HeroIcon className="w-10 h-10 text-white" />}
                  </motion.div>
                  <p className="text-slate-900 font-black text-lg">{badge}</p>
                  <p className="text-slate-400 text-sm mt-1">Enterprise-grade solutions</p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0, 0.3, 0.6].map((d, i) => (
                      <motion.span key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: d }}
                        className={\`w-2 h-2 rounded-full bg-gradient-to-br \${c.gradient} inline-block\`} />
                    ))}
                  </div>
                </GlassCard>
              </>
            )}
          </motion.div>
        </div>
      </div>
      {dark && <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />}
    </section>
  );
}

`;

const newContent = content.substring(0, heroStart) + newHero + content.substring(nextExportComment + 1);
fs.writeFileSync(path, newContent, 'utf8');
console.log('Done. New file length:', newContent.length, '(was:', content.length, ')');
