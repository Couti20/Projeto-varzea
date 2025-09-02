import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  ArrowLeft,
  Settings,
  Users,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  StopCircle,
  Edit,
  Save,
  X,
  ChevronRight,
  Lock,
  Unlock,
  Bell,
  Mail,
  MessageSquare,
  BarChart,
  Target,
  Flag,
  Clock
} from 'lucide-react'

const ChampionshipManage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [championship, setChampionship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [editingField, setEditingField] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(null)

  // Mock data - será substituído pela API
  useEffect(() => {
    setTimeout(() => {
      setChampionship({
        id: id,
        name: 'Campeonato Várzea 2025',
        description: 'O maior campeonato de futebol amador da região',
        status: 'active',
        phase: 'groups',
        startDate: '2025-09-15',
        endDate: '2025-12-20',
        registrationDeadline: '2025-09-10',
        
        // Estatísticas
        stats: {
          totalTeams: 16,
          registeredTeams: 14,
          totalMatches: 48,
          playedMatches: 12,
          totalGoals: 42,
          yellowCards: 18,
          redCards: 2,
          avgGoalsPerMatch: 3.5
        },
        
        // Configurações
        settings: {
          registrationOpen: false,
          allowSubstitutions: true,
          maxSubstitutions: 5,
          matchDuration: 90,
          halfTimeDuration: 15,
          extraTime: false,
          penalties: true,
          yellowCardLimit: 3,
          redCardSuspension: 1,
          pointsWin: 3,
          pointsDraw: 1,
          pointsLoss: 0
        },
        
        // Fases
        phases: [
          { 
            id: 1, 
            name: 'Fase de Grupos', 
            status: 'active',
            startDate: '2025-09-15',
            endDate: '2025-10-30',
            progress: 25
          },
          { 
            id: 2, 
            name: 'Oitavas de Final', 
            status: 'pending',
            startDate: '2025-11-05',
            endDate: '2025-11-15',
            progress: 0
          },
          { 
            id: 3, 
            name: 'Quartas de Final', 
            status: 'pending',
            startDate: '2025-11-20',
            endDate: '2025-11-25',
            progress: 0
          },
          { 
            id: 4, 
            name: 'Semifinal', 
            status: 'pending',
            startDate: '2025-12-05',
            endDate: '2025-12-10',
            progress: 0
          },
          { 
            id: 5, 
            name: 'Final', 
            status: 'pending',
            startDate: '2025-12-20',
            endDate: '2025-12-20',
            progress: 0
          }
        ],
        
        // Notificações
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          appEnabled: true,
          sendMatchReminders: true,
          sendResultUpdates: true,
          sendImportantNews: true
        },
        
        // Finanças
        finances: {
          registrationFee: 150,
          totalRevenue: 2100,
          totalExpenses: 800,
          balance: 1300,
          paidTeams: 14,
          pendingPayments: 0
        },
        
        // Próximos jogos
        upcomingMatches: [
          {
            id: 1,
            homeTeam: 'Real Várzea FC',
            awayTeam: 'Milan da Vila',
            date: '2025-09-29',
            time: '10:00',
            field: 'Campo Principal'
          },
          {
            id: 2,
            homeTeam: 'Barcelona da Quebrada',
            awayTeam: 'Juventus do Bairro',
            date: '2025-09-29',
            time: '14:00',
            field: 'Campo 2'
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [id])

  // Funções de gerenciamento
  const updateChampionshipStatus = (newStatus) => {
    setChampionship({ ...championship, status: newStatus })
    setShowConfirmModal(null)
  }

  const toggleRegistration = () => {
    setChampionship({
      ...championship,
      settings: {
        ...championship.settings,
        registrationOpen: !championship.settings.registrationOpen
      }
    })
  }

  const updateSetting = (field, value) => {
    setChampionship({
      ...championship,
      settings: {
        ...championship.settings,
        [field]: value
      }
    })
    setEditingField(null)
  }

  const updateNotification = (field) => {
    setChampionship({
      ...championship,
      notifications: {
        ...championship.notifications,
        [field]: !championship.notifications[field]
      }
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'finished': return 'text-gray-600 bg-gray-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPhaseStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/organization/championships`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(championship.status)}`}>
              {championship.status === 'active' ? 'Em Andamento' : 
               championship.status === 'paused' ? 'Pausado' :
               championship.status === 'finished' ? 'Finalizado' : 'Cancelado'}
            </span>
          </div>
          <p className="text-gray-600">Painel de Controle e Gerenciamento</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          {championship.status === 'active' && (
            <button
              onClick={() => setShowConfirmModal('pause')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
            >
              <Pause className="w-4 h-4" />
              Pausar Campeonato
            </button>
          )}
          
          {championship.status === 'paused' && (
            <button
              onClick={() => setShowConfirmModal('resume')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
            >
              <Play className="w-4 h-4" />
              Retomar Campeonato
            </button>
          )}
          
          <button
            onClick={toggleRegistration}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${
              championship.settings.registrationOpen
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {championship.settings.registrationOpen ? (
              <>
                <Lock className="w-4 h-4" />
                Fechar Inscrições
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Abrir Inscrições
              </>
            )}
          </button>
          
          <button
            onClick={() => navigate(`/organization/championships/${id}/tables`)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
          >
            <BarChart className="w-4 h-4" />
            Ver Tabelas
          </button>
          
          <button
            onClick={() => navigate(`/organization/championships/${id}/teams`)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Users className="w-4 h-4" />
            Gerenciar Times
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="text-xs text-gray-500">Times</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {championship.stats.registeredTeams}/{championship.stats.totalTeams}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-5 h-5 text-green-500" />
                <span className="text-xs text-gray-500">Jogos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {championship.stats.playedMatches}/{championship.stats.totalMatches}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-500">Gols</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {championship.stats.totalGoals}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <BarChart className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-gray-500">Média</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {championship.stats.avgGoalsPerMatch}
              </p>
            </div>
          </div>

          {/* Phases Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fases do Campeonato</h3>
            <div className="space-y-4">
              {championship.phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      {getPhaseStatusIcon(phase.status)}
                      {index < championship.phases.length - 1 && (
                        <div className={`w-0.5 h-16 mt-2 ${
                          phase.status === 'completed' ? 'bg-blue-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{phase.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(phase.startDate).toLocaleDateString('pt-BR')} - 
                          {new Date(phase.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {phase.status === 'active' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progresso</span>
                            <span className="text-gray-900 font-medium">{phase.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all"
                              style={{ width: `${phase.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Campeonato</h3>
            
            <div className="space-y-4">
              {/* Pontuação */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sistema de Pontuação</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Vitória</span>
                    {editingField === 'pointsWin' ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          defaultValue={championship.settings.pointsWin}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          id="pointsWin"
                        />
                        <button
                          onClick={() => {
                            const value = document.getElementById('pointsWin').value
                            updateSetting('pointsWin', parseInt(value))
                          }}
                          className="p-1 text-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="p-1 text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{championship.settings.pointsWin}</span>
                        <button
                          onClick={() => setEditingField('pointsWin')}
                          className="p-0.5 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Empate</span>
                    <span className="font-semibold text-gray-900">{championship.settings.pointsDraw}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Derrota</span>
                    <span className="font-semibold text-gray-900">{championship.settings.pointsLoss}</span>
                  </div>
                </div>
              </div>

              {/* Cartões */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sistema de Cartões</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Limite Amarelos</span>
                    <span className="font-semibold text-gray-900">{championship.settings.yellowCardLimit}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Suspensão Vermelho</span>
                    <span className="font-semibold text-gray-900">{championship.settings.redCardSuspension} jogo(s)</span>
                  </div>
                </div>
              </div>

              {/* Partidas */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Configurações de Partida</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Duração</span>
                    <span className="font-semibold text-gray-900">{championship.settings.matchDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Intervalo</span>
                    <span className="font-semibold text-gray-900">{championship.settings.halfTimeDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Substituições</span>
                    <span className="font-semibold text-gray-900">{championship.settings.maxSubstitutions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Prorrogação</span>
                    <span className={`font-semibold ${championship.settings.extraTime ? 'text-green-600' : 'text-red-600'}`}>
                      {championship.settings.extraTime ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notifications and Finance */}
        <div className="space-y-6">
          {/* Upcoming Matches */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Jogos</h3>
            <div className="space-y-3">
              {championship.upcomingMatches.map(match => (
                <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(match.date).toLocaleDateString('pt-BR')} - {match.time}
                    </span>
                    <span className="text-xs text-primary-600 font-medium">
                      {match.field}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">{match.homeTeam}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="font-medium text-gray-900">{match.awayTeam}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de Inscrição</span>
                <span className="font-semibold text-gray-900">R$ {championship.finances.registrationFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Times Pagos</span>
                <span className="font-semibold text-green-600">{championship.finances.paidTeams}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Receita Total</span>
                <span className="font-semibold text-green-600">R$ {championship.finances.totalRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Despesas</span>
                <span className="font-semibold text-red-600">R$ {championship.finances.totalExpenses}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Saldo</span>
                  <span className="text-lg font-bold text-primary-600">R$ {championship.finances.balance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">E-mail</span>
                </div>
                <input
                  type="checkbox"
                  checked={championship.notifications.emailEnabled}
                  onChange={() => updateNotification('emailEnabled')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={championship.notifications.smsEnabled}
                  onChange={() => updateNotification('smsEnabled')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">App</span>
                </div>
                <input
                  type="checkbox"
                  checked={championship.notifications.appEnabled}
                  onChange={() => updateNotification('appEnabled')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Lembretes de Jogos</span>
                  <input
                    type="checkbox"
                    checked={championship.notifications.sendMatchReminders}
                    onChange={() => updateNotification('sendMatchReminders')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Resultados</span>
                  <input
                    type="checkbox"
                    checked={championship.notifications.sendResultUpdates}
                    onChange={() => updateNotification('sendResultUpdates')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Avisos Importantes</span>
                  <input
                    type="checkbox"
                    checked={championship.notifications.sendImportantNews}
                    onChange={() => updateNotification('sendImportantNews')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Zona de Perigo</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowConfirmModal('cancel')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancelar Campeonato
              </button>
              <p className="text-xs text-red-700 text-center">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {showConfirmModal === 'pause' && 'Pausar Campeonato'}
                {showConfirmModal === 'resume' && 'Retomar Campeonato'}
                {showConfirmModal === 'cancel' && 'Cancelar Campeonato'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {showConfirmModal === 'pause' && 'Tem certeza que deseja pausar o campeonato? Todos os jogos serão suspensos temporariamente.'}
              {showConfirmModal === 'resume' && 'Tem certeza que deseja retomar o campeonato?'}
              {showConfirmModal === 'cancel' && 'ATENÇÃO: Esta ação é irreversível! O campeonato será permanentemente cancelado.'}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (showConfirmModal === 'pause') updateChampionshipStatus('paused')
                  if (showConfirmModal === 'resume') updateChampionshipStatus('active')
                  if (showConfirmModal === 'cancel') updateChampionshipStatus('cancelled')
                }}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  showConfirmModal === 'cancel' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChampionshipManage