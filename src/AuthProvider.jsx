import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

const API_BASE_URL = 'http://51.77.221.168/api'

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

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // le backend ne regarde pas l'email, juste username/password env
          username: 'arthur',
          password
        })
      })

      if (!res.ok) {
        return false
      }

      const data = await res.json()
      if (!data.token) {
        return false
      }

      const userData = {
        email,
        name: 'Arthur',
        id: 1
      }

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(userData))

      setToken(data.token)
      setUser(userData)
      setIsAuthenticated(true)
      return true
    } catch (e) {
      console.error('Erreur login:', e)
      return false
    }
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