import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import toast from 'react-hot-toast';

export function DepartmentBudget() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      let dept = null;
      
      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        if (deptPayload && typeof deptPayload === 'object' && deptPayload.name) {
          dept = {
            id: deptPayload.id || slug,
            name: deptPayload.name,
            description: deptPayload.description || ''
          };
        }
      } catch (error) {
        console.warn('Department API failed:', error.message);
      }
      
      if (!dept) {
        dept = { id: slug, name: `Department ${slug}`, description: '' };
      }
      setDepartment(dept);

      // Fetch budget data from API
      try {
        const response = await departmentAPI.getDepartmentBudget(slug);
        const budget = response.data?.data || {};
        setBudgetData(budget);
      } catch (error) {
        console.warn('Budget API failed:', error.message);
        setBudgetData({});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartment({ id: slug, name: `Department ${slug}` });
      setBudgetData({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/60 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Budget</h1>
              <p className="text-gray-600 mt-1">Manage department budget allocation</p>
            </div>
          </div>
        </motion.div>

        {budgetData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Budget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Total Allocated</span>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${(budgetData.total_budget || 0).toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Amount Spent</span>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${(budgetData.total_spent || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">{budgetData.total_budget ? ((budgetData.total_spent / budgetData.total_budget) * 100).toFixed(1) : 0}% utilization</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Remaining</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${(budgetData.remaining_budget || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">{budgetData.total_budget ? ((budgetData.remaining_budget / budgetData.total_budget) * 100).toFixed(1) : 0}% available</p>
              </div>
            </div>

            {/* Budget Breakdown by Project */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Breakdown by Project</h2>
              {budgetData.projects && budgetData.projects.length > 0 ? (
                <div className="space-y-4">
                  {budgetData.projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{project.name}</span>
                          <p className="text-xs text-gray-500">{project.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">${Number(project.spent || 0).toLocaleString()} / ${Number(project.budget || 0).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{project.budget ? ((project.spent / project.budget) * 100).toFixed(1) : 0}% spent</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.budget ? Math.min((project.spent / project.budget) * 100, 100) : 0}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No projects with budget allocated to this department</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DepartmentBudget;
