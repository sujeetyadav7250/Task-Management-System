import React from 'react'
import TaskItem from './TaskItem'
import Pagination from '../common/Pagination'
import Loading from '../common/Loading'

const TaskList = ({ 
  tasks, 
  loading, 
  onEditTask, 
  onDeleteTask, 
  onUpdateTask,
  pagination,
  onPageChange 
}) => {
  if (loading && tasks.length === 0) {
    return <Loading message="Loading tasks..." />
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
          <span className="text-sm text-gray-600 mt-1 sm:mt-0">
            {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''} total
          </span>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="p-6 space-y-4">
        {tasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default TaskList