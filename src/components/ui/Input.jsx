import { forwardRef, useState } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ 
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  size = 'md',
  variant = 'default',
  className = '',
  disabled = false,
  required = false,
  type = 'text',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`

  const baseInputClasses = clsx(
    'block w-full border rounded-md shadow-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    'placeholder-gray-400',
    {
      'pl-10': leftIcon || leftAddon,
      'pr-10': rightIcon || rightAddon || type === 'password',
    }
  )

  const variants = {
    default: clsx(
      'border-gray-300',
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
    ),
    filled: clsx(
      'border-transparent bg-gray-100',
      'focus:bg-white focus:border-primary-500',
      error ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-red-500' : '',
    ),
    underlined: clsx(
      'border-0 border-b-2 border-gray-300 rounded-none shadow-none bg-transparent',
      'focus:ring-0 focus:border-primary-500',
      error ? 'border-red-300 focus:border-red-500' : '',
    )
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const EyeIcon = ({ show }) => (
    <svg
      className={clsx(iconSizes[size], 'text-gray-400')}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {show ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
        />
      )}
    </svg>
  )

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left addon */}
        {leftAddon && (
          <div className="absolute inset-y-0 left-0 flex items-center">
            <span className="px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-sm">
              {leftAddon}
            </span>
          </div>
        )}

        {/* Left icon */}
        {leftIcon && !leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={clsx(iconSizes[size], 'text-gray-400')}>
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={clsx(
            baseInputClasses,
            variants[variant],
            sizes[size]
          )}
          disabled={disabled}
          required={required}
          {...props}
        />

        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            <EyeIcon show={showPassword} />
          </button>
        )}

        {/* Right icon */}
        {rightIcon && type !== 'password' && !rightAddon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={clsx(iconSizes[size], 'text-gray-400')}>
              {rightIcon}
            </span>
          </div>
        )}

        {/* Right addon */}
        {rightAddon && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <span className="px-3 text-gray-500 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-sm">
              {rightAddon}
            </span>
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-600">{hint}</p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Specialized input components
export const TextArea = forwardRef(({ 
  label,
  error,
  hint,
  className = '',
  rows = 3,
  resize = true,
  ...props 
}, ref) => {
  const inputId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(
          'block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          'placeholder-gray-400',
          !resize && 'resize-none',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      />

      {hint && !error && (
        <p className="mt-1 text-sm text-gray-600">{hint}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export const Select = forwardRef(({ 
  label,
  error,
  hint,
  options = [],
  placeholder,
  className = '',
  ...props 
}, ref) => {
  const inputId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>

      {hint && !error && (
        <p className="mt-1 text-sm text-gray-600">{hint}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export const Checkbox = forwardRef(({ 
  label,
  description,
  error,
  className = '',
  ...props 
}, ref) => {
  const inputId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={clsx(
              'w-4 h-4 text-primary-600 bg-white border border-gray-300 rounded',
              'focus:ring-2 focus:ring-primary-500',
              'disabled:bg-gray-50 disabled:border-gray-300',
              error && 'border-red-300 focus:ring-red-500'
            )}
            {...props}
          />
        </div>
        <div className="ml-3">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export const Radio = forwardRef(({ 
  label,
  description,
  error,
  className = '',
  ...props 
}, ref) => {
  const inputId = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className={clsx(
              'w-4 h-4 text-primary-600 bg-white border border-gray-300',
              'focus:ring-2 focus:ring-primary-500',
              'disabled:bg-gray-50 disabled:border-gray-300',
              error && 'border-red-300 focus:ring-red-500'
            )}
            {...props}
          />
        </div>
        <div className="ml-3">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Radio.displayName = 'Radio'

export default Input