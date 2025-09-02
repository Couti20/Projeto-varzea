import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import ChampionshipView from './pages/Organization/ChampionshipView'
import { 
  ArrowLeft,
  Eye,
  Edit,
  Save,
  X,
  Calendar,
  Users,
  Trophy,
  Settings,
  FileText,
  DollarSign,
  Clock,
  MapPin,
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Info
} from 'lucide-react'

const ChampionshipView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [championship, setChampionship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState({})
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    groups: true,
    rules: true,
    finance: true
  })
  const [tempValues, setTempValues] = useState({})

  // Mock data - será substituído pela API
  useEffect(() => {
    setTimeout(() => {
      setChampionship({
        // Informações Básicas
        name: 'Campeonato Várzea 2025',
        description: 'O maior campeonato de futebol amador da região, reunindo os melhores times da várzea',
        startDate: '2025-09-15',
        endDate: '2025-12-20',
        registrationDeadline: '2025-09-10',
        status: 'active',
        
        // Configuração de Grupos
        format: 'groups_knockout',
        groups: [
          {
            id: 1,
            name: 'Grupo A',
            teams: 4,
            classifyCount: 2
          },
          {
            id: 2,
            name: 'Grupo B',
            teams: 4,
            classifyCount: 2
          },
          {
            id: 3,
            name: 'Grupo C',
            teams: 4,
            classifyCount: 2
          },
          {
            id: 4,
            name: 'Grupo D',
            teams: 4,
            classifyCount: 2
          }
        ],
        
        // Configurações do Campeonato
        pointsWin: 3,
        pointsDraw: 1,
        pointsLoss: 0,
        tiebreakers: ['points', 'wins', 'goal_difference', 'goals_for', 'head_to_head'],
        
        // Regras
        rules: 'Cada time deve apresentar a documentação completa antes do início do campeonato. É obrigatório o uso de caneleiras.',
        minPlayers: 11,
        maxPlayers: 25,
        matchDuration: 90,
        halfTimeDuration: 15,
        allowYellowCards: true,
        yellowCardLimit: 3,
        allowRedCards: true,
        redCardSuspension: 1,
        allowSubstitutions: true,
        maxSubstitutions: 5,
        
        // Finanças
        registrationFee: 150,
        feeDeadline: '2025-09-05',
        prizeFirst: 5000,
        prizeSecond: 2500,
        prizeThird: 1000,
        
        // Estatísticas
        totalTeams: 16,
        registeredTeams: 14,
        paidTeams: 12
      })
      setLoading(false)
    }, 1000)
  }, [id])

  // Toggle seção expandida
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Iniciar edição
  const startEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
    setTempValues({ ...tempValues, [field]: championship[field] })
  }

  // Cancelar edição
  const cancelEdit = (field) => {
    setEditMode({ ...editMode, [field]: false })
    setTempValues({ ...tempValues, [field]: undefined })
  }

  // Salvar edição
  const saveEdit = (field) => {
    setChampionship({ ...championship, [field]: tempValues[field] })
    setEditMode({ ...editMode, [field]: false })
  }

  // Editar grupo
  const updateGroup = (groupId, field, value) => {
    const updatedGroups = championship.groups.map(g => 
      g.id === groupId ? { ...g, [field]: value } : g
    )
    setChampionship({ ...championship, groups: updatedGroups })
  }

  // Adicionar grupo
  const addGroup = () => {
    const newGroupId = Math.max(...championship.groups.map(g => g.id)) + 1
    const groupLetter = String.fromCharCode(65 + championship.groups.length)
    
    setChampionship({
      ...championship,
      groups: [
        ...championship.groups,
        {
          id: newGroupId,
          name: `Grupo ${groupLetter}`,
          teams: 4,
          classifyCount: 2
        }
      ]
    })
  }

  // Remover grupo
  const removeGroup = (groupId) => {
    if (championship.groups.length === 1) return
    
    setChampionship({
      ...championship,
      groups: championship.groups.filter(g => g.id !== groupId)
    })
  }

  // Calcular totais
  const getTotalTeams = () => {
    return championship?.groups.reduce((total, group) => total + group.teams, 0) || 0
  }

  const getTotalClassified = () => {
    return championship?.groups.reduce((total, group) => total + group.classifyCount, 0) || 0
  }

  const getFormatLabel = (format) => {
    const formats = {
      'groups_only': 'Apenas Fase de Grupos',
      'knockout_only': 'Apenas Mata-Mata',
      'groups_knockout': 'Grupos + Mata-Mata'
    }
    return formats[format] || format
  }

  const getTiebreakerLabel = (criteria) => {
    const labels = {
      'points': 'Pontos',
      'wins': 'Vitórias',
      'goal_difference': 'Saldo de Gols',
      'goals_for': 'Gols Pró',
      'head_to_head': 'Confronto Direto'
    }
    return labels[criteria] || criteria
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/organization/championships')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
          <p className="text-gray-600">Visualização completa e edição</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/organization/championships/${id}/manage`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Settings className="w-4 h-4" />
            Gerenciar
          </button>
        </div>
      </div>

      {/* Seção: Informações Básicas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('basic')}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informações Básicas</h2>
          </div>
          {expandedSections.basic ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.basic && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Campeonato
              </label>
              {editMode.name ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempValues.name}
                    onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => saveEdit('name')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => cancelEdit('name')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900">{championship.name}</p>
                  <button
                    onClick={() => startEdit('name')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              {editMode.description ? (
                <div className="flex gap-2">
                  <textarea
                    value={tempValues.description}
                    onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => saveEdit('description')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => cancelEdit('description')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-gray-900">{championship.description}</p>
                  <button
                    onClick={() => startEdit('description')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                {editMode.startDate ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempValues.startDate}
                      onChange={(e) => setTempValues({ ...tempValues, startDate: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => saveEdit('startDate')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cancelEdit('startDate')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      {new Date(championship.startDate).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => startEdit('startDate')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término
                </label>
                {editMode.endDate ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempValues.endDate}
                      onChange={(e) => setTempValues({ ...tempValues, endDate: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => saveEdit('endDate')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cancelEdit('endDate')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      {new Date(championship.endDate).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => startEdit('endDate')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo de Inscrição
                </label>
                {editMode.registrationDeadline ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempValues.registrationDeadline}
                      onChange={(e) => setTempValues({ ...tempValues, registrationDeadline: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => saveEdit('registrationDeadline')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cancelEdit('registrationDeadline')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      {new Date(championship.registrationDeadline).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => startEdit('registrationDeadline')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seção: Configuração de Grupos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('groups')}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configuração de Grupos</h2>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {championship.groups.length} grupos | {getTotalTeams()} times
            </span>
          </div>
          {expandedSections.groups ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.groups && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato do Campeonato
              </label>
              {editMode.format ? (
                <div className="flex gap-2">
                  <select
                    value={tempValues.format}
                    onChange={(e) => setTempValues({ ...tempValues, format: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="groups_only">Apenas Fase de Grupos</option>
                    <option value="knockout_only">Apenas Mata-Mata</option>
                    <option value="groups_knockout">Grupos + Mata-Mata</option>
                  </select>
                  <button
                    onClick={() => saveEdit('format')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => cancelEdit('format')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900">{getFormatLabel(championship.format)}</p>
                  <button
                    onClick={() => startEdit('format')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Grupos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Grupos e Classificação
                </label>
                <button
                  onClick={addGroup}
                  className="flex items-center gap-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Grupo
                </button>
              </div>
              
              <div className="space-y-3">
                {championship.groups.map(group => (
                  <div key={group.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                        className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                      />
                      {championship.groups.length > 1 && (
                        <button
                          onClick={() => removeGroup(group.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Número de Times
                        </label>
                        <input
                          type="number"
                          value={group.teams}
                          onChange={(e) => updateGroup(group.id, 'teams', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="2"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Times que Classificam
                        </label>
                        <input
                          type="number"
                          value={group.classifyCount}
                          onChange={(e) => updateGroup(group.id, 'classifyCount', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="1"
                          max={group.teams - 1}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-900">
                    Total: <strong>{getTotalTeams()} times</strong> em 
                    <strong> {championship.groups.length} grupos</strong>, 
                    classificando <strong>{getTotalClassified()} times</strong> para a próxima fase
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seção: Regras e Pontuação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('rules')}
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Regras e Pontuação</h2>
          </div>
          {expandedSections.rules ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.rules && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            {/* Sistema de Pontuação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sistema de Pontuação
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vitória</label>
                  {editMode.pointsWin ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={tempValues.pointsWin}
                        onChange={(e) => setTempValues({ ...tempValues, pointsWin: parseInt(e.target.value) })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                      <button
                        onClick={() => saveEdit('pointsWin')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelEdit('pointsWin')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="font-semibold text-gray-900">{championship.pointsWin} pontos</span>
                      <button
                        onClick={() => startEdit('pointsWin')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Empate</label>
                  {editMode.pointsDraw ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={tempValues.pointsDraw}
                        onChange={(e) => setTempValues({ ...tempValues, pointsDraw: parseInt(e.target.value) })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                      <button
                        onClick={() => saveEdit('pointsDraw')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelEdit('pointsDraw')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="font-semibold text-gray-900">{championship.pointsDraw} ponto</span>
                      <button
                        onClick={() => startEdit('pointsDraw')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Derrota</label>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-gray-900">{championship.pointsLoss} pontos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critérios de Desempate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Critérios de Desempate (ordem de prioridade)
              </label>
              <div className="space-y-2">
                {championship.tiebreakers.map((criteria, index) => (
                  <div key={criteria} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 w-8">{index + 1}º</span>
                    <span className="text-sm text-gray-900">{getTiebreakerLabel(criteria)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regras do Campeonato */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cartões
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Limite de Amarelos</span>
                    {editMode.yellowCardLimit ? (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={tempValues.yellowCardLimit}
                          onChange={(e) => setTempValues({ ...tempValues, yellowCardLimit: parseInt(e.target.value) })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="1"
                        />
                        <button
                          onClick={() => saveEdit('yellowCardLimit')}
                          className="p-1 text-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => cancelEdit('yellowCardLimit')}
                          className="p-1 text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{championship.yellowCardLimit}</span>
                        <button
                          onClick={() => startEdit('yellowCardLimit')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Suspensão por Vermelho</span>
                    {editMode.redCardSuspension ? (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={tempValues.redCardSuspension}
                          onChange={(e) => setTempValues({ ...tempValues, redCardSuspension: parseInt(e.target.value) })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="1"
                        />
                        <button
                          onClick={() => saveEdit('redCardSuspension')}
                          className="p-1 text-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => cancelEdit('redCardSuspension')}
                          className="p-1 text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{championship.redCardSuspension} jogo(s)</span>
                        <button
                          onClick={() => startEdit('redCardSuspension')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elenco e Substituições
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Jogadores (Min-Máx)</span>
                    <span className="font-medium text-gray-900">
                      {championship.minPlayers} - {championship.maxPlayers}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Substituições</span>
                    {editMode.maxSubstitutions ? (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={tempValues.maxSubstitutions}
                          onChange={(e) => setTempValues({ ...tempValues, maxSubstitutions: parseInt(e.target.value) })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="0"
                        />
                        <button
                          onClick={() => saveEdit('maxSubstitutions')}
                          className="p-1 text-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => cancelEdit('maxSubstitutions')}
                          className="p-1 text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{championship.maxSubstitutions}</span>
                        <button
                          onClick={() => startEdit('maxSubstitutions')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Regulamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regulamento Adicional
              </label>
              {editMode.rules ? (
                <div className="flex gap-2">
                  <textarea
                    value={tempValues.rules}
                    onChange={(e) => setTempValues({ ...tempValues, rules: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => saveEdit('rules')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => cancelEdit('rules')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex-1">
                    {championship.rules || 'Nenhum regulamento adicional definido'}
                  </p>
                  <button
                    onClick={() => startEdit('rules')}
                    className="p-1 text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seção: Informações Financeiras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('finance')}
        >
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informações Financeiras</h2>
          </div>
          {expandedSections.finance ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.finance && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Inscrição
                </label>
                {editMode.registrationFee ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tempValues.registrationFee}
                      onChange={(e) => setTempValues({ ...tempValues, registrationFee: parseFloat(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={() => saveEdit('registrationFee')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => cancelEdit('registrationFee')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-semibold">R$ {championship.registrationFee}</p>
                    <button
                      onClick={() => startEdit('registrationFee')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo de Pagamento
                </label>
                {editMode.feeDeadline ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempValues.feeDeadline}
                      onChange={(e) => setTempValues({ ...tempValues, feeDeadline: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => saveEdit('feeDeadline')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => cancelEdit('feeDeadline')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      {new Date(championship.feeDeadline).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => startEdit('feeDeadline')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Premiação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premiação
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-800">1º Lugar</span>
                  </div>
                  <p className="font-bold text-yellow-900">R$ {championship.prizeFirst || '0'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-800">2º Lugar</span>
                  </div>
                  <p className="font-bold text-gray-900">R$ {championship.prizeSecond || '0'}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800">3º Lugar</span>
                  </div>
                  <p className="font-bold text-orange-900">R$ {championship.prizeThird || '0'}</p>
                </div>
              </div>
            </div>

            {/* Status de Pagamentos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Status de Pagamentos</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{championship.totalTeams}</p>
                  <p className="text-xs text-gray-600">Total de Times</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{championship.registeredTeams}</p>
                  <p className="text-xs text-gray-600">Times Inscritos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{championship.paidTeams}</p>
                  <p className="text-xs text-gray-600">Pagamentos Confirmados</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Todas as alterações são salvas automaticamente
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/organization/championships/${id}/tables`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white"
          >
            Ver Tabelas
          </button>
          <button
            onClick={() => navigate(`/organization/championships/${id}/teams`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white"
          >
            Times Inscritos
          </button>
          <button
            onClick={() => navigate(`/organization/championships/${id}/manage`)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Painel de Controle
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChampionshipView