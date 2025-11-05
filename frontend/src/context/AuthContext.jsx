import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'
import { toastService } from '../services/toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    const token = authService.getToken()

    if (storedUser && token) {
      setUser(storedUser)
      
      authService.getCurrentUser()
        .then(response => {
          if (response.success) {
            setUser(response.data.user)
            toastService.success('Welcome back!')
          } else {
            authService.logout()
            setUser(null)
          }
        })
        .catch(() => {
          authService.logout()
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      setError('')
      setLoading(true)
      const toastId = toastService.loading('Signing in...')
      
      const response = await authService.login({ email, password })
      
      if (response.success) {
        setUser(response.data.user)
        toastService.update(toastId, {
          render: 'Login successful!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        return { success: true }
      } else {
        toastService.update(toastId, {
          render: response.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toastService.error(message)
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setError('')
      setLoading(true)
      const toastId = toastService.loading('Creating account...')
      
      const response = await authService.register({ name, email, password })
      
      if (response.success) {
        setUser(response.data.user)
        toastService.update(toastId, {
          render: 'Account created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        return { success: true }
      } else {
        toastService.update(toastId, {
          render: response.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toastService.error(message)
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError('')
    toastService.info('Logged out successfully')
  }

  const clearError = () => {
    setError('')
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}