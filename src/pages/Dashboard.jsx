import { useAuth } from '../context/AuthContext'
import AthleteDashboard from './Athlete/AthleteDashboard'
import ClubDashboard from './Club/ClubDashboard'
import OrganizationDashboard from './Organization/OrganizationDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user type
  switch (user.type) {
    case 'athlete':
      return <AthleteDashboard />
    case 'club':
      return <ClubDashboard />
    case 'organization':
      return <OrganizationDashboard />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tipo de usuário não reconhecido
            </h2>
            <p className="text-gray-600 mb-6">
              Não foi possível identificar o tipo da sua conta.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Recarregar
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/login'
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fazer Login Novamente
              </button>
            </div>
          </div>
        </div>
      )
  }
}

export default Dashboard


