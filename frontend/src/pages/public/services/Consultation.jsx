import { motion } from 'framer-motion';
import { Users, Lightbulb, Target, BarChart3, Shield, Compass, Brain, TrendingUp, Award } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function Consultation() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Technology Consultation" title="Expert Guidance For" highlight="Your Vision" description="Transform your business with strategic technology consultation." accentColor="amber" icon={Users} image="/svc-custom.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Strategic <span className="text-amber-600">Consulting</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Lightbulb, title: 'Insightful', desc: 'Deep industry knowledge and technology expertise.' }, { icon: Target, title: 'Focused', desc: 'Goal-oriented strategies aligned with business outcomes.' }, { icon: BarChart3, title: 'Results-Driven', desc: 'Measurable impact with clear ROI tracking.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ n: '200+', label: 'Projects Advised' }, { n: '50+', label: 'Industry Experts' }, { n: '98%', label: 'Client Satisfaction' }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-4xl font-black text-white">{s.n}</p>
                <p className="text-white/70 font-medium mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Consultation <span className="text-amber-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Digital Transformation', description: 'Guide your digital evolution with a clear roadmap' }, { title: 'Technology Strategy', description: 'Plan your technology investments for maximum ROI' }, { title: 'Architecture Design', description: 'Design scalable, resilient system architectures' }, { title: 'Process Optimization', description: 'Streamline operations for efficiency and speed' }, { title: 'Risk Assessment', description: 'Identify and mitigate technology and business risks' }, { title: 'Vendor Selection', description: 'Choose the right tools, platforms, and partners' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-amber-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="amber" steps={[{ title: 'Discovery', description: 'Deep dive into your business objectives and challenges.' }, { title: 'Analysis', description: 'Assess current state of technology and processes.' }, { title: 'Recommendations', description: 'Provide strategic, actionable guidance with priorities.' }, { title: 'Roadmap', description: 'Create a phased implementation plan with milestones.' }, { title: 'Support', description: 'Guide implementation and measure outcomes.' }]} />
      <ServiceWhyChoose reasons={[{ icon: Brain, title: 'Industry Expertise', description: '50+ consultants with deep domain knowledge across sectors.' }, { icon: Compass, title: 'Strategic Vision', description: 'We align technology with your long-term business goals.' }, { icon: TrendingUp, title: 'Proven Results', description: 'Our clients see average 35% improvement in efficiency.' }, { icon: Shield, title: 'Risk Mitigation', description: 'Identify blind spots before they become costly problems.' }, { icon: Award, title: 'Vendor Neutral', description: 'Unbiased recommendations for what works for you.' }, { icon: Users, title: 'Ongoing Partnership', description: 'We stay with you through implementation and beyond.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Get Expert Advice" description="Book a free consultation with our senior technology strategists." />
    </div>
  );
}
