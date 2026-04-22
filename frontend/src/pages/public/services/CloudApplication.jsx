import { motion } from 'framer-motion';
import { Cloud, Server, Globe, Zap, Shield, BarChart3, Database, Users } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function CloudApplication() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Cloud Application Development" title="Built for the" highlight="Cloud" description="Scalable, resilient cloud-native applications engineered for high availability and infinite scale." accentColor="cyan" icon={Cloud} image="/svc-cloud.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Cloud <span className="text-cyan-600">Advantage</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Server, title: 'Scalable', desc: 'Auto-scale from zero to millions of users seamlessly.' }, { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security with compliance baked in.' }, { icon: Zap, title: 'Fast', desc: 'Edge-deployed for sub-second response times globally.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
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
            <h2 className="text-4xl font-black text-slate-900">Key <span className="text-cyan-600">Features</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Scalability', description: 'Handle growth without infrastructure changes' }, { title: 'Reliability', description: '99.9% uptime SLA guaranteed' }, { title: 'Global Reach', description: 'Deploy anywhere, reach everyone' }, { title: 'Cost Efficient', description: 'Pay only for what you use' }, { title: 'Auto-Scaling', description: 'Automatically adjust resources based on demand' }, { title: 'Disaster Recovery', description: 'Built-in backup and recovery systems' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-cyan-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="cyan" steps={[{ title: 'Architecture Review', description: 'Plan your cloud infrastructure for optimal performance.' }, { title: 'Cloud Setup', description: 'Configure your cloud environment with best practices.' }, { title: 'Application Deployment', description: 'Deploy your application with CI/CD pipelines.' }, { title: 'Optimization', description: 'Optimize performance, costs, and resource utilization.' }, { title: 'Monitoring', description: 'Continuous performance tracking and alerting.' }]} />
      <ServiceTechStack technologies={[{ icon: '\u2601\uFE0F', name: 'AWS' }, { icon: '\uD83D\uDD35', name: 'Azure' }, { icon: '\uD83D\uDFE1', name: 'GCP' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\u2638\uFE0F', name: 'Kubernetes' }, { icon: '\uD83D\uDD04', name: 'Terraform' }, { icon: '\uD83D\uDCE1', name: 'Serverless' }, { icon: '\uD83D\uDDC3\uFE0F', name: 'DynamoDB' }, { icon: '\uD83D\uDD34', name: 'Redis' }, { icon: '\uD83D\uDCCA', name: 'CloudWatch' }, { icon: '\uD83D\uDD12', name: 'IAM' }, { icon: '\uD83C\uDF10', name: 'CloudFront' }]} />
      <ServiceWhyChoose reasons={[{ icon: Cloud, title: 'Cloud-Native', description: 'Built from ground up for cloud, not just migrated.' }, { icon: Globe, title: 'Multi-Region', description: 'Deploy across regions for low latency globally.' }, { icon: Shield, title: 'Security First', description: 'SOC 2, HIPAA, GDPR compliant architectures.' }, { icon: BarChart3, title: 'Cost Optimized', description: 'Right-sized infrastructure that saves you money.' }, { icon: Database, title: 'Managed Services', description: 'Leverage managed databases, queues, and caches.' }, { icon: Users, title: '24/7 Support', description: 'Round-the-clock monitoring and incident response.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Move to the Cloud" description="Build scalable, resilient applications that grow with your business." />
    </div>
  );
}
