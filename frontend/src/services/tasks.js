import api from './api'

export const taskService = {
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams()
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        if (Array.isArray(filters[key])) {
          filters[key].forEach(item => params.append(key, item))
        } else {
          params.append(key, filters[key])
        }
      }
    })

    const response = await api.get(`/tasks?${params}`)
    return response.data
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/tasks/stats/overview')
    return response.data
  }
}