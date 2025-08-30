import axios from 'axios'
import { toast } from 'react-hot-toast'
import { storage } from './storage'
import { STORAGE_KEYS } from '../utils/constants'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`
      )
    }

    return response
  },
  (error) => {
    const { response, request, config } = error

    // Calculate request duration if available
    let duration = 'unknown'
    if (config?.metadata?.startTime) {
      duration = new Date() - config.metadata.startTime + 'ms'
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error: ${config?.method?.toUpperCase()} ${config?.url} (${duration})`,
        error
      )
    }

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          storage.remove(STORAGE_KEYS.USER)
          storage.remove(STORAGE_KEYS.TOKEN)
          
          if (window.location.pathname !== '/login') {
            toast.error('Sessão expirada. Faça login novamente.')
            window.location.href = '/login'
          }
          break

        case 403:
          toast.error('Acesso negado. Você não tem permissão para esta ação.')
          break

        case 404:
          toast.error('Recurso não encontrado.')
          break

        case 422:
          // Validation errors - handled by individual components
          break

        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.')
          break

        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.')
          break

        default:
          const message = data?.message || `Erro ${status}: ${response.statusText}`
          toast.error(message)
      }

      // Return structured error
      return Promise.reject({
        ...error,
        message: data?.message || error.message,
        status,
        data
      })
    } else if (request) {
      // Network error
      toast.error('Erro de conexão. Verifique sua internet.')
      return Promise.reject({
        ...error,
        message: 'Erro de rede',
        isNetworkError: true
      })
    } else {
      // Request setup error
      toast.error('Erro interno. Tente novamente.')
      return Promise.reject(error)
    }
  }
)

// API methods
export const apiClient = {
  // Generic methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // Upload file
  upload: (url, file, config = {}) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
      onUploadProgress: config.onProgress
    })
  },

  // Download file
  download: async (url, filename, config = {}) => {
    try {
      const response = await api.get(url, {
        ...config,
        responseType: 'blob',
        onDownloadProgress: config.onProgress
      })

      // Create download link
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return response
    } catch (error) {
      toast.error('Erro ao baixar arquivo')
      throw error
    }
  }
}

// Request helpers
export const createRequestConfig = (options = {}) => {
  const {
    timeout = 10000,
    cache = false,
    retry = 1,
    ...rest
  } = options

  return {
    timeout,
    ...rest,
    metadata: {
      cache,
      retry,
      retryCount: 0
    }
  }
}

// Retry mechanism
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      // Don't retry on 4xx errors (client errors)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }

      console.log(`Request failed, retrying... (${attempt}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
}

// Cache helpers for React Query
export const getCacheKey = (endpoint, params = {}) => {
  const paramString = new URLSearchParams(params).toString()
  return paramString ? `${endpoint}?${paramString}` : endpoint
}

// API status checker
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 })
    return response.status === 200
  } catch {
    return false
  }
}

// Export the configured axios instance
export default api