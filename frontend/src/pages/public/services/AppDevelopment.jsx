import { motion } from 'framer-motion';
import { Smartphone, Layers, Wifi, Bell, Shield, Cpu, Zap, Users } from 'lucide-react';
import { ServiceHero, ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../../components/ServiceSections';

export default function AppDevelopment() {
  return (
    <div className="bg-white">
      <ServiceHero badge="Mobile App Development" title="Apps That People" highlight="Love" description="Native iOS and Android applications crafted for seamless user experiences." accentColor="violet" icon={Smartphone} image="/svc-mobile.jpg" />

      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900">Multi-Platform <span className="text-violet-600">Excellence</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Smartphone, title: 'Multi-Platform', desc: 'Native iOS, Android, and cross-platform solutions.' }, { icon: Zap, title: 'Performance', desc: 'Buttery-smooth 60fps animations and fast load times.' }, { icon: Shield, title: 'Security', desc: 'End-to-end encryption and secure data handling.' }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7" /></div>
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
            <h2 className="text-4xl font-black text-slate-900">What We <span className="text-violet-600">Build</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: 'iOS Development', description: 'Native and cross-platform iOS applications' }, { title: 'Android Development', description: 'Robust Android apps for all devices' }, { title: 'Cross-Platform', description: 'Single codebase for multiple platforms' }, { title: 'Real-Time Sync', description: 'Seamless data synchronization' }, { title: 'Offline Support', description: 'Full functionality without internet' }, { title: 'Push Notifications', description: 'Keep users engaged with notifications' }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-6 border-l-4 border-l-violet-500 hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceProcess accentColor="violet" steps={[{ title: 'Requirements Analysis', description: 'Define app goals, user personas, and core requirements.' }, { title: 'UI/UX Design', description: 'Beautiful, intuitive mobile interfaces with prototyping.' }, { title: 'Development', description: 'Code your app with modern best practices and clean architecture.' }, { title: 'Testing & Beta', description: 'Thorough testing on real devices with beta user feedback.' }, { title: 'Launch & Support', description: 'Deploy to app stores and provide ongoing support.' }]} />
      <ServiceTechStack technologies={[{ icon: '\u269B\uFE0F', name: 'React Native' }, { icon: '\uD83D\uDD35', name: 'Flutter' }, { icon: '\uD83C\uDF4E', name: 'Swift' }, { icon: '\uD83E\uDD16', name: 'Kotlin' }, { icon: '\uD83D\uDD37', name: 'TypeScript' }, { icon: '\uD83D\uDD25', name: 'Firebase' }, { icon: '\uD83D\uDDC3\uFE0F', name: 'SQLite' }, { icon: '\uD83D\uDCE1', name: 'GraphQL' }, { icon: '\uD83D\uDD14', name: 'FCM/APNs' }, { icon: '\uD83E\uDDEA', name: 'Jest' }, { icon: '\uD83D\uDC33', name: 'Docker' }, { icon: '\uD83D\uDCCA', name: 'Analytics' }]} />
      <ServiceWhyChoose reasons={[{ icon: Smartphone, title: 'Native Experience', description: 'Platform-specific UI that feels natural to every user.' }, { icon: Cpu, title: 'Optimized Performance', description: '60fps animations with efficient memory and battery usage.' }, { icon: Wifi, title: 'Offline-First', description: 'Full functionality even without internet connectivity.' }, { icon: Bell, title: 'Smart Notifications', description: 'Personalized push notifications to boost engagement.' }, { icon: Layers, title: 'App Store Ready', description: 'Optimized for approval on both Apple App Store and Google Play.' }, { icon: Users, title: 'Dedicated Support', description: 'Post-launch maintenance, updates, and performance monitoring.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Ready to Build Your App?" description="Let us create a mobile experience your users will love." />
    </div>
  );
}