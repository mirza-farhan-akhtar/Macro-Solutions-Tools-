import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../../services/api';
import { MapPin, Clock, DollarSign, Briefcase, ArrowLeft, Upload, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO } from '../../utils/useSEO';

export default function CareerDetail() {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    phone: '',
    cover_letter: '',
    resume: null
  });

  useEffect(() => {
    fetchCareerDetail();
  }, [slug]);

  const fetchCareerDetail = async () => {
    try {
      const response = await publicAPI.careerDetail(slug);
      setCareer(response.data);
    } catch (error) {
      toast.error('Failed to load job details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('career_id', career.id);
      submitData.append('applicant_name', formData.applicant_name);
      submitData.append('applicant_email', formData.applicant_email);
      submitData.append('phone', formData.phone);
      submitData.append('cover_letter', formData.cover_letter);
      
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      await publicAPI.apply(submitData);
      setApplicationSubmitted(true);
      setShowApplicationForm(false);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      applicant_name: '',
      applicant_email: '', 
      phone: '',
      cover_letter: '',
      resume: null
    });
    setShowApplicationForm(false);
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-yellow-100 text-yellow-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useSEO({
    title: career ? `${career.title} | Careers at MACRO Solutions` : 'Job Opening | MACRO Solutions Tools Ltd',
    description: career ? `Join MACRO Solutions as ${career.title}. ${career.department ? career.department + ' role' : 'Exciting opportunity'} with a global team delivering world-class software.` : 'Explore career opportunities at MACRO Solutions Tools Ltd.',
    keywords: career ? `${career.title} job, software engineering careers, MACRO Solutions hiring, ${career.department || 'tech'} jobs` : 'software jobs, IT careers, MACRO Solutions',
    canonical: career ? `/careers/${career.slug}` : '/careers',
  });

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="skeleton-glass h-12 w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-8">
                <div className="space-y-4">
                  <div className="skeleton-glass h-8 w-3/4"></div>
                  <div className="skeleton-glass h-4 w-1/2"></div>
                  <div className="skeleton-glass h-32 w-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="skeleton-glass h-12 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="glass-card p-12">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job posting you're looking for doesn't exist or may have been closed.</p>
            <Link to="/careers" className="glass-button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="gradient-blob" style={{ top: '20%', left: '20%' }}></div>
      <div className="gradient-blob" style={{ top: '60%', right: '20%' }}></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/careers" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                    {career.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    {career.department && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{career.department}</span>
                      </div>
                    )}
                    
                    {career.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{career.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getJobTypeColor(career.type)}`}>
                        {career.type?.charAt(0).toUpperCase() + career.type?.slice(1) || 'Full-time'}
                      </span>
                    </div>
                    
                    {career.salary_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{career.salary_range}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {career.deadline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Application Deadline:</strong> {new Date(career.deadline).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-600">Job Description</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: career.description }}
              />
            </motion.div>

            {/* Requirements */}
            {career.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-600">Requirements</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: career.requirements }}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6"
            >
              {applicationSubmitted ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                  <p className="text-green-600">Thank you for your interest. We'll review your application and get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4">Interested in this role?</h3>
                  <p className="text-gray-600 mb-6">Apply now and join our amazing team!</p>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Apply for this Job
                  </button>
                </>
              )}
            </motion.div>

            {/* Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-4">Job Information</h3>
              <div className="space-y-3">
                {career.experience_level && (
                  <div>
                    <span className="font-medium text-gray-700">Experience Level:</span>
                    <span className="ml-2 text-gray-600 capitalize">{career.experience_level}</span>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">Posted:</span>
                  <span className="ml-2 text-gray-600">{new Date(career.created_at).toLocaleDateString()}</span>
                </div>
                
                {career.applications && (
                  <div>
                    <span className="font-medium text-gray-700">Applications:</span>
                    <span className="ml-2 text-gray-600">{career.applications.length || 0}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Apply for {career.title}</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="applicant_name"
                    value={formData.applicant_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 glass-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="applicant_email"
                    value={formData.applicant_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 glass-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Resume/CV *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cover Letter</label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2 glass-input"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
