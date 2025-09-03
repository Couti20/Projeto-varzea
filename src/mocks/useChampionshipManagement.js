// src/hooks/useChampionshipManagement.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useChampionshipHelpers } from '../utils/championshipHelpers';
import { useStatisticsCalculator } from '../utils/statisticsCalculator';
import { useMatchGenerator } from '../utils/matchGenerator';

// Hook principal para gerenciamento completo de campeonatos
export const useChampionshipManagement = (championshipId) => {
  const queryClient = useQueryClient();
  const helpers = useChampionshipHelpers();
  const { generateMatches } = useMatchGenerator();
  
  // Estados locais
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  // Queries para dados do campeonato
  const { data: championship, isLoading: loadingChampionship, error: championshipError } = useQuery({
    queryKey: ['championship', championshipId],
    queryFn: () => fetchChampionship(championshipId),
    enabled: !!championshipId,
    staleTime: 2 * 60 * 1000, // Cache por 2 minutos
  });

  const { data: teams = [], isLoading: loadingTeams } = useQuery({
    queryKey: ['championship-teams', championshipId],
    queryFn: () => fetchChampionshipTeams(championshipId),
    enabled: !!championshipId,
    staleTime: 1 * 60 * 1000,
  });

  const { data: matches = [], isLoading: loadingMatches } = useQuery({
    queryKey: ['championship-matches', championshipId],
    queryFn: () => fetchChampionshipMatches(championshipId),
    enabled: !!championshipId,
    staleTime: 30 * 1000, // Cache mais curto para jogos
  });

  // Calculadora de estatísticas
  const statistics = useStatisticsCalculator(teams, matches, championship);

  // Dados computados com cache
  const computedData = useMemo(() => {
    if (!championship || teams.length === 0) return null;

    return helpers.performance.getCachedData(
      `championship-data-${championshipId}`,
      () => ({
        standings: statistics.calculateStandings(),
        topScorers: statistics.calculateTopScorers(),
        generalStats: statistics.calculateGeneralStats(),
        validationStatus: helpers.validation.canStartChampionship(championship, teams),
        availableActions: helpers.navigation.getAvailableActions(championship, teams, matches),
        notifications: helpers.notifications.generateNotifications(championship, teams, matches)
      }),
      1 * 60 * 1000 // Cache por 1 minuto
    );
  }, [championship, teams, matches, championshipId]);

  // Mutations para ações do campeonato
  const updateChampionshipMutation = useMutation({
    mutationFn: ({ championshipId, updates }) => updateChampionship(championshipId, updates),
    onMutate: async ({ updates }) => {
      setIsProcessing(true);
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['championship', championshipId] });
      
      // Snapshot dos dados atuais
      const previousData = queryClient.getQueryData(['championship', championshipId]);
      
      // Update otimista
      queryClient.setQueryData(['championship', championshipId], old => ({
        ...old,
        ...updates
      }));

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback em caso de erro
      queryClient.setQueryData(['championship', championshipId], context.previousData);
      toast.error('Erro ao atualizar campeonato: ' + err.message);
    },
    onSuccess: (data, { action }) => {
      toast.success(`Campeonato ${action || 'atualizado'} com sucesso!`);
      setLastAction({ type: 'update', timestamp: Date.now(), action });
    },
    onSettled: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ['championship', championshipId] });
    }
  });

  const addTeamMutation = useMutation({
    mutationFn: ({ championshipId, teamData }) => addTeamToChampionship(championshipId, teamData),
    onMutate: async ({ teamData }) => {
      setIsProcessing(true);
      await queryClient.cancelQueries({ queryKey: ['championship-teams', championshipId] });
      
      const previousTeams = queryClient.getQueryData(['championship-teams', championshipId]);
      
      // Update otimista
      queryClient.setQueryData(['championship-teams', championshipId], old => [
        ...(old || []),
        { ...teamData, id: Date.now(), status: 'pending' }
      ]);

      return { previousTeams };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['championship-teams', championshipId], context.previousTeams);
      toast.error('Erro ao adicionar time: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Time adicionado com sucesso!');
      setLastAction({ type: 'add_team', timestamp: Date.now() });
    },
    onSettled: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ['championship-teams', championshipId] });
    }
  });

  const generateMatchesMutation = useMutation({
    mutationFn: ({ championshipId, teams, settings }) => {
      const generatedMatches = generateMatches(teams, championship.format, settings);
      return saveGeneratedMatches(championshipId, generatedMatches);
    },
    onSuccess: (data) => {
      toast.success(`${data.length} jogos gerados com sucesso!`);
      setLastAction({ type: 'generate_matches', timestamp: Date.now(), count: data.length });
      queryClient.invalidateQueries({ queryKey: ['championship-matches', championshipId] });
    },
    onError: (err) => {
      toast.error('Erro ao gerar jogos: ' + err.message);
    }
  });

  const updateMatchResultMutation = useMutation({
    mutationFn: ({ matchId, homeScore, awayScore }) => updateMatchResult(matchId, homeScore, awayScore),
    onMutate: async ({ matchId, homeScore, awayScore }) => {
      await queryClient.cancelQueries({ queryKey: ['championship-matches', championshipId] });
      
      const previousMatches = queryClient.getQueryData(['championship-matches', championshipId]);
      
      // Update otimista
      queryClient.setQueryData(['championship-matches', championshipId], old => 
        old?.map(match => 
          match.id === matchId 
            ? { ...match, scoreHome: homeScore, scoreAway: awayScore, status: 'finished' }
            : match
        )
      );

      return { previousMatches };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['championship-matches', championshipId], context.previousMatches);
      toast.error('Erro ao atualizar resultado: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Resultado atualizado com sucesso!');
      setLastAction({ type: 'update_match', timestamp: Date.now() });
      
      // Invalidar estatísticas relacionadas
      queryClient.invalidateQueries({ queryKey: ['championship-teams', championshipId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['championship-matches', championshipId] });
    }
  });

  // Ações do campeonato
  const actions = {
    // Atualizar dados básicos do campeonato
    updateChampionship: useCallback((updates, action = 'atualizado') => {
      updateChampionshipMutation.mutate({ championshipId, updates, action });
    }, [championshipId, updateChampionshipMutation]),

    // Adicionar time
    addTeam: useCallback((teamData) => {
      addTeamMutation.mutate({ championshipId, teamData });
    }, [championshipId, addTeamMutation]),

    // Remover time
    removeTeam: useCallback(async (teamId) => {
      if (!window.confirm('Tem certeza que deseja remover este time?')) return;
      
      try {
        setIsProcessing(true);
        await removeTeamFromChampionship(championshipId, teamId);
        queryClient.invalidateQueries({ queryKey: ['championship-teams', championshipId] });
        toast.success('Time removido com sucesso!');
        setLastAction({ type: 'remove_team', timestamp: Date.now() });
      } catch (error) {
        toast.error('Erro ao remover time: ' + error.message);
      } finally {
        setIsProcessing(false);
      }
    }, [championshipId, queryClient]),

    // Confirmar time
    confirmTeam: useCallback(async (teamId) => {
      try {
        setIsProcessing(true);
        await confirmTeam(championshipId, teamId);
        queryClient.invalidateQueries({ queryKey: ['championship-teams', championshipId] });
        toast.success('Time confirmado com sucesso!');
        setLastAction({ type: 'confirm_team', timestamp: Date.now() });
      } catch (error) {
        toast.error('Erro ao confirmar time: ' + error.message);
      } finally {
        setIsProcessing(false);
      }
    }, [championshipId, queryClient]),

    // Gerar jogos
    generateMatches: useCallback((settings = {}) => {
      const confirmedTeams = teams.filter(t => t.status === 'confirmed');
      
      if (confirmedTeams.length < 2) {
        toast.error('É necessário pelo menos 2 times confirmados para gerar jogos');
        return;
      }

      const validation = helpers.validation.canStartChampionship(championship, confirmedTeams);
      if (!validation.valid) {
        const proceed = window.confirm(
          `Avisos encontrados:\n${validation.errors.join('\n')}\n\nDeseja continuar mesmo assim?`
        );
        if (!proceed) return;
      }

      generateMatchesMutation.mutate({ championshipId, teams: confirmedTeams, settings });
    }, [championshipId, teams, championship, generateMatchesMutation]),

    // Atualizar resultado de jogo
    updateMatchResult: useCallback((matchId, homeScore, awayScore) => {
      const validation = helpers.validation.validateMatchResult(homeScore, awayScore);
      
      if (!validation.valid) {
        toast.error(validation.errors.join(', '));
        return;
      }

      updateMatchResultMutation.mutate({ matchId, homeScore, awayScore });
    }, [updateMatchResultMutation]),

    // Mudar status do campeonato
    changeStatus: useCallback((newStatus) => {
      const statusActions = {
        'open': 'Inscrições abertas',
        'active': 'Campeonato iniciado',
        'finished': 'Campeonato finalizado',
        'cancelled': 'Campeonato cancelado'
      };

      const action = statusActions[newStatus] || 'Status alterado';
      actions.updateChampionship({ status: newStatus }, action);
    }, []),

    // Limpar cache
    refreshData: useCallback(() => {
      helpers.performance.clearCache(`championship-data-${championshipId}`);
      queryClient.invalidateQueries({ queryKey: ['championship', championshipId] });
      queryClient.invalidateQueries({ queryKey: ['championship-teams', championshipId] });
      queryClient.invalidateQueries({ queryKey: ['championship-matches', championshipId] });
      toast.success('Dados atualizados!');
    }, [championshipId, queryClient])
  };

  // Estado de loading consolidado
  const isLoading = loadingChampionship || loadingTeams || loadingMatches || isProcessing;

  // Retornar dados e funcionalidades
  return {
    // Dados
    championship,
    teams,
    matches,
    computedData,
    statistics,

    // Estados
    isLoading,
    isProcessing,
    lastAction,
    error: championshipError,

    // Ações
    actions,

    // Utilitários
    helpers,
    
    // Status shortcuts
    canStart: computedData?.validationStatus?.valid || false,
    availableActions: computedData?.availableActions || [],
    notifications: computedData?.notifications || []
  };
};

// Hook para múltiplos campeonatos (lista)
export const useChampionshipsOverview = (organizationId) => {
  const queryClient = useQueryClient();
  
  const { data: championships = [], isLoading, error } = useQuery({
    queryKey: ['organization-championships', organizationId],
    queryFn: () => fetchOrganizationChampionships(organizationId),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  });

  // Estatísticas consolidadas
  const overviewStats = useMemo(() => {
    if (championships.length === 0) return null;

    const active = championships.filter(c => c.status === 'active');
    const open = championships.filter(c => c.status === 'open');
    const finished = championships.filter(c => c.status === 'finished');
    
    const totalTeams = championships.reduce((sum, c) => sum + (c.teamsCount || 0), 0);
    const totalMatches = championships.reduce((sum, c) => sum + (c.matchesTotal || 0), 0);
    const totalRevenue = championships.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

    return {
      total: championships.length,
      active: active.length,
      open: open.length,
      finished: finished.length,
      totalTeams,
      totalMatches,
      totalRevenue,
      avgTeamsPerChampionship: championships.length > 0 ? Math.round(totalTeams / championships.length) : 0,
      completionRate: totalMatches > 0 ? Math.round((championships.reduce((sum, c) => sum + (c.matchesPlayed || 0), 0) / totalMatches) * 100) : 0
    };
  }, [championships]);

  const createChampionship = useMutation({
    mutationFn: (championshipData) => createNewChampionship(organizationId, championshipData),
    onSuccess: (newChampionship) => {
      queryClient.invalidateQueries({ queryKey: ['organization-championships', organizationId] });
      toast.success('Campeonato criado com sucesso!');
      return newChampionship;
    },
    onError: (error) => {
      toast.error('Erro ao criar campeonato: ' + error.message);
    }
  });

  return {
    championships,
    overviewStats,
    isLoading,
    error,
    createChampionship: createChampionship.mutateAsync,
    isCreating: createChampionship.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['organization-championships', organizationId] })
  };
};

// Hook para visualização pública de campeonatos
export const usePublicChampionship = (championshipId) => {
  const helpers = useChampionshipHelpers();

  const { data: publicData, isLoading } = useQuery({
    queryKey: ['public-championship', championshipId],
    queryFn: () => fetchPublicChampionshipData(championshipId),
    enabled: !!championshipId,
    staleTime: 2 * 60 * 1000,
  });

  const computedStats = useMemo(() => {
    if (!publicData) return null;

    const { championship, teams, matches } = publicData;
    const statistics = useStatisticsCalculator(teams, matches, championship);

    return {
      standings: statistics.calculateStandings(),
      topScorers: statistics.calculateTopScorers(),
      generalStats: statistics.calculateGeneralStats(),
      recentMatches: matches
        .filter(m => m.status === 'finished')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10),
      upcomingMatches: matches
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10)
    };
  }, [publicData]);

  const shareChampionship = useCallback((type = 'general') => {
    if (!publicData) return;

    const { championship, teams } = publicData;
    
    if (type === 'whatsapp') {
      helpers.sharing.shareWhatsApp(championship, {
        type: 'standings',
        standings: computedStats?.standings
      });
    } else {
      return helpers.sharing.shareLink(championship);
    }
  }, [publicData, computedStats, helpers]);

  return {
    championship: publicData?.championship,
    teams: publicData?.teams || [],
    matches: publicData?.matches || [],
    computedStats,
    isLoading,
    shareChampionship,
    formatters: helpers.formatters
  };
};

// Funções mock para as APIs (substituir por implementações reais)
const fetchChampionship = async (id) => {
  // Mock implementation
  return { id, name: 'Copa da Várzea 2025', status: 'active', format: 'league' };
};

const fetchChampionshipTeams = async (championshipId) => {
  // Mock implementation
  return [];
};

const fetchChampionshipMatches = async (championshipId) => {
  // Mock implementation
  return [];
};

const updateChampionship = async (id, updates) => {
  // Mock implementation
  return { id, ...updates };
};

const addTeamToChampionship = async (championshipId, teamData) => {
  // Mock implementation
  return { id: Date.now(), ...teamData };
};

const removeTeamFromChampionship = async (championshipId, teamId) => {
  // Mock implementation
  return { success: true };
};

const confirmTeam = async (championshipId, teamId) => {
  // Mock implementation
  return { success: true };
};

const saveGeneratedMatches = async (championshipId, matches) => {
  // Mock implementation
  return matches;
};

const updateMatchResult = async (matchId, homeScore, awayScore) => {
  // Mock implementation
  return { id: matchId, scoreHome: homeScore, scoreAway: awayScore };
};

const fetchOrganizationChampionships = async (organizationId) => {
  // Mock implementation
  return [];
};

const createNewChampionship = async (organizationId, data) => {
  // Mock implementation
  return { id: Date.now(), ...data };
};

const fetchPublicChampionshipData = async (championshipId) => {
  // Mock implementation
  return { championship: {}, teams: [], matches: [] };
};