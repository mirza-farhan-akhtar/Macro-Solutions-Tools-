import { motion } from 'framer-motion';
import { Cog, GitBranch, Container, BarChart3, Shield, Zap, Server, RefreshCw, Users } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function DevOps() {
  return (
    <div className="bg-white">
      <ServiceHero badge="DevOps Services" title="Ship Faster" highlight="Ship Better" description="Automated CI/CD pipelines, infrastructure as code, and container orchestration." accentColor="orange" icon={Cog} image="/svc-devops.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">DevOps <span className="text-orange-600">Impact</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Zap, title: 'Fast', desc: '3x faster deployment cycles with automated pipelines.' }, { icon: Shield, title: 'Reliable', desc: 'Zero-downtime deployments and instant rollbacks.' }, { icon: Cog, title: 'Secure', desc: 'Security baked into every stage of the pipeline.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ n: '3x', label: 'Faster Deployments' }, { n: '80%', label: 'Less Manual Work' }, { n: '0', label: 'Downtime Deployments' }].map((s, i) => (
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
            <h2 className="text-4xl font-black text-slate-900">DevOps <span className="text-orange-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'CI/CD Pipelines', description: 'Automated build, test, and deploy workflows' }, { title: 'Infrastructure as Code', description: 'Version-controlled, reproducible infrastructure' }, { title: 'Container Orchestration', description: 'Docker and Kubernetes for reliable deployments' }, { title: 'Performance Monitoring', description: 'Real-time metrics, dashboards, and alerting' }, { title: 'Log Management', description: 'Centralized logging with search and analysis' }, { title: 'Incident Management', description: 'Automated alerts and rapid response protocols' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-orange-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="orange" steps={[{ title: 'Assessment', description: 'Evaluate your development workflows and bottlenecks.' }, { title: 'Pipeline Design', description: 'Architect CI/CD pipelines tailored to your stack.' }, { title: 'Infrastructure Setup', description: 'Provision infrastructure with Terraform and IaC.' }, { title: 'Automation', description: 'Automate builds, tests, deployments, and monitoring.' }, { title: 'Optimization', description: 'Continuously improve pipeline speed and reliability.' }]} />
      <ServiceTechStack technologies={[{ icon: '\uD83D\uDD04', name: 'Jenkins' }, { icon: '\uD83D\uDFE1', name: 'GitHub Actions' }, { icon: '\uD83D\uDFE0', name: 'GitLab CI' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\u2638\uFE0F', name: 'Kubernetes' }, { icon: '\uD83D\uDD04', name: 'Terraform' }, { icon: '\uD83E\uDD16', name: 'Ansible' }, { icon: '\uD83D\uDCCA', name: 'Prometheus' }, { icon: '\uD83D\uDCC8', name: 'Grafana' }, { icon: '\uD83D\uDCDD', name: 'ELK Stack' }, { icon: '\u2601\uFE0F', name: 'AWS/Azure' }, { icon: '\uD83D\uDD12', name: 'Vault' }]} />
      <ServiceWhyChoose reasons={[{ icon: GitBranch, title: 'CI/CD Experts', description: 'Battle-tested pipelines that handle any scale.' }, { icon: Container, title: 'Container Native', description: 'Full Docker and Kubernetes lifecycle management.' }, { icon: BarChart3, title: 'Observability', description: 'Complete visibility into your application health.' }, { icon: Server, title: 'IaC Mastery', description: 'Infrastructure defined, versioned, and automated.' }, { icon: RefreshCw, title: 'GitOps Ready', description: 'Git as single source of truth for everything.' }, { icon: Users, title: 'Culture Building', description: 'We help your team adopt DevOps practices organically.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Accelerate Your Delivery" description="Deploy faster, fail less, and automate everything." />
    </div>
  );
}
