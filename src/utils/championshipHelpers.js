// src/utils/championshipHelpers.js
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Utilitários para validação de campeonatos
export const championshipValidation = {
  // Validar se pode iniciar um campeonato
  canStartChampionship: (championship, teams) => {
    const errors = [];
    
    if (!championship) {
      errors.push('Campeonato não encontrado');
      return { valid: false, errors };
    }
    
    if (teams.length < 2) {
      errors.push('Necessário pelo menos 2 times para iniciar');
    }
    
    if (championship.format === 'knockout') {
      const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(teams.length)));
      if (teams.length !== powerOfTwo) {
        errors.push(`Para mata-mata, é recomendado ${powerOfTwo} times (atual: ${teams.length})`);
      }
    }
    
    const confirmedTeams = teams.filter(t => t.status === 'confirmed');
    if (confirmedTeams.length < teams.length) {
      errors.push(`${teams.length - confirmedTeams.length} time(s) ainda não confirmado(s)`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: errors.length > 0 && confirmedTeams.length >= 2 ? 
        ['Pode iniciar com times confirmados apenas'] : []
    };
  },

  // Validar dados do campeonato
  validateChampionshipData: (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }
    
    if (!data.season) {
      errors.push('Temporada é obrigatória');
    }
    
    if (!data.format || !['league', 'knockout', 'mixed'].includes(data.format)) {
      errors.push('Formato inválido');
    }
    
    if (data.maxTeams && data.maxTeams < 2) {
      errors.push('Máximo de times deve ser pelo menos 2');
    }
    
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        errors.push('Data de fim deve ser posterior à data de início');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Validar resultado de partida
  validateMatchResult: (homeScore, awayScore) => {
    const errors = [];
    
    if (homeScore < 0 || awayScore < 0) {
      errors.push('Placares não podem ser negativos');
    }
    
    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      errors.push('Placares devem ser números inteiros');
    }
    
    if (homeScore > 50 || awayScore > 50) {
      errors.push('Placar muito alto, verifique se está correto');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// Utilitários de formatação
export const championshipFormatters = {
  // Formatar status do campeonato
  formatChampionshipStatus: (status) => {
    const statusMap = {
      'draft': { label: 'Rascunho', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800' },
      'open': { label: 'Inscrições Abertas', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' },
      'active': { label: 'Em Andamento', color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
      'finished': { label: 'Finalizado', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-800' },
      'cancelled': { label: 'Cancelado', color: 'red', bg: 'bg-red-100', text: 'text-red-800' }
    };
    
    return statusMap[status] || statusMap.draft;
  },

  // Formatar formato do campeonato
  formatChampionshipFormat: (format) => {
    const formatMap = {
      'league': 'Pontos Corridos',
      'knockout': 'Eliminatória',
      'mixed': 'Misto (Grupos + Mata-mata)'
    };
    
    return formatMap[format] || 'Desconhecido';
  },

  // Formatar moeda
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  },

  // Formatar data/hora
  formatDateTime: (date, format = 'dd/MM/yyyy HH:mm') => {
    if (!date) return 'Data não definida';
    try {
      return formatDate(new Date(date), format, { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  },

  // Formatar progresso
  formatProgress: (current, total) => {
    if (total === 0) return '0%';
    return `${Math.round((current / total) * 100)}%`;
  },

  // Formatar placar
  formatScore: (homeScore, awayScore) => {
    if (homeScore === null || awayScore === null) return 'vs';
    return `${homeScore} × ${awayScore}`;
  }
};

// Utilitários de navegação
export const championshipNavigation = {
  // Obter rotas do campeonato
  getChampionshipRoutes: (championshipId, userType = 'organization') => {
    const baseUrl = userType === 'organization' ? '/organization/championships' : '/championships';
    
    return {
      view: `${baseUrl}/${championshipId}`,
      manage: `${baseUrl}/${championshipId}/manage`,
      teams: `${baseUrl}/${championshipId}/teams`,
      matches: `${baseUrl}/${championshipId}/matches`,
      tables: `${baseUrl}/${championshipId}/tables`,
      results: `${baseUrl}/${championshipId}/results`,
      reports: `${baseUrl}/${championshipId}/reports`
    };
  },

  // Obter ações disponíveis baseado no status
  getAvailableActions: (championship, teams = [], matches = []) => {
    const actions = [];
    
    switch (championship.status) {
      case 'draft':
        actions.push(
          { key: 'edit', label: 'Editar', icon: 'Edit', route: 'manage' },
          { key: 'teams', label: 'Gerenciar Times', icon: 'Users', route: 'teams' }
        );
        
        if (teams.length >= 2) {
          actions.push({ key: 'publish', label: 'Abrir Inscrições', icon: 'Play', action: 'publish' });
        }
        break;
        
      case 'open':
        actions.push(
          { key: 'teams', label: 'Gerenciar Times', icon: 'Users', route: 'teams' },
          { key: 'edit', label: 'Configurar', icon: 'Settings', route: 'manage' }
        );
        
        const confirmedTeams = teams.filter(t => t.status === 'confirmed');
        if (confirmedTeams.length >= 2) {
          actions.push({ key: 'start', label: 'Iniciar Campeonato', icon: 'Play', action: 'start' });
        }
        break;
        
      case 'active':
        actions.push(
          { key: 'matches', label: 'Gerenciar Jogos', icon: 'Calendar', route: 'matches' },
          { key: 'tables', label: 'Tabelas', icon: 'BarChart', route: 'tables' },
          { key: 'results', label: 'Resultados', icon: 'Trophy', route: 'results' },
          { key: 'reports', label: 'Relatórios', icon: 'FileText', route: 'reports' }
        );
        break;
        
      case 'finished':
        actions.push(
          { key: 'results', label: 'Resultados Finais', icon: 'Trophy', route: 'results' },
          { key: 'reports', label: 'Relatório Completo', icon: 'FileText', route: 'reports' }
        );
        break;
    }
    
    // Ação sempre disponível
    actions.push({ key: 'view', label: 'Visualizar', icon: 'Eye', route: 'view' });
    
    return actions;
  }
};

// Utilitários de compartilhamento
export const championshipSharing = {
  // Compartilhar via WhatsApp
  shareWhatsApp: (championship, data = {}) => {
    let message = `🏆 *${championship.name}*\n`;
    message += `📅 Temporada ${championship.season}\n\n`;
    
    if (data.type === 'standings' && data.standings) {
      message += '📊 *CLASSIFICAÇÃO ATUAL*\n\n';
      data.standings.slice(0, 5).forEach((team, index) => {
        const position = index + 1;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}º`;
        message += `${medal} ${team.name} - ${team.points}pts\n`;
      });
    } else if (data.type === 'match' && data.match) {
      message += `⚽ *RESULTADO*\n\n`;
      message += `${data.match.homeTeam} ${championshipFormatters.formatScore(data.match.scoreHome, data.match.scoreAway)} ${data.match.awayTeam}\n`;
      if (data.match.date) {
        message += `📅 ${championshipFormatters.formatDateTime(data.match.date, 'dd/MM/yyyy')}\n`;
      }
    } else if (data.type === 'invitation') {
      message += `📢 *CONVITE PARA PARTICIPAR*\n\n`;
      message += `Formato: ${championshipFormatters.formatChampionshipFormat(championship.format)}\n`;
      message += `Times: ${data.teamsCount || 0}/${championship.maxTeams || 'sem limite'}\n`;
      if (championship.registrationFee) {
        message += `Taxa: ${championshipFormatters.formatCurrency(championship.registrationFee)}\n`;
      }
    }
    
    message += `\n⚽ *Futebol de Várzea*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  },

  // Compartilhar via link
  shareLink: (championship, route = 'view') => {
    const url = `${window.location.origin}/championships/${championship.id}/${route}`;
    
    if (navigator.share) {
      navigator.share({
        title: championship.name,
        text: `Confira o campeonato ${championship.name}`,
        url
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      // Mostrar toast de sucesso
    }
    
    return url;
  },

  // Gerar dados para compartilhamento
  generateShareData: (championship, teams = [], matches = [], standings = []) => {
    return {
      championship: {
        name: championship.name,
        season: championship.season,
        format: championship.format,
        status: championship.status
      },
      stats: {
        teamsCount: teams.length,
        matchesTotal: matches.length,
        matchesPlayed: matches.filter(m => m.status === 'finished').length,
        leader: standings[0]?.name || 'TBD'
      },
      url: championshipNavigation.getChampionshipRoutes(championship.id).view
    };
  }
};

// Utilitários de notificação
export const championshipNotifications = {
  // Gerar notificações baseadas em eventos
  generateNotifications: (championship, teams = [], matches = []) => {
    const notifications = [];
    const now = new Date();
    
    // Jogos próximos (nas próximas 24h)
    const upcomingMatches = matches.filter(match => {
      if (match.status !== 'scheduled' || !match.date) return false;
      const matchDate = new Date(match.date);
      const hoursDiff = (matchDate - now) / (1000 * 60 * 60);
      return hoursDiff > 0 && hoursDiff <= 24;
    });
    
    upcomingMatches.forEach(match => {
      notifications.push({
        id: `upcoming-${match.id}`,
        type: 'upcoming_match',
        title: 'Jogo em breve',
        message: `${match.homeTeam?.name} vs ${match.awayTeam?.name} em ${championshipFormatters.formatDateTime(match.date, 'HH:mm')}`,
        priority: 'high',
        createdAt: now.toISOString()
      });
    });
    
    // Times pendentes de confirmação
    const pendingTeams = teams.filter(t => t.status === 'pending');
    if (pendingTeams.length > 0) {
      notifications.push({
        id: 'pending-teams',
        type: 'pending_confirmation',
        title: 'Times pendentes',
        message: `${pendingTeams.length} time(s) aguardando confirmação`,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }
    
    // Pagamentos pendentes
    const pendingPayments = teams.filter(t => t.paymentStatus === 'pending');
    if (pendingPayments.length > 0) {
      notifications.push({
        id: 'pending-payments',
        type: 'pending_payment',
        title: 'Pagamentos pendentes',
        message: `${pendingPayments.length} time(s) com pagamento pendente`,
        priority: 'medium',
        createdAt: now.toISOString()
      });
    }
    
    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  },

  // Formatar notificação para exibição
  formatNotification: (notification) => {
    const typeConfig = {
      'upcoming_match': { icon: '⚽', color: 'blue' },
      'pending_confirmation': { icon: '⏳', color: 'yellow' },
      'pending_payment': { icon: '💰', color: 'orange' },
      'match_result': { icon: '🎯', color: 'green' },
      'team_joined': { icon: '👥', color: 'green' },
      'default': { icon: '📢', color: 'gray' }
    };
    
    const config = typeConfig[notification.type] || typeConfig.default;
    
    return {
      ...notification,
      displayIcon: config.icon,
      displayColor: config.color,
      timeAgo: championshipFormatters.formatDateTime(notification.createdAt, 'dd/MM HH:mm')
    };
  }
};

// Utilitários de performance
export const championshipPerformance = {
  // Cache de dados calculados
  cache: new Map(),
  
  // Obter dados com cache
  getCachedData: (key, calculateFn, ttl = 5 * 60 * 1000) => {
    const cached = championshipPerformance.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.data;
    }
    
    const data = calculateFn();
    championshipPerformance.cache.set(key, {
      data,
      timestamp: now
    });
    
    return data;
  },
  
  // Limpar cache
  clearCache: (prefix = null) => {
    if (prefix) {
      for (const key of championshipPerformance.cache.keys()) {
        if (key.startsWith(prefix)) {
          championshipPerformance.cache.delete(key);
        }
      }
    } else {
      championshipPerformance.cache.clear();
    }
  },
  
  // Debounce para evitar cálculos excessivos
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Hook personalizado para usar todos os utilitários
export const useChampionshipHelpers = () => {
  return {
    validation: championshipValidation,
    formatters: championshipFormatters,
    navigation: championshipNavigation,
    sharing: championshipSharing,
    notifications: championshipNotifications,
    performance: championshipPerformance
  };
};