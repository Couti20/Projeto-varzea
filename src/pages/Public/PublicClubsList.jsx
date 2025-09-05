// src/pages/Public/PublicClubsList.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Search, 
  Filter,
  Building2,
  MapPin,
  Trophy,
  Users,
  ChevronRight,
  Calendar
} from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { apiClient } from '../../services/api'

const PublicClubsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBairro, setSelectedBairro] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ['public-clubs', { searchTerm, selectedBairro, selectedStatus }],
    queryFn: async () => {
      const response = await apiClient.get('/api/public/clubs', {
        params: {
          search: searchTerm || undefined,
          bairro: selectedBairro !== 'all' ? selectedBairro : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
        }
      })
      return response.data
    },
    staleTime: 2 * 60 * 1000
  })

  // Extrair bairros únicos dos clubes para o filtro
  const bairros = [...new Set(clubs.map(club => club.bairro).filter(Boolean))]
  
  const bairroOptions = [
    { value: 'all', label: 'Todos os Bairros' },
    ...bairros.map(bairro => ({ value: bairro, label: bairro }))
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'recruiting', label: 'Recrutando' }
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
            Clubes de Futebol de Várzea
          </h1>
          <p className="text-gray-600">
            Descubra clubes da sua região e suas histórias
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
                  placeholder="Buscar clubes por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedBairro}
              onChange={(e) => setSelectedBairro(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {bairroOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>

      {/* Clubs Grid */}
      <div className="max-w-6xl mx-auto pb-8 px-4">
        {clubs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum clube encontrado
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

// Componente ClubCard
const ClubCard = ({ club }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {club.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
          {club.bairro && (
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {club.bairro}
            </p>
          )}
          {club.foundedYear && (
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              Fundado em {club.foundedYear}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-lg font-bold text-blue-600">{club.athletesCount || 0}</div>
          <div className="text-xs text-gray-600">Atletas</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-600">{club.stats?.wins || 0}</div>
          <div className="text-xs text-gray-600">Vitórias</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="text-lg font-bold text-yellow-600">{club.championshipsCount || 0}</div>
          <div className="text-xs text-gray-600">Campeonatos</div>
        </div>
      </div>

      {/* Status and achievements */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          club.status === 'recruiting' ? 'bg-green-100 text-green-800' :
          club.status === 'active' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {club.status === 'recruiting' ? 'Recrutando' :
           club.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
        
        {club.achievements && club.achievements.length > 0 && (
          <div className="flex items-center text-xs text-yellow-600">
            <Trophy className="w-3 h-3 mr-1" />
            {club.achievements.length} conquista(s)
          </div>
        )}
      </div>

      {/* Recent championships */}
      {club.recentChampionships && club.recentChampionships.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Campeonatos recentes:</p>
          <div className="space-y-1">
            {club.recentChampionships.slice(0, 2).map((championship, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center justify-between">
                <span className="truncate">{championship.name}</span>
                <span className="ml-2 whitespace-nowrap">
                  {championship.position}º lugar
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to={`/clubs/${club.id}`}>
        <Button className="w-full group">
          Ver Perfil do Clube
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </Card>
  )
}

export default PublicClubsList