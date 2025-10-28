import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    if (email === 'arthur@example.com' && password === 'password123') {
      const newToken = 'token_' + Math.random().toString(36).substr(2, 9)
      const userData = {
        email,
        name: 'Arthur',
        id: 1
      }

      localStorage.setItem('authToken', newToken)
      localStorage.setItem('authUser', JSON.stringify(userData))

      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider