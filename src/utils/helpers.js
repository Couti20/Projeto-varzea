// Date utilities
export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  const formats = {
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    long: {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  }
  
  return dateObj.toLocaleDateString('pt-BR', formats[format])
}

export const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const isToday = (date) => {
  const today = new Date()
  const compareDate = new Date(date)
  
  return today.toDateString() === compareDate.toDateString()
}

export const isThisWeek = (date) => {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
  const compareDate = new Date(date)
  
  return compareDate >= weekStart && compareDate <= weekEnd
}

// String utilities
export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatName = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Number utilities
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '-'
  return Number(num).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 100)
}

// Football specific utilities
export const calculateGoalDifference = (goalsFor, goalsAgainst) => {
  return (goalsFor || 0) - (goalsAgainst || 0)
}

export const formatGoalDifference = (difference) => {
  if (difference > 0) return `+${difference}`
  return difference.toString()
}

export const getMatchResult = (homeScore, awayScore) => {
  if (homeScore === null || awayScore === null) return null
  
  if (homeScore > awayScore) return 'home_win'
  if (homeScore < awayScore) return 'away_win'
  return 'draw'
}

export const formatScore = (homeScore, awayScore) => {
  const home = homeScore !== null ? homeScore : '-'
  const away = awayScore !== null ? awayScore : '-'
  return `${home} x ${away}`
}

// Array utilities
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[key]
    let bVal = b[key]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const unique = (array, key) => {
  if (key) {
    return array.filter((item, index, self) => 
      index === self.findIndex(t => t[key] === item[key])
    )
  }
  return [...new Set(array)]
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidBrazilianPhone = (phone) => {
  const phoneRegex = /^\(?([0-9]{2})\)?[-.\s]?([0-9]{4,5})[-.\s]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

// ID generation
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}${timestamp}${random}`
}

// Object utilities
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

// Local storage helpers
export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export const safeJSONStringify = (obj, fallback = '{}') => {
  try {
    return JSON.stringify(obj)
  } catch {
    return fallback
  }
}

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  return searchParams.toString()
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}