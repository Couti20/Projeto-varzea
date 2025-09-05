// src/pages/Athlete/AthleteMultiClubDashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAthleteMultiClubDashboard, useMultiClubOperations } from '../../hooks/useMultipleClubs'
import { useActiveChampionships } from '../../hooks/useChampionships'
import { Card, StatsCard, Button, EmptyStateCard } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { formatDate } from '../../utils/helpers'
import { 
  BarChart3, 
  Trophy, 
  Users, 
  Calendar,
  Copy,
  CheckCircle,
  Clock,
  Target,
  Plus,
  LogOut,
  Eye
} from 'lucide-react'

const AthleteMultiClubDashboard = () => {
  const { user } = useAuth()
  const { 
    athlete, 
    clubs, 
    invites, 
    stats, 
    isLoading, 
    error 
  } = useAthleteMultiClubDashboard(user.id)
  
  const operations = useMultiClubOperations(user.id)
  const { data: championships } = useActiveChampionships()

  // Função para copiar ID do atleta
  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id)
    alert('ID copiado para a área de transferência!')
  }

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
  const activeClubs = clubs?.filter(club => club.membershipStatus === 'active') || []
  const pendingClubs = clubs?.filter(club => club.membershipStatus === 'pending') || []

  return (
    <DashboardLayout
      title={`Olá, ${user.name}! ⚽`}
      subtitle="Bem-vindo ao seu painel de atleta"
    >
      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Clubes Ativos"
          value={activeClubs.length}
          icon="🏟️"
          color="success"
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar - Perfil e Informações */}
        <div className="lg:col-span-1 space-y-6">
          {/* Perfil */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Meu Perfil</h3>
              <Link to="/athlete/profile">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                  ⚽
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{athlete?.name || user.name}</h4>
                  <p className="text-gray-600">
                    {athlete?.position || 'Posição não definida'} • {athlete?.age || 'N/A'} anos
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Clubes Ativos:</span>
                    <span className="font-medium text-green-600">{activeClubs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pendentes:</span>
                    <span className="font-medium text-yellow-600">{pendingClubs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Convites:</span>
                    <span className="font-medium text-blue-600">{pendingInvites.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ID do Atleta */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Meu ID Único 🆔
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Compartilhe este ID com clubes para receber convites
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-white border rounded-md text-sm font-mono">
                {user.id}
              </code>
              <Button onClick={handleCopyId} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </Button>
            </div>
          </Card>

          {/* Navegação Rápida */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Navegação Rápida
            </h3>
            <div className="space-y-2">
              <Link to="/athletes" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Outros Atletas
                </Button>
              </Link>
              <Link to="/clubs" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Explorar Clubes
                </Button>
              </Link>
              <Link to="/championships" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Ver Campeonatos
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meus Clubes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Meus Clubes ({clubs.length})
              </h3>
              <Link to="/athlete/invites">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ver Convites
                </Button>
              </Link>
            </div>
            
            {clubs.length > 0 ? (
              <div className="space-y-4">
                {clubs.map((club) => (
                  <ClubCard 
                    key={club.id} 
                    club={club} 
                    onLeave={operations.leaveClub}
                    isLeaving={operations.isLeaving}
                  />
                ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={<Users className="w-8 h-8" />}
                title="Nenhum clube"
                description="Você ainda não faz parte de nenhum clube."
                action={
                  <Link to="/athlete/invites">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ver Convites
                    </Button>
                  </Link>
                }
              />
            )}
          </Card>

          {/* Convites Pendentes */}
          {pendingInvites.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-500" />
                  Convites Pendentes
                </h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {pendingInvites.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {pendingInvites.slice(0, 3).map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{invite.clubName}</p>
                      <p className="text-sm text-gray-600">
                        Convite recebido em {formatDate(invite.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => operations.acceptInvite(invite.id)}
                        loading={operations.isAccepting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => operations.rejectInvite(invite.id)}
                        loading={operations.isRejecting}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingInvites.length > 3 && (
                <div className="mt-4 text-center">
                  <Link to="/athlete/invites">
                    <Button variant="ghost" size="sm">
                      Ver todos os convites
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )}

          {/* Estatísticas Detalhadas */}
          {stats && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Minhas Estatísticas
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalGoals || 0}
                  </div>
                  <div className="text-sm text-gray-600">Gols</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalMatches || 0}
                  </div>
                  <div className="text-sm text-gray-600">Jogos</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.totalAssists || 0}
                  </div>
                  <div className="text-sm text-gray-600">Assistências</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.averageRating || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">Média</div>
                </div>
              </div>

              {/* Estatísticas por clube */}
              {clubs.length > 1 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Performance por Clube
                  </h4>
                  <div className="space-y-3">
                    {clubs.map((club) => (
                      <div key={club.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{club.name}</p>
                          <p className="text-sm text-gray-600">
                            {club.stats?.goals || 0} gols em {club.stats?.matches || 0} jogos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {club.stats?.matches > 0 ? 
                              ((club.stats.goals / club.stats.matches).toFixed(2)) + ' gols/jogo' : 
                              'Sem jogos'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Campeonatos Ativos */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Campeonatos Ativos
            </h3>
            
            {activeClubs.length > 0 ? (
              <div className="space-y-3">
                {championships?.slice(0, 5).map((championship) => (
                  <Link key={championship.id} to={`/championships/${championship.id}`}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{championship.name}</p>
                        <p className="text-sm text-gray-600">
                          {championship.format} • {championship.teams?.length || 0} times
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        championship.status === 'active' ? 'bg-green-100 text-green-800' :
                        championship.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {championship.status === 'active' ? 'Em Andamento' :
                         championship.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                      </span>
                    </div>
                  </Link>
                ))}
                
                <div className="mt-4 text-center">
                  <Link to="/championships">
                    <Button variant="outline" size="sm">
                      Ver Todos os Campeonatos
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyStateCard
                icon={<Trophy className="w-8 h-8" />}
                title="Sem campeonatos ativos"
                description="Junte-se a um clube para participar de campeonatos."
                action={
                  <Link to="/championships">
                    <Button size="sm" variant="outline">
                      Explorar Campeonatos
                    </Button>
                  </Link>
                }
              />
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Componente ClubCard para múltiplos clubes
const ClubCard = ({ club, onLeave, isLeaving }) => {
  const [showLeaveModal, setShowLeaveModal] = React.useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">🏟️</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{club.name}</h4>
            <p className="text-sm text-gray-600">{club.bairro}</p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>{club.stats?.matches || 0} jogos</span>
              <span>{club.stats?.goals || 0} gols</span>
              <span className={`px-2 py-1 rounded-full font-medium ${
                club.membershipStatus === 'active' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {club.membershipStatus === 'active' ? 'Ativo' : 'Pendente'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to={`/clubs/${club.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
          </Link>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
            title="Sair do clube"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de confirmação omitido por brevidade - igual ao anterior */}
    </>
  )
}

export default AthleteMultiClubDashboard

// src/App.jsx - ROTAS ATUALIZADAS
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ChampionshipsProvider } from './context/ChampionshipsContext'

// Layout components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Club pages
import ClubTeam from './pages/Club/ClubTeam'
import ClubDashboard from './pages/Club/ClubDashboard'

// Athlete pages
import AthleteProfile from './pages/Athlete/AthleteProfile'
import AthleteInvites from './pages/Athlete/AthleteInvites'
import AthleteMultiClubDashboard from './pages/Athlete/AthleteMultiClubDashboard'

// Organization pages
import OrganizationChampionships from './pages/Organization/OrganizationChampionships'
import OrganizationAdvancedDashboard from './pages/Organization/OrganizationAdvancedDashboard'
import CreateChampionship from './pages/Organization/CreateChampionship'
import ChampionshipManage from './pages/Organization/ChampionshipManage'
import ChampionshipTeamsManagement from './pages/Organization/ChampionshipTeamsManagement'
import ChampionshipTables from './pages/Organization/ChampionshipTables'
import ChampionshipResults from './pages/Organization/ChampionshipResults'
import ChampionshipReports from './pages/Organization/ChampionshipReports'
import UnifiedChampionshipDashboard from './pages/Organization/UnifiedChampionshipDashboard'

// Public pages - NOVAS
import AthletePublicProfile from './pages/Public/AthletePublicProfile'
import ClubPublicProfile from './pages/Public/ClubPublicProfile'
import PublicChampionships from './pages/Public/PublicChampionships'
import PublicAthletesList from './pages/Public/PublicAthletesList'
import PublicClubsList from './pages/Public/PublicClubsList'

// Championship pages
import Championships from './pages/Championship/Championships'
import ChampionshipDetail from './pages/Championship/ChampionshipDetail'
import ChampionshipPublicView from './pages/Championship/ChampionshipView'

// Error pages
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <ChampionshipsProvider>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<Home />} />
          
          {/* Public profiles - NOVAS ROTAS */}
          <Route path="/athletes" element={<PublicAthletesList />} />
          <Route path="/athletes/:id" element={<AthletePublicProfile />} />
          <Route path="/clubs" element={<PublicClubsList />} />
          <Route path="/clubs/:id" element={<ClubPublicProfile />} />
          <Route path="/championships" element={<PublicChampionships />} />
          <Route path="/championships/:id" element={<ChampionshipPublicView />} />
          
          {/* Auth routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Athlete routes - ATUALIZADO */}
          <Route
            path="/athlete/*"
            element={
              <ProtectedRoute requiredUserType="athlete">
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<AthleteMultiClubDashboard />} />
                  <Route path="profile" element={<AthleteProfile />} />
                  <Route path="invites" element={<AthleteInvites />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Club routes */}
          <Route
            path="/club/*"
            element={
              <ProtectedRoute requiredUserType="club">
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<ClubDashboard />} />
                  <Route path="team" element={<ClubTeam />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Organization routes */}
          <Route
            path="/organization/*"
            element={
              <ProtectedRoute requiredUserType="organization">
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<OrganizationAdvancedDashboard />} />
                  <Route path="championships" element={<OrganizationChampionships />} />
                  <Route path="championships/create" element={<CreateChampionship />} />
                  <Route path="championships/:id/manage" element={<ChampionshipManage />} />
                  <Route path="championships/:id/teams" element={<ChampionshipTeamsManagement />} />
                  <Route path="championships/:id/tables" element={<ChampionshipTables />} />
                  <Route path="championships/:id/results" element={<ChampionshipResults />} />
                  <Route path="championships/:id/reports" element={<ChampionshipReports />} />
                  <Route path="championships/:id/dashboard" element={<UnifiedChampionshipDashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ChampionshipsProvider>
  )
}

export default App