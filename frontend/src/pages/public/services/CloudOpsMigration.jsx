import { motion } from 'framer-motion';
import { ArrowRightLeft, Cloud, Shield, Zap, Clock, BarChart3, Server, Users } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function CloudOpsMigration() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Cloud Ops & Migration" title="Migrate" highlight="Seamlessly" description="Zero-downtime cloud migrations and ongoing operations management." accentColor="blue" icon={ArrowRightLeft} image="/svc-cloud.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Migration <span className="text-blue-600">Benefits</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Zap, title: 'Efficient', desc: 'Streamlined migration with minimal business disruption.' }, { icon: Shield, title: 'Safe', desc: 'Encrypted transfers and rollback plans at every stage.' }, { icon: Clock, title: 'Fast', desc: 'Rapid migration timelines with parallel workstreams.' }].map((item, i) => (
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
            <h2 className="text-4xl font-black text-slate-900">Migration <span className="text-blue-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Zero Downtime Migration', description: 'Seamless transition without service interruption' }, { title: 'Data Security', description: 'Encrypted transfers and comprehensive backups' }, { title: 'Performance Optimization', description: 'Maximize cloud resources for best performance' }, { title: 'Cost Optimization', description: 'Reduce infrastructure spending with right-sizing' }, { title: 'Monitoring & Management', description: '24/7 cloud operations and monitoring' }, { title: 'Training & Support', description: 'Team enablement and ongoing operational support' }].map((f, i) => (
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

      <ServiceProcess accentColor="blue" steps={[{ title: 'Assessment', description: 'Analyze current infrastructure, dependencies, and workloads.' }, { title: 'Planning', description: 'Create a detailed migration roadmap with risk mitigation.' }, { title: 'Data Migration', description: 'Safely transfer your data with encryption and validation.' }, { title: 'Testing', description: 'Validate everything works correctly in the new environment.' }, { title: 'Cutover', description: 'Execute final migration with zero-downtime switchover.' }]} />
      <ServiceTechStack technologies={[{ icon: '\u2601\uFE0F', name: 'AWS Migration' }, { icon: '\uD83D\uDD35', name: 'Azure Migrate' }, { icon: '\uD83D\uDFE1', name: 'GCP Transfer' }, { icon: '\uD83D\uDD04', name: 'Terraform' }, { icon: '\uD83E\uDD16', name: 'Ansible' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\u2638\uFE0F', name: 'Kubernetes' }, { icon: '\uD83D\uDDC3\uFE0F', name: 'DB Migration' }, { icon: '\uD83D\uDCCA', name: 'CloudWatch' }, { icon: '\uD83D\uDD12', name: 'VPN/VPC' }, { icon: '\uD83D\uDCE1', name: 'DNS Migration' }, { icon: '\uD83D\uDEE1\uFE0F', name: 'IAM' }]} />
      <ServiceWhyChoose reasons={[{ icon: ArrowRightLeft, title: 'Zero Downtime', description: 'Proven migration strategies that keep your business running.' }, { icon: Cloud, title: 'Multi-Cloud', description: 'Expertise across AWS, Azure, and Google Cloud Platform.' }, { icon: Shield, title: 'Data Integrity', description: 'Validated data transfers with rollback capabilities.' }, { icon: BarChart3, title: 'Cost Savings', description: 'Typical 30-40% reduction in infrastructure costs.' }, { icon: Server, title: 'Ops Management', description: 'Ongoing cloud operations and optimization post-migration.' }, { icon: Users, title: 'Knowledge Transfer', description: 'We train your team to manage the new environment.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Start Your Migration" description="Move to the cloud with confidence and zero downtime." />
    </div>
  );
}
