import { safeJSONParse, safeJSONStringify } from '../utils/helpers'

class StorageService {
  constructor() {
    this.isSupported = this.checkSupport()
  }

  // Check if localStorage is supported
  checkSupport() {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      console.warn('localStorage is not supported')
      return false
    }
  }

  // Get item from localStorage
  get(key, fallback = null) {
    if (!this.isSupported) {
      console.warn('localStorage not supported, returning fallback')
      return fallback
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return fallback
      
      return safeJSONParse(item, fallback)
    } catch (error) {
      console.error(`Error getting item from localStorage (${key}):`, error)
      return fallback
    }
  }

  // Set item in localStorage
  set(key, value) {
    if (!this.isSupported) {
      console.warn('localStorage not supported, cannot save data')
      return false
    }

    try {
      const serializedValue = safeJSONStringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error(`Error setting item in localStorage (${key}):`, error)
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, attempting to clear old data')
        this.clearExpired()
        
        // Try again after clearing
        try {
          const serializedValue = safeJSONStringify(value)
          localStorage.setItem(key, serializedValue)
          return true
        } catch {
          console.error('Still unable to save after clearing expired data')
        }
      }
      
      return false
    }
  }

  // Remove item from localStorage
  remove(key) {
    if (!this.isSupported) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing item from localStorage (${key}):`, error)
      return false
    }
  }

  // Clear all items from localStorage
  clear() {
    if (!this.isSupported) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Check if key exists
  has(key) {
    if (!this.isSupported) return false
    return localStorage.getItem(key) !== null
  }

  // Get all keys
  keys() {
    if (!this.isSupported) return []
    
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i))
    }
    return keys
  }

  // Get storage size in MB
  getSize() {
    if (!this.isSupported) return 0

    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    
    return (total / 1024 / 1024).toFixed(2) // Convert to MB
  }

  // Set item with expiration
  setWithExpiry(key, value, ttl) {
    const now = new Date()
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    }
    return this.set(key, item)
  }

  // Get item with expiration check
  getWithExpiry(key, fallback = null) {
    const item = this.get(key)
    
    if (!item) return fallback
    
    // Check if item has expiry
    if (!item.expiry) return item
    
    const now = new Date()
    
    if (now.getTime() > item.expiry) {
      this.remove(key)
      return fallback
    }
    
    return item.value
  }

  // Clear expired items
  clearExpired() {
    if (!this.isSupported) return

    const now = new Date()
    const keysToRemove = []

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const item = safeJSONParse(localStorage[key])
          if (item && item.expiry && now.getTime() > item.expiry) {
            keysToRemove.push(key)
          }
        } catch {
          // Skip non-JSON items
        }
      }
    }

    keysToRemove.forEach(key => this.remove(key))
    
    console.log(`Cleared ${keysToRemove.length} expired items`)
  }

  // App-specific methods
  
  // Cache management for React Query
  getCacheKey(key) {
    return `cache_${key}`
  }

  setCache(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default
    return this.setWithExpiry(this.getCacheKey(key), data, ttl)
  }

  getCache(key, fallback = null) {
    return this.getWithExpiry(this.getCacheKey(key), fallback)
  }

  removeCache(key) {
    return this.remove(this.getCacheKey(key))
  }

  // User preferences
  setPreference(key, value) {
    const preferences = this.get('user_preferences', {})
    preferences[key] = value
    return this.set('user_preferences', preferences)
  }

  getPreference(key, fallback = null) {
    const preferences = this.get('user_preferences', {})
    return preferences[key] !== undefined ? preferences[key] : fallback
  }

  // App settings
  setSetting(key, value) {
    const settings = this.get('app_settings', {})
    settings[key] = value
    return this.set('app_settings', settings)
  }

  getSetting(key, fallback = null) {
    const settings = this.get('app_settings', {})
    return settings[key] !== undefined ? settings[key] : fallback
  }

  // Backup and restore
  backup() {
    if (!this.isSupported) return null

    const backup = {}
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        backup[key] = localStorage[key]
      }
    }
    
    return {
      timestamp: new Date().toISOString(),
      data: backup
    }
  }

  restore(backup) {
    if (!this.isSupported || !backup || !backup.data) return false

    try {
      this.clear()
      
      for (let key in backup.data) {
        localStorage.setItem(key, backup.data[key])
      }
      
      console.log('Storage restored from backup:', backup.timestamp)
      return true
    } catch (error) {
      console.error('Error restoring from backup:', error)
      return false
    }
  }

  // Migration helper
  migrate(migrations) {
    const currentVersion = this.getSetting('storage_version', 0)
    
    migrations
      .filter(migration => migration.version > currentVersion)
      .sort((a, b) => a.version - b.version)
      .forEach(migration => {
        try {
          console.log(`Running storage migration ${migration.version}`)
          migration.up()
          this.setSetting('storage_version', migration.version)
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error)
        }
      })
  }
}

// Create singleton instance
export const storage = new StorageService()

// Export class for testing
export { StorageService }

// Export convenience methods
export default storage