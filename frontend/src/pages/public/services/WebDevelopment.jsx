import { motion } from 'framer-motion';
import { Code, Globe, Server, Zap, Shield, BarChart3, Database, Users, Layers, Palette } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function WebDevelopment() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Web Development" title="Websites That" highlight="Perform" description="High-performance, scalable web applications built with modern frameworks and best practices." accentColor="blue" icon={Code} image="/svc-web.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Full-Stack <span className="text-blue-600">Expertise</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Globe, title: 'Frontend', desc: 'React, Next.js, Vue — blazing fast UIs.' }, { icon: Server, title: 'Backend', desc: 'Node.js, Laravel, Django — robust APIs.' }, { icon: Database, title: 'Database', desc: 'SQL, NoSQL, graph databases — optimized storage.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">What We <span className="text-blue-600">Build</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Progressive Web Apps', description: 'App-like experiences in the browser' }, { title: 'E-Commerce Platforms', description: 'Scalable online stores with payment integration' }, { title: 'SaaS Applications', description: 'Multi-tenant cloud software solutions' }, { title: 'API Development', description: 'RESTful and GraphQL API design' }, { title: 'CMS Solutions', description: 'Custom content management systems' }, { title: 'Real-Time Applications', description: 'WebSocket-powered live features' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="blue" steps={[{ title: 'Discovery & Planning', description: 'Understand your goals, audience, and technical requirements.' }, { title: 'UI/UX Design', description: 'Create wireframes and high-fidelity prototypes.' }, { title: 'Development', description: 'Build with clean, maintainable, and tested code.' }, { title: 'Quality Assurance', description: 'Rigorous testing across browsers and devices.' }, { title: 'Launch & Support', description: 'Deploy, monitor, and provide ongoing maintenance.' }]} />
      <ServiceTechStack technologies={[{ icon: '⚛️', name: 'React' }, { icon: '▲', name: 'Next.js' }, { icon: '💚', name: 'Vue.js' }, { icon: '🟢', name: 'Node.js' }, { icon: '🐘', name: 'PHP/Laravel' }, { icon: '🐍', name: 'Python' }, { icon: '🔷', name: 'TypeScript' }, { icon: '🎨', name: 'Tailwind CSS' }, { icon: '🐬', name: 'MySQL' }, { icon: '🐘', name: 'PostgreSQL' }, { icon: '🍃', name: 'MongoDB' }, { icon: '🔴', name: 'Redis' }]} />
      <ServiceWhyChoose reasons={[{ icon: Zap, title: 'Lightning Fast', description: 'Sub-second load times with optimized performance.' }, { icon: Shield, title: 'Secure by Default', description: 'OWASP-compliant code with regular security audits.' }, { icon: BarChart3, title: 'SEO Optimized', description: 'Built for search engines from the ground up.' }, { icon: Layers, title: 'Scalable Architecture', description: 'Handle millions of users without breaking a sweat.' }, { icon: Palette, title: 'Pixel Perfect', description: 'Beautiful, responsive designs on every device.' }, { icon: Users, title: 'Ongoing Support', description: 'Dedicated team for maintenance and feature updates.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Start Your Web Project" description="Let us build a web application that exceeds your expectations." />
    </div>
  );
}
