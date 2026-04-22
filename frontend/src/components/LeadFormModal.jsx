import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Phone, Building2, Briefcase, DollarSign,
  Calendar, MessageSquare, Globe, Sparkles, CheckCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useLeadForm } from '../context/LeadFormContext';
import { publicAPI } from '../services/api';
import toast from 'react-hot-toast';

const SERVICES = [
  'Web Development','Mobile App Development','Custom Software Development',
  'UI/UX Design','Cloud Application Development','Cloud Migration & DevOps',
  'Cloud Maintenance','Cybersecurity','Quality Assurance & Testing',
  'DevOps & CI/CD','IT Consultation','AI & Machine Learning',
  'Data Analytics','Blockchain Development','E-commerce Solutions',
  'ERP / CRM Solutions','Other',
];
const BUDGETS = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-150k', label: '$50,000 - $150,000' },
  { value: '150k-500k', label: '$150,000 - $500,000' },
  { value: '500k+', label: '$500,000+' },
  { value: 'discuss', label: "Let's Discuss" },
];
const TIMELINES = ['ASAP (1-2 weeks)','1 Month','2-3 Months','3-6 Months','6-12 Months','12+ Months','Flexible'];
const INDUSTRIES = [
  'Technology & Software','Finance & Banking','Healthcare & Medical',
  'Retail & E-commerce','Education & E-learning','Government & Public Sector',
  'Manufacturing','Media & Entertainment','Travel & Hospitality',
  'Construction & Real Estate','Non-Profit / NGO','Startup','Other',
];
const SOURCES = ['Google / Search Engine','Social Media','Referral from a Friend','LinkedIn','Blog / Article','Online Ad','Conference / Event','Other'];

const inputClass = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all';
const labelClass = 'block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5';

function Field({ id, label, icon: Icon, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {Icon && <Icon className="inline w-3 h-3 mr-1 -mt-0.5" />}
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const EMPTY = { name:'',email:'',phone:'',company:'',service:'',budget_range:'',timeline:'',industry:'',source:'',message:'' };

export default function LeadFormModal() {
  const { open, closeLeadForm, prefill } = useLeadForm();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setForm({ ...EMPTY, ...prefill }); setDone(false); setErrors({}); }
  }, [open, prefill]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.message.trim()) e.message = 'Please describe your project';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await publicAPI.contact({
        name: form.name, email: form.email, phone: form.phone, company: form.company,
        subject: form.service || 'Project Enquiry', message: form.message,
        budget_range: form.budget_range, industry: form.industry,
        timeline: form.timeline, source: form.source || 'website',
      });
      setDone(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeLeadForm()}>
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={closeLeadForm} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative flex-shrink-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-8 py-7 overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />We respond within 2 hours
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">Start Your Project</h2>
                  <p className="text-white/65 text-sm mt-1">Tell us about your vision - we will build it.</p>
                </div>
                <button onClick={closeLeadForm} className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {done ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
                  <p className="text-slate-500 max-w-sm leading-relaxed mb-8">Thank you! Our team will review your project details and reach out within 2 business hours.</p>
                  <button onClick={closeLeadForm} className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Back to Site
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="p-8">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Your Information</p>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field id="name" label="Full Name" icon={User} required error={errors.name}>
                      <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="John Smith" className={inputClass} autoComplete="name" />
                    </Field>
                    <Field id="email" label="Email Address" icon={Mail} required error={errors.email}>
                      <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" className={inputClass} autoComplete="email" />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field id="phone" label="Phone Number" icon={Phone} required error={errors.phone}>
                      <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" className={inputClass} autoComplete="tel" />
                    </Field>
                    <Field id="company" label="Company / Organisation" icon={Building2}>
                      <input id="company" type="text" value={form.company} onChange={set('company')} placeholder="ACME Corp" className={inputClass} autoComplete="organization" />
                    </Field>
                  </div>
                  <hr className="border-slate-100 my-6" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Project Details</p>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field id="service" label="Service Interested In" icon={Briefcase}>
                      <select id="service" value={form.service} onChange={set('service')} className={inputClass}>
                        <option value="">Select a service</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field id="industry" label="Your Industry" icon={Globe}>
                      <select id="industry" value={form.industry} onChange={set('industry')} className={inputClass}>
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field id="budget" label="Estimated Budget" icon={DollarSign}>
                      <select id="budget" value={form.budget_range} onChange={set('budget_range')} className={inputClass}>
                        <option value="">Select budget range</option>
                        {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                      </select>
                    </Field>
                    <Field id="timeline" label="Desired Timeline" icon={Calendar}>
                      <select id="timeline" value={form.timeline} onChange={set('timeline')} className={inputClass}>
                        <option value="">Select timeline</option>
                        {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="mb-5">
                    <Field id="message" label="Project Description" icon={MessageSquare} required error={errors.message}>
                      <textarea id="message" value={form.message} onChange={set('message')} rows={4}
                        placeholder="Tell us about your project goals, requirements, and any specific features you need"
                        className={inputClass + ' resize-none'} />
                    </Field>
                  </div>
                  <div className="mb-8">
                    <Field id="source" label="How did you hear about us?">
                      <select id="source" value={form.source} onChange={set('source')} className={inputClass}>
                        <option value="">Select</option>
                        {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:pointer-events-none">
                    {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Sending</>) : (<><Sparkles className="w-4 h-4" /> Send My Project Request <ArrowRight className="w-4 h-4" /></>)}
                  </button>
                  <p className="text-center text-slate-400 text-xs mt-4">Your information is kept confidential and never shared.</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
