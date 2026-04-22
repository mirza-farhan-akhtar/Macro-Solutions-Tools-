import { motion } from 'framer-motion';
import { Palette, Figma, MousePointer, Eye, Accessibility, Layers, Users, Sparkles, Monitor } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function UXUIDesign() {
  return (
    <div className="bg-white">
      <ServiceHero badge="UX/UI Design" title="Interfaces That" highlight="Inspire" description="Beautiful, user-centered designs that delight users and drive engagement." accentColor="pink" icon={Palette} image="/svc-uxui.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Design <span className="text-pink-600">Philosophy</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Users, title: 'User-Centered', desc: 'Every decision backed by real user research and data.' }, { icon: Sparkles, title: 'Modern', desc: 'Clean, contemporary aesthetics that stand out.' }, { icon: Monitor, title: 'Performant', desc: 'Designs optimized for fast loading and smooth interactions.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
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
            <h2 className="text-4xl font-black text-slate-900">Design <span className="text-pink-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'User Research', description: 'Interviews, surveys, and analytics to understand users' }, { title: 'Wireframing', description: 'Low-fidelity blueprints to validate concepts fast' }, { title: 'Visual Design', description: 'High-fidelity, pixel-perfect interface design' }, { title: 'Prototyping', description: 'Interactive prototypes for testing before development' }, { title: 'Accessibility', description: 'WCAG 2.1 compliant designs for inclusive experiences' }, { title: 'Usability Testing', description: 'Real user testing sessions to validate design decisions' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-pink-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="pink" steps={[{ title: 'Research', description: 'Understand users, business goals, and competitive landscape.' }, { title: 'Wireframes', description: 'Map user flows and create low-fidelity wireframes.' }, { title: 'Visual Design', description: 'Create beautiful, on-brand high-fidelity mockups.' }, { title: 'Prototyping', description: 'Build interactive prototypes for usability testing.' }, { title: 'Handoff', description: 'Deliver design specs, assets, and developer documentation.' }]} />
      <ServiceTechStack title="Design Tools We Use" technologies={[{ icon: '\uD83C\uDFA8', name: 'Figma' }, { icon: '\u270F\uFE0F', name: 'Sketch' }, { icon: '\uD83C\uDFAD', name: 'Adobe XD' }, { icon: '\uD83D\uDCF8', name: 'Photoshop' }, { icon: '\u2728', name: 'Illustrator' }, { icon: '\uD83C\uDFAC', name: 'After Effects' }, { icon: '\uD83D\uDCD0', name: 'InVision' }, { icon: '\uD83D\uDDBC\uFE0F', name: 'Principle' }, { icon: '\uD83D\uDCCA', name: 'Hotjar' }, { icon: '\uD83D\uDD0D', name: 'Maze' }, { icon: '\uD83D\uDCCB', name: 'Notion' }, { icon: '\uD83C\uDFAF', name: 'Miro' }]} />
      <ServiceWhyChoose reasons={[{ icon: Figma, title: 'Design Systems', description: 'Scalable component libraries for consistent experiences.' }, { icon: MousePointer, title: 'Interaction Design', description: 'Meaningful micro-interactions that delight users.' }, { icon: Eye, title: 'Visual Excellence', description: 'Award-worthy aesthetics that reflect your brand.' }, { icon: Accessibility, title: 'Inclusive Design', description: 'Accessible to all users regardless of ability.' }, { icon: Layers, title: 'Design Tokens', description: 'Systematic design that scales across platforms.' }, { icon: Users, title: 'User Validated', description: 'Every design tested with real users before handoff.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Design Your Product" description="Create interfaces your users will love." />
    </div>
  );
}
