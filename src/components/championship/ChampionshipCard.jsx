// src/components/championship/ChampionshipCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Settings, 
  Eye,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui';
import { useChampionshipHelpers } from '../../utils/championshipHelpers';

export const ChampionshipCard = ({ 
  championship, 
  teams = [], 
  matches = [], 
  showActions = true,
  onAction = () => {} 
}) => {
  const navigate = useNavigate();
  const helpers = useChampionshipHelpers();
  
  const statusConfig = helpers.formatters.formatChampionshipStatus(championship.status);
  const format = helpers.formatters.formatChampionshipFormat(championship.format);
  const progress = helpers.formatters.formatProgress(
    matches.filter(m => m.status === 'finished').length,
    matches.length
  );

  const confirmedTeams = teams.filter(t => t.status === 'confirmed').length;
  const pendingPayments = teams.filter(t => t.paymentStatus === 'pending').length;

  const handlePrimaryAction = () => {
    const routes = helpers.navigation.getChampionshipRoutes(championship.id);
    
    switch (championship.status) {
      case 'draft':
        navigate(routes.manage);
        break;
      case 'open':
        navigate(routes.teams);
        break;
      case 'active':
        navigate(routes.view);
        break;
      case 'finished':
        navigate(routes.results);
        break;
      default:
        navigate(routes.view);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {championship.name}
            </h3>
            <p className="text-sm text-gray-600">
              {format} • Temporada {championship.season}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
            
            {championship.status === 'active' && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Alertas importantes */}
        {pendingPayments > 0 && (
          <div className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded-md mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-orange-700">
              {pendingPayments} pagamento(s) pendente(s)
            </span>
          </div>
        )}

        {championship.status === 'open' && confirmedTeams >= 2 && (
          <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md mb-3">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-green-700">
              Pronto para iniciar ({confirmedTeams} times confirmados)
            </span>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary-600">
              {teams.length}
            </div>
            <div className="text-xs text-gray-600">
              Times{championship.maxTeams ? ` / ${championship.maxTeams}` : ''}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {matches.length}
            </div>
            <div className="text-xs text-gray-600">
              Jogos
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {progress}
            </div>
            <div className="text-xs text-gray-600">
              Progresso
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {championship.status === 'active' && matches.length > 0 && (
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.round((matches.filter(m => m.status === 'finished').length / matches.length) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              Início: {helpers.formatters.formatDateTime(championship.startDate, 'dd/MM/yyyy')}
            </span>
          </div>
          
          {championship.endDate && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                Fim: {helpers.formatters.formatDateTime(championship.endDate, 'dd/MM/yyyy')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between space-x-3">
            <Button
              onClick={handlePrimaryAction}
              className="flex-1"
              variant={championship.status === 'active' ? 'default' : 'outline'}
            >
              {championship.status === 'draft' && (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </>
              )}
              {championship.status === 'open' && (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Times
                </>
              )}
              {championship.status === 'active' && (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Dashboard
                </>
              )}
              {championship.status === 'finished' && (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Resultados
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('menu', championship)}
              className="px-3"
            >
              ⋮
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// src/components/championship/TeamCard.jsx
export const TeamCard = ({ 
  team, 
  championship,
  showActions = true, 
  onAction = () => {},
  stats = null
}) => {
  const helpers = useChampionshipHelpers();

  const statusColors = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800'
  };

  const paymentColors = {
    'paid': 'text-green-600',
    'pending': 'text-red-600',
    'overdue': 'text-red-700'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo/Avatar */}
          <div className="text-3xl">
            {team.logo || '⚽'}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {team.name}
            </h4>
            
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{team.players || 0} atletas</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>Cap: {team.captain}</span>
              </div>
              
              {team.neighborhood && (
                <div className="flex items-center space-x-1">
                  <span>{team.neighborhood}</span>
                </div>
              )}
            </div>

            {/* Stats extras se fornecidas */}
            {stats && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{stats.played} jogos</span>
                <span className="text-green-600">{stats.wins}V</span>
                <span className="text-gray-600">{stats.draws}E</span>
                <span className="text-red-600">{stats.losses}D</span>
                <span>{stats.points} pts</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status e ações */}
        <div className="flex items-center space-x-3">
          {/* Status badges */}
          <div className="text-right">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[team.status] || 'bg-gray-100 text-gray-800'
            }`}>
              {team.status === 'confirmed' ? 'Confirmado' :
               team.status === 'pending' ? 'Pendente' : 'Rejeitado'}
            </span>
            
            {championship.registrationFee && (
              <div className={`text-xs mt-1 font-medium ${
                paymentColors[team.paymentStatus] || 'text-gray-600'
              }`}>
                {team.paymentStatus === 'paid' ? 'Pago' : 
                 team.paymentStatus === 'pending' ? 'A pagar' : 'Pendente'}
              </div>
            )}
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              {team.status === 'pending' && (
                <Button
                  size="xs"
                  onClick={() => onAction('confirm', team)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✓
                </Button>
              )}
              
              <Button
                variant="outline"
                size="xs"
                onClick={() => onAction('view', team)}
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button
                variant="outline"
                size="xs"
                onClick={() => onAction('menu', team)}
                className="text-gray-400 hover:text-gray-600"
              >
                ⋮
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// src/components/championship/MatchCard.jsx
export const MatchCard = ({ 
  match, 
  teams = [], 
  showActions = false,
  onAction = () => {},
  isCompact = false
}) => {
  const helpers = useChampionshipHelpers();
  
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);
  
  const statusConfig = {
    'scheduled': { label: 'Agendado', color: 'text-blue-600', bg: 'bg-blue-50' },
    'live': { label: 'Ao vivo', color: 'text-red-600', bg: 'bg-red-50' },
    'finished': { label: 'Finalizado', color: 'text-green-600', bg: 'bg-green-50' },
    'cancelled': { label: 'Cancelado', color: 'text-gray-600', bg: 'bg-gray-50' }
  };

  const status = statusConfig[match.status] || statusConfig.scheduled;

  if (isCompact) {
    return (
      <div className={`p-3 rounded-lg border ${status.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm">
            <span>{homeTeam?.shortName || 'TIME A'}</span>
            <div className="font-bold">
              {match.status === 'finished' 
                ? `${match.scoreHome} × ${match.scoreAway}`
                : 'vs'
              }
            </div>
            <span>{awayTeam?.shortName || 'TIME B'}</span>
          </div>
          
          <div className="text-xs text-gray-600">
            {match.date && helpers.formatters.formatDateTime(match.date, 'dd/MM HH:mm')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      {/* Header com status e rodada */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          
          {match.round && (
            <span className="text-xs text-gray-500">
              Rodada {match.round}
            </span>
          )}
          
          {match.phase && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
              {match.phase}
            </span>
          )}
        </div>
        
        {match.status === 'live' && (
          <div className="flex items-center space-x-1 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">AO VIVO</span>
          </div>
        )}
      </div>

      {/* Times e placar */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        {/* Time da casa */}
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{homeTeam?.logo || '⚽'}</div>
          <div className="font-medium text-gray-900">{homeTeam?.name || 'Time A'}</div>
          <div className="text-sm text-gray-600">{homeTeam?.shortName}</div>
        </div>

        {/* Placar */}
        <div className="text-center px-4">
          {match.status === 'finished' ? (
            <div className="text-3xl font-bold text-gray-900">
              {match.scoreHome} - {match.scoreAway}
            </div>
          ) : (
            <div className="text-2xl font-medium text-gray-500">
              {match.status === 'live' ? `${match.scoreHome || 0} - ${match.scoreAway || 0}` : 'vs'}
            </div>
          )}
          
          {match.status === 'live' && match.minute && (
            <div className="text-xs text-red-600 mt-1">
              {match.minute}'
            </div>
          )}
        </div>

        {/* Time visitante */}
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{awayTeam?.logo || '⚽'}</div>
          <div className="font-medium text-gray-900">{awayTeam?.name || 'Time B'}</div>
          <div className="text-sm text-gray-600">{awayTeam?.shortName}</div>
        </div>
      </div>

      {/* Informações do jogo */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
        {match.date && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              {helpers.formatters.formatDateTime(match.date, 'dd/MM/yyyy')}
            </span>
          </div>
        )}
        
        {match.date && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>
              {helpers.formatters.formatDateTime(match.date, 'HH:mm')}
            </span>
          </div>
        )}
        
        {match.venue && (
          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span className="truncate max-w-32">{match.venue}</span>
          </div>
        )}
      </div>

      {/* Gols (se finalizado) */}
      {match.status === 'finished' && match.goals && match.goals.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2">Gols:</p>
          <div className="space-y-1">
            {match.goals.slice(0, 5).map((goal, idx) => (
              <div key={idx} className="text-xs flex items-center justify-between">
                <span>{goal.playerName}</span>
                <span className="text-gray-500">{goal.minute}'</span>
              </div>
            ))}
            {match.goals.length > 5 && (
              <div className="text-xs text-gray-500">
                +{match.goals.length - 5} gol(s)...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="mt-4 pt-3 border-t flex justify-end space-x-2">
          {match.status === 'scheduled' && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onAction('edit', match)}
            >
              Editar
            </Button>
          )}
          
          {(match.status === 'scheduled' || match.status === 'live') && (
            <Button
              size="xs"
              onClick={() => onAction('update_score', match)}
            >
              Atualizar Placar
            </Button>
          )}
          
          <Button
            variant="outline"
            size="xs"
            onClick={() => onAction('view', match)}
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

// src/components/championship/StatsCard.jsx
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  trend = null,
  onClick = null
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  const cardClasses = onClick 
    ? 'bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-shadow'
    : 'bg-white p-6 rounded-lg border border-gray-200';

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <span>{trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}</span>
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/championship/NotificationList.jsx
export const NotificationList = ({ notifications = [], onAction = () => {} }) => {
  const helpers = useChampionshipHelpers();

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl mb-2 block">🔔</span>
        <p>Nenhuma notificação no momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map(notification => {
        const formatted = helpers.notifications.formatNotification(notification);
        
        return (
          <div
            key={notification.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => onAction('view', notification)}
          >
            <div className="text-lg">{formatted.displayIcon}</div>
            
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
            
            {notification.priority === 'high' && (
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default {
  ChampionshipCard,
  TeamCard,
  MatchCard,
  StatsCard,
  NotificationList
};