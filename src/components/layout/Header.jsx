import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui'
import clsx from 'clsx'

const Header = ({ className = '' }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'athlete': return '⚽'
      case 'club': return '🏟️'
      case 'organization': return '🏆'
      default: return '👤'
    }
  }

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'athlete': return 'Atleta'
      case 'club': return 'Clube'
      case 'organization': return 'Organização'
      default: return 'Usuário'
    }
  }

  if (!user) {
    return (
      <header className={clsx('bg-white shadow-sm border-b', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">⚽</span>
              <span className="text-xl font-bold text-primary-600">
                Futebol de Várzea
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={clsx('bg-white shadow-sm border-b safe-area-top', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <span className="text-xl font-bold text-primary-600 hidden sm:block">
              Futebol de Várzea
            </span>
            <span className="text-lg font-bold text-primary-600 sm:hidden">
              Várzea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            
            {user.type === 'athlete' && (
              <>
                <Link 
                  to="/athlete/profile" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Perfil
                </Link>
                <Link 
                  to="/athlete/invites" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Convites
                </Link>
              </>
            )}
            
            {user.type === 'club' && (
              <Link 
                to="/club/team" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Elenco
              </Link>
            )}
            
            {user.type === 'organization' && (
              <Link 
                to="/organization/championships" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Campeonatos
              </Link>
            )}
            
            <Link 
              to="/championships" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Competições
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {user.name}
                </div>
                <div className="text-xs text-gray-600 flex items-center">
                  <span className="mr-1">{getUserTypeIcon(user.type)}</span>
                  {getUserTypeLabel(user.type)}
                </div>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">
                {getUserTypeIcon(user.type)}
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="sm:hidden">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                {getUserTypeIcon(user.type)}
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <span className="hidden sm:inline">Sair</span>
              <span className="sm:hidden">🚪</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header