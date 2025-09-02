import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChampionships } from '../../context/ChampionshipsContext'
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
  ChevronRight,
  Clock,
  UserCheck
} from 'lucide-react'

const CreateChampionship = () => {
  const navigate = useNavigate()
  const { addChampionship } = useChampionships()
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
    
    // Sistema de Pontuação
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    tiebreakers: ['points', 'wins', 'goal_difference', 'goals_for', 'head_to_head'],
    
    // Sistema de Cartões
    yellowCardLimit: 3,
    redCardSuspension: 1,
    
    // Configurações de Partida
    matchDuration: 90,
    matchPeriods: 2,
    intervalDuration: 15,
    substitutions: 5,
    extraTime: false,
    
    // Regulamento
    rules: '',
    minPlayers: 11,
    maxPlayers: 25,
    
    // Taxas
    registrationFee: '',
    feeDeadline: '',

    // SISTEMA DE PREMIAÇÃO
    hasAwards: false,
    awardType: '2', // '2' para 1º e 2º, '3' para 1º, 2º e 3º
    firstPlaceAward: '',
    secondPlaceAward: '',
    thirdPlaceAward: ''
  })

  const [errors, setErrors] = useState({})

  const steps = [
    { id: 1, name: 'Informações Básicas', icon: FileText },
    { id: 2, name: 'Configuração de Grupos', icon: Users },
    { id: 3, name: 'Regras e Pontuação', icon: Settings },
    { id: 4, name: 'Revisão', icon: Trophy }
  ]

  // Função para formatar moeda
  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/\D/g, '');
    if (numericValue === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue / 100);
  };

  const handleCurrencyChange = (field, value) => {
    const numericValue = value.replace(/\D/g, '');
    setFormData({ ...formData, [field]: numericValue });
  };

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

      // Validação da premiação
      if (formData.hasAwards) {
        if (!formData.firstPlaceAward) newErrors.firstPlaceAward = 'Prêmio 1º lugar é obrigatório'
        if (!formData.secondPlaceAward) newErrors.secondPlaceAward = 'Prêmio 2º lugar é obrigatório'
        if (formData.awardType === '3' && !formData.thirdPlaceAward) {
          newErrors.thirdPlaceAward = 'Prêmio 3º lugar é obrigatório'
        }
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

  // Salvar campeonato - VERSÃO CORRIGIDA COM REDIRECIONAMENTO
  const handleSave = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    
    // Simular processamento
    setTimeout(() => {
      // Preparar dados do campeonato
      const championshipData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationDeadline: formData.registrationDeadline,
        registrationFee: formData.registrationFee,
        feeDeadline: formData.feeDeadline,
        format: formData.format,
        groups: formData.groups,
        season: new Date(formData.startDate).getFullYear().toString(),
        
        // Dados da premiação
        awards: formData.hasAwards ? {
          firstPlace: parseInt(formData.firstPlaceAward) || 0,
          secondPlace: parseInt(formData.secondPlaceAward) || 0,
          thirdPlace: formData.awardType === '3' ? (parseInt(formData.thirdPlaceAward) || 0) : 0,
          total: (parseInt(formData.firstPlaceAward) || 0) + 
                 (parseInt(formData.secondPlaceAward) || 0) + 
                 (formData.awardType === '3' ? (parseInt(formData.thirdPlaceAward) || 0) : 0)
        } : null,
        
        // Todas as configurações do wizard
        settings: {
          pointsWin: formData.pointsWin,
          pointsDraw: formData.pointsDraw,
          pointsLoss: formData.pointsLoss,
          yellowCardLimit: formData.yellowCardLimit,
          redCardSuspension: formData.redCardSuspension,
          matchDuration: formData.matchDuration,
          matchPeriods: formData.matchPeriods,
          intervalDuration: formData.intervalDuration,
          substitutions: formData.substitutions,
          extraTime: formData.extraTime,
          tiebreakers: formData.tiebreakers,
          minPlayers: formData.minPlayers,
          maxPlayers: formData.maxPlayers,
          rules: formData.rules,
          registrationOpen: true // Abre inscrições por padrão
        }
      }

      console.log('Salvando campeonato:', championshipData)
      
      // Salvar no Context
      const newChampionshipId = addChampionship(championshipData)
      
      // REDIRECIONAMENTO PARA A PÁGINA DE VISUALIZAÇÃO
      navigate(`/organization/championships/${newChampionshipId}/view`)
      
      setLoading(false)
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
                    type="text"
                    value={formatCurrency(formData.registrationFee)}
                    onChange={(e) => handleCurrencyChange('registrationFee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="R$ 0,00"
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

              {/* SEÇÃO DE PREMIAÇÃO */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Premiação
                  </h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hasAwards}
                      onChange={(e) => setFormData({ ...formData, hasAwards: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Campeonato com premiação</span>
                  </label>
                </div>

                {formData.hasAwards && (
                  <div className="space-y-6">
                    {/* Tipo de Premiação */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Quantas colocações serão premiadas?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, awardType: '2' })}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.awardType === '2' 
                              ? 'border-primary-500 bg-primary-50 text-primary-700' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-lg mb-1">🥇🥈</div>
                          <div className="text-sm font-medium">1º e 2º Lugar</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, awardType: '3' })}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.awardType === '3' 
                              ? 'border-primary-500 bg-primary-50 text-primary-700' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-lg mb-1">🥇🥈🥉</div>
                          <div className="text-sm font-medium">1º, 2º e 3º Lugar</div>
                        </button>
                      </div>
                    </div>

                    {/* Campos de Premiação */}
                    <div className="space-y-4">
                      {/* 1º Lugar */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          🥇 <span className="ml-2">Prêmio 1º Lugar *</span>
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(formData.firstPlaceAward)}
                          onChange={(e) => handleCurrencyChange('firstPlaceAward', e.target.value)}
                          placeholder="R$ 0,00"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white ${
                            errors.firstPlaceAward ? 'border-red-500' : 'border-yellow-300'
                          }`}
                        />
                        {errors.firstPlaceAward && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstPlaceAward}</p>
                        )}
                      </div>

                      {/* 2º Lugar */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          🥈 <span className="ml-2">Prêmio 2º Lugar *</span>
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(formData.secondPlaceAward)}
                          onChange={(e) => handleCurrencyChange('secondPlaceAward', e.target.value)}
                          placeholder="R$ 0,00"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white ${
                            errors.secondPlaceAward ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.secondPlaceAward && (
                          <p className="text-red-500 text-sm mt-1">{errors.secondPlaceAward}</p>
                        )}
                      </div>

                      {/* 3º Lugar - só aparece se for selecionado */}
                      {formData.awardType === '3' && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            🥉 <span className="ml-2">Prêmio 3º Lugar *</span>
                          </label>
                          <input
                            type="text"
                            value={formatCurrency(formData.thirdPlaceAward)}
                            onChange={(e) => handleCurrencyChange('thirdPlaceAward', e.target.value)}
                            placeholder="R$ 0,00"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
                              errors.thirdPlaceAward ? 'border-red-500' : 'border-amber-300'
                            }`}
                          />
                          {errors.thirdPlaceAward && (
                            <p className="text-red-500 text-sm mt-1">{errors.thirdPlaceAward}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Resumo da Premiação */}
                    {(formData.firstPlaceAward || formData.secondPlaceAward || formData.thirdPlaceAward) && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-3">💰 Resumo da Premiação</h4>
                        <div className="space-y-2 text-sm">
                          {formData.firstPlaceAward && (
                            <div className="flex justify-between">
                              <span>🥇 1º Lugar:</span>
                              <span className="font-medium">{formatCurrency(formData.firstPlaceAward)}</span>
                            </div>
                          )}
                          {formData.secondPlaceAward && (
                            <div className="flex justify-between">
                              <span>🥈 2º Lugar:</span>
                              <span className="font-medium">{formatCurrency(formData.secondPlaceAward)}</span>
                            </div>
                          )}
                          {formData.awardType === '3' && formData.thirdPlaceAward && (
                            <div className="flex justify-between">
                              <span>🥉 3º Lugar:</span>
                              <span className="font-medium">{formatCurrency(formData.thirdPlaceAward)}</span>
                            </div>
                          )}
                          <div className="border-t border-blue-200 pt-2 mt-3">
                            <div className="flex justify-between font-bold text-blue-900">
                              <span>Total em Premiação:</span>
                              <span>
                                {formatCurrency(
                                  String(
                                    (parseInt(formData.firstPlaceAward) || 0) + 
                                    (parseInt(formData.secondPlaceAward) || 0) + 
                                    (formData.awardType === '3' ? (parseInt(formData.thirdPlaceAward) || 0) : 0)
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
            <div className="space-y-8">
              {/* Sistema de Pontuação */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Sistema de Pontuação
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vitória
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.pointsWin}
                        onChange={(e) => setFormData({ ...formData, pointsWin: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-8"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">pts</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.pointsDraw}
                        onChange={(e) => setFormData({ ...formData, pointsDraw: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-8"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">pts</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Derrota
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.pointsLoss}
                        onChange={(e) => setFormData({ ...formData, pointsLoss: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-8"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sistema de Cartões */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-yellow-500" />
                  Sistema de Cartões
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite Amarelos
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.yellowCardLimit}
                        onChange={(e) => setFormData({ ...formData, yellowCardLimit: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-16"
                        min="1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">jogo(s)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cartões amarelos para suspensão
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suspensão Vermelho
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.redCardSuspension}
                        onChange={(e) => setFormData({ ...formData, redCardSuspension: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-16"
                        min="1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">jogo(s)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Jogos de suspensão por cartão vermelho
                    </p>
                  </div>
                </div>
              </div>

              {/* Configurações de Partida */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Configurações de Partida
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.matchDuration}
                        onChange={(e) => setFormData({ ...formData, matchDuration: parseInt(e.target.value) || 90 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-12"
                        min="1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">min</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Duração total da partida
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tempos
                    </label>
                    <select
                      value={formData.matchPeriods}
                      onChange={(e) => setFormData({ ...formData, matchPeriods: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="1">1 tempo</option>
                      <option value="2">2 tempos</option>
                      <option value="3">3 tempos</option>
                      <option value="4">4 tempos</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Quantos períodos a partida terá
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.intervalDuration}
                        onChange={(e) => setFormData({ ...formData, intervalDuration: parseInt(e.target.value) || 15 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right pr-12"
                        min="1"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">min</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tempo de intervalo entre os tempos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Substituições
                    </label>
                    <input
                      type="number"
                      value={formData.substitutions}
                      onChange={(e) => setFormData({ ...formData, substitutions: parseInt(e.target.value) || 5 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="3"
                      max="7"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Número máximo de substituições
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prorrogação
                  </label>
                  <select
                    value={formData.extraTime}
                    onChange={(e) => setFormData({ ...formData, extraTime: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Se haverá prorrogação em caso de empate
                  </p>
                </div>
              </div>

              {/* Critérios de Desempate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
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

              {/* Regulamento Adicional */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regulamento Adicional</h3>
                
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regras Específicas
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
                        <dd className="font-medium text-gray-900">{formatCurrency(formData.registrationFee)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* SEÇÃO DE PREMIAÇÃO NA REVISÃO */}
                {formData.hasAwards && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Premiação
                    </h3>
                    <div className="space-y-2 text-sm">
                      {formData.firstPlaceAward && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">🥇 1º Lugar:</dt>
                          <dd className="font-medium text-gray-900">{formatCurrency(formData.firstPlaceAward)}</dd>
                        </div>
                      )}
                      {formData.secondPlaceAward && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">🥈 2º Lugar:</dt>
                          <dd className="font-medium text-gray-900">{formatCurrency(formData.secondPlaceAward)}</dd>
                        </div>
                      )}
                      {formData.awardType === '3' && formData.thirdPlaceAward && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">🥉 3º Lugar:</dt>
                          <dd className="font-medium text-gray-900">{formatCurrency(formData.thirdPlaceAward)}</dd>
                        </div>
                      )}
                      {(formData.firstPlaceAward || formData.secondPlaceAward || formData.thirdPlaceAward) && (
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <dt className="text-gray-600 font-medium">💰 Total:</dt>
                          <dd className="font-bold text-green-600">
                            {formatCurrency(
                              String(
                                (parseInt(formData.firstPlaceAward) || 0) + 
                                (parseInt(formData.secondPlaceAward) || 0) + 
                                (formData.awardType === '3' ? (parseInt(formData.thirdPlaceAward) || 0) : 0)
                              )
                            )}
                          </dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                  <h3 className="font-medium text-gray-900 mb-3">Regras e Configurações</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Sistema de Pontos:</dt>
                      <dd className="font-medium text-gray-900">
                        V: {formData.pointsWin} | E: {formData.pointsDraw} | D: {formData.pointsLoss}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Duração da Partida:</dt>
                      <dd className="font-medium text-gray-900">
                        {formData.matchDuration} min ({formData.matchPeriods} {formData.matchPeriods === 1 ? 'tempo' : 'tempos'})
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Intervalo:</dt>
                      <dd className="font-medium text-gray-900">{formData.intervalDuration} min</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Substituições:</dt>
                      <dd className="font-medium text-gray-900">{formData.substitutions}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Prorrogação:</dt>
                      <dd className="font-medium text-gray-900">{formData.extraTime ? 'Sim' : 'Não'}</dd>
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
                        {formData.yellowCardLimit} amarelos = suspensão | Vermelho = {formData.redCardSuspension} jogo(s)
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