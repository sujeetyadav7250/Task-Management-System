import React, { useState } from 'react'
import { format } from 'date-fns'

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [updating, setUpdating] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'in-progress': return 'bg-cyan-100 text-cyan-800 border-cyan-300'
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true)
      await onUpdate(task._id, { status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handlePriorityChange = async (newPriority) => {
    try {
      setUpdating(true)
      await onUpdate(task._id, { priority: newPriority })
    } catch (error) {
      console.error('Error updating priority:', error)
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  return (
    <div className={`bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      task.status === 'completed' ? 'opacity-75 bg-gray-50' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
            task.status === 'completed' ? 'line-through text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags and Due Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1">
          {task.tags && task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm flex items-center gap-1 ${
            isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
            {isOverdue && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2">
                Overdue
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Priority Selector */}
      <div className="pt-3 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority:</label>
        <div className="flex gap-2">
          {['low', 'medium', 'high'].map(priority => (
            <button
              key={priority}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-md border transition-colors duration-200 ${
                task.priority === priority
                  ? getPriorityColor(priority)
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handlePriorityChange(priority)}
              disabled={updating}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskItem