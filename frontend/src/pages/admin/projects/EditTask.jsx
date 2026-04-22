import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Users,
  Target,
  FileText,
  AlertTriangle,
  Plus,
  X,
  Clock,
  Trash2
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const EditTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assigned_to: '',
    parent_task_id: '',
    due_date: '',
    estimated_hours: '',
    dependencies: [],
    metadata: {}
  });

  useEffect(() => {
    loadData();
  }, [taskId, projectId]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      
      // First get the task details
      const taskRes = await projectAPI.getTask(taskId);
      const task = taskRes.data.data;
      
      // Then load project, users, and other tasks
      const [projectRes, usersRes, tasksRes] = await Promise.all([
        projectAPI.getProject(projectId),
        projectAPI.getUsers(),
        projectAPI.getProjectTasks(projectId)
      ]);
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        assigned_to: task.assigned_to || '',
        parent_task_id: task.parent_task_id || '',
        due_date: task.due_date || '',
        estimated_hours: task.estimated_hours || '',
        dependencies: task.dependencies?.map(d => d.id) || [],
        metadata: task.metadata || {}
      });
      
      setProject(projectRes.data.data);
      setUsers(usersRes.data?.data || []);
      setTasks(tasksRes.data?.data?.data?.filter(t => t.id !== parseInt(taskId)) || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load task data');
      navigate(`/admin/projects/${projectId}`);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      await projectAPI.updateTask(taskId, formData);
      toast.success('Task updated successfully!');
      navigate(`/admin/projects/${projectId}`);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg));
        });
      } else {
        toast.error('Failed to update task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      await projectAPI.deleteTask(taskId);
      toast.success('Task deleted successfully!');
      navigate(`/admin/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleDependencyToggle = (taskIdToToggle) => {
    const isSelected = formData.dependencies.includes(taskIdToToggle);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        dependencies: prev.dependencies.filter(id => id !== taskIdToToggle)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, taskIdToToggle]
      }));
    }
  };

  // Filter available users based on project members
  const availableUsers = users.filter(user => 
    project?.members?.some(member => member.user_id === user.id)
  );

  // Filter available tasks for dependencies (exclude current task and completed tasks)
  const availableTasks = tasks.filter(task => 
    task.status !== 'Completed' && task.id !== parseInt(taskId)
  );

  const getStatusColor = (status) => {
    const colors = {
      'To Do': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'In Review': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Blocked': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-gray-500',
      'Medium': 'text-blue-500',
      'High': 'text-orange-500',
      'Critical': 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Task</h1>
              <p className="text-slate-600 mt-1">
                Update task in <span className="font-medium">{project?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            Delete Task
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Task Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Describe the task requirements and objectives"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">Assignment & Timeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned To
                </label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">Select team member</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.department?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Task Relationships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Task Relationships</h2>
            </div>

            {/* Parent Task */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Parent Task (Optional)
              </label>
              <select
                value={formData.parent_task_id}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_task_id: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="">None - This is a main task</option>
                {availableTasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 mt-1">
                Select a parent task to make this a sub-task
              </p>
            </div>

            {/* Dependencies */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dependencies (Optional)
              </label>
              <p className="text-sm text-slate-500 mb-3">
                Select tasks that must be completed before this task can start
              </p>

              {availableTasks.length > 0 ? (
                <div className="space-y-2">
                  {availableTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleDependencyToggle(task.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.dependencies.includes(task.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            {task.assigned_user && (
                              <span className="text-xs text-slate-500">
                                Assigned to: {task.assigned_user.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.dependencies.includes(task.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {formData.dependencies.includes(task.id) && (
                            <div className="w-2 h-2 rounded bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No other tasks available for dependencies</p>
                </div>
              )}

              {/* Selected Dependencies Summary */}
              {formData.dependencies.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Selected Dependencies ({formData.dependencies.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.dependencies.map(taskId => {
                      const task = availableTasks.find(t => t.id === taskId);
                      return (
                        <span
                          key={taskId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                        >
                          {task?.title}
                          <button
                            type="button"
                            onClick={() => handleDependencyToggle(taskId)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button
              type="button"
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Task
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;