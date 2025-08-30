import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Re-export the useAuth hook from context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Additional auth-related hooks and utilities
export const useAuthStatus = () => {
  const { user, loading } = useAuth()
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    isAthlete: user?.type === 'athlete',
    isClub: user?.type === 'club',
    isOrganization: user?.type === 'organization',
    userType: user?.type,
    userId: user?.id,
    userName: user?.name
  }
}

export const useRequireAuth = (requiredType = null) => {
  const { user, loading } = useAuth()
  
  const hasAccess = () => {
    if (loading) return { hasAccess: false, loading: true }
    if (!user) return { hasAccess: false, loading: false, reason: 'not_authenticated' }
    if (requiredType && user.type !== requiredType) {
      return { hasAccess: false, loading: false, reason: 'wrong_user_type' }
    }
    return { hasAccess: true, loading: false }
  }
  
  return hasAccess()
}

export const usePermissions = () => {
  const { user } = useAuth()
  
  const can = (action, resource) => {
    if (!user) return false
    
    // Define permissions based on user type
    const permissions = {
      athlete: {
        view: ['profile', 'invites', 'championships', 'matches'],
        edit: ['profile'],
        create: [],
        delete: []
      },
      club: {
        view: ['profile', 'team', 'championships', 'matches', 'invites'],
        edit: ['profile', 'team'],
        create: ['invites'],
        delete: ['team_members', 'invites']
      },
      organization: {
        view: ['profile', 'championships', 'matches', 'teams'],
        edit: ['profile', 'championships', 'matches'],
        create: ['championships', 'matches'],
        delete: ['championships', 'matches']
      }
    }
    
    const userPermissions = permissions[user.type] || { view: [], edit: [], create: [], delete: [] }
    return userPermissions[action]?.includes(resource) || false
  }
  
  const canViewResource = (resource) => can('view', resource)
  const canEditResource = (resource) => can('edit', resource)
  const canCreateResource = (resource) => can('create', resource)
  const canDeleteResource = (resource) => can('delete', resource)
  
  return {
    can,
    canView: canViewResource,
    canEdit: canEditResource,
    canCreate: canCreateResource,
    canDelete: canDeleteResource
  }
}

export default useAuth