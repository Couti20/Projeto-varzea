import { forwardRef } from 'react'
import clsx from 'clsx'

const Card = forwardRef(({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'default',
  border = true,
  rounded = 'default',
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white'

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  const roundeds = {
    none: '',
    sm: 'rounded-sm',
    default: 'rounded-lg',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  return (
    <div
      ref={ref}
      className={clsx(
        baseClasses,
        paddings[padding],
        shadows[shadow],
        roundeds[rounded],
        {
          'border border-gray-200': border,
          'card-hover': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card compound components
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('pb-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={clsx('text-lg font-medium text-gray-900', className)} {...props}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={clsx('mt-1 text-sm text-gray-600', className)} {...props}>
    {children}
  </p>
)

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('pt-4', className)} {...props}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('pt-4 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
)

// Specialized card variants
export const StatsCard = ({ 
  title, 
  value, 
  subtitle,
  icon,
  color = 'primary',
  trend,
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  }

  return (
    <Card className={clsx('text-center', className)} hover {...props}>
      {icon && (
        <div className={clsx('text-3xl mb-2', colors[color])}>
          {icon}
        </div>
      )}
      <div className={clsx('text-3xl font-bold mb-1', colors[color])}>
        {value}
      </div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
      {trend && (
        <div className={clsx(
          'text-xs mt-2',
          trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
        </div>
      )}
    </Card>
  )
}

export const ProfileCard = ({ 
  name, 
  role, 
  avatar, 
  actions,
  className = '',
  ...props 
}) => (
  <Card className={clsx('text-center', className)} {...props}>
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4">
        {avatar || '👤'}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-4">{role}</p>
      {actions && (
        <div className="flex space-x-2">
          {actions}
        </div>
      )}
    </div>
  </Card>
)

export const MatchCard = ({ 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore, 
  date, 
  status,
  onShareClick,
  className = '',
  ...props 
}) => (
  <Card className={clsx('p-4', className)} hover {...props}>
    <div className="flex items-center justify-between">
      <div className="flex-1 text-center">
        <div className="font-medium text-gray-900 mb-1">{homeTeam}</div>
      </div>
      
      <div className="px-4">
        <div className="text-center">
          <div className="text-xl font-bold mb-1">
            {status === 'finished' ? `${homeScore} x ${awayScore}` : 'x'}
          </div>
          <div className="text-xs text-gray-600">
            {status === 'finished' ? 'Final' : 
             status === 'live' ? '🔴 AO VIVO' :
             new Date(date).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
      
      <div className="flex-1 text-center">
        <div className="font-medium text-gray-900 mb-1">{awayTeam}</div>
      </div>
      
      {onShareClick && (
        <button
          onClick={onShareClick}
          className="ml-3 p-2 text-gray-400 hover:text-green-600 transition-colors"
          title="Compartilhar no WhatsApp"
        >
          📱
        </button>
      )}
    </div>
  </Card>
)

export const TeamCard = ({ 
  name, 
  logo, 
  bairro, 
  foundedYear,
  playersCount,
  onViewClick,
  className = '',
  ...props 
}) => (
  <Card className={className} hover {...props}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
        {logo || '🏟️'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-600">{bairro}</p>
        {foundedYear && (
          <p className="text-xs text-gray-500">Fundado em {foundedYear}</p>
        )}
      </div>
      <div className="text-right">
        {playersCount !== undefined && (
          <div className="text-sm text-gray-600 mb-2">
            {playersCount} atletas
          </div>
        )}
        {onViewClick && (
          <button
            onClick={onViewClick}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver detalhes
          </button>
        )}
      </div>
    </div>
  </Card>
)

export const AthleteCard = ({ 
  name, 
  position, 
  age,
  status,
  onRemoveClick,
  className = '',
  ...props 
}) => (
  <Card className={clsx('p-4', className)} {...props}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{position}</p>
        <p className="text-sm text-gray-600">{age} anos</p>
        <span className={clsx(
          'inline-block px-2 py-1 rounded-full text-xs font-medium mt-2',
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {status === 'active' ? 'Ativo' : 
           status === 'pending' ? 'Pendente' : 'Livre'}
        </span>
      </div>
      {onRemoveClick && (
        <button
          onClick={onRemoveClick}
          className="text-red-600 hover:text-red-700 p-2"
          title="Remover atleta"
        >
          ❌
        </button>
      )}
    </div>
  </Card>
)

export const EmptyStateCard = ({ 
  icon = '📭', 
  title, 
  description, 
  action,
  className = '',
  ...props 
}) => (
  <Card className={clsx('text-center py-12', className)} {...props}>
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-600 mb-6">{description}</p>
    )}
    {action}
  </Card>
)

export default Card