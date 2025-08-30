import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Navigation from './Navigation'
import clsx from 'clsx'

const Layout = ({ children, className = '' }) => {
  const { user } = useAuth()

  return (
    <div className={clsx('min-h-screen bg-gray-50 flex flex-col', className)}>
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className={clsx(
        'flex-1',
        user && 'pb-20 lg:pb-8' // Add bottom padding for mobile navigation
      )}>
        {children}
      </main>
      
      {/* Mobile Navigation */}
      {user && <Navigation />}
    </div>
  )
}

// Layout variants for specific pages
export const AuthLayout = ({ children, className = '' }) => (
  <div className={clsx('min-h-screen bg-gray-50', className)}>
    <Header />
    <main className="flex-1">
      {children}
    </main>
  </div>
)

export const FullscreenLayout = ({ children, className = '' }) => (
  <div className={clsx('min-h-screen', className)}>
    {children}
  </div>
)

export const CenteredLayout = ({ 
  children, 
  maxWidth = 'max-w-md',
  className = '' 
}) => (
  <div className={clsx('min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4', className)}>
    <div className={clsx('w-full', maxWidth)}>
      {children}
    </div>
  </div>
)

export const DashboardLayout = ({ 
  children, 
  title,
  subtitle,
  actions,
  className = '' 
}) => {
  const { user } = useAuth()

  return (
    <div className={clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      {children}
    </div>
  )
}

export const CardLayout = ({ 
  children, 
  title,
  description,
  maxWidth = 'max-w-2xl',
  className = '' 
}) => (
  <div className={clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
    <div className={clsx('mx-auto', maxWidth)}>
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  </div>
)

// Responsive container
export const Container = ({ 
  children, 
  size = 'default',
  className = '' 
}) => {
  const sizes = {
    sm: 'max-w-2xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-xl',
    full: 'max-w-full'
  }

  return (
    <div className={clsx('mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </div>
  )
}

// Page wrapper for consistent spacing
export const Page = ({ 
  children, 
  className = '',
  padding = true 
}) => (
  <div className={clsx(
    padding && 'py-8',
    className
  )}>
    {children}
  </div>
)

// Section component for organizing content
export const Section = ({ 
  children, 
  title,
  description,
  className = '' 
}) => (
  <section className={clsx('mb-12', className)}>
    {(title || description) && (
      <div className="mb-6">
        {title && (
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        )}
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
    )}
    {children}
  </section>
)

export default Layout