import React, { useState, useEffect } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import TaskFilters from './TaskFilters'
import TaskStats from './TaskStats'
import { taskService } from '../../services/tasks'
import Loading from '../common/Loading'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    tags: [],
    search: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getTasks(filters)
      
      if (response.success) {
        setTasks(response.data.tasks)
        setPagination(response.data.pagination)
      } else {
        setError('Failed to fetch tasks')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await taskService.getStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData)
      if (response.success) {
        setShowTaskForm(false)
        fetchTasks()
        fetchStats()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creating task' 
      }
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData)
      if (response.success) {
        setEditingTask(null)
        fetchTasks()
        fetchStats()
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating task' 
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await taskService.deleteTask(taskId)
        if (response.success) {
          fetchTasks()
          fetchStats()
        } else {
          setError('Failed to delete task')
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting task')
      }
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 })
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const closeTaskForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  if (loading && tasks.length === 0) {
    return <Loading message="Loading your tasks..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your tasks efficiently</p>
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowTaskForm(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button 
              className="text-red-700 hover:text-red-900"
              onClick={() => setError('')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Statistics */}
        <TaskStats stats={stats} />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TaskFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <TaskList
              tasks={tasks}
              loading={loading}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={closeTaskForm}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard