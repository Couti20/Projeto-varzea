import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const Navigation = ({ className = '' }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const getNavItems = () => {
    const baseItems = [
      { 
        path: '/dashboard', 
        label: 'Home', 
        icon: '🏠',
        activeIcon: '🏠' 
      }
    ]

    const typeSpecificItems = {
      athlete: [
        { 
          path: '/athlete/profile', 
          label: 'Perfil', 
          icon: '👤',
          activeIcon: '👤' 
        },
        { 
          path: '/athlete/invites', 
          label: 'Convites', 
          icon: '📩',
          activeIcon: '📬',
          badge: 0 // TODO: Get actual invite count
        },
        { 
          path: '/championships', 
          label: 'Campeonatos', 
          icon: '🏆',
          activeIcon: '🏆' 
        }
      ],
      club: [
        { 
          path: '/club/team', 
          label: 'Elenco', 
          icon: '👥',
          activeIcon: '👥' 
        },
        { 
          path: '/championships', 
          label: 'Campeonatos', 
          icon: '🏆',
          activeIcon: '🏆' 
        }
      ],
      organization: [
        { 
          path: '/organization/championships', 
          label: 'Campeonatos', 
          icon: '🏆',
          activeIcon: '🏆' 
        }
      ]
    }

    return [...baseItems, ...(typeSpecificItems[user.type] || [])]
  }

  const navItems = getNavItems()

  return (
    <nav className={clsx(
      'lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom',
      'px-2 py-1 z-40',
      className
    )}>
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200',
                'min-w-0 flex-1 max-w-20',
                'mobile-tap',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              )}
            >
              <div className="relative mb-1">
                <span className={clsx(
                  'text-lg transition-transform duration-200',
                  isActive && 'scale-110'
                )}>
                  {isActive ? item.activeIcon : item.icon}
                </span>
                
                {/* Badge for notifications */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              
              <span className={clsx(
                'text-truncate leading-tight',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Sidebar for desktop (future implementation)
export const Sidebar = ({ className = '' }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  // This would be used for desktop sidebar navigation
  // Currently hidden as we're using top navigation
  return null
}

export default Navigation