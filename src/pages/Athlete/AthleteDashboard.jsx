import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAthleteDashboard } from '../../hooks/useAthletes'
import { useActiveChampionships } from '../../hooks/useChampionships'
import { Card, StatsCard, Button, EmptyStateCard } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { formatDate } from '../../utils/helpers'

const AthleteDashboard = () => {
  const { user } = useAuth()
  const { 
    athlete, 
    invites, 
    stats, 
    isLoading, 
    error 
  } = useAthleteDashboard(user.id)
  
  const { data: championships } = useActiveChampionships()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600">Tente recarregar a página</p>
        </div>
      </div>
    )
  }

  const pendingInvites = invites?.filter(inv => inv.status === 'pending') || []
  const club = athlete?.club

  return (
    <DashboardLayout
      title={`Olá, ${user.name}! ⚽`}
      subtitle="Bem-vindo ao seu painel de atleta"
    >
      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Status"
          value={
            athlete?.status === 'active' ? 'Ativo' :
            athlete?.status === 'pending' ? 'Pendente' :
            'Livre'
          }
          icon={
            athlete?.status === 'active' ? '✅' :
            athlete?.status === 'pending' ? '⏳' :
            '🆓'
          }
          color={
            athlete?.status === 'active' ? 'success' :
            athlete?.status === 'pending' ? 'warning' :
            'secondary'
          }
        />

        <StatsCard
          title="Convites"
          value={pendingInvites.length}
          icon="📩"
          color="primary"
        />

        <StatsCard
          title="Gols"
          value={stats?.totalGoals || 0}
          icon="⚽"
          color="success"
        />

        <StatsCard
          title="Jogos"
          value={stats?.totalMatches || 0}
          icon="🏃‍♂️"
          color="secondary"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Athlete Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Meu Perfil</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                  ⚽
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{athlete?.name}</h4>
                  <p className="text-gray-600">{athlete?.position} • {athlete?.age} anos</p>
                </div>
                <Link to="/athlete/profile">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      athlete?.status === 'active' ? 'bg-green-100 text-green-800' :
                      athlete?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {athlete?.status === 'active' ? 'Ativo' :
                       athlete?.status === 'pending' ? 'Pendente' : 'Livre'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Único:</span>
                    <span className="ml-2 font-mono text-xs">{user.id}</span>
                  </div>
                </div>
              </div>

              {club && (
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Meu Clube</h5>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{club.name}</p>
                      <p className="text-sm text-gray-600">{club.bairro}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sair do Clube
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Invites */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Convites Pendentes
              </h3>
              <Link to="/athlete/invites">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>

            {pendingInvites.length > 0 ? (
              <div className="space-y-3">
                {pendingInvites.slice(0, 2).map(invite => (
                  <div key={invite.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{invite.club?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {invite.club?.bairro} • {formatDate(invite.createdAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">Aceitar</Button>
                        <Button variant="outline" size="sm">Recusar</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingInvites.length > 2 && (
                  <div className="text-center pt-2">
                    <Link to="/athlete/invites">
                      <Button variant="ghost" size="sm">
                        Ver mais {pendingInvites.length - 2} convites
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-2xl mb-2">📭</p>
                <p>Nenhum convite pendente</p>
                <p className="text-sm mt-1">
                  Compartilhe seu ID único com clubes para receber convites
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Championships and Activity */}
        <div className="space-y-6">
          {/* Active Championships */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Campeonatos em Andamento
              </h3>
              <Link to="/championships">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>

            {championships && championships.length > 0 ? (
              <div className="space-y-4">
                {championships.slice(0, 3).map(championship => (
                  <div key={championship.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {championship.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Temporada {championship.season} • {championship.teamsCount} times
                        </p>
                      </div>
                      <Link to={`/championships/${championship.id}`}>
                        <Button size="sm">Ver</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-2xl mb-2">🏆</p>
                <p>Nenhum campeonato ativo</p>
                <p className="text-sm mt-1">
                  Entre em um clube para participar de campeonatos
                </p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            
            <div className="space-y-3">
              <Link to="/athlete/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">👤</span>
                  Editar Perfil
                </Button>
              </Link>
              
              <Link to="/athlete/invites" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📩</span>
                  Gerenciar Convites
                  {pendingInvites.length > 0 && (
                    <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                      {pendingInvites.length}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link to="/championships" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🏆</span>
                  Ver Campeonatos
                </Button>
              </Link>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.id)
                  // In a real app, show toast
                  alert('ID copiado para a área de transferência!')
                }}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📋</span>
                  Copiar Meu ID
                </Button>
              </button>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Como funciona? 🤔
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>1.</strong> Compartilhe seu ID único com clubes
              </p>
              <p>
                <strong>2.</strong> Receba e aceite convites de clubes
              </p>
              <p>
                <strong>3.</strong> Participe de campeonatos com seu clube
              </p>
              <p>
                <strong>4.</strong> Acompanhe suas estatísticas e desempenho
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AthleteDashboard