// src/pages/Public/PublicChampionships.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Trophy, 
  Search, 
  Filter,
  Calendar,
  Users,
  MapPin,
  ChevronRight
} from 'lucide-react'

const PublicChampionships = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')

  // Mock data para desenvolvimento
  const mockChampionships = [
    {
      id: '1',
      name: 'Campeonato de Várzea 2025',
      status: 'active',
      format: 'league',
      teamsCount: 16,
      startDate: '2025-01-15',
      location: 'São Paulo - SP',
      description: 'O maior campeonato de várzea da região'
    },
    {
      id: '2', 
      name: 'Copa dos Campeões',
      status: 'upcoming',
      format: 'knockout',
      teamsCount: 8,
      startDate: '2025-02-01',
      location: 'Rio de Janeiro - RJ',
      description: 'Mata-mata entre os melhores times'
    },
    {
      id: '3',
      name: 'Liga Regional Sul',
      status: 'active',
      format: 'league',
      teamsCount: 12,
      startDate: '2025-01-10',
      location: 'Porto Alegre - RS',
      description: 'Pontos corridos da região sul'
    },
    {
      id: '4',
      name: 'Torneio de Verão',
      status: 'open',
      format: 'mixed',
      teamsCount: 20,
      startDate: '2025-02-15',
      location: 'Salvador - BA',
      description: 'Inscrições abertas até janeiro'
    },
    {
      id: '5',
      name: 'Copa Nordeste Amateur',
      status: 'finished',
      format: 'knockout',
      teamsCount: 16,
      startDate: '2024-12-01',
      location: 'Recife - PE',
      description: 'Campeonato finalizado em dezembro'
    }
  ]

  // Filtrar campeonatos
  const filteredChampionships = mockChampionships.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || championship.status === selectedStatus
    const matchesFormat = selectedFormat === 'all' || championship.format === selectedFormat
    return matchesSearch && matchesStatus && matchesFormat
  })

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Em Andamento' },
    { value: 'upcoming', label: 'Próximos' },
    { value: 'open', label: 'Inscrições Abertas' },
    { value: 'finished', label: 'Finalizados' }
  ]

  const formatOptions = [
    { value: 'all', label: 'Todos os Formatos' },
    { value: 'league', label: 'Liga (Pontos Corridos)' },
    { value: 'knockout', label: 'Mata-mata' },
    { value: 'mixed', label: 'Misto' }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campeonatos de Futebol de Várzea
          </h1>
          <p className="text-gray-600">
            Acompanhe todos os campeonatos em andamento na sua região
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar campeonatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
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
            
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formatOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Championships Grid */}
      <div className="max-w-6xl mx-auto pb-8 px-4">
        {filteredChampionships.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChampionships.map((championship) => (
              <ChampionshipCard key={championship.id} championship={championship} formatDate={formatDate} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum campeonato encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou aguarde novos campeonatos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de Card do Campeonato
const ChampionshipCard = ({ championship, formatDate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'open': return 'bg-yellow-100 text-yellow-800'
      case 'finished': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Em Andamento'
      case 'upcoming': return 'Próximo'
      case 'open': return 'Inscrições Abertas'
      case 'finished': return 'Finalizado'
      default: return 'Não Iniciado'
    }
  }

  const getFormatLabel = (format) => {
    switch (format) {
      case 'league': return 'Liga'
      case 'knockout': return 'Mata-mata'
      case 'mixed': return 'Misto'
      default: return format
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {championship.name}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(championship.status)}`}>
          {getStatusLabel(championship.status)}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {championship.startDate ? formatDate(championship.startDate) : 'Data a definir'}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {championship.teamsCount} times participantes
        </div>
        
        {championship.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {championship.location}
          </div>
        )}
      </div>

      {championship.description && (
        <p className="text-sm text-gray-600 mb-4">
          {championship.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">
          {getFormatLabel(championship.format)}
        </span>
        
        <Link to={`/championships/${championship.id}`}>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center group">
            Ver Detalhes
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default PublicChampionships