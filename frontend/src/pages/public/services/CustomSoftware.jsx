import { motion } from 'framer-motion';
import { Wrench, Layers, TrendingUp, Shield, Cog, Database, RefreshCw, Users, Cpu } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function CustomSoftware() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Custom Software Development" title="Software Built For" highlight="You" description="Bespoke software solutions designed precisely for your unique challenges." accentColor="indigo" icon={Wrench} image="/svc-custom.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Tailored <span className="text-indigo-600">Solutions</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: TrendingUp, title: 'Business Growth', desc: 'Software that accelerates your competitive advantage.' }, { icon: Shield, title: 'Protection', desc: 'Enterprise-grade security and data compliance.' }, { icon: Layers, title: 'Flexibility', desc: 'Adaptable architecture that evolves with your needs.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
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
            <h2 className="text-4xl font-black text-slate-900">What We <span className="text-indigo-600">Deliver</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Tailored Solutions', description: 'Built specifically for your business needs' }, { title: 'Legacy Integration', description: 'Seamlessly integrate with existing systems' }, { title: 'Scalable Architecture', description: 'Grows with your business without re-engineering' }, { title: 'Data Migration', description: 'Safe transfer from old to new systems' }, { title: 'Custom Workflows', description: 'Automate your unique business processes' }, { title: 'Ongoing Support', description: 'Long-term partnership and maintenance' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-indigo-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="indigo" steps={[{ title: 'Business Analysis', description: 'Understand your unique requirements and objectives.' }, { title: 'Architecture Design', description: 'Plan the perfect technical solution and stack.' }, { title: 'Custom Development', description: 'Build your bespoke software with agile methodologies.' }, { title: 'Integration & Testing', description: 'Connect with existing systems and thorough QA.' }, { title: 'Deployment & Training', description: 'Launch and empower your team with comprehensive training.' }]} />
      <ServiceTechStack technologies={[{ icon: '\u269B\uFE0F', name: 'React' }, { icon: '\uD83D\uDFE2', name: 'Node.js' }, { icon: '\uD83D\uDC0D', name: 'Python' }, { icon: '\u2615', name: 'Java' }, { icon: '\uD83D\uDD37', name: '.NET' }, { icon: '\uD83D\uDC18', name: 'PHP/Laravel' }, { icon: '\uD83D\uDC2C', name: 'MySQL' }, { icon: '\uD83D\uDC18', name: 'PostgreSQL' }, { icon: '\uD83C\uDF43', name: 'MongoDB' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\u2601\uFE0F', name: 'AWS/Azure' }, { icon: '\uD83D\uDD04', name: 'CI/CD' }]} />
      <ServiceWhyChoose reasons={[{ icon: Cog, title: 'Custom-Built', description: 'Every feature designed around your specific requirements.' }, { icon: Layers, title: 'Future-Proof', description: 'Scalable architecture that grows with your business.' }, { icon: RefreshCw, title: 'Legacy Modernization', description: 'Modernize outdated systems without disrupting operations.' }, { icon: Database, title: 'Data-Driven', description: 'Built-in analytics and reporting for informed decisions.' }, { icon: Cpu, title: 'AI-Ready', description: 'Architecture designed to integrate AI capabilities later.' }, { icon: Users, title: 'Full Ownership', description: 'You own 100% of the code with no vendor lock-in.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Explore Solutions" description="Tell us your challenge and we will design a solution that fits perfectly." />
    </div>
  );
}
