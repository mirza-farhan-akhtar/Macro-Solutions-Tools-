import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI, getImageUrl } from '../../services/api';
import { ArrowLeft, ArrowRight, Check, Star, Target, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO } from '../../utils/useSEO';
import { useLeadForm } from '../../context/LeadFormContext';

function Orb({ size, x, y, delay, gradient, opacity = 0.3 }) {
  return (
    <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: gradient, opacity }}
      animate={{ x: [0, 25, -15, 0], y: [0, -20, 18, 0], scale: [1, 1.07, 0.96, 1] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { openLeadForm } = useLeadForm();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchService();
  }, [slug]);

  const fetchService = async () => {
    try {
      const response = await publicAPI.serviceDetail(slug);
      setService(response.data || response);
    } catch (error) {
      console.error('Failed to fetch service:', error);
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error('Failed to load service details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Extended service data for complete detail pages - fallback if no backend data
  const getServiceDetails = (service) => {
    // If service has custom details from backend, use them
    if (service?.features || service?.benefits || service?.process_steps || service?.technologies) {
      return {
        features: service.features || [],
        benefits: service.benefits || [],
        process: service.process_steps || [],
        technologies: service.technologies || []
      };
    }

    // Fallback defaults for services without detailed data
    const baseDetails = {
      features: [
        'Professional consultation and planning',
        'Modern technology stack implementation',
        'Quality assurance and testing',
        'Ongoing support and maintenance',
        'Documentation and training'
      ],
      benefits: [
        'Increased efficiency and productivity',
        'Reduced operational costs',
        'Enhanced security and reliability',  
        'Scalable and future-ready solutions',
        'Competitive market advantage'
      ],
      process: [
        { title: 'Discovery & Planning', description: 'Understanding your requirements and creating a comprehensive project plan' },
        { title: 'Design & Architecture', description: 'Designing the optimal solution architecture and user interfaces' },
        { title: 'Development & Testing', description: 'Building and rigorously testing your solution' },
        { title: 'Deployment & Support', description: 'Launching your solution and providing ongoing support' }
      ],
      technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB']
    };

    // Service-specific customizations only if no backend data
    switch(slug) {
      case 'web-development':
        return {
          ...baseDetails,
          features: [
            'Custom web application development',
            'Responsive design implementation',
            'Modern frontend frameworks (React, Vue, Angular)',
            'Robust backend APIs and databases',
            'SEO optimization and performance tuning',
            'Progressive Web App (PWA) development'
          ],
          technologies: ['React', 'Vue.js', 'Node.js', 'Laravel', 'PostgreSQL', 'AWS']
        };
      case 'mobile-app-development':
        return {
          ...baseDetails,
          features: [
            'Native iOS and Android development',
            'Cross-platform React Native & Flutter apps',
            'App Store optimization and deployment',
            'Push notifications and real-time features',
            'Offline functionality and data sync',
            'Comprehensive app testing and QA'
          ],
          technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'TestFlight']
        };
      case 'cloud-solutions':
        return {
          ...baseDetails,
          features: [
            'Cloud migration and infrastructure setup',
            'Auto-scaling and load balancing',
            'Serverless architecture implementation',
            'Cloud security and compliance',
            'Cost optimization and monitoring',
            'Disaster recovery and backup solutions'
          ],
          technologies: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform']
        };
      case 'devops-cicd':
        return {
          ...baseDetails,
          features: [
            'CI/CD pipeline setup and automation',
            'Infrastructure as Code (IaC)',
            'Container orchestration with Kubernetes',
            'Monitoring and alerting systems',
            'Security scanning and compliance',
            'Performance optimization and scaling'
          ],
          technologies: ['Jenkins', 'GitLab CI', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus']
        };
      case 'ui-ux-design':
        return {
          ...baseDetails,
          features: [
            'User research and persona development',
            'Wireframing and prototyping',
            'Visual design and branding',
            'Usability testing and optimization',
            'Accessibility compliance (WCAG)',
            'Design system creation'
          ],
          technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'Zeplin']
        };
      case 'data-analytics':
        return {
          ...baseDetails,
          features: [
            'Data collection and ETL pipelines',
            'Advanced analytics and machine learning',
            'Interactive dashboards and visualization',
            'Real-time data processing',
            'Predictive analytics and insights',
            'Data governance and security'
          ],
          technologies: ['Python', 'R', 'TensorFlow', 'Tableau', 'Power BI', 'Apache Spark']
        };
      default:
        return baseDetails;
    }
  };

  useSEO({
    title: service ? `${service.title} | MACRO Solutions` : 'Service | MACRO Solutions Tools Ltd',
    description: service?.excerpt || service?.short_description || 'Professional software development and technology services from MACRO Solutions — delivered on time, built to scale.',
    keywords: service ? `${service.title}, software development UK, MACRO Solutions services` : 'software services, custom development, MACRO Solutions',
    canonical: service ? `/services/${service.slug}` : '/services',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  if (notFound) return <Navigate to="/services" replace />;

  const hasImage = !!service?.image;
  const serviceDetails = service ? getServiceDetails(service) : {};

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className={`relative py-28 overflow-hidden ${hasImage ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60'}`}>
        {/* Background image with Ken Burns effect */}
        {hasImage && (
          <>
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(service.image)})` }}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/70 to-slate-900/30" />
          </>
        )}
        {/* Light-mode decorations (no image) */}
        {!hasImage && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
            <Orb size="500px" x="-5%" y="-10%" delay={0} gradient="radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)" />
            <Orb size="350px" x="65%" y="30%" delay={3} gradient="radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%)" opacity={0.22} />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </>
        )}

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to="/services" className={`inline-flex items-center gap-2 transition-colors text-sm ${hasImage ? 'text-white/50 hover:text-white/80' : 'text-slate-400 hover:text-slate-700'}`}>
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${hasImage ? 'bg-white/10 border-white/20 text-white' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
              <Sparkles className="w-4 h-4" /><span>Our Services</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 ${hasImage ? 'text-white' : 'text-slate-900'}`}>
              {service?.title}
            </h1>
            <p className={`text-lg max-w-3xl leading-relaxed ${hasImage ? 'text-white/70' : 'text-slate-500'}`}>{service?.excerpt}</p>
          </motion.div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${hasImage ? 'from-slate-900' : 'from-white'} to-transparent`} />
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {service?.content && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="prose prose-lg prose-slate max-w-none mb-16 text-slate-700"
              dangerouslySetInnerHTML={{ __html: service.content }} />
          )}

          {/* Features */}
          {serviceDetails.features?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 text-center">
                What&apos;s <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Included</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceDetails.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Benefits */}
          {serviceDetails.benefits?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 text-center">
                Key <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Benefits</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceDetails.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* PROCESS — dark bg */}
      {serviceDetails.process?.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
          <div className="relative max-w-5xl mx-auto px-6 sm:px-8">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-black text-white text-center mb-12">
              Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Process</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {serviceDetails.process.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TECHNOLOGIES + CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {serviceDetails.technologies?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-8">
                Technologies <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">We Use</span>
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {serviceDetails.technologies.map((tech, i) => (
                  <span key={i} className="px-5 py-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl font-medium text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-center text-white">
              <Target className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="text-white/70 mb-6 text-sm">Let&apos;s discuss how {service?.title} can transform your business.</p>
              <button onClick={() => openLeadForm({ service: service?.title })} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
              <Globe className="w-10 h-10 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Explore More Services</h3>
              <p className="text-slate-500 mb-6 text-sm">Discover our comprehensive range of technology solutions.</p>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-indigo-200 hover:text-indigo-700 transition-all">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
