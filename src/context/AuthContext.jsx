import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { authService } from '../services/auth'
import { storage } from '../services/storage'
import { STORAGE_KEYS } from '../utils/constants'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = storage.get(STORAGE_KEYS.USER)
        const token = storage.get(STORAGE_KEYS.TOKEN)
        
        if (savedUser && token) {
          setUser(savedUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear corrupted data
        storage.remove(STORAGE_KEYS.USER)
        storage.remove(STORAGE_KEYS.TOKEN)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await authService.login({ email, password })
      const { user: userData, token } = response.data
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.USER, userData)
      storage.set(STORAGE_KEYS.TOKEN, token)
      
      setUser(userData)
      toast.success(`Bem-vindo, ${userData.name}!`)
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro no login'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await authService.register(userData)
      const { user: newUser, token } = response.data
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.USER, newUser)
      storage.set(STORAGE_KEYS.TOKEN, token)
      
      setUser(newUser)
      toast.success(`Cadastro realizado com sucesso! Bem-vindo, ${newUser.name}!`)
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro no cadastro'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.TOKEN)
    toast.success('Logout realizado com sucesso!')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    storage.set(STORAGE_KEYS.USER, updatedUser)
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAthlete: user?.type === 'athlete',
    isClub: user?.type === 'club',
    isOrganization: user?.type === 'organization'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}