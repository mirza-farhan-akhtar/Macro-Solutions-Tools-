import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Bot, Sparkles, BarChart3, Eye, MessageSquare, Cog, Shield, Zap, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import { useSEO } from '../../utils/useSEO';
import { ServiceProcess, ServiceTechStack, ServiceWhyChoose, ServiceTestimonials, ServiceCTA, GlassCard } from '../../components/ServiceSections';
import { AIServicesVector } from '../../components/HeroVectors';

export default function AIServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'AI Services | MACRO Solutions Tools',
    description: 'Advanced AI and machine learning solutions for your business.',
    keywords: 'AI services, machine learning, NLP, computer vision, predictive analytics',
    canonical: '/ai-services',
    ogType: 'website'
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await publicAPI.aiServices();
        setServices(res.data?.data || res.data || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const capabilities = [
    { icon: Brain, title: 'Machine Learning', description: 'Custom ML models trained on your data for accurate predictions.', color: 'violet' },
    { icon: MessageSquare, title: 'Natural Language Processing', description: 'Text analysis, chatbots, and sentiment analysis at scale.', color: 'blue' },
    { icon: Eye, title: 'Computer Vision', description: 'Image recognition, object detection, and visual inspection.', color: 'cyan' },
    { icon: BarChart3, title: 'Predictive Analytics', description: 'Data-driven forecasting for smarter business decisions.', color: 'emerald' },
    { icon: Bot, title: 'Intelligent Automation', description: 'AI-powered workflow automation that learns and improves.', color: 'amber' },
    { icon: Sparkles, title: 'Generative AI', description: 'Content generation, code assistants, and creative AI tools.', color: 'pink' }
  ];

  const colorMap = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-l-violet-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-l-blue-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-l-cyan-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-l-amber-500' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-l-pink-500' }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-violet-50/50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/20 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-semibold mb-6">
              <Brain className="w-4 h-4" /> Artificial Intelligence
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
              AI That <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Transforms</span> Business
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
              Harness the power of artificial intelligence and machine learning to automate processes, unlock insights, and create intelligent products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5">
                Explore AI Solutions
              </Link>
              <Link to="/contact" className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-violet-300 hover:text-violet-700 transition-all">
                Book a Demo
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
            <div className="relative h-[480px]">
              <AIServicesVector />
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">AI <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Capabilities</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto">End-to-end AI solutions tailored to your industry and business challenges.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className={`p-6 border-l-4 ${colorMap[cap.color]?.border || 'border-l-slate-500'} hover:shadow-md transition-all h-full`}>
                  <div className={`w-12 h-12 rounded-xl ${colorMap[cap.color]?.bg || 'bg-slate-50'} ${colorMap[cap.color]?.text || 'text-slate-600'} flex items-center justify-center mb-4`}>
                    <cap.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{cap.title}</h3>
                  <p className="text-slate-500 text-sm">{cap.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic AI Services from API */}
      {!loading && services.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Our AI <span className="text-violet-600">Solutions</span></h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Production-ready AI solutions powering businesses worldwide.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div key={service.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-4">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{service.name || service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceProcess accentColor="violet" steps={[{ title: 'Data Assessment', description: 'Evaluate your data quality, availability, and readiness for AI.' }, { title: 'Model Design', description: 'Select algorithms and design ML models for your use case.' }, { title: 'Training & Tuning', description: 'Train models on your data with hyperparameter optimization.' }, { title: 'Integration', description: 'Deploy AI models into your existing workflows and systems.' }, { title: 'Monitoring', description: 'Track model performance and retrain as data evolves.' }]} />
      <ServiceTechStack technologies={[{ icon: '🧠', name: 'TensorFlow' }, { icon: '🔥', name: 'PyTorch' }, { icon: '🤗', name: 'Hugging Face' }, { icon: '🐍', name: 'Python' }, { icon: '🤖', name: 'OpenAI' }, { icon: '☁️', name: 'AWS SageMaker' }, { icon: '🔵', name: 'Azure ML' }, { icon: '📊', name: 'MLflow' }, { icon: '🐼', name: 'Pandas' }, { icon: '📈', name: 'Scikit-learn' }, { icon: '🗃️', name: 'Vector DB' }, { icon: '⚡', name: 'LangChain' }]} />
      <ServiceWhyChoose reasons={[{ icon: Brain, title: 'AI Expertise', description: 'PhD-level data scientists and ML engineers on every project.' }, { icon: Database, title: 'Data-First', description: 'We start with your data to clean, transform, and optimize.' }, { icon: Cog, title: 'Production Ready', description: 'Models built for production scale, not just notebooks.' }, { icon: Shield, title: 'Ethical AI', description: 'Responsible AI with bias detection and explainability.' }, { icon: Zap, title: 'Fast Iteration', description: 'Rapid prototyping from idea to working model in weeks.' }, { icon: Users, title: 'Knowledge Transfer', description: 'We upskill your team to maintain and extend AI capabilities.' }]} />
      <ServiceTestimonials />
      <ServiceCTA title="Start Your AI Journey" description="Transform your business with intelligent AI solutions." />
    </div>
  );
}
