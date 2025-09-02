import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Users, 
  ArrowLeft,
  Check,
  X,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban,
  FileText,
  Download,
  Eye,
  Shuffle
} from 'lucide-react'

const ChampionshipTeams = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [championship, setChampionship] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeams, setSelectedTeams] = useState([])
  const [showGroupAssignModal, setShowGroupAssignModal] = useState(false)
  const [groups, setGroups] = useState([])

  // Mock data - será substituído pela API
  useEffect(() => {
    setTimeout(() => {
      setChampionship({
        id: id,
        name: 'Campeonato Várzea 2025',
        totalSlots: 16,
        registrationDeadline: '2025-09-10',
        startDate: '2025-09-15',
        groups: [
          { id: 'A', name: 'Grupo A', slots: 4, filled: 3 },
          { id: 'B', name: 'Grupo B', slots: 4, filled: 4 },
          { id: 'C', name: 'Grupo C', slots: 4, filled: 2 },
          { id: 'D', name: 'Grupo D', slots: 4, filled: 1 }
        ]
      })

      setGroups([
        { id: 'A', name: 'Grupo A', slots: 4, filled: 3 },
        { id: 'B', name: 'Grupo B', slots: 4, filled: 4 },
        { id: 'C', name: 'Grupo C', slots: 4, filled: 2 },
        { id: 'D', name: 'Grupo D', slots: 4, filled: 1 }
      ])

      setTeams([
        {
          id: 1,
          name: 'Real Várzea FC',
          responsibleName: 'João Silva',
          responsibleEmail: 'joao@realvarzea.com',
          responsiblePhone: '(11) 98765-4321',
          location: 'São Paulo - SP',
          foundedDate: '2015-03-10',
          players: 22,
          status: 'approved',
          groupId: 'A',
          registrationDate: '2025-08-20',
          paymentStatus: 'paid',
          paymentDate: '2025-08-22',
          documents: {
            registration: true,
            playersList: true,
            payment: true
          }
        },
        {
          id: 2,
          name: 'Barcelona da Quebrada',
          responsibleName: 'Pedro Santos',
          responsibleEmail: 'pedro@barcaquebrada.com',
          responsiblePhone: '(11) 97654-3210',
          location: 'Guarulhos - SP',
          foundedDate: '2018-07-15',
          players: 25,
          status: 'approved',
          groupId: 'A',
          registrationDate: '2025-08-18',
          paymentStatus: 'paid',
          paymentDate: '2025-08-20',
          documents: {
            registration: true,
            playersList: true,
            payment: true
          }
        },
        {
          id: 3,
          name: 'Juventus do Bairro',
          responsibleName: 'Carlos Oliveira',
          responsibleEmail: 'carlos@juventusbairro.com',
          responsiblePhone: '(11) 96543-2109',
          location: 'Osasco - SP',
          foundedDate: '2012-11-20',
          players: 20,
          status: 'pending',
          groupId: null,
          registrationDate: '2025-08-25',
          paymentStatus: 'pending',
          documents: {
            registration: true,
            playersList: false,
            payment: false
          }
        },
        {
          id: 4,
          name: 'Milan da Vila',
          responsibleName: 'Roberto Alves',
          responsibleEmail: 'roberto@milanvila.com',
          responsiblePhone: '(11) 95432-1098',
          location: 'Santo André - SP',
          foundedDate: '2020-01-05',
          players: 18,
          status: 'pending',
          groupId: null,
          registrationDate: '2025-08-28',
          paymentStatus: 'pending',
          documents: {
            registration: true,
            playersList: true,
            payment: false
          }
        },
        {
          id: 5,
          name: 'Santos da Praça',
          responsibleName: 'Fernando Costa',
          responsibleEmail: 'fernando@santospraca.com',
          responsiblePhone: '(11) 94321-0987',
          location: 'Santos - SP',
          foundedDate: '2016-05-12',
          players: 23,
          status: 'rejected',
          groupId: null,
          registrationDate: '2025-08-15',
          rejectionReason: 'Documentação incompleta - Falta lista de jogadores atualizada',
          documents: {
            registration: false,
            playersList: false,
            payment: false
          }
        },
        {
          id: 6,
          name: 'Corinthians do Campo',
          responsibleName: 'André Martins',
          responsibleEmail: 'andre@corinthianscampo.com',
          responsiblePhone: '(11) 93210-9876',
          location: 'São Bernardo - SP',
          foundedDate: '2019-09-08',
          players: 24,
          status: 'approved',
          groupId: 'B',
          registrationDate: '2025-08-22',
          paymentStatus: 'paid',
          paymentDate: '2025-08-24',
          documents: {
            registration: true,
            playersList: true,
            payment: true
          }
        }
      ])

      setLoading(false)
    }, 1000)
  }, [id])

  // Filtrar times por status
  const getFilteredTeams = () => {
    let filtered = teams

    if (selectedTab === 'pending') {
      filtered = teams.filter(t => t.status === 'pending')
    } else if (selectedTab === 'approved') {
      filtered = teams.filter(t => t.status === 'approved')
    } else if (selectedTab === 'rejected') {
      filtered = teams.filter(t => t.status === 'rejected')
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  // Aprovar time
  const approveTeam = (teamId) => {
    setTeams(teams.map(t => 
      t.id === teamId ? { ...t, status: 'approved' } : t
    ))
  }

  // Rejeitar time
  const rejectTeam = (teamId, reason) => {
    setTeams(teams.map(t => 
      t.id === teamId ? { ...t, status: 'rejected', rejectionReason: reason } : t
    ))
  }

  // Atribuir time a um grupo
  const assignToGroup = (teamId, groupId) => {
    setTeams(teams.map(t => 
      t.id === teamId ? { ...t, groupId: groupId } : t
    ))
    
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, filled: g.filled + 1 } : g
    ))
  }

  // Selecionar/deselecionar time
  const toggleTeamSelection = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId))
    } else {
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  // Distribuir times aleatoriamente nos grupos
  const distributeTeamsRandomly = () => {
    const approvedTeamsWithoutGroup = teams.filter(t => t.status === 'approved' && !t.groupId)
    const availableGroups = groups.filter(g => g.filled < g.slots)
    
    if (approvedTeamsWithoutGroup.length === 0) return

    // Embaralhar times
    const shuffledTeams = [...approvedTeamsWithoutGroup].sort(() => Math.random() - 0.5)
    
    // Distribuir nos grupos disponíveis
    let groupIndex = 0
    shuffledTeams.forEach(team => {
      if (groupIndex < availableGroups.length) {
        assignToGroup(team.id, availableGroups[groupIndex].id)
        groupIndex = (groupIndex + 1) % availableGroups.length
      }
    })

    setShowGroupAssignModal(false)
  }

  const filteredTeams = getFilteredTeams()

  const stats = {
    total: teams.length,
    pending: teams.filter(t => t.status === 'pending').length,
    approved: teams.filter(t => t.status === 'approved').length,
    rejected: teams.filter(t => t.status === 'rejected').length,
    paid: teams.filter(t => t.paymentStatus === 'paid').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando times...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/organization/championships/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
          <p className="text-gray-600">Gerenciar Times Inscritos</p>
        </div>
        <button
          onClick={() => setShowGroupAssignModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Shuffle className="w-5 h-5" />
          Sortear Grupos
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejeitados</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <Ban className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Groups Status */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Distribuição nos Grupos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {championship.groups.map(group => (
            <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{group.name}</p>
                <p className="text-xs text-gray-600">{group.filled}/{group.slots} times</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                group.filled === group.slots ? 'bg-green-500' : 
                group.filled > 0 ? 'bg-yellow-500' : 'bg-gray-300'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, responsável ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pending', label: 'Pendentes', count: stats.pending, color: 'yellow' },
            { id: 'approved', label: 'Aprovados', count: stats.approved, color: 'green' },
            { id: 'rejected', label: 'Rejeitados', count: stats.rejected, color: 'red' },
            { id: 'all', label: 'Todos', count: stats.total, color: 'gray' }
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
              <span className={`
                px-2 py-0.5 rounded-full text-xs
                ${selectedTab === tab.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Teams List */}
      <div className="space-y-4">
        {filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum time encontrado
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há times nesta categoria'
              }
            </p>
          </div>
        ) : (
          filteredTeams.map(team => (
            <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {selectedTab === 'all' && (
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.id)}
                        onChange={() => toggleTeamSelection(team.id)}
                        className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {team.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Inscrito em {new Date(team.registrationDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {team.players} jogadores
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {team.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Análise Pendente
                      </span>
                    )}
                    {team.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Aprovado
                      </span>
                    )}
                    {team.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Ban className="w-3 h-3" />
                        Rejeitado
                      </span>
                    )}
                    {team.groupId && (
                      <span className="text-sm font-medium text-primary-600">
                        {groups.find(g => g.id === team.groupId)?.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Team Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Responsável</p>
                    <p className="text-sm font-medium text-gray-900">{team.responsibleName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {team.responsibleEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Telefone</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {team.responsiblePhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fundado em</p>
                    <p className="text-sm text-gray-900">
                      {new Date(team.foundedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Documentos:</span>
                  <div className="flex gap-3">
                    <div className={`flex items-center gap-1 text-sm ${team.documents.registration ? 'text-green-600' : 'text-red-600'}`}>
                      {team.documents.registration ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      Ficha
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${team.documents.playersList ? 'text-green-600' : 'text-red-600'}`}>
                      {team.documents.playersList ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      Elenco
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${team.documents.payment ? 'text-green-600' : 'text-red-600'}`}>
                      {team.documents.payment ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      Pagamento
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Pagamento:</span>
                  {team.paymentStatus === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Pago em {new Date(team.paymentDate).toLocaleDateString('pt-BR')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      Pendente
                    </span>
                  )}
                </div>

                {/* Rejection Reason */}
                {team.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Motivo da Rejeição:</p>
                        <p className="text-sm text-red-700 mt-1">{team.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                    <FileText className="w-4 h-4" />
                    Documentos
                  </button>
                  
                  {team.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveTeam(team.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectTeam(team.id, 'Documentação incompleta')}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </>
                  )}
                  
                  {team.status === 'approved' && !team.groupId && (
                    <select
                      onChange={(e) => assignToGroup(team.id, e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Atribuir Grupo</option>
                      {groups.filter(g => g.filled < g.slots).map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name} ({group.filled}/{group.slots})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Group Assignment Modal */}
      {showGroupAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribuir Times nos Grupos
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Existem {teams.filter(t => t.status === 'approved' && !t.groupId).length} times aprovados 
                sem grupo definido.
              </p>
              
              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{group.name}</span>
                    <span className="text-sm text-gray-600">
                      {group.filled}/{group.slots} vagas preenchidas
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Distribuição Aleatória:</strong> Os times serão distribuídos 
                aleatoriamente entre os grupos com vagas disponíveis.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGroupAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={distributeTeamsRandomly}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Sortear Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChampionshipTeams