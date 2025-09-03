// src/pages/Organization/OrganizationAdvancedDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Eye,
  Settings,
  TrendingUp,
  MapPin,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '../../components/ui';

const OrganizationAdvancedDashboard = () => {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [championships, setChampionships] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  // Mock data - Em produção viria da API
  useEffect(() => {
    setTimeout(() => {
      const mockChampionships = [
        {
          id: 1,
          name: 'Copa da Várzea 2025',
          season: '2025',
          format: 'league',
          status: 'active',
          teamsCount: 12,
          maxTeams: 16,
          matchesTotal: 132,
          matchesPlayed: 45,
          startDate: '2025-01-15',
          endDate: '2025-06-15',
          nextMatch: {
            date: '2025-02-15T15:00:00Z',
            teams: 'FC Barcelona vs Real Periferia'
          },
          progress: 34,
          registrationFee: 150,
          totalRevenue: 1800
        },
        {
          id: 2,
          name: 'Torneio de Verão 2025',
          season: '2025',
          format: 'knockout',
          status: 'open',
          teamsCount: 8,
          maxTeams: 16,
          matchesTotal: 30,
          matchesPlayed: 0,
          startDate: '2025-03-01',
          endDate: '2025-04-30',
          progress: 0,
          registrationFee: 100,
          totalRevenue: 800
        },
        {
          id: 3,
          name: 'Liga dos Bairros 2024',
          season: '2024',
          format: 'mixed',
          status: 'finished',
          teamsCount: 16,
          maxTeams: 16,
          matchesTotal: 78,
          matchesPlayed: 78,
          startDate: '2024-08-01',
          endDate: '2024-12-20',
          progress: 100,
          registrationFee: 120,
          totalRevenue: 1920,
          champion: 'Santos da Quebrada'
        }
      ];
      setChampionships(mockChampionships);

      const mockStats = {
        totalChampionships: 3,
        activeChampionships: 1,
        totalTeams: 36,
        totalMatches: 123,
        totalRevenue: 4520,
        avgTeamsPerChampionship: 12,
        completionRate: 78,
        satisfaction: 4.7
      };
      setStatistics(mockStats);

      const mockActivity = [
        {
          id: 1,
          type: 'team_joined',
          message: 'Palmeiras da Vila se inscreveu na Copa da Várzea 2025',
          time: '2025-02-01T10:30:00Z',
          championship: 'Copa da Várzea 2025',
          icon: '👥',
          color: 'green'
        },
        {
          id: 2,
          type: 'match_result',
          message: 'Resultado registrado: FC Barcelona 2x1 Real Periferia',
          time: '2025-02-01T16:00:00Z',
          championship: 'Copa da Várzea 2025',
          icon: '⚽',
          color: 'blue'
        },
        {
          id: 3,
          type: 'championship_created',
          message: 'Novo campeonato "Torneio de Verão 2025" criado',
          time: '2025-01-30T14:20:00Z',
          championship: 'Torneio de Verão 2025',
          icon: '🏆',
          color: 'purple'
        },
        {
          id: 4,
          type: 'payment_received',
          message: 'Pagamento recebido de Santos da Quebrada (R$ 150)',
          time: '2025-01-29T11:45:00Z',
          championship: 'Copa da Várzea 2025',
          icon: '💰',
          color: 'green'
        }
      ];
      setRecentActivity(mockActivity);

      setLoading(false);
    }, 1200);
  }, []);

  // Filtrar campeonatos por status
  const activeChampionships = championships.filter(c => c.status === 'active');
  const openChampionships = championships.filter(c => c.status === 'open');
  const finishedChampionships = championships.filter(c => c.status === 'finished');

  // Função para formatar datas
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Função para formatar moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'finished': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter label do status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'open': return 'Inscrições Abertas';
      case 'finished': return 'Finalizado';
      default: return 'Desconhecido';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard da Organização
            </h1>
            <p className="text-gray-600 mt-1">
              Visão geral completa dos seus campeonatos e atividades
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </Button>
            
            <Button
              onClick={() => navigate('/organization/championships/create')}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Campeonato</span>
            </Button>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total de Campeonatos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.totalChampionships}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-green-600">
                    {statistics.activeChampionships} ativos
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Times Participantes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.totalTeams}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-blue-600">
                    Média: {statistics.avgTeamsPerChampionship} por campeonato
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Jogos Organizados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.totalMatches}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{statistics.completionRate}% concluídos</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Receita Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(statistics.totalRevenue)}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-purple-600">
                    Satisfação: {statistics.satisfaction}/5.0 ⭐
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campeonatos Ativos */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Campeonatos em Andamento
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/organization/championships')}
                >
                  Ver Todos
                </Button>
              </div>
            </div>

            <div className="p-6">
              {activeChampionships.length > 0 ? (
                <div className="space-y-4">
                  {activeChampionships.map(championship => (
                    <div 
                      key={championship.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {championship.name}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Trophy className="w-4 h-4 mr-1" />
                                  {championship.format}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {championship.teamsCount}/{championship.maxTeams} times
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {championship.matchesPlayed}/{championship.matchesTotal} jogos
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Barra de Progresso */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progresso do Campeonato</span>
                              <span className="text-primary-600 font-medium">
                                {championship.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all"
                                style={{ width: `${championship.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Próximo Jogo */}
                          {championship.nextMatch && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                              <div className="text-sm">
                                <span className="text-blue-600 font-medium">Próximo jogo:</span>
                                <div className="text-gray-900">
                                  {championship.nextMatch.teams}
                                </div>
                                <div className="text-gray-600">
                                  {formatDate(championship.nextMatch.date)} às{' '}
                                  {new Date(championship.nextMatch.date).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/organization/championships/${championship.id}/results`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Resultados
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => navigate(`/organization/championships/${championship.id}/manage`)}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum campeonato ativo no momento.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/organization/championships/create')}
                  >
                    Criar Primeiro Campeonato
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Atividades Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Atividades Recentes
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        activity.color === 'green' ? 'bg-green-100' :
                        activity.color === 'blue' ? 'bg-blue-100' :
                        activity.color === 'purple' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {activity.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-5">
                          {activity.message}
                        </p>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(activity.time).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ações Rápidas
                </h3>
              </div>
              
              <div className="p-4 space-y-2">
                <button
                  onClick={() => navigate('/organization/championships/create')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Novo Campeonato</p>
                    <p className="text-sm text-gray-600">Criar nova competição</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/organization/championships')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ver Campeonatos</p>
                    <p className="text-sm text-gray-600">Gerenciar todos</p>
                  </div>
                </button>

                <button
                  onClick={() => console.log('Relatórios')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Relatórios</p>
                    <p className="text-sm text-gray-600">Análises detalhadas</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Status dos Campeonatos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Status dos Campeonatos
                </h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Em Andamento</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {activeChampionships.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Inscrições Abertas</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {openChampionships.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Finalizados</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {finishedChampionships.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Campeonatos em Inscrição */}
        {openChampionships.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Campeonatos com Inscrições Abertas
                </h2>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {openChampionships.length} aberto(s)
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {openChampionships.map(championship => (
                  <div key={championship.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {championship.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(championship.status)}`}>
                        {getStatusLabel(championship.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Times inscritos:</span>
                        <span className="font-medium">
                          {championship.teamsCount}/{championship.maxTeams}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Taxa de inscrição:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(championship.registrationFee)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Receita atual:</span>
                        <span className="font-medium">
                          {formatCurrency(championship.totalRevenue)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/organization/championships/${championship.id}/teams`)}
                        className="flex-1"
                      >
                        Gerenciar Times
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/organization/championships/${championship.id}/manage`)}
                        className="flex-1"
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationAdvancedDashboard;