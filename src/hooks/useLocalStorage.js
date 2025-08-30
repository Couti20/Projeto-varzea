import { useState, useEffect } from 'react'
import { storage } from '../services/storage'

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return storage.get(key, initialValue)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to local storage
      storage.set(key, valueToStore)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Remove value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      storage.remove(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

// Hook for storing with expiry
export const useLocalStorageWithExpiry = (key, initialValue, ttl = 5 * 60 * 1000) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return storage.getWithExpiry(key, initialValue)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}" with expiry:`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      storage.setWithExpiry(key, valueToStore, ttl)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}" with expiry:`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      storage.remove(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

// Hook for user preferences
export const usePreference = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return storage.getPreference(key, initialValue)
  })

  const updatePreference = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue
    setValue(valueToStore)
    storage.setPreference(key, valueToStore)
  }

  return [value, updatePreference]
}

// Hook for app settings
export const useAppSetting = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return storage.getSetting(key, initialValue)
  })

  const updateSetting = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue
    setValue(valueToStore)
    storage.setSetting(key, valueToStore)
  }

  return [value, updateSetting]
}

// Hook for form data persistence
export const usePersistedForm = (key, initialData = {}) => {
  const [formData, setFormData, removeFormData] = useLocalStorage(`form_${key}`, initialData)

  const updateFormData = (updates) => {
    setFormData(current => ({ ...current, ...updates }))
  }

  const resetFormData = () => {
    setFormData(initialData)
  }

  const clearFormData = () => {
    removeFormData()
  }

  return {
    formData,
    updateFormData,
    resetFormData,
    clearFormData,
    setFormData
  }
}

// Hook for recently viewed items
export const useRecentItems = (key, maxItems = 10) => {
  const [items, setItems] = useLocalStorage(`recent_${key}`, [])

  const addItem = (item) => {
    setItems(current => {
      // Remove existing item if present
      const filtered = current.filter(i => i.id !== item.id)
      // Add to beginning and limit to maxItems
      return [item, ...filtered].slice(0, maxItems)
    })
  }

  const removeItem = (itemId) => {
    setItems(current => current.filter(i => i.id !== itemId))
  }

  const clearItems = () => {
    setItems([])
  }

  return {
    items,
    addItem,
    removeItem,
    clearItems
  }
}

// Hook for theme preferences
export const useTheme = () => {
  const [theme, setTheme] = usePreference('theme', 'light')

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light')
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }
}

// Hook for cache management
export const useCache = (key, defaultValue = null) => {
  const [cached, setCached] = useState(() => {
    return storage.getCache(key, defaultValue)
  })

  const setCache = (value, ttl) => {
    setCached(value)
    storage.setCache(key, value, ttl)
  }

  const clearCache = () => {
    setCached(defaultValue)
    storage.removeCache(key)
  }

  return [cached, setCache, clearCache]
}

export default useLocalStorage