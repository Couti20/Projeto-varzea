import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useClubDashboard } from '../../hooks/useClubs'
import { useActiveChampionships } from '../../hooks/useChampionships'
import { Card, StatsCard, Button, AthleteCard, EmptyStateCard } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { formatDate } from '../../utils/helpers'

const ClubDashboard = () => {
  const { user } = useAuth()
  const { 
    club, 
    athletes, 
    stats, 
    isLoading, 
    error 
  } = useClubDashboard(user.id)
  
  const { data: championships } = useActiveChampionships()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando painel do clube...</p>
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

  const activeAthletes = athletes?.filter(a => a.status === 'active') || []
  const pendingAthletes = athletes?.filter(a => a.status === 'pending') || []
  const clubChampionships = championships?.filter(c => c.teamIds?.includes(user.id)) || []

  return (
    <DashboardLayout
      title={`${club?.name || user.name} 🏟️`}
      subtitle={club?.bairro ? `${club.bairro} • Fundado em ${club.foundedYear || 'N/A'}` : 'Bem-vindo ao painel do seu clube'}
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Atletas"
          value={activeAthletes.length}
          subtitle={pendingAthletes.length > 0 ? `${pendingAthletes.length} pendentes` : 'No elenco'}
          icon="👥"
          color="primary"
        />

        <StatsCard
          title="Campeonatos"
          value={clubChampionships.length}
          subtitle="Participando"
          icon="🏆"
          color="secondary"
        />

        <StatsCard
          title="Vitórias"
          value={stats?.wins || 0}
          subtitle="Esta temporada"
          icon="🏅"
          color="success"
        />

        <StatsCard
          title="Gols"
          value={stats?.goalsFor || 0}
          subtitle="Marcados"
          icon="⚽"
          color="warning"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Club Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Elenco</h3>
              <div className="flex space-x-2">
                <Link to="/club/team">
                  <Button variant="outline" size="sm">
                    Gerenciar
                  </Button>
                </Link>
                <Button size="sm">
                  ➕ Convidar Atleta
                </Button>
              </div>
            </div>

            {activeAthletes.length > 0 ? (
              <div className="space-y-4">
                {/* Active Athletes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Atletas Ativos ({activeAthletes.length})
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeAthletes.slice(0, 4).map(athlete => (
                      <div key={athlete.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{athlete.name}</h5>
                            <p className="text-sm text-gray-600">
                              {athlete.position} • {athlete.age} anos
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              ✏️
                            </button>
                            <button className="text-red-400 hover:text-red-600 p-1">
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeAthletes.length > 4 && (
                    <div className="text-center mt-3">
                      <Link to="/club/team">
                        <Button variant="ghost" size="sm">
                          Ver todos os {activeAthletes.length} atletas
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Pending Athletes */}
                {pendingAthletes.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Convites Pendentes ({pendingAthletes.length})
                    </h4>
                    <div className="space-y-2">
                      {pendingAthletes.slice(0, 2).map(athlete => (
                        <div key={athlete.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{athlete.name}</h5>
                              <p className="text-sm text-gray-600">
                                {athlete.position} • Aguardando resposta
                              </p>
                            </div>
                            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                              Pendente
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyStateCard
                icon="👥"
                title="Nenhum atleta no elenco"
                description="Comece convidando atletas usando o ID único deles"
                action={
                  <Button>
                    Convidar Primeiro Atleta
                  </Button>
                }
              />
            )}
          </Card>

          {/* Championships */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Campeonatos
              </h3>
              <Link to="/championships">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>

            {clubChampionships.length > 0 ? (
              <div className="space-y-4">
                {clubChampionships.slice(0, 3).map(championship => (
                  <div key={championship.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {championship.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>Temporada {championship.season}</span>
                          <span>{championship.teamsCount} times</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            championship.status === 'active' ? 'bg-green-100 text-green-800' :
                            championship.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {championship.status === 'active' ? 'Em andamento' :
                             championship.status === 'draft' ? 'Rascunho' : 'Finalizado'}
                          </span>
                        </div>
                      </div>
                      <Link to={`/championships/${championship.id}`}>
                        <Button size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-2xl mb-2">🏆</p>
                <p>Não está participando de campeonatos</p>
                <p className="text-sm mt-1">
                  Procure por campeonatos abertos para inscrição
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <span className="mr-2">➕</span>
                Convidar Atleta
              </Button>
              
              <Link to="/club/team" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">👥</span>
                  Gerenciar Elenco
                </Button>
              </Link>
              
              <Link to="/championships" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🏆</span>
                  Buscar Campeonatos
                </Button>
              </Link>

              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">📊</span>
                Ver Estatísticas
              </Button>
            </div>
          </Card>

          {/* Club Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Estatísticas do Clube
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de Jogos:</span>
                <span className="font-medium">{stats?.totalMatches || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vitórias:</span>
                <span className="font-medium text-green-600">{stats?.wins || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Empates:</span>
                <span className="font-medium text-yellow-600">{stats?.draws || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Derrotas:</span>
                <span className="font-medium text-red-600">{stats?.losses || 0}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gols Marcados:</span>
                  <span className="font-medium">{stats?.goalsFor || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gols Sofridos:</span>
                  <span className="font-medium">{stats?.goalsAgainst || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Saldo:</span>
                  <span className={
                    (stats?.goalsFor || 0) - (stats?.goalsAgainst || 0) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }>
                    {(stats?.goalsFor || 0) - (stats?.goalsAgainst || 0) >= 0 ? '+' : ''}
                    {(stats?.goalsFor || 0) - (stats?.goalsAgainst || 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Atividade Recente
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-green-500">✅</span>
                <span>Pedro Santos aceitou o convite</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-blue-500">📩</span>
                <span>Convite enviado para João Silva</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-yellow-500">🏆</span>
                <span>Inscrito na Copa da Várzea 2025</span>
              </div>
            </div>
          </Card>

          {/* Help */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dicas para o Clube 💡
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>•</strong> Use IDs únicos para convidar atletas
              </p>
              <p>
                <strong>•</strong> Participe de campeonatos para ganhar experiência
              </p>
              <p>
                <strong>•</strong> Mantenha seu elenco sempre atualizado
              </p>
              <p>
                <strong>•</strong> Acompanhe as estatísticas para melhorar
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ClubDashboard