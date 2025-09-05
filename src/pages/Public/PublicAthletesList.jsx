// src/pages/Public/PublicAthletesList.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Search, 
  Filter,
  Users,
  MapPin,
  Trophy,
  Target,
  ChevronRight
} from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { apiClient } from '../../services/api'

const PublicAthletesList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('all')
  const [selectedClubStatus, setSelectedClubStatus] = useState('all')

  const { data: athletes = [], isLoading, error } = useQuery({
    queryKey: ['public-athletes', { searchTerm, selectedPosition, selectedClubStatus }],
    queryFn: async () => {
      const response = await apiClient.get('/api/public/athletes', {
        params: {
          search: searchTerm || undefined,
          position: selectedPosition !== 'all' ? selectedPosition : undefined,
          clubStatus: selectedClubStatus !== 'all' ? selectedClubStatus : undefined,
        }
      })
      return response.data
    },
    staleTime: 2 * 60 * 1000
  })

  const positionOptions = [
    { value: 'all', label: 'Todas as Posições' },
    { value: 'goleiro', label: 'Goleiro' },
    { value: 'zagueiro', label: 'Zagueiro' },
    { value: 'lateral', label: 'Lateral' },
    { value: 'volante', label: 'Volante' },
    { value: 'meia', label: 'Meia' },
    { value: 'atacante', label: 'Atacante' }
  ]

  const clubStatusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'with_club', label: 'Com Clube' },
    { value: 'free', label: 'Sem Clube' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Atletas de Futebol de Várzea
          </h1>
          <p className="text-gray-600">
            Conheça os atletas da sua região e suas estatísticas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto py-6 px-4">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar atletas por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {positionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedClubStatus}
              onChange={(e) => setSelectedClubStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clubStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>

      {/* Athletes Grid */}
      <div className="max-w-6xl mx-auto pb-8 px-4">
        {athletes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {athletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum atleta encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

// Componente AthleteCard
const AthleteCard = ({ athlete }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {athlete.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{athlete.name}</h3>
          <p className="text-gray-600">{athlete.position} • {athlete.age} anos</p>
          {athlete.location && (
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {athlete.location}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-600">{athlete.stats?.totalGoals || 0}</div>
          <div className="text-xs text-gray-600">Gols</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-lg font-bold text-blue-600">{athlete.stats?.totalMatches || 0}</div>
          <div className="text-xs text-gray-600">Jogos</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded">
          <div className="text-lg font-bold text-purple-600">{athlete.clubs?.length || 0}</div>
          <div className="text-xs text-gray-600">Clubes</div>
        </div>
      </div>

      {/* Clubs */}
      {athlete.clubs && athlete.clubs.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Clubes:</p>
          <div className="flex flex-wrap gap-1">
            {athlete.clubs.slice(0, 2).map((club) => (
              <span key={club.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {club.name}
              </span>
            ))}
            {athlete.clubs.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{athlete.clubs.length - 2} mais
              </span>
            )}
          </div>
        </div>
      )}

      <Link to={`/athletes/${athlete.id}`}>
        <Button className="w-full group">
          Ver Perfil
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </Card>
  )
}

export default PublicAthletesList