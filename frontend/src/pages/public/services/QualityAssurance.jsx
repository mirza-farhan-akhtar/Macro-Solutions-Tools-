import { motion } from 'framer-motion';
import { CheckCircle, Bug, Gauge, ShieldCheck, Users, Repeat, FileSearch, Zap, BarChart3 } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function QualityAssurance() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Quality Assurance Services" title="Zero Bugs" highlight="Guaranteed" description="Comprehensive QA and testing services to ensure your software is flawless." accentColor="green" icon={CheckCircle} image="/svc-qa.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Quality <span className="text-green-600">Standards</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: FileSearch, title: 'Thorough', desc: 'Every feature tested across all edge cases.' }, { icon: BarChart3, title: 'Data-Driven', desc: 'Metrics and reports for complete quality visibility.' }, { icon: CheckCircle, title: 'Reliable', desc: 'Repeatable, automated testing you can trust.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ n: '10K+', label: 'Tests Executed' }, { n: '99%', label: 'Bug Detection Rate' }, { n: '50%', label: 'Faster QA Cycles' }].map((s, i) => (
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
            <h2 className="text-4xl font-black text-slate-900">Testing <span className="text-green-600">Services</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'Functional Testing', description: 'Verify every feature works as specified' }, { title: 'Performance Testing', description: 'Load, stress, and scalability testing' }, { title: 'Security Testing', description: 'Vulnerability scanning and penetration testing' }, { title: 'User Acceptance Testing', description: 'Ensure the product meets business requirements' }, { title: 'Automation Testing', description: 'CI/CD integrated automated test suites' }, { title: 'Regression Testing', description: 'Ensure new changes do not break existing features' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-green-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="green" steps={[{ title: 'Test Planning', description: 'Define test strategy, scope, and acceptance criteria.' }, { title: 'Test Design', description: 'Create test cases, scenarios, and test data.' }, { title: 'Execution', description: 'Run manual and automated tests across environments.' }, { title: 'Reporting', description: 'Detailed bug reports with severity and reproduction steps.' }, { title: 'Sign-Off', description: 'Final quality gate approval and release recommendation.' }]} />
      <ServiceTechStack technologies={[{ icon: '\uD83E\uDDEA', name: 'Selenium' }, { icon: '\uD83C\uDFAD', name: 'Playwright' }, { icon: '\uD83C\uDF32', name: 'Cypress' }, { icon: '\uD83D\uDCF1', name: 'Appium' }, { icon: '\u26A1', name: 'Jest' }, { icon: '\uD83D\uDD25', name: 'JMeter' }, { icon: '\uD83D\uDCCA', name: 'Grafana k6' }, { icon: '\uD83D\uDC1B', name: 'Jira' }, { icon: '\uD83D\uDCCB', name: 'TestRail' }, { icon: '\uD83E\uDD16', name: 'Robot Framework' }, { icon: '\uD83D\uDD12', name: 'OWASP ZAP' }, { icon: '\uD83D\uDCC8', name: 'Allure' }]} />
      <ServiceWhyChoose reasons={[{ icon: Bug, title: 'Bug-Free Delivery', description: '99% defect detection rate before production release.' }, { icon: Gauge, title: 'Performance Proven', description: 'Your app handles 10x expected load without breaking.' }, { icon: ShieldCheck, title: 'Security Certified', description: 'OWASP Top 10 verified with penetration testing.' }, { icon: Repeat, title: 'CI/CD Integrated', description: 'Tests run automatically on every code commit.' }, { icon: Zap, title: 'Fast Turnaround', description: '50% faster QA cycles through smart automation.' }, { icon: Users, title: 'Expert QA Team', description: 'ISTQB certified testers with domain expertise.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Ship with Confidence" description="Release bug-free software with our comprehensive QA services." />
    </div>
  );
}
