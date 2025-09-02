import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Users,
  Calendar,
  Settings,
  FileText,
  ChevronRight
} from 'lucide-react'

const CreateChampionship = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    // Informações Básicas
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    
    // Configuração de Grupos
    format: 'groups_knockout', // groups_only, knockout_only, groups_knockout
    groups: [
      {
        id: 1,
        name: 'Grupo A',
        teams: 4,
        classifyCount: 2
      }
    ],
    
    // Configurações do Campeonato
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    tiebreakers: ['points', 'wins', 'goal_difference', 'goals_for', 'head_to_head'],
    
    // Regulamento
    rules: '',
    minPlayers: 11,
    maxPlayers: 25,
    allowYellowCards: true,
    yellowCardLimit: 3,
    allowRedCards: true,
    redCardSuspension: 1,
    
    // Taxas
    registrationFee: '',
    feeDeadline: ''
  })

  const [errors, setErrors] = useState({})

  const steps = [
    { id: 1, name: 'Informações Básicas', icon: FileText },
    { id: 2, name: 'Configuração de Grupos', icon: Users },
    { id: 3, name: 'Regras e Pontuação', icon: Settings },
    { id: 4, name: 'Revisão', icon: Trophy }
  ]

  // Adicionar novo grupo
  const addGroup = () => {
    const newGroupId = Math.max(...formData.groups.map(g => g.id)) + 1
    const groupLetter = String.fromCharCode(65 + formData.groups.length) // A, B, C, etc.
    
    setFormData({
      ...formData,
      groups: [
        ...formData.groups,
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
    if (formData.groups.length === 1) return // Manter pelo menos 1 grupo
    
    setFormData({
      ...formData,
      groups: formData.groups.filter(g => g.id !== groupId)
    })
  }

  // Atualizar grupo
  const updateGroup = (groupId, field, value) => {
    setFormData({
      ...formData,
      groups: formData.groups.map(g => 
        g.id === groupId ? { ...g, [field]: value } : g
      )
    })
  }

  // Calcular total de times
  const getTotalTeams = () => {
    return formData.groups.reduce((total, group) => total + parseInt(group.teams || 0), 0)
  }

  // Calcular times classificados
  const getTotalClassified = () => {
    return formData.groups.reduce((total, group) => total + parseInt(group.classifyCount || 0), 0)
  }

  // Validar formulário
  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Nome é obrigatório'
      if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória'
      if (!formData.endDate) newErrors.endDate = 'Data de término é obrigatória'
      if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Prazo de inscrição é obrigatório'
      
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'Data de término deve ser após a data de início'
      }
    }

    if (step === 2) {
      formData.groups.forEach((group, index) => {
        if (group.teams < 2) {
          newErrors[`group_${group.id}_teams`] = 'Mínimo 2 times por grupo'
        }
        if (group.classifyCount >= group.teams) {
          newErrors[`group_${group.id}_classify`] = 'Classificados deve ser menor que total de times'
        }
        if (group.classifyCount < 1) {
          newErrors[`group_${group.id}_classify`] = 'Deve classificar pelo menos 1 time'
        }
      })

      // Validar se o número de classificados é potência de 2 para mata-mata
      if (formData.format === 'groups_knockout') {
        const totalClassified = getTotalClassified()
        const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0
        
        if (!isPowerOfTwo(totalClassified)) {
          newErrors.totalClassified = `Total de classificados (${totalClassified}) deve ser potência de 2 (2, 4, 8, 16, 32...)`
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Avançar para próximo passo
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Voltar para passo anterior
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Salvar campeonato
  const handleSave = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    
    // Simular salvamento
    setTimeout(() => {
      console.log('Salvando campeonato:', formData)
      navigate('/organization/championships')
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/organization/championships')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Criar Novo Campeonato</h1>
          <p className="text-gray-600">Configure seu campeonato com total flexibilidade</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= step.id 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-3 font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Campeonato *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Campeonato Várzea 2025"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Descreva seu campeonato..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Término *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Inscrição *
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.registrationDeadline && (
                    <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Inscrição
                  </label>
                  <input
                    type="number"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="R$ 0,00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Pagamento
                  </label>
                  <input
                    type="date"
                    value={formData.feeDeadline}
                    onChange={(e) => setFormData({ ...formData, feeDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuração de Grupos */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato do Campeonato
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="groups_only">Apenas Fase de Grupos</option>
                  <option value="knockout_only">Apenas Mata-Mata</option>
                  <option value="groups_knockout">Grupos + Mata-Mata</option>
                </select>
              </div>

              {formData.format !== 'knockout_only' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Configuração dos Grupos</h3>
                    <button
                      onClick={addGroup}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Grupo
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-blue-900 font-medium mb-1">
                          Configuração Flexível
                        </p>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Crie quantos grupos quiser</li>
                          <li>• Defina quantos times em cada grupo</li>
                          <li>• Escolha quantos classificam de cada grupo</li>
                          <li>• Total de times: <span className="font-semibold">{getTotalTeams()}</span></li>
                          <li>• Total de classificados: <span className="font-semibold">{getTotalClassified()}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Erro de validação para mata-mata */}
                  {errors.totalClassified && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800">{errors.totalClassified}</p>
                      </div>
                    </div>
                  )}

                  {/* Lista de Grupos */}
                  <div className="space-y-4">
                    {formData.groups.map((group, index) => (
                      <div key={group.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <input
                            type="text"
                            value={group.name}
                            onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                            className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                          />
                          {formData.groups.length > 1 && (
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Número de Times
                            </label>
                            <input
                              type="number"
                              value={group.teams}
                              onChange={(e) => updateGroup(group.id, 'teams', parseInt(e.target.value) || 0)}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors[`group_${group.id}_teams`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              min="2"
                              max="100"
                            />
                            {errors[`group_${group.id}_teams`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`group_${group.id}_teams`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Times que Classificam
                            </label>
                            <input
                              type="number"
                              value={group.classifyCount}
                              onChange={(e) => updateGroup(group.id, 'classifyCount', parseInt(e.target.value) || 0)}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors[`group_${group.id}_classify`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              min="1"
                              max={group.teams - 1}
                            />
                            {errors[`group_${group.id}_classify`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`group_${group.id}_classify`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Regras e Pontuação */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sistema de Pontuação</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontos por Vitória
                    </label>
                    <input
                      type="number"
                      value={formData.pointsWin}
                      onChange={(e) => setFormData({ ...formData, pointsWin: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontos por Empate
                    </label>
                    <input
                      type="number"
                      value={formData.pointsDraw}
                      onChange={(e) => setFormData({ ...formData, pointsDraw: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontos por Derrota
                    </label>
                    <input
                      type="number"
                      value={formData.pointsLoss}
                      onChange={(e) => setFormData({ ...formData, pointsLoss: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Critérios de Desempate</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Ordem de prioridade dos critérios (arraste para reorganizar):
                  </p>
                  {formData.tiebreakers.map((criteria, index) => {
                    const criteriaLabels = {
                      points: 'Pontos',
                      wins: 'Vitórias',
                      goal_difference: 'Saldo de Gols',
                      goals_for: 'Gols Pró',
                      head_to_head: 'Confronto Direto'
                    }
                    return (
                      <div key={criteria} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-500">{index + 1}º</span>
                        <span className="text-sm text-gray-900">{criteriaLabels[criteria]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regras do Campeonato</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mínimo de Jogadores
                    </label>
                    <input
                      type="number"
                      value={formData.minPlayers}
                      onChange={(e) => setFormData({ ...formData, minPlayers: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Jogadores
                    </label>
                    <input
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.allowYellowCards}
                      onChange={(e) => setFormData({ ...formData, allowYellowCards: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sistema de Cartões Amarelos</span>
                  </label>

                  {formData.allowYellowCards && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Limite de cartões amarelos para suspensão
                      </label>
                      <input
                        type="number"
                        value={formData.yellowCardLimit}
                        onChange={(e) => setFormData({ ...formData, yellowCardLimit: parseInt(e.target.value) || 0 })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="1"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.allowRedCards}
                      onChange={(e) => setFormData({ ...formData, allowRedCards: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sistema de Cartões Vermelhos</span>
                  </label>

                  {formData.allowRedCards && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jogos de suspensão por cartão vermelho
                      </label>
                      <input
                        type="number"
                        value={formData.redCardSuspension}
                        onChange={(e) => setFormData({ ...formData, redCardSuspension: parseInt(e.target.value) || 0 })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulamento Adicional
                  </label>
                  <textarea
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={6}
                    placeholder="Adicione regras específicas do seu campeonato..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Revisão */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-900 font-medium">Tudo pronto!</p>
                    <p className="text-green-700 text-sm mt-1">
                      Revise as configurações do seu campeonato antes de criar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Nome:</dt>
                      <dd className="font-medium text-gray-900">{formData.name || '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Período:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.startDate && formData.endDate 
                          ? `${new Date(formData.startDate).toLocaleDateString('pt-BR')} - ${new Date(formData.endDate).toLocaleDateString('pt-BR')}`
                          : '-'
                        }
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Prazo de Inscrição:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.registrationDeadline 
                          ? new Date(formData.registrationDeadline).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </dd>
                    </div>
                    {formData.registrationFee && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Taxa de Inscrição:</dt>
                        <dd className="font-medium text-gray-900">R$ {formData.registrationFee}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Configuração do Campeonato</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Formato:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.format === 'groups_only' && 'Apenas Grupos'}
                        {formData.format === 'knockout_only' && 'Apenas Mata-Mata'}
                        {formData.format === 'groups_knockout' && 'Grupos + Mata-Mata'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Total de Times:</dt>
                      <dd className="font-medium text-gray-900">{getTotalTeams()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Grupos:</dt>
                      <dd className="font-medium text-gray-900">{formData.groups.length}</dd>
                    </div>
                    {formData.format !== 'groups_only' && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Times Classificados:</dt>
                        <dd className="font-medium text-gray-900">{getTotalClassified()}</dd>
                      </div>
                    )}
                  </dl>

                  {/* Detalhes dos Grupos */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos:</h4>
                    <div className="space-y-1">
                      {formData.groups.map(group => (
                        <div key={group.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{group.name}:</span>
                          <span className="text-gray-900">
                            {group.teams} times, classifica {group.classifyCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Pontuação e Regras</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Sistema de Pontos:</dt>
                      <dd className="font-medium text-gray-900">
                        V: {formData.pointsWin} | E: {formData.pointsDraw} | D: {formData.pointsLoss}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Elenco:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.minPlayers} - {formData.maxPlayers} jogadores
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Cartões:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.allowYellowCards && `${formData.yellowCardLimit} amarelos = suspensão`}
                        {formData.allowYellowCards && formData.allowRedCards && ' | '}
                        {formData.allowRedCards && `Vermelho = ${formData.redCardSuspension} jogo(s)`}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Voltar
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/organization/championships')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Criar Campeonato
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateChampionship