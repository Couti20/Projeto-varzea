import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  Plus, 
  Users, 
  Calendar,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react'

const OrganizationChampionships = () => {
  const navigate = useNavigate()
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState('active')
  
  // Mock data - será substituído pela API
  useEffect(() => {
    setTimeout(() => {
      setChampionships([
        {
          id: 1,
          name: 'Campeonato Várzea 2025',
          status: 'active',
          startDate: '2025-09-15',
          endDate: '2025-12-20',
          teams: 16,
          groups: 4,
          teamsPerGroup: 4,
          classifyPerGroup: 2,
          currentPhase: 'groups',
          registrationOpen: false
        },
        {
          id: 2,
          name: 'Copa Primavera',
          status: 'registration',
          startDate: '2025-10-01',
          endDate: '2025-11-30',
          teams: 8,
          groups: 2,
          teamsPerGroup: 4,
          classifyPerGroup: 2,
          currentPhase: 'registration',
          registrationOpen: true,
          registeredTeams: 5
        },
        {
          id: 3,
          name: 'Torneio de Verão',
          status: 'planning',
          startDate: '2025-12-01',
          endDate: '2026-02-28',
          teams: 32,
          groups: 8,
          teamsPerGroup: 4,
          classifyPerGroup: 2,
          currentPhase: 'planning',
          registrationOpen: false
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Em Andamento' },
      registration: { color: 'bg-blue-100 text-blue-800', icon: Users, text: 'Inscrições Abertas' },
      planning: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Planejamento' },
      finished: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Finalizado' }
    }
    return badges[status] || badges.planning
  }

  const getPhaseBadge = (phase) => {
    const phases = {
      planning: 'Planejamento',
      registration: 'Inscrições',
      groups: 'Fase de Grupos',
      knockout: 'Mata-Mata',
      final: 'Final',
      finished: 'Encerrado'
    }
    return phases[phase] || 'Planejamento'
  }

  const filteredChampionships = championships.filter(champ => {
    if (selectedTab === 'active') return champ.status === 'active'
    if (selectedTab === 'registration') return champ.status === 'registration'
    if (selectedTab === 'planning') return champ.status === 'planning'
    if (selectedTab === 'finished') return champ.status === 'finished'
    return true
  })

  const stats = {
    total: championships.length,
    active: championships.filter(c => c.status === 'active').length,
    registration: championships.filter(c => c.status === 'registration').length,
    planning: championships.filter(c => c.status === 'planning').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando campeonatos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Campeonatos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus campeonatos e competições</p>
        </div>
        <button
          onClick={() => navigate('/organization/championships/create')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Campeonato
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Trophy className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inscrições</p>
              <p className="text-2xl font-bold text-blue-600">{stats.registration}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planejamento</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.planning}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'active', label: 'Em Andamento', count: stats.active },
            { id: 'registration', label: 'Inscrições', count: stats.registration },
            { id: 'planning', label: 'Planejamento', count: stats.planning },
            { id: 'all', label: 'Todos', count: stats.total }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${selectedTab === tab.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Championships List */}
      <div className="space-y-4">
        {filteredChampionships.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum campeonato encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedTab === 'all' 
                ? 'Crie seu primeiro campeonato para começar'
                : `Não há campeonatos nesta categoria`
              }
            </p>
            {selectedTab === 'all' && (
              <button
                onClick={() => navigate('/organization/championships/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
                Criar Campeonato
              </button>
            )}
          </div>
        ) : (
          filteredChampionships.map(championship => {
            const StatusBadge = getStatusBadge(championship.status)
            return (
              <div
                key={championship.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Trophy className="w-6 h-6 text-primary-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {championship.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(championship.startDate).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {championship.teams} times
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {championship.groups} grupos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                        <StatusBadge.icon className="w-3 h-3" />
                        {StatusBadge.text}
                      </span>
                      <span className="text-xs text-gray-500">
                        Fase: {getPhaseBadge(championship.currentPhase)}
                      </span>
                    </div>
                  </div>

                  {/* Championship Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Grupos</p>
                      <p className="text-sm font-medium text-gray-900">{championship.groups}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Times/Grupo</p>
                      <p className="text-sm font-medium text-gray-900">{championship.teamsPerGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Classificados/Grupo</p>
                      <p className="text-sm font-medium text-gray-900">{championship.classifyPerGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status Inscrições</p>
                      <p className="text-sm font-medium">
                        {championship.registrationOpen ? (
                          <span className="text-green-600">Abertas</span>
                        ) : (
                          <span className="text-red-600">Fechadas</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Registration Progress */}
                  {championship.status === 'registration' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Inscrições</span>
                        <span className="text-gray-900 font-medium">
                          {championship.registeredTeams || 0}/{championship.teams}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${((championship.registeredTeams || 0) / championship.teams) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/organization/championships/${championship.id}/view`)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>

                    <button
                      onClick={() => navigate(`/organization/championships/${championship.id}/manage`)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Gerenciar
                    </button>
                    
                    {championship.status === 'registration' && (
                      <button
                        onClick={() => navigate(`/organization/championships/${championship.id}/teams`)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        Times Inscritos
                      </button>
                    )}
                    
                    {championship.status === 'active' && (
                      <button
                        onClick={() => navigate(`/organization/championships/${championship.id}/tables`)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Trophy className="w-4 h-4" />
                        Tabelas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default OrganizationChampionships