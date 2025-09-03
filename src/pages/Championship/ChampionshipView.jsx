import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChampionships } from '../../context/ChampionshipsContext'
import { 
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Edit,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react'

const ChampionshipView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getChampionshipById } = useChampionships()
  const [championship, setChampionship] = useState(null)

  const [detailsOpen, setDetailsOpen] = useState(true)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [awardsOpen, setAwardsOpen] = useState(true)

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

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStats = () => {
    if (!championship) return { totalTeams: 0, registeredTeams: 0, availableSpots: 0 }
    const totalTeams = championship.groups?.reduce((total, group) => total + (group.teams || 0), 0) || 16
    const registeredTeams = championship.registeredTeams || Math.floor(totalTeams * 0.875)
    const availableSpots = totalTeams - registeredTeams
    
    return { totalTeams, registeredTeams, availableSpots }
  }

  const getDaysUntilStart = () => {
    if (!championship) return 0
    const today = new Date()
    const startDate = new Date(championship.startDate)
    const diffTime = startDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDaysUntilRegistrationDeadline = () => {
    if (!championship) return 0
    const today = new Date()
    const deadline = new Date(championship.registrationDeadline)
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const canStartChampionship = () => {
    if (!championship) return false
    const stats = getStats()
    const allTeamsRegistered = stats.registeredTeams === stats.totalTeams
    const allPaid = championship.teams?.every(team => team.paid) || false
    const allApproved = championship.teams?.every(team => team.approved) || false

    return allTeamsRegistered && allPaid && allApproved
  }

  const handleStartChampionship = () => {
    // Aqui você pode chamar uma API ou atualizar o contexto para marcar o campeonato como "em andamento"
    alert('✅ Campeonato marcado como EM ANDAMENTO!')
  }

  if (!championship) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando campeonato...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const daysUntilStart = getDaysUntilStart()
  const daysUntilDeadline = getDaysUntilRegistrationDeadline()

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/organization/championships')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{championship.name}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {championship.status === 'in_progress' ? 'Em Andamento' : 'Inscrições Abertas'}
              </span>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {championship.location || 'Local a ser definido'}
            </p>
          </div>
          <button 
            onClick={() => navigate(`/organization/championships/${id}/manage`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Botão Confirmar Início */}
      <div className="mb-6 text-right">
        <button
          onClick={handleStartChampionship}
          disabled={!canStartChampionship()}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors mx-auto
            ${canStartChampionship() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          <CheckCircle className="w-5 h-5" />
          Confirmar Início
        </button>
        {!canStartChampionship() && (
          <p className="text-sm text-gray-500 mt-2">
            É necessário que todos os times estejam confirmados, pagos e aceitos para iniciar o campeonato.
          </p>
        )}
      </div>

      {/* ... resto do código existente (cards de status, detalhes, premiação, regras, botões de ação etc.) ... */}
    </div>
  )
}

export default ChampionshipView
