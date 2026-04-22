import { motion } from 'framer-motion';
import { Wrench, Activity, Shield, Clock, AlertTriangle, RefreshCw, Server, Database, Users } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function CloudMaintenance() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Cloud Maintenance & Support" title="Always" highlight="Online" description="Proactive 24/7 cloud infrastructure monitoring, optimization, and maintenance." accentColor="emerald" icon={Wrench} image="/svc-cloud.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Proactive <span className="text-emerald-600">Infrastructure Care</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Activity, title: '24/7 Monitoring', desc: 'Real-time alerting and automated incident response.' }, { icon: Shield, title: 'Secure', desc: 'Regular patches, audits, and compliance checks.' }, { icon: RefreshCw, title: 'Optimized', desc: 'Continuous performance tuning and cost optimization.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
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
            <h2 className="text-4xl font-black text-slate-900">Maintenance <span className="text-emerald-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Proactive Monitoring', description: 'Catch issues before they impact users' }, { title: 'Security Patches', description: 'Stay protected against emerging threats' }, { title: 'Performance Tuning', description: 'Optimize for best performance continuously' }, { title: 'Backup Management', description: 'Automated backups and disaster recovery' }, { title: 'Scaling Adjustments', description: 'Right-size your infrastructure as needs change' }, { title: 'Incident Response', description: '24/7 emergency support with SLA guarantees' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-emerald-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="emerald" steps={[{ title: 'Assessment', description: 'Review your current cloud environment and identify gaps.' }, { title: 'Planning', description: 'Create a comprehensive maintenance strategy and SLA.' }, { title: 'Implementation', description: 'Set up monitoring tools, alerts, and automation.' }, { title: 'Management', description: 'Ongoing maintenance, patching, and support.' }, { title: 'Optimization', description: 'Continuous improvement of performance and costs.' }]} />
      <ServiceTechStack technologies={[{ icon: '\uD83D\uDCCA', name: 'Datadog' }, { icon: '\uD83D\uDD0D', name: 'New Relic' }, { icon: '\uD83D\uDCC8', name: 'Grafana' }, { icon: '\uD83D\uDD14', name: 'PagerDuty' }, { icon: '\uD83D\uDD04', name: 'Terraform' }, { icon: '\uD83E\uDD16', name: 'Ansible' }, { icon: '\u2601\uFE0F', name: 'CloudWatch' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\u2638\uFE0F', name: 'Kubernetes' }, { icon: '\uD83D\uDD12', name: 'Vault' }, { icon: '\uD83D\uDCDD', name: 'ELK Stack' }, { icon: '\uD83D\uDEE1\uFE0F', name: 'WAF' }]} />
      <ServiceWhyChoose reasons={[{ icon: Clock, title: '99.9% Uptime SLA', description: 'Guaranteed availability with financial-backed SLAs.' }, { icon: AlertTriangle, title: 'Proactive Detection', description: 'AI-powered anomaly detection catches issues early.' }, { icon: Shield, title: 'Security First', description: 'Regular vulnerability scanning and compliance audits.' }, { icon: Server, title: 'Infrastructure Experts', description: 'Certified cloud engineers managing your systems.' }, { icon: Database, title: 'Data Protection', description: 'Automated backups with tested recovery procedures.' }, { icon: Users, title: 'Dedicated Team', description: 'Named support engineers who know your environment.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Get a Support Plan" description="Never worry about downtime again. Let our experts manage your infrastructure." />
    </div>
  );
}
