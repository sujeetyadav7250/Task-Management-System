import React from 'react'

const TaskStats = ({ stats }) => {
  if (!stats) return null

  const { statusCounts, totalTasks } = stats

  const statCards = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: '📊',
      color: 'bg-blue-500'
    },
    {
      label: 'Pending',
      value: statusCounts.pending || 0,
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    {
      label: 'In Progress',
      value: statusCounts['in-progress'] || 0,
      icon: '🔄',
      color: 'bg-cyan-500'
    },
    {
      label: 'Completed',
      value: statusCounts.completed || 0,
      icon: '✅',
      color: 'bg-green-500'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'in-progress': return 'bg-cyan-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'in-progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
              {card.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Bars */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                <span className="text-sm font-medium text-gray-700 min-w-24">
                  {getStatusText(status)}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStatusColor(status)} transition-all duration-500`}
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 min-w-8 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskStats