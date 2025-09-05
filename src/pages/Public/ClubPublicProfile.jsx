// src/pages/Public/ClubPublicProfile.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  Target,
  Award,
  BarChart3,
  ArrowLeft,
  Phone,
  Mail
} from 'lucide-react'
import { Card, StatsCard, Button, EmptyStateCard } from '../../components/ui'
import { apiClient } from '../../services/api'
import { formatDate } from '../../utils/helpers'

const ClubPublicProfile = () => {
  const { id } = useParams()

  const { data: club, isLoading, error } = useQuery({
    queryKey: ['public-club', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/public/clubs/${id}`)
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

  if (error || !club) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏟️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Clube não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O clube que você procura não existe ou foi removido.
          </p>
          <Link to="/clubs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para clubes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const athletes = club.athletes || []
  const stats = club.stats || {}
  const championships = club.championships || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/clubs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {club.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                {club.bairro && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {club.bairro}
                  </span>
                )}
                {club.foundedYear && (
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Fundado em {club.foundedYear}
                  </span>
                )}
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {athletes.length} atletas
                </span>
              </div>
              
              {/* Contatos */}
              <div className="flex items-center space-x-4 mt-3 text-sm">
                {club.phone && (
                  <span className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-1" />
                    {club.phone}
                  </span>
                )}
                {club.email && (
                  <span className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-1" />
                    {club.email}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {championships.filter(c => c.status === 'active').length} campeonatos ativos
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
            title="Atletas"
            value={athletes.length}
            icon="👥"
            color="primary"
          />
          <StatsCard
            title="Vitórias"
            value={stats.wins || 0}
            icon="🏆"
            color="success"
          />
          <StatsCard
            title="Gols Marcados"
            value={stats.goalsFor || 0}
            icon="⚽"
            color="warning"
          />
          <StatsCard
            title="Jogos"
            value={stats.totalMatches || 0}
            icon="🏃‍♂️"
            color="secondary"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informações */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Clube
              </h3>
              
              <div className="space-y-3">
                {club.bairro && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{club.bairro}</span>
                  </div>
                )}
                
                {club.foundedYear && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">Fundado em {club.foundedYear}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{athletes.length} atletas</span>
                </div>
                
                {club.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{club.phone}</span>
                  </div>
                )}
                
                {club.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{club.email}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Conquistas */}
            {club.achievements && club.achievements.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Conquistas
                </h3>
                
                <div className="space-y-3">
                  {club.achievements.slice(0, 5).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Sobre */}
            {club.description && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Sobre o Clube
                </h3>
                <p className="text-gray-600 leading-relaxed">{club.description}</p>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Elenco */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Elenco ({athletes.length})
              </h3>
              
              {athletes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {athletes.map((athlete) => (
                    <Link key={athlete.id} to={`/athletes/${athlete.id}`}>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {athlete.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{athlete.name}</p>
                          <p className="text-sm text-gray-600">{athlete.position} • {athlete.age} anos</p>
                        </div>
                        {athlete.goals > 0 && (
                          <span className="text-sm text-green-600 font-medium">
                            {athlete.goals} gols
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  icon={<Users className="w-8 h-8" />}
                  title="Elenco vazio"
                  description="Este clube ainda não possui atletas cadastrados."
                />
              )}
            </Card>

            {/* Campeonatos */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Campeonatos
              </h3>
              
              {championships.length > 0 ? (
                <div className="space-y-3">
                  {championships.map((championship) => (
                    <Link key={championship.id} to={`/championships/${championship.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">{championship.name}</p>
                          <p className="text-sm text-gray-600">
                            {championship.format} • {championship.teams} times
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            championship.status === 'active' ? 'bg-green-100 text-green-800' :
                            championship.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {championship.status === 'active' ? 'Em Andamento' :
                             championship.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                          </span>
                          {championship.position && (
                            <p className="text-sm text-gray-600 mt-1">
                              {championship.position}º lugar
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  icon={<Trophy className="w-8 h-8" />}
                  title="Sem campeonatos"
                  description="Este clube ainda não participou de campeonatos."
                />
              )}
            </Card>

            {/* Estatísticas Detalhadas */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Estatísticas do Clube
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.wins || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Vitórias</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.draws || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Empates</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {stats.losses || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Derrotas</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.goalsFor || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Gols Pró</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.goalsAgainst || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Gols Contra</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">
                    {((stats.goalsFor || 0) - (stats.goalsAgainst || 0)) > 0 ? '+' : ''}
                    {(stats.goalsFor || 0) - (stats.goalsAgainst || 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Saldo de Gols</div>
                </div>
              </div>

              {stats.totalMatches > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Aproveitamento</p>
                      <p className="text-sm text-gray-600">
                        {(((stats.wins || 0) * 3 + (stats.draws || 0)) / (stats.totalMatches * 3) * 100).toFixed(1)}% dos pontos possíveis
                      </p>
                    </div>
                    <div className="text-2xl">📊</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubPublicProfile

