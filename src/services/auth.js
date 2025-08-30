import { apiClient } from './api'
import { API_ENDPOINTS } from '../utils/constants'

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response
  },

  // Register user
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)
    return response
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Ignore logout errors - user will be logged out locally anyway
      console.warn('Logout request failed:', error)
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE)
    return response
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE, userData)
    return response
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await apiClient.post('/auth/change-password', passwords)
    return response
  },

  // Reset password request
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/reset-password', { email })
    return response
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password/confirm', {
      token,
      password: newPassword
    })
    return response
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiClient.post('/auth/verify-email', { token })
    return response
  },

  // Resend email verification
  resendEmailVerification: async () => {
    const response = await apiClient.post('/auth/resend-verification')
    return response
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    const response = await apiClient.post('/auth/check-email', { email })
    return response.data.exists
  },

  // Validate username availability
  checkUsernameAvailable: async (username) => {
    const response = await apiClient.post('/auth/check-username', { username })
    return response.data.available
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await apiClient.delete('/auth/account', {
      data: { password }
    })
    return response
  }
}

// Social auth services (for future implementation)
export const socialAuthService = {
  // Google OAuth
  loginWithGoogle: async (tokenId) => {
    const response = await apiClient.post('/auth/google', { tokenId })
    return response
  },

  // Facebook OAuth
  loginWithFacebook: async (accessToken) => {
    const response = await apiClient.post('/auth/facebook', { accessToken })
    return response
  },

  // Apple OAuth
  loginWithApple: async (identityToken) => {
    const response = await apiClient.post('/auth/apple', { identityToken })
    return response
  }
}

// Auth utilities
export const authUtils = {
  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true

    try {
      // Basic JWT structure check
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      return payload.exp < currentTime
    } catch {
      return true
    }
  },

  // Get token expiration time
  getTokenExpiry: (token) => {
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return new Date(payload.exp * 1000)
    } catch {
      return null
    }
  },

  // Get user role from token
  getUserRoleFromToken: (token) => {
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role || payload.type
    } catch {
      return null
    }
  },

  // Check if user has permission
  hasPermission: (user, permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  },

  // Check if user has role
  hasRole: (user, role) => {
    if (!user) return false
    return user.type === role || user.role === role
  },

  // Generate password strength score
  getPasswordStrength: (password) => {
    if (!password) return 0

    let score = 0
    
    // Length
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character types
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    return Math.min(score, 5)
  },

  // Password strength labels
  getPasswordStrengthLabel: (strength) => {
    const labels = {
      0: 'Muito fraca',
      1: 'Fraca',
      2: 'Regular',
      3: 'Boa',
      4: 'Forte',
      5: 'Muito forte'
    }
    return labels[strength] || 'Muito fraca'
  },

  // Validate password requirements
  validatePassword: (password, requirements = {}) => {
    const {
      minLength = 6,
      requireUppercase = false,
      requireLowercase = false,
      requireNumbers = false,
      requireSymbols = false
    } = requirements

    const errors = []

    if (password.length < minLength) {
      errors.push(`Deve ter pelo menos ${minLength} caracteres`)
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Deve conter pelo menos uma letra maiúscula')
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Deve conter pelo menos uma letra minúscula')
    }

    if (requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Deve conter pelo menos um número')
    }

    if (requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Deve conter pelo menos um símbolo')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default authService