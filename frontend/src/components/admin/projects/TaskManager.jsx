import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Calendar,
  Users,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const TaskManager = ({ projectId, initialTasks = [], onTasksChange }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [view, setView] = useState('list'); // list, board, timeline
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setTasks(initialTasks);
    setFilteredTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, priorityFilter, assigneeFilter, tasks]);

  const applyFilters = () => {
    let filtered = tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesAssignee = !assigneeFilter || task.assigned_to === parseInt(assigneeFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
    
    setFilteredTasks(filtered);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await projectAPI.updateTask(taskId, { status: newStatus });
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
      setOpenDropdown(null);
      toast.success('Task status updated!');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await projectAPI.deleteTask(taskId);
      
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'To Do': 'bg-gray-100 text-gray-700 border border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
      'In Review': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Completed': 'bg-green-100 text-green-700 border border-green-200',
      'Blocked': 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-gray-500 bg-gray-50',
      'Medium': 'text-blue-600 bg-blue-50',
      'High': 'text-orange-600 bg-orange-50',
      'Critical': 'text-red-600 bg-red-50',
    };
    return colors[priority] || 'text-gray-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'In Progress':
        return <Circle size={16} className="text-blue-600" />;
      case 'Blocked':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Circle size={16} className="text-gray-400" />;
    }
  };

  const tasksByStatus = {
    'To Do': filteredTasks.filter(t => t.status === 'To Do'),
    'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
    'In Review': filteredTasks.filter(t => t.status === 'In Review'),
    'Completed': filteredTasks.filter(t => t.status === 'Completed'),
    'Blocked': filteredTasks.filter(t => t.status === 'Blocked'),
  };

  const uniqueAssignees = [...new Set(tasks.map(t => t.assigned_user).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Tasks ({filteredTasks.length})</h3>
          
          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                view === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Board
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <Link
            to={`/admin/projects/${projectId}/tasks/create`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Task
          </Link>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                >
                  <option value="">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                >
                  <option value="">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                >
                  <option value="">All Assignees</option>
                  {uniqueAssignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Views */}
      {view === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <Target size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No tasks found</h3>
              <p className="text-slate-500 mb-4">Create your first task to get started</p>
              <Link
                to={`/admin/projects/${projectId}/tasks/create`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={16} />
                Add Task
              </Link>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        {task.priority && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {task.assigned_user && (
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {task.assigned_user.name}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        {task.estimated_hours && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {task.estimated_hours}h est.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === task.id ? null : task.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {openDropdown === task.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10"
                        >
                          <div className="p-1">
                            <Link
                              to={`/admin/tasks/${task.id}/edit?projectId=${projectId}`}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition"
                            >
                              <Edit3 size={16} />
                              Edit Task
                            </Link>
                            
                            <div className="border-t border-slate-100 my-1"></div>
                            
                            <div className="px-3 py-1">
                              <p className="text-xs font-medium text-slate-500 mb-2">Change Status</p>
                              {['To Do', 'In Progress', 'In Review', 'Completed', 'Blocked'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusUpdate(task.id, status)}
                                  className={`block w-full text-left px-2 py-1 text-sm rounded transition ${
                                    task.status === status ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                            
                            <div className="border-t border-slate-100 my-1"></div>
                            
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 size={16} />
                              Delete Task
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {view === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-700">{status}</h4>
                <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded-full text-xs">
                  {statusTasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {statusTasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <h5 className="font-medium text-slate-900 mb-2 text-sm">{task.title}</h5>
                    
                    {task.priority && (
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded mb-2 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      {task.assigned_user && (
                        <span className="flex items-center gap-1">
                          <Users size={10} />
                          {task.assigned_user.name.split(' ')[0]}
                        </span>
                      )}
                      {task.due_date && (
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;