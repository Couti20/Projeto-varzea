import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAthlete } from './useAthletes';

// Hook para gerenciar múltiplos times (expandindo o sistema atual)
export const useMultiTeamManagement = (athleteId) => {
  const queryClient = useQueryClient();
  
  // Usar hook existente do projeto
  const { data: athlete, isLoading, error, refetch } = useAthlete(athleteId);
  
  // Estado para múltiplos times (expansão do sistema atual)
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (athlete) {
      // Converter estrutura atual (clube único) para múltiplos times
      const currentTeams = [];
      
      // Se o atleta tem um clube atual, adicionar como primeiro time
      if (athlete.club) {
        currentTeams.push({
          teamId: athlete.club.id,
          teamName: athlete.club.name,
          status: athlete.status || 'active', // active, pending, free
          role: 'Titular', // Padrão
          joinDate: athlete.joinDate || new Date().toISOString(),
          logo: athlete.club.logo || '/api/placeholder/40/40',
          nextMatch: null, // A ser expandido
          currentChampionship: null // A ser expandido
        });
      }

      // Simular times adicionais para demonstração
      // Em produção, isso viria da API expandida
      if (athlete.additionalTeams) {
        athlete.additionalTeams.forEach(team => {
          currentTeams.push(team);
        });
      }

      setTeams(currentTeams);
    }
  }, [athlete]);

  // Mutation para sair de um time
  const leaveTeamMutation = useMutation({
    mutationFn: async (teamId) => {
      // Simular API call - em produção seria uma chamada real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se for o clube principal, usar lógica existente
      if (athlete?.club?.id === teamId) {
        // Chamar API existente para sair do clube
        // const response = await apiClient.delete(`/athletes/${athleteId}/leave-club`);
        // return response.data;
        return { success: true, type: 'main_club' };
      } else {
        // Para times adicionais (futura implementação)
        // const response = await apiClient.delete(`/athletes/${athleteId}/teams/${teamId}`);
        // return response.data;
        return { success: true, type: 'additional_team' };
      }
    },
    onSuccess: (data, teamId) => {
      // Atualizar estado local
      setTeams(currentTeams => currentTeams.filter(team => team.teamId !== teamId));
      
      // Invalidar queries do React Query
      queryClient.invalidateQueries(['athlete', athleteId]);
      queryClient.invalidateQueries(['athletes']);
      
      const teamName = teams.find(t => t.teamId === teamId)?.teamName;
      toast.success(`Você saiu do ${teamName} com sucesso!`);
    },
    onError: (error) => {
      console.error('Erro ao sair do time:', error);
      toast.error('Erro ao sair do time. Tente novamente.');
    }
  });

  // Mutation para aceitar convite de novo time
  const acceptTeamInviteMutation = useMutation({
    mutationFn: async (inviteData) => {
      // Simular aceitação de convite para time adicional
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, team: inviteData };
    },
    onSuccess: (data) => {
      // Adicionar novo time à lista
      setTeams(currentTeams => [...currentTeams, data.team]);
      queryClient.invalidateQueries(['athlete', athleteId]);
      toast.success(`Você agora faz parte do ${data.team.teamName}!`);
    },
    onError: (error) => {
      toast.error('Erro ao aceitar convite');
    }
  });

  return {
    teams,
    athlete,
    isLoading,
    error,
    refetch,
    leaveTeam: leaveTeamMutation.mutate,
    acceptTeamInvite: acceptTeamInviteMutation.mutate,
    isLeavingTeam: leaveTeamMutation.isPending,
    isAcceptingInvite: acceptTeamInviteMutation.isPending
  };
};

// Hook para estatísticas de múltiplos times
export const useMultiTeamStats = (athleteId) => {
  const { teams } = useMultiTeamManagement(athleteId);
  
  const stats = {
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === 'active').length,
    pendingTeams: teams.filter(t => t.status === 'pending').length,
    upcomingMatches: teams.filter(t => t.nextMatch).length
  };

  return stats;
};