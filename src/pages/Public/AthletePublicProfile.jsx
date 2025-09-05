// src/pages/Public/AthletePublicProfile.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target, 
  Award,
  Users,
  BarChart3,
  ArrowLeft
} from 'lucide-react'
import { Card, StatsCard, Button, EmptyStateCard } from '../../components/ui'
import { apiClient } from '../../services/api'
import { formatDate } from '../../utils/helpers'

const AthletePublicProfile = () => {
  const { id } = useParams()

  const { data: athlete, isLoading, error } = useQuery({
    queryKey: ['public-athlete', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/public/athletes/${id}`)
      return response.data
    },
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-6">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Atleta não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O perfil que você procura não existe ou foi removido.
          </p>
          <Link to="/athletes">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para atletas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const clubs = athlete.clubs || []
  const stats = athlete.stats || {}
  const achievements = athlete.achievements || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/athletes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {athlete.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{athlete.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {athlete.position || 'Posição não definida'}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {athlete.age} anos
                </span>
                {athlete.location && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {athlete.location}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  clubs.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {clubs.length > 0 ? `${clubs.length} clube(s)` : 'Sem clube'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {stats.totalMatches || 0} jogos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Gols"
            value={stats.totalGoals || 0}
            icon="⚽"
            color="success"
          />
          <StatsCard
            title="Assistências"
            value={stats.totalAssists || 0}
            icon="🎯"
            color="primary"
          />
          <StatsCard
            title="Jogos"
            value={stats.totalMatches || 0}
            icon="🏃‍♂️"
            color="secondary"
          />
          <StatsCard
            title="Clubes"
            value={clubs.length}
            icon="🏟️"
            color="warning"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clubes Atuais */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Clubes
              </h3>
              
              {clubs.length > 0 ? (
                <div className="space-y-3">
                  {clubs.map((club) => (
                    <Link key={club.id} to={`/clubs/${club.id}`}>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium">🏟️</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{club.name}</p>
                          <p className="text-sm text-gray-600">{club.bairro}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          club.membershipStatus === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {club.membershipStatus === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  icon={<Users className="w-8 h-8" />}
                  title="Sem clubes"
                  description="Este atleta ainda não faz parte de nenhum clube."
                />
              )}
            </Card>

            {/* Conquistas */}
            {achievements.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Conquistas
                </h3>
                
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.championship}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Biografia */}
            {athlete.bio && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Sobre
                </h3>
                <p className="text-gray-600 leading-relaxed">{athlete.bio}</p>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas Detalhadas */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Estatísticas Detalhadas
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.totalGoals || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Gols Marcados</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.totalAssists || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Assistências</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.totalMatches || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Jogos Disputados</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.goalsPerMatch || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Gols por Jogo</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {stats.yellowCards || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Cartões Amarelos</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">
                    {stats.redCards || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Cartões Vermelhos</div>
                </div>
              </div>

              {stats.totalGoals > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Eficiência Ofensiva</p>
                      <p className="text-sm text-gray-600">
                        Média de {((stats.totalGoals + stats.totalAssists) / Math.max(stats.totalMatches, 1)).toFixed(2)} participações em gols por jogo
                      </p>
                    </div>
                    <div className="text-2xl">🔥</div>
                  </div>
                </div>
              )}
            </Card>

            {/* Histórico Recente */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Jogos Recentes
              </h3>
              
              {stats.recentMatches && stats.recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentMatches.slice(0, 5).map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{match.championship}</p>
                        <p className="text-sm text-gray-600">
                          {match.homeTeam} {match.homeScore} x {match.awayScore} {match.awayTeam}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {match.goals > 0 && `${match.goals} gol(s)`}
                          {match.assists > 0 && ` ${match.assists} assist.`}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(match.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  icon={<Target className="w-8 h-8" />}
                  title="Nenhum jogo recente"
                  description="Histórico de jogos não disponível."
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AthletePublicProfile