// src/components/ui/AdvancedComponents.jsx
import React, { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

// Dropdown Avançado com Pesquisa
export const AdvancedSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Selecione...",
  searchable = true,
  multiple = false,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value?.includes(option.value)
        ? value.filter(v => v !== option.value)
        : [...(value || []), option.value]
      onChange(newValue)
    } else {
      onChange(option.value)
      setIsOpen(false)
    }
  }

  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0])
        return option ? option.label : placeholder
      }
      return `${value.length} selecionados`
    } else {
      const option = options.find(opt => opt.value === value)
      return option ? option.label : placeholder
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-left ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 focus:ring-2 focus:ring-blue-500'
        } ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {getDisplayValue()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = multiple 
                  ? value?.includes(option.value)
                  : value === option.value

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Alert Avançado
export const AdvancedAlert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose,
  actions,
  className = ""
}) => {
  const getAlertStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        }
    }
  }

  const styles = getAlertStyles(type)

  return (
    <div className={`border rounded-lg p-4 ${styles.bg} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="flex-1 ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.textColor}`}>
            {children}
          </div>
          {actions && (
            <div className="mt-3 flex space-x-2">
              {actions}
            </div>
          )}
        </div>
        {onClose && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${styles.textColor} hover:bg-opacity-20 hover:bg-gray-600 focus:outline-none`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading Skeleton
export const LoadingSkeleton = ({ 
  lines = 3, 
  height = "h-4", 
  className = "",
  animated = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${height} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          } ${animated ? 'animate-pulse' : ''}`}
        />
      ))}
    </div>
  )
}

// Stats Card Avançado
export const AdvancedStatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  subtitle,
  trend,
  className = ""
}) => {
  const getTrendIcon = () => {
    if (!change) return null
    
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          {getTrendIcon()}
          <span className={`text-sm font-medium ml-1 ${getChangeColor()}`}>
            {change}
          </span>
          {trend && (
            <span className="text-sm text-gray-500 ml-2">
              vs período anterior
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Progress Bar Avançado
export const AdvancedProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  striped = false,
  animated = false,
  className = ""
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'red':
        return 'bg-red-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'purple':
        return 'bg-purple-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'h-2'
      case 'lg':
        return 'h-4'
      default:
        return 'h-3'
    }
  }

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses(size)}`}>
        <div
          className={`${getSizeClasses(size)} rounded-full transition-all duration-500 ease-out ${
            getColorClasses(color)
          } ${striped ? 'bg-stripes' : ''} ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Time Picker
export const TimePicker = ({ 
  value, 
  onChange, 
  disabled = false,
  className = ""
}) => {
  const [hour, setHour] = useState(value?.split(':')[0] || '08')
  const [minute, setMinute] = useState(value?.split(':')[1] || '00')

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHour(h)
      setMinute(m)
    }
  }, [value])

  useEffect(() => {
    onChange(`${hour}:${minute}`)
  }, [hour, minute, onChange])

  const hours = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, '0')
  )
  
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, '0')
  )

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="w-4 h-4 text-gray-400" />
      <select
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        disabled={disabled}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
      >
        {hours.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="text-gray-500">:</span>
      <select
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        disabled={disabled}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
      >
        {minutes.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  )
}

// Date Range Picker
export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Calendar className="w-4 h-4 text-gray-400" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        disabled={disabled}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-500">até</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        disabled={disabled}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

// Loading Button
export const LoadingButton = ({
  loading = false,
  children,
  loadingText = "Carregando...",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center space-x-2 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  )
}

// Filter Bar
export const FilterBar = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className = ""
}) => {
  const activeCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className={`bg-white p-4 border border-gray-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
          {activeCount > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Limpar todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            {filter.type === 'select' && (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}