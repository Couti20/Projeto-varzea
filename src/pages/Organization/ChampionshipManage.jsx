import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChampionships } from '../../context/ChampionshipsContext'
import { 
  Pencil, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Save,
  Plus,
  Trash2,
  Check,
  X,
  Eye,
  AlertCircle
} from 'lucide-react'

const ChampionshipManage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getChampionshipById, updateChampionship } = useChampionships()
  const [championship, setChampionship] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [tempValues, setTempValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState({})

  const [financialSectionOpen, setFinancialSectionOpen] = useState(true)
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [groupsOpen, setGroupsOpen] = useState(true)
  const [awardsOpen, setAwardsOpen] = useState(true)
  const [rulesOpen, setRulesOpen] = useState(false)

  useEffect(() => {
    if (id) {
      const championshipData = getChampionshipById(parseInt(id))
      if (championshipData) {
        setChampionship(championshipData)
      } else {
        navigate('/organization/championships')
      }
    }
  }, [id, getChampionshipById, navigate])

  const formatCurrency = (valueInCents) => {
    if (!valueInCents) return 'Gratuito'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valueInCents / 100)
  }

  const handleCurrencyChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue;
  };

  const formatCurrencyInput = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/\D/g, '');
    if (numericValue === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue / 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const validateField = (field, value) => {
    const fieldErrors = {}

    switch (field) {
      case 'name':
        if (!value || value.trim().length < 3) {
          fieldErrors.name = 'Nome deve ter pelo menos 3 caracteres'
        }
        break
      case 'description':
        if (!value || value.trim().length < 10) {
          fieldErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
        }
        break
      case 'startDate':
        if (!value) {
          fieldErrors.startDate = 'Data de início é obrigatória'
        }
        break
      case 'endDate':
        if (!value) {
          fieldErrors.endDate = 'Data de término é obrigatória'
        } else if (tempValues.startDate && value <= tempValues.startDate) {
          fieldErrors.endDate = 'Data de término deve ser posterior à data de início'
        }
        break
      case 'registrationDeadline':
        if (!value) {
          fieldErrors.registrationDeadline = 'Prazo de inscrição é obrigatório'
        } else if (tempValues.startDate && value >= tempValues.startDate) {
          fieldErrors.registrationDeadline = 'Prazo deve ser anterior ao início do campeonato'
        }
        break
      case 'registrationFee':
        if (value && isNaN(value)) {
          fieldErrors.registrationFee = 'Valor inválido'
        }
        break
    }

    return fieldErrors
  }

  const startEditing = (field, currentValue) => {
    setEditingField(field)
    setErrors({})
    
    if (field === 'startDate' || field === 'endDate' || field === 'registrationDeadline') {
      setTempValues({ 
        ...tempValues,
        [field]: formatDateForInput(currentValue),
        startDate: tempValues.startDate || formatDateForInput(championship.startDate),
        endDate: tempValues.endDate || formatDateForInput(championship.endDate),
        registrationDeadline: tempValues.registrationDeadline || formatDateForInput(championship.registrationDeadline)
      })
    } else if (field === 'registrationFee') {
      setTempValues({ [field]: currentValue?.toString() || '0' })
    } else {
      setTempValues({ [field]: currentValue })
    }
  }

  const startEditingAward = (position, currentValue) => {
    setEditingField(`award_${position}`)
    setTempValues({ [`award_${position}`]: currentValue?.toString() || '0' })
    setErrors({})
  }

  const cancelEditing = () => {
    setEditingField(null)
    setTempValues({})
    setErrors({})
  }

  const saveField = async (field) => {
    const value = tempValues[field]
    const fieldErrors = validateField(field, value)
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    
    try {
      // Simular salvamento
      setTimeout(() => {
        let processedValue = value

        // Processar valores especiais
        if (field === 'registrationFee') {
          processedValue = parseInt(handleCurrencyChange(value)) || 0
        }
        
        const updatedData = { [field]: processedValue }
        updateChampionship(parseInt(id), updatedData)
        
        // Atualizar estado local
        setChampionship(prev => ({ ...prev, [field]: processedValue }))
        
        setEditingField(null)
        setTempValues({})
        setErrors({})
        setSuccessMessage(`${getFieldLabel(field)} atualizado com sucesso!`)
        setLoading(false)
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => setSuccessMessage(''), 3000)
      }, 800)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setLoading(false)
    }
  }

  const saveAward = async (position) => {
    const value = tempValues[`award_${position}`]
    const numericValue = parseInt(handleCurrencyChange(value)) || 0
    
    setLoading(true)
    
    try {
      setTimeout(() => {
        const updatedAwards = {
          ...championship.awards,
          [position]: numericValue
        }
        
        // Recalcular total
        updatedAwards.total = (updatedAwards.firstPlace || 0) + 
                             (updatedAwards.secondPlace || 0) + 
                             (updatedAwards.thirdPlace || 0)
        
        const updatedData = { awards: updatedAwards }
        updateChampionship(parseInt(id), updatedData)
        
        setChampionship(prev => ({ ...prev, awards: updatedAwards }))
        
        setEditingField(null)
        setTempValues({})
        setSuccessMessage('Premiação atualizada com sucesso!')
        setLoading(false)
        
        setTimeout(() => setSuccessMessage(''), 3000)
      }, 800)
    } catch (error) {
      console.error('Erro ao salvar premiação:', error)
      setLoading(false)
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Nome',
      description: 'Descrição',
      startDate: 'Data de início',
      endDate: 'Data de término',
      registrationDeadline: 'Prazo de inscrição',
      registrationFee: 'Taxa de inscrição'
    }
    return labels[field] || field
  }

  const addGroup = () => {
    if (!championship.groups) return
    
    const newGroupId = Math.max(...championship.groups.map(g => g.id)) + 1
    const groupLetter = String.fromCharCode(65 + championship.groups.length)
    
    const newGroup = {
      id: newGroupId,
      name: `Grupo ${groupLetter}`,
      teams: 4,
      classifyCount: 2
    }
    
    const updatedGroups = [...championship.groups, newGroup]
    updateChampionship(parseInt(id), { groups: updatedGroups })
    setChampionship(prev => ({ ...prev, groups: updatedGroups }))
  }

  const removeGroup = (groupId) => {
    if (championship.groups.length <= 1) return
    
    const updatedGroups = championship.groups.filter(g => g.id !== groupId)
    updateChampionship(parseInt(id), { groups: updatedGroups })
    setChampionship(prev => ({ ...prev, groups: updatedGroups }))
  }

  const updateGroup = (groupId, field, value) => {
    const updatedGroups = championship.groups.map(g => 
      g.id === groupId ? { ...g, [field]: value } : g
    )
    updateChampionship(parseInt(id), { groups: updatedGroups })
    setChampionship(prev => ({ ...prev, groups: updatedGroups }))
  }

  const getStats = () => {
    if (!championship) return { totalTeams: 0, registeredTeams: 0, confirmedPayments: 0 }
    
    const totalTeams = championship.groups?.reduce((total, group) => total + (group.teams || 0), 0) || 16
    const registeredTeams = Math.floor(totalTeams * 0.875)
    const confirmedPayments = Math.floor(registeredTeams * 0.857)
    
    return { totalTeams, registeredTeams, confirmedPayments }
  }

  const stats = getStats()

  if (!championship) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando campeonato...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <Check className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/organization/championships')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
            <p className="text-gray-600">Painel de gerenciamento e edição</p>
          </div>
          <button
            onClick={() => navigate(`/organization/championships/${id}/view`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </button>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => setBasicInfoOpen(!basicInfoOpen)}
        >
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="text-green-600">📋</span>
            Informações Básicas
          </h3>
          {basicInfoOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {basicInfoOpen && (
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome - Editável */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Nome do Campeonato</span>
                  {editingField !== 'name' && (
                    <button 
                      onClick={() => startEditing('name', championship.name)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'name' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempValues.name || ''}
                        onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      <button 
                        onClick={() => saveField('name')}
                        disabled={loading}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.name && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{championship.name}</p>
                )}
              </div>
              
              <div>
                <span className="text-gray-600 font-medium">Status</span>
                <p className="text-green-600 font-semibold">Inscrições Abertas</p>
              </div>
            </div>

            {/* Descrição - Editável */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">Descrição</span>
                {editingField !== 'description' && (
                  <button 
                    onClick={() => startEditing('description', championship.description)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingField === 'description' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValues.description || ''}
                    onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => saveField('description')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed mt-2">
                  {championship.description || 'Nenhuma descrição adicionada'}
                </p>
              )}
            </div>

            {/* Datas - Editáveis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Data de Início */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 font-medium">Data de Início</span>
                  {editingField !== 'startDate' && (
                    <button 
                      onClick={() => startEditing('startDate', championship.startDate)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'startDate' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={tempValues.startDate || ''}
                        onChange={(e) => setTempValues({ ...tempValues, startDate: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.startDate ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      <button 
                        onClick={() => saveField('startDate')}
                        disabled={loading}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.startDate && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatDate(championship.startDate)}
                  </p>
                )}
              </div>

              {/* Data de Término */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 font-medium">Data de Término</span>
                  {editingField !== 'endDate' && (
                    <button 
                      onClick={() => startEditing('endDate', championship.endDate)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'endDate' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={tempValues.endDate || ''}
                        onChange={(e) => setTempValues({ ...tempValues, endDate: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.endDate ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      <button 
                        onClick={() => saveField('endDate')}
                        disabled={loading}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.endDate && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatDate(championship.endDate)}
                  </p>
                )}
              </div>

              {/* Prazo de Inscrição */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 font-medium">Prazo de Inscrição</span>
                  {editingField !== 'registrationDeadline' && (
                    <button 
                      onClick={() => startEditing('registrationDeadline', championship.registrationDeadline)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'registrationDeadline' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={tempValues.registrationDeadline || ''}
                        onChange={(e) => setTempValues({ ...tempValues, registrationDeadline: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.registrationDeadline ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      <button 
                        onClick={() => saveField('registrationDeadline')}
                        disabled={loading}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.registrationDeadline && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.registrationDeadline}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    {formatDate(championship.registrationDeadline)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regras e Regulamento - Editável */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => setRulesOpen(!rulesOpen)}
        >
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="text-red-600">📋</span>
            Regras e Regulamento
          </h3>
          {rulesOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {rulesOpen && (
          <div className="px-6 pb-6">
            {/* Regras Gerais */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Regras Gerais</h4>
                {editingField !== 'generalRules' && (
                  <button 
                    onClick={() => startEditing('generalRules', championship.rules?.general?.join('\n') || '')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingField === 'generalRules' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValues.generalRules || ''}
                    onChange={(e) => setTempValues({ ...tempValues, generalRules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={6}
                    placeholder="Digite as regras gerais, uma por linha"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const rules = tempValues.generalRules.split('\n').filter(rule => rule.trim());
                        const updatedData = { 
                          rules: { 
                            ...championship.rules, 
                            general: rules 
                          } 
                        };
                        updateChampionship(parseInt(id), updatedData);
                        setChampionship(prev => ({ ...prev, ...updatedData }));
                        setEditingField(null);
                        setTempValues({});
                        setSuccessMessage('Regras gerais atualizadas!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {championship.rules?.general?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {championship.rules.general.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma regra geral adicionada</p>
                  )}
                </div>
              )}
            </div>

            {/* Formato da Competição */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Formato da Competição</h4>
                {editingField !== 'formatRules' && (
                  <button 
                    onClick={() => startEditing('formatRules', championship.rules?.format?.join('\n') || '')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingField === 'formatRules' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValues.formatRules || ''}
                    onChange={(e) => setTempValues({ ...tempValues, formatRules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder="Digite as regras do formato, uma por linha"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const rules = tempValues.formatRules.split('\n').filter(rule => rule.trim());
                        const updatedData = { 
                          rules: { 
                            ...championship.rules, 
                            format: rules 
                          } 
                        };
                        updateChampionship(parseInt(id), updatedData);
                        setChampionship(prev => ({ ...prev, ...updatedData }));
                        setEditingField(null);
                        setTempValues({});
                        setSuccessMessage('Regras de formato atualizadas!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {championship.rules?.format?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {championship.rules.format.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma regra de formato adicionada</p>
                  )}
                </div>
              )}
            </div>

            {/* Regras de Pagamento */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Regras de Pagamento</h4>
                {editingField !== 'paymentRules' && (
                  <button 
                    onClick={() => startEditing('paymentRules', championship.rules?.payment?.join('\n') || '')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingField === 'paymentRules' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValues.paymentRules || ''}
                    onChange={(e) => setTempValues({ ...tempValues, paymentRules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    placeholder="Digite as regras de pagamento, uma por linha"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const rules = tempValues.paymentRules.split('\n').filter(rule => rule.trim());
                        const updatedData = { 
                          rules: { 
                            ...championship.rules, 
                            payment: rules 
                          } 
                        };
                        updateChampionship(parseInt(id), updatedData);
                        setChampionship(prev => ({ ...prev, ...updatedData }));
                        setEditingField(null);
                        setTempValues({});
                        setSuccessMessage('Regras de pagamento atualizadas!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {championship.rules?.payment?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {championship.rules.payment.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma regra de pagamento adicionada</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Configuração de Grupos */}
      {championship.groups && championship.groups.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => setGroupsOpen(!groupsOpen)}
          >
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">👥</span>
              Configuração de Grupos
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {championship.groups.length} grupos | {stats.totalTeams} times
              </span>
            </h3>
            {groupsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {groupsOpen && (
            <div className="px-6 pb-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Formato do Campeonato</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-900 font-semibold">
                  {championship.format === 'groups_only' && 'Apenas Grupos'}
                  {championship.format === 'knockout_only' && 'Apenas Mata-Mata'}  
                  {championship.format === 'groups_knockout' && 'Grupos + Mata-Mata'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Grupos e Classificação</h4>
                  <button 
                    onClick={addGroup}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Grupo
                  </button>
                </div>
                
                {championship.groups.map((group) => (
                  <div key={group.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                        className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Times
                        </label>
                        <input
                          type="number"
                          value={group.teams}
                          onChange={(e) => updateGroup(group.id, 'teams', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Times que Classificam
                        </label>
                        <input
                          type="number"
                          value={group.classifyCount}
                          onChange={(e) => updateGroup(group.id, 'classifyCount', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1"
                          max={group.teams - 1}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informações Financeiras */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => setFinancialSectionOpen(!financialSectionOpen)}
        >
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="text-green-600">💰</span>
            Informações Financeiras
          </h3>
          {financialSectionOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {financialSectionOpen && (
          <div className="px-6 pb-6">
            {/* Taxa de Inscrição - Editável */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Taxa de Inscrição</span>
                  {editingField !== 'registrationFee' && (
                    <button 
                      onClick={() => startEditing('registrationFee', championship.registrationFee)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'registrationFee' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formatCurrencyInput(tempValues.registrationFee) || ''}
                        onChange={(e) => setTempValues({ ...tempValues, registrationFee: handleCurrencyChange(e.target.value) })}
                        placeholder="R$ 0,00"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.registrationFee ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      <button 
                        onClick={() => saveField('registrationFee')}
                        disabled={loading}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.registrationFee && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.registrationFee}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    {formatCurrency(championship.registrationFee)}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Prazo de Pagamento</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDate(championship.feeDeadline)}
                </p>
              </div>
            </div>

            {/* Premiação - Editável */}
            {championship.awards && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Premiação
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1º Lugar - Editável */}
                  {championship.awards.firstPlace > 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center relative">
                      {editingField !== 'award_firstPlace' && (
                        <button 
                          onClick={() => startEditingAward('firstPlace', championship.awards.firstPlace)}
                          className="absolute top-2 right-2 p-1 text-yellow-600 hover:text-yellow-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-3xl mb-2">🥇</div>
                      <div className="text-yellow-700 font-medium mb-1">1º Lugar</div>
                      {editingField === 'award_firstPlace' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formatCurrencyInput(tempValues.award_firstPlace) || ''}
                            onChange={(e) => setTempValues({ ...tempValues, award_firstPlace: handleCurrencyChange(e.target.value) })}
                            placeholder="R$ 0,00"
                            className="w-full px-2 py-1 border border-yellow-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => saveAward('firstPlace')}
                              disabled={loading}
                              className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-yellow-800">
                          {formatCurrency(championship.awards.firstPlace)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2º Lugar - Editável */}
                  {championship.awards.secondPlace > 0 && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center relative">
                      {editingField !== 'award_secondPlace' && (
                        <button 
                          onClick={() => startEditingAward('secondPlace', championship.awards.secondPlace)}
                          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-3xl mb-2">🥈</div>
                      <div className="text-gray-700 font-medium mb-1">2º Lugar</div>
                      {editingField === 'award_secondPlace' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formatCurrencyInput(tempValues.award_secondPlace) || ''}
                            onChange={(e) => setTempValues({ ...tempValues, award_secondPlace: handleCurrencyChange(e.target.value) })}
                            placeholder="R$ 0,00"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                          />
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => saveAward('secondPlace')}
                              disabled={loading}
                              className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(championship.awards.secondPlace)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3º Lugar - Editável */}
                  {championship.awards.thirdPlace > 0 && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center relative">
                      {editingField !== 'award_thirdPlace' && (
                        <button 
                          onClick={() => startEditingAward('thirdPlace', championship.awards.thirdPlace)}
                          className="absolute top-2 right-2 p-1 text-amber-600 hover:text-amber-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-3xl mb-2">🥉</div>
                      <div className="text-amber-700 font-medium mb-1">3º Lugar</div>
                      {editingField === 'award_thirdPlace' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formatCurrencyInput(tempValues.award_thirdPlace) || ''}
                            onChange={(e) => setTempValues({ ...tempValues, award_thirdPlace: handleCurrencyChange(e.target.value) })}
                            placeholder="R$ 0,00"
                            className="w-full px-2 py-1 border border-amber-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => saveAward('thirdPlace')}
                              disabled={loading}
                              className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-amber-800">
                          {formatCurrency(championship.awards.thirdPlace)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Total da Premiação */}
                {championship.awards.total > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">💰 Total em Premiação:</span>
                      <span className="text-2xl font-bold text-green-800">
                        {formatCurrency(championship.awards.total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status de Pagamentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalTeams}
                </div>
                <div className="text-blue-700 font-medium">Total de Times</div>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {stats.registeredTeams}
                </div>
                <div className="text-yellow-700 font-medium">Times Inscritos</div>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.confirmedPayments}
                </div>
                <div className="text-green-700 font-medium">Pagamentos Confirmados</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between">
        <button 
          onClick={() => navigate(`/organization/championships/${id}/view`)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Modo Visualização
        </button>

        <div className="flex space-x-4">
          <button 
            onClick={() => navigate(`/organization/championships/${id}/tables`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Ver Tabelas
          </button>
          <button 
            onClick={() => navigate(`/organization/championships/${id}/teams`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Gerenciar Times
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChampionshipManage