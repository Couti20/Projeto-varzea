import { useState, createContext, useContext } from 'react'
import clsx from 'clsx'

const TabsContext = createContext()

const Tabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className = '',
  orientation = 'horizontal'
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  
  const setValue = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ currentValue, setValue, orientation }}>
      <div className={clsx('tabs', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className = '' }) => {
  const { orientation } = useContext(TabsContext)
  
  return (
    <div
      className={clsx(
        'flex',
        orientation === 'horizontal' 
          ? 'border-b border-gray-200 space-x-8 overflow-x-auto' 
          : 'flex-col border-r border-gray-200 space-y-1',
        className
      )}
      role="tablist"
      aria-orientation={orientation}
    >
      {children}
    </div>
  )
}

const TabsTrigger = ({ 
  value, 
  children, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { currentValue, setValue, orientation } = useContext(TabsContext)
  const isActive = currentValue === value
  
  const baseClasses = clsx(
    'inline-flex items-center justify-center whitespace-nowrap font-medium text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled
    }
  )

  const horizontalClasses = clsx(
    'py-2 px-1 border-b-2 min-w-0 flex-shrink-0',
    isActive 
      ? 'border-primary-500 text-primary-600' 
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  )

  const verticalClasses = clsx(
    'px-3 py-2 rounded-md text-left w-full',
    isActive 
      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
  )

  return (
    <button
      className={clsx(
        baseClasses,
        orientation === 'horizontal' ? horizontalClasses : verticalClasses,
        className
      )}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => !disabled && setValue(value)}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, children, className = '' }) => {
  const { currentValue } = useContext(TabsContext)
  
  if (currentValue !== value) {
    return null
  }

  return (
    <div
      className={clsx('mt-4', className)}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      {children}
    </div>
  )
}

// Simple tabs component for backward compatibility
export const SimpleTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'text-sm py-2 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  }

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'whitespace-nowrap border-b-2 font-medium min-w-0 flex-shrink-0 transition-colors',
                sizes[size],
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Card tabs variant
export const CardTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '' 
}) => (
  <div className={clsx('flex rounded-lg bg-gray-100 p-1', className)}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={clsx(
          'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
          activeTab === tab.id
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        {tab.icon && <span className="mr-2">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
)

// Pill tabs variant
export const PillTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '' 
}) => (
  <div className={clsx('flex space-x-2', className)}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={clsx(
          'px-4 py-2 text-sm font-medium rounded-full transition-colors',
          activeTab === tab.id
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        {tab.icon && <span className="mr-2">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
)

// Export compound components
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export { TabsList, TabsTrigger, TabsContent }
export default Tabs