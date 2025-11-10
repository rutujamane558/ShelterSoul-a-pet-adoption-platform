import React, { createContext, useContext, useState, useEffect } from 'react'

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

  // Use environment variable or fallback to mock data for demo
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [mockMode, setMockMode] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
    
    // Check if backend is available
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (!response.ok) {
        setMockMode(true)
        console.log('Backend not available, using mock data')
      }
    } catch (error) {
      setMockMode(true)
      console.log('Backend not available, using mock data')
    }
  }

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      setMockMode(true)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    if (mockMode) {
      // Mock login for demo
      if (email === 'admin@sheltersoul.com' && password === 'admin123') {
        const mockUser = {
          id: '1',
          fullName: 'Admin User',
          email: 'admin@sheltersoul.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
        setUser(mockUser)
        localStorage.setItem('token', 'mock-admin-token')
        return { success: true }
      } else if (email === 'user@example.com' && password === 'user123') {
        const mockUser = {
          id: '2',
          fullName: 'John Doe',
          email: 'user@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        setUser(mockUser)
        localStorage.setItem('token', 'mock-user-token')
        return { success: true }
      }
      return { success: false, message: 'Invalid credentials' }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const register = async (userData) => {
    if (mockMode) {
      // Mock registration for demo
      const mockUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      }
      setUser(mockUser)
      localStorage.setItem('token', 'mock-token-' + mockUser.id)
      return { success: true }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    API_BASE_URL,
    mockMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}