import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props 
}, ref) => {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'mobile-tap', // Custom class for mobile tap feedback
    {
      'w-full': fullWidth,
      'cursor-not-allowed': disabled || loading
    }
  )

  const variants = {
    primary: clsx(
      'bg-primary-600 hover:bg-primary-700 text-white',
      'focus:ring-primary-500',
      'active:bg-primary-800'
    ),
    secondary: clsx(
      'bg-secondary-600 hover:bg-secondary-700 text-white',
      'focus:ring-secondary-500',
      'active:bg-secondary-800'
    ),
    outline: clsx(
      'border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
      'focus:ring-primary-500 focus:border-primary-500',
      'active:bg-gray-100'
    ),
    ghost: clsx(
      'bg-transparent hover:bg-gray-100 text-gray-700',
      'focus:ring-primary-500',
      'active:bg-gray-200'
    ),
    danger: clsx(
      'bg-red-600 hover:bg-red-700 text-white',
      'focus:ring-red-500',
      'active:bg-red-800'
    ),
    success: clsx(
      'bg-green-600 hover:bg-green-700 text-white',
      'focus:ring-green-500',
      'active:bg-green-800'
    ),
    warning: clsx(
      'bg-yellow-500 hover:bg-yellow-600 text-white',
      'focus:ring-yellow-500',
      'active:bg-yellow-700'
    )
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-md',
    xl: 'px-8 py-4 text-lg rounded-lg'
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }

  const LoadingSpinner = () => (
    <svg
      className={clsx('animate-spin', iconSizes[size])}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner />
      )}
      
      {!loading && leftIcon && (
        <span className={clsx(iconSizes[size], 'mr-2')}>
          {leftIcon}
        </span>
      )}

      {!loading && children}

      {!loading && rightIcon && (
        <span className={clsx(iconSizes[size], 'ml-2')}>
          {rightIcon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

// Compound components for specific use cases
export const IconButton = forwardRef(({ icon, ...props }, ref) => (
  <Button
    ref={ref}
    className="!p-2"
    {...props}
  >
    {icon}
  </Button>
))

IconButton.displayName = 'IconButton'

export const LoadingButton = forwardRef(({ loading, children, ...props }, ref) => (
  <Button
    ref={ref}
    loading={loading}
    disabled={loading}
    {...props}
  >
    {children}
  </Button>
))

LoadingButton.displayName = 'LoadingButton'

export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => (
  <div
    className={clsx(
      'inline-flex',
      {
        'flex-row': orientation === 'horizontal',
        'flex-col': orientation === 'vertical'
      },
      '[&>button:not(:first-child)]:ml-px [&>button:not(:first-child)]:rounded-l-none',
      '[&>button:not(:last-child)]:rounded-r-none',
      orientation === 'vertical' && [
        '[&>button:not(:first-child)]:mt-px [&>button:not(:first-child)]:rounded-t-none',
        '[&>button:not(:last-child)]:rounded-b-none'
      ],
      className
    )}
  >
    {children}
  </div>
)

export default Button