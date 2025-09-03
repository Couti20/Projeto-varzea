// src/pages/Organization/UnifiedChampionshipDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  Calendar, 
  BarChart3,
  Trophy,
  Target,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Share2,
  Download,
  RefreshCw,
  Bell,
  Eye,
  Edit,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useChampionshipHelpers } from '../../utils/championshipHelpers';
import { useStatisticsCalculator } from '../../utils/statisticsCalculator';
import MatchGeneration from '../../components/championship/MatchGeneration';

const UnifiedChampionshipDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const helpers = useChampionshipHelpers();
  
  // States
  const [loading, setLoading] = useState(true);
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMatchGeneration, setShowMatchGeneration] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock data completo
  useEffect(() => {
    setTimeout(() => {
      const mockChampionship = {
        id: 1,
        name: 'Copa da Várzea 2025',
        season: '2025',
        format: 'league',
        status: 'active',
        maxTeams: 16,
        startDate: '2025-01-15T00:00:00Z',
        endDate: '2025-06-15T00:00:00Z',
        registrationFee: 150,
        registrationDeadline: '2025-02-01T23:59:59Z',
        description: 'Campeonato de pontos corridos entre os times da várzea paulistana',
        settings: {
          pointsWin: 3,
          pointsDraw: 1,
          pointsLoss: 0,
          matchDuration: 90
        }
      };
      setChampionship(mockChampionship);

      const mockTeams = [
        {
          id: 1, clubId: 101, name: 'FC Barcelona do Bairro', shortName: 'BAR', logo: '🔵',
          captain: 'João Silva', phone: '(11) 99999-0001', email: 'barcelona@email.com',
          players: 18, status: 'confirmed', paymentStatus: 'paid',
          enrolledAt: '2025-01-10T10:00:00Z', neighborhood: 'Vila Madalena'
        },
        {
          id: 2, clubId: 102, name: 'Real Periferia', shortName: 'REA', logo: '⚪',
          captain: 'Pedro Santos', phone: '(11) 99999-0002', email: 'real@email.com',
          players: 16, status: 'confirmed', paymentStatus: 'paid',
          enrolledAt: '2025-01-12T14:30:00Z', neighborhood: 'Cidade Tiradentes'
        },
        {
          id: 3, clubId: 103, name: 'Santos da Quebrada', shortName: 'SAN', logo: '⚫',
          captain: 'Carlos Oliveira', phone: '(11) 99999-0003', email: 'santos@email.com',
          players: 20, status: 'confirmed', paymentStatus: 'paid',
          enrolledAt: '2025-01-08T16:45:00Z', neighborhood: 'Capão Redondo'
        },
        {
          id: 4, clubId: 104, name: 'Palmeiras da Vila', shortName: 'PAL', logo: '🟢',
          captain: 'Luis Fernando', phone: '(11) 99999-0004', email: 'palmeiras@email.com',
          players: 15, status: 'pending', paymentStatus: 'pending',
          enrolledAt: '2025-01-15T09:20:00Z', neighborhood: 'Vila Olímpia'
        }
      ];
      setTeams(mockTeams);

      const mockMatches = [
        {
          id: 1, round: 1, homeTeamId: 1, awayTeamId: 2,
          scoreHome: 2, scoreAway: 1, status: 'finished',
          date: '2025-01-20T15:00:00Z', venue: 'Campo da Vila',
          goals: [
            { playerId: 101, playerName: 'João Silva', teamId: 1, minute: 15, type: 'goal' },
            { playerId: 102, playerName: 'Pedro Santos', teamId: 2, minute: 32, type: 'goal' },
            { playerId: 103, playerName: 'Carlos Lima', teamId: 1, minute: 78, type: 'goal' }
          ]
        },
        {
          id: 2, round: 1, homeTeamId: 3, awayTeamId: 4,
          scoreHome: null, scoreAway: null, status: 'scheduled',
          date: '2025-02-15T17:00:00Z', venue: 'Campo Central'
        },
        {
          id: 3, round: 2, homeTeamId: 2, awayTeamId: 3,
          scoreHome: null, scoreAway: null, status: 'scheduled',
          date: '2025-02-22T15:00:00Z', venue: 'Campo do Bairro'
        }
      ];
      setMatches(mockMatches);

      // Gerar notificações
      const generatedNotifications = helpers.notifications.generateNotifications(
        mockChampionship, 
        mockTeams, 
        mockMatches
      );
      setNotifications(generatedNotifications);

      setLoading(false);
    }, 1000);
  }, [id]);

  // Calculadora de estatísticas
  const statistics = useStatisticsCalculator(teams, matches, championship);

  // Dados calculados com cache
  const dashboardData = useMemo(() => {
    if (!championship || teams.length === 0) return null;
    
    return helpers.performance.getCachedData(
      `dashboard-${championship.id}`,
      () => ({
        standings: statistics.calculateStandings(),
        topScorers: statistics.calculateTopScorers(),
        generalStats: statistics.calculateGeneralStats(),
        recentMatches: matches
          .filter(m => m.status === 'finished')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5),
        upcomingMatches: matches
          .filter(m => m.status === 'scheduled')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5)
      }),
      2 * 60 * 1000 // Cache por 2 minutos
    );
  }, [championship, teams, matches]);

  // Ações disponíveis
  const availableActions = championship ? 
    helpers.navigation.getAvailableActions(championship, teams, matches) : [];

  // Status do campeonato
  const championshipStatus = championship ? 
    helpers.formatters.formatChampionshipStatus(championship.status) : null;

  // Executar ação
  const executeAction = (action) => {
    switch (action.key) {
      case 'publish':
        // Abrir inscrições
        setChampionship(prev => ({ ...prev, status: 'open' }));
        break;
      case 'start':
        // Iniciar campeonato
        setChampionship(prev => ({ ...prev, status: 'active' }));
        break;
      case 'generate_matches':
        setShowMatchGeneration(true);
        break;
      default:
        if (action.route) {
          const routes = helpers.navigation.getChampionshipRoutes(championship.id);
          navigate(routes[action.route]);
        }
    }
  };

  // Compartilhar campeonato
  const handleShare = (type = 'general') => {
    const shareData = helpers.sharing.generateShareData(championship, teams, matches, dashboardData?.standings);
    
    if (type === 'whatsapp') {
      helpers.sharing.shareWhatsApp(championship, {
        type: 'standings',
        standings: dashboardData?.standings
      });
    } else {
      helpers.sharing.shareLink(championship);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (showMatchGeneration) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowMatchGeneration(false)}
            className="mb-4"
          >
            ← Voltar ao Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerar Jogos - {championship.name}
          </h1>
        </div>
        
        <MatchGeneration
          championship={championship}
          teams={teams.filter(t => t.status === 'confirmed')}
          onGenerate={(generatedMatches) => {
            setMatches(prev => [...prev, ...generatedMatches]);
            setShowMatchGeneration(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/organization/championships')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <span>{championship.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${championshipStatus.bg} ${championshipStatus.text}`}>
                    {championshipStatus.label}
                  </span>
                </h1>
                <p className="text-gray-600">
                  {helpers.formatters.formatChampionshipFormat(championship.format)} • 
                  Temporada {championship.season} • 
                  {teams.length} time(s) inscrito(s)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {notifications.length > 0 && (
                <div className="relative">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                    <span className="ml-2">{notifications.length}</span>
                  </Button>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {availableActions.map(action => {
              const IconComponent = {
                Edit, Settings, Users, Calendar, BarChart3, Trophy, Eye, Play
              }[action.icon] || Settings;
              
              return (
                <Button
                  key={action.key}
                  onClick={() => executeAction(action)}
                  variant={action.key === 'start' || action.key === 'publish' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
            
            {championship.status === 'active' && (
              <Button
                onClick={() => setShowMatchGeneration(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Gerar Jogos</span>
              </Button>
            )}
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Estatísticas Principais */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
                <div className="text-sm text-gray-600">Times Inscritos</div>
                <div className="text-xs text-gray-500">
                  de {championship.maxTeams} máximo
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {teams.filter(t => t.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmados</div>
                <div className="text-xs text-gray-500">
                  {helpers.formatters.formatProgress(
                    teams.filter(t => t.status === 'confirmed').length,
                    teams.length
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardData?.generalStats?.finishedMatches || 0}
                </div>
                <div className="text-sm text-gray-600">Jogos Realizados</div>
                <div className="text-xs text-gray-500">
                  de {dashboardData?.generalStats?.totalMatches || 0}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData?.generalStats?.totalGoals || 0}
                </div>
                <div className="text-sm text-gray-600">Gols Marcados</div>
                <div className="text-xs text-gray-500">
                  Média: {dashboardData?.generalStats?.averageGoals || 0} por jogo
                </div>
              </div>
            </div>

            {/* Classificação Atual */}
            {dashboardData?.standings && dashboardData.standings.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Classificação Atual
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(helpers.navigation.getChampionshipRoutes(championship.id).tables)}
                    >
                      Ver Completa
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {dashboardData.standings.slice(0, 6).map((team, index) => (
                      <div key={team.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        index < 2 ? 'bg-green-50' : 
                        index >= dashboardData.standings.length - 2 ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-200 text-yellow-800' :
                            index === 1 ? 'bg-gray-200 text-gray-800' :
                            index === 2 ? 'bg-orange-200 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {team.position}
                          </div>
                          <span className="text-lg">{team.logo}</span>
                          <div>
                            <div className="font-medium text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-600">
                              {team.played} jogos • {team.wins}V {team.draws}E {team.losses}D
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">{team.points}</div>
                          <div className="text-sm text-gray-500">
                            SG: {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notificações */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-orange-500" />
                    Notificações ({notifications.length})
                  </h3>
                </div>
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map(notification => {
                    const formatted = helpers.notifications.formatNotification(notification);
                    return (
                      <div key={notification.id} className="flex items-start space-x-2">
                        <span className="text-lg">{formatted.displayIcon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatted.timeAgo}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Próximos Jogos */}
            {dashboardData?.upcomingMatches && dashboardData.upcomingMatches.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Próximos Jogos
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {dashboardData.upcomingMatches.slice(0, 3).map(match => {
                    const homeTeam = teams.find(t => t.id === match.homeTeamId);
                    const awayTeam = teams.find(t => t.id === match.awayTeamId);
                    
                    return (
                      <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">
                            {homeTeam?.shortName} vs {awayTeam?.shortName}
                          </div>
                          <div className="text-gray-600">
                            Rodada {match.round}
                          </div>
                        </div>
                        
                        {match.date && (
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{helpers.formatters.formatDateTime(match.date, 'dd/MM')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{helpers.formatters.formatDateTime(match.date, 'HH:mm')}</span>
                            </div>
                            {match.venue && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-20">{match.venue}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Artilheiros */}
            {dashboardData?.topScorers && dashboardData.topScorers.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-red-500" />
                    Artilheiros
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {dashboardData.topScorers.slice(0, 5).map((scorer, index) => (
                    <div key={scorer.playerId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{scorer.playerName}</div>
                          <div className="text-gray-600">{scorer.teamName}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary-600">
                        {scorer.goals}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChampionshipDashboard;