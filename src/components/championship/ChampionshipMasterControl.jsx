// src/components/championship/ChampionshipMasterControl.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Calendar, 
  BarChart3,
  Trophy,
  Target,
  Share2,
  Download,
  RefreshCw,
  Play,
  Pause,
  Bell,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui';
import { toast } from 'react-hot-toast';

// Importar todos os hooks e utilitários
import { useChampionshipManagement } from '../../hooks/useChampionshipManagement';
import { useChampionshipExporter } from '../../utils/exportUtils';
import { ChampionshipCard, TeamCard, MatchCard, StatsCard, NotificationList } from './index';

// Componente principal que integra todo o sistema
const ChampionshipMasterControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados locais para UI
  const [activeView, setActiveView] = useState('overview');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Hook principal de gerenciamento
  const {
    championship,
    teams,
    matches,
    computedData,
    statistics,
    isLoading,
    isProcessing,
    lastAction,
    error,
    actions,
    helpers,
    canStart,
    availableActions,
    notifications
  } = useChampionshipManagement(id);

  // Hook de exportação
  const { exportQuick, generateShareableReport } = useChampionshipExporter();

  // Simulação de tempo real (em produção seria WebSocket)
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      // Simular atualizações em tempo real
      actions.refreshData();
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, actions]);

  // Lidar com ações dos componentes
  const handleAction = useCallback(async (actionType, item, extra = {}) => {
    try {
      switch (actionType) {
        case 'confirm_team':
          await actions.confirmTeam(item.id);
          break;
          
        case 'remove_team':
          await actions.removeTeam(item.id);
          break;
          
        case 'update_match_score':
          const { homeScore, awayScore } = extra;
          actions.updateMatchResult(item.id, homeScore, awayScore);
          break;
          
        case 'generate_matches':
          actions.generateMatches(extra.settings);
          break;
          
        case 'change_status':
          actions.changeStatus(extra.newStatus);
          break;
          
        case 'export_data':
          handleExport(extra.format);
          break;
          
        case 'share_championship':
          handleShare(extra.type);
          break;
          
        default:
          console.log('Ação não implementada:', actionType, item);
      }
    } catch (error) {
      toast.error('Erro ao executar ação: ' + error.message);
    }
  }, [actions]);

  // Lidar com exportação
  const handleExport = (format) => {
    if (!championship || !computedData) {
      toast.error('Dados não disponíveis para exportação');
      return;
    }

    const exportData = {
      championship,
      teams,
      matches,
      standings: computedData.standings,
      statistics: computedData.generalStats
    };

    try {
      exportQuick(format, exportData);
      toast.success('Arquivo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro na exportação: ' + error.message);
    }
  };

  // Lidar com compartilhamento
  const handleShare = (type = 'general') => {
    if (!championship) return;

    switch (type) {
      case 'whatsapp':
        helpers.sharing.shareWhatsApp(championship, {
          type: 'standings',
          standings: computedData?.standings
        });
        break;
      case 'link':
        const url = helpers.sharing.shareLink(championship);
        toast.success('Link copiado para área de transferência!');
        break;
      default:
        toast.info('Tipo de compartilhamento não implementado');
    }
  };

  // Obter estatísticas para o dashboard
  const getDashboardStats = () => {
    if (!computedData) return [];

    const finishedMatches = matches.filter(m => m.status === 'finished').length;
    const totalGoals = computedData.generalStats?.totalGoals || 0;
    const confirmedTeams = teams.filter(t => t.status === 'confirmed').length;
    const pendingPayments = teams.filter(t => t.paymentStatus === 'pending').length;

    return [
      {
        title: 'Times Confirmados',
        value: confirmedTeams,
        subtitle: `de ${teams.length} inscritos`,
        icon: Users,
        color: confirmedTeams === teams.length ? 'green' : 'blue',
        onClick: () => setActiveView('teams')
      },
      {
        title: 'Jogos Realizados',
        value: finishedMatches,
        subtitle: `de ${matches.length} total`,
        icon: Calendar,
        color: finishedMatches > 0 ? 'green' : 'gray',
        onClick: () => setActiveView('matches')
      },
      {
        title: 'Total de Gols',
        value: totalGoals,
        subtitle: `Média: ${computedData.generalStats?.averageGoals || 0}/jogo`,
        icon: Target,
        color: 'red',
        onClick: () => setActiveView('stats')
      },
      {
        title: 'Notificações',
        value: notifications.length,
        subtitle: pendingPayments > 0 ? `${pendingPayments} pagamentos pendentes` : 'Tudo em dia',
        icon: Bell,
        color: notifications.length > 0 ? 'yellow' : 'green',
        onClick: () => setActiveView('notifications')
      }
    ];
  };

  // Renderizar conteúdo baseado na view ativa
  const renderActiveView = () => {
    if (!computedData) return null;

    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Grid de estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getDashboardStats().map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Classificação top 3 */}
            {computedData.standings?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Top 3 Atual
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveView('standings')}
                  >
                    Ver Completa
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {computedData.standings.slice(0, 3).map((team, index) => (
                    <div key={team.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-4xl mb-2 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' : 'text-orange-500'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-600">
                        {team.points} pontos • {team.played} jogos
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximos jogos e últimos resultados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos jogos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Próximos Jogos
                </h3>
                
                <div className="space-y-3">
                  {matches
                    .filter(m => m.status === 'scheduled')
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3)
                    .map(match => (
                      <MatchCard 
                        key={match.id} 
                        match={match} 
                        teams={teams}
                        isCompact={true}
                      />
                    ))}
                </div>
              </div>

              {/* Últimos resultados */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Últimos Resultados
                </h3>
                
                <div className="space-y-3">
                  {matches
                    .filter(m => m.status === 'finished')
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3)
                    .map(match => (
                      <MatchCard 
                        key={match.id} 
                        match={match} 
                        teams={teams}
                        isCompact={true}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'teams':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Times Participantes ({teams.length})
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/organization/championships/${id}/teams`)}
                >
                  Gerenciar Times
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  championship={championship}
                  onAction={handleAction}
                  stats={computedData.standings?.find(s => s.id === team.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Jogos ({matches.length})
              </h3>
              <div className="flex items-center space-x-2">
                {canStart && (
                  <Button
                    onClick={() => handleAction('generate_matches', null, { settings: {} })}
                    disabled={isProcessing}
                  >
                    Gerar Jogos
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {matches
                .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
                .map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={teams}
                    showActions={true}
                    onAction={handleAction}
                  />
                ))}
            </div>
          </div>
        );

      case 'standings':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Classificação</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="p-3">Pos</th>
                    <th className="p-3">Time</th>
                    <th className="p-3 text-center">PJ</th>
                    <th className="p-3 text-center">V</th>
                    <th className="p-3 text-center">E</th>
                    <th className="p-3 text-center">D</th>
                    <th className="p-3 text-center">GP</th>
                    <th className="p-3 text-center">GC</th>
                    <th className="p-3 text-center">SG</th>
                    <th className="p-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {computedData.standings?.map((team, index) => (
                    <tr key={team.id} className={`border-b hover:bg-gray-50 ${
                      index < 2 ? 'bg-green-50' : 
                      index >= computedData.standings.length - 2 ? 'bg-red-50' : ''
                    }`}>
                      <td className="p-3 font-medium">{team.position}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{team.logo || '⚽'}</span>
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">{team.played}</td>
                      <td className="p-3 text-center text-green-600">{team.wins}</td>
                      <td className="p-3 text-center">{team.draws}</td>
                      <td className="p-3 text-center text-red-600">{team.losses}</td>
                      <td className="p-3 text-center">{team.goalsFor}</td>
                      <td className="p-3 text-center">{team.goalsAgainst}</td>
                      <td className={`p-3 text-center font-medium ${
                        team.goalDifference > 0 ? 'text-green-600' : 
                        team.goalDifference < 0 ? 'text-red-600' : ''
                      }`}>
                        {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                      </td>
                      <td className="p-3 text-center font-bold text-primary-600">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notificações ({notifications.length})
            </h3>
            <NotificationList 
              notifications={notifications} 
              onAction={handleAction}
            />
          </div>
        );

      default:
        return <div>View não encontrada</div>;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar campeonato
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !championship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando campeonato...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb e título */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/organization/championships')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    {championship.name}
                  </h1>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    helpers.formatters.formatChampionshipStatus(championship.status).bg
                  } ${helpers.formatters.formatChampionshipStatus(championship.status).text}`}>
                    {helpers.formatters.formatChampionshipStatus(championship.status).label}
                  </span>

                  {isProcessing && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Processando...</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">
                  {helpers.formatters.formatChampionshipFormat(championship.format)} • 
                  Temporada {championship.season}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Toggle tempo real */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={isRealTimeEnabled ? 'bg-green-50 text-green-600' : ''}
              >
                {isRealTimeEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Tempo Real
              </Button>

              {/* Compartilhar */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('whatsapp')}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>

              {/* Exportar */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportModal(!showExportModal)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>

                {showExportModal && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                    <div className="p-2">
                      <button
                        onClick={() => { handleExport('standings-csv'); setShowExportModal(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                      >
                        Classificação (CSV)
                      </button>
                      <button
                        onClick={() => { handleExport('matches-csv'); setShowExportModal(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                      >
                        Jogos (CSV)
                      </button>
                      <button
                        onClick={() => { handleExport('report-html'); setShowExportModal(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                      >
                        Relatório (HTML)
                      </button>
                      <button
                        onClick={() => { handleExport('full-json'); setShowExportModal(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                      >
                        Dados Completos (JSON)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={actions.refreshData}
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex space-x-8 mt-4">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'teams', label: 'Times', icon: Users },
              { id: 'matches', label: 'Jogos', icon: Calendar },
              { id: 'standings', label: 'Classificação', icon: Trophy },
              { id: 'notifications', label: `Notificações (${notifications.length})`, icon: Bell }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                    activeView === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {renderActiveView()}
      </div>

      {/* Click outside to close export modal */}
      {showExportModal && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default ChampionshipMasterControl;