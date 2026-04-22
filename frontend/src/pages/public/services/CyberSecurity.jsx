import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, Eye, FileSearch, Users, Server, Fingerprint, ShieldCheck } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function CyberSecurity() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Cyber Security Services" title="Defend Your" highlight="Digital Assets" description="Advanced cybersecurity solutions to protect what matters most." accentColor="red" icon={Shield} image="/svc-cyber.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Security <span className="text-red-600">Pillars</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Shield, title: 'Protected', desc: 'Multi-layered security architecture for complete protection.' }, { icon: Eye, title: 'Vigilant', desc: '24/7 real-time monitoring and threat intelligence.' }, { icon: FileSearch, title: 'Compliant', desc: 'Meet industry regulations and compliance standards.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-500 to-rose-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ n: '500+', label: 'Threats Blocked Daily' }, { n: '99.9%', label: 'Uptime Guaranteed' }, { n: '24/7', label: 'Security Monitoring' }].map((s, i) => (
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
            <h2 className="text-4xl font-black text-slate-900">Security <span className="text-red-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Threat Detection', description: 'AI-powered real-time threat monitoring and response' }, { title: 'Vulnerability Assessment', description: 'Comprehensive scanning of your digital infrastructure' }, { title: 'Penetration Testing', description: 'Ethical hacking to find weaknesses before attackers do' }, { title: 'Compliance Management', description: 'SOC 2, HIPAA, GDPR, ISO 27001 compliance support' }, { title: 'Incident Response', description: 'Rapid containment and recovery from security breaches' }, { title: 'Employee Training', description: 'Security awareness programs to reduce human risk' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-red-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="red" steps={[{ title: 'Security Audit', description: 'Assess your current security posture and vulnerabilities.' }, { title: 'Threat Modeling', description: 'Identify potential attack vectors and risk priorities.' }, { title: 'Implementation', description: 'Deploy security controls, firewalls, and monitoring.' }, { title: 'Testing', description: 'Penetration testing and red-team exercises.' }, { title: 'Continuous Protection', description: 'Ongoing monitoring, updates, and incident response.' }]} />
      <ServiceTechStack technologies={[{ icon: '\uD83D\uDEE1\uFE0F', name: 'SIEM' }, { icon: '\uD83D\uDD25', name: 'Firewall' }, { icon: '\uD83D\uDD0D', name: 'IDS/IPS' }, { icon: '\uD83D\uDD12', name: 'Zero Trust' }, { icon: '\uD83D\uDD11', name: 'MFA/IAM' }, { icon: '\uD83D\uDCE1', name: 'SOAR' }, { icon: '\uD83E\uDDEA', name: 'Pen Testing' }, { icon: '\uD83D\uDCCA', name: 'Splunk' }, { icon: '\uD83E\uDD16', name: 'AI Detection' }, { icon: '\u2601\uFE0F', name: 'Cloud Security' }, { icon: '\uD83D\uDCDD', name: 'Compliance' }, { icon: '\uD83D\uDD10', name: 'Encryption' }]} />
      <ServiceWhyChoose reasons={[{ icon: Lock, title: 'Zero-Trust', description: 'Never trust, always verify defense in depth security model.' }, { icon: AlertTriangle, title: 'Proactive Defense', description: 'Stop threats before they reach your systems.' }, { icon: Fingerprint, title: 'Identity Security', description: 'Advanced authentication and access management.' }, { icon: Server, title: 'SOC Services', description: 'Dedicated security operations center monitoring.' }, { icon: ShieldCheck, title: 'Compliance Ready', description: 'Meet every industry regulation with confidence.' }, { icon: Users, title: 'Expert Team', description: 'Certified cybersecurity professionals (CISSP, CEH, OSCP).' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Secure Your Business" description="Protect your business with enterprise-grade security." />
    </div>
  );
}
