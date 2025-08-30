import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '../services/api'
import { API_ENDPOINTS, POINTS_SYSTEM } from '../utils/constants'

// Query keys
const QUERY_KEYS = {
  CHAMPIONSHIPS: 'championships',
  CHAMPIONSHIP: 'championship',
  CHAMPIONSHIP_TEAMS: 'championshipTeams',
  CHAMPIONSHIP_MATCHES: 'championshipMatches',
  CHAMPIONSHIP_STANDINGS: 'championshipStandings',
  CHAMPIONSHIP_STATS: 'championshipStats'
}

// Get all championships
export const useChampionships = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIPS, params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CHAMPIONSHIPS.BASE, { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single championship
export const useChampionship = (championshipId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIP, championshipId],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.CHAMPIONSHIPS.BASE}/${championshipId}`)
      return response.data
    },
    enabled: enabled && !!championshipId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get championship teams
export const useChampionshipTeams = (championshipId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIP_TEAMS, championshipId],
    queryFn: async () => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.TEAMS.replace(':id', championshipId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!championshipId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get championship matches
export const useChampionshipMatches = (championshipId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIP_MATCHES, championshipId],
    queryFn: async () => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.MATCHES.replace(':id', championshipId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!championshipId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get championship standings
export const useChampionshipStandings = (championshipId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIP_STANDINGS, championshipId],
    queryFn: async () => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.STANDINGS.replace(':id', championshipId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!championshipId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get championship statistics (top scorers, etc.)
export const useChampionshipStats = (championshipId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAMPIONSHIP_STATS, championshipId],
    queryFn: async () => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.STATS.replace(':id', championshipId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!championshipId,
    staleTime: 5 * 60 * 1000,
  })
}

// Create championship
export const useCreateChampionship = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (championshipData) => {
      const response = await apiClient.post(API_ENDPOINTS.CHAMPIONSHIPS.BASE, championshipData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIPS] })
      toast.success('Campeonato criado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar campeonato')
    }
  })
}

// Update championship
export const useUpdateChampionship = (championshipId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates) => {
      const response = await apiClient.put(`${API_ENDPOINTS.CHAMPIONSHIPS.BASE}/${championshipId}`, updates)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP, championshipId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIPS] })
      toast.success('Campeonato atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar campeonato')
    }
  })
}

// Add team to championship
export const useAddTeamToChampionship = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ championshipId, teamId }) => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.TEAMS.replace(':id', championshipId)
      const response = await apiClient.post(url, { teamId })
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP_TEAMS, variables.championshipId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP, variables.championshipId] })
      toast.success('Time adicionado ao campeonato!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao adicionar time')
    }
  })
}

// Generate matches for championship
export const useGenerateMatches = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (championshipId) => {
      const url = API_ENDPOINTS.CHAMPIONSHIPS.GENERATE_MATCHES.replace(':id', championshipId)
      const response = await apiClient.post(url)
      return response.data
    },
    onSuccess: (data, championshipId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP_MATCHES, championshipId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP, championshipId] })
      toast.success('Tabela de jogos gerada com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao gerar tabela')
    }
  })
}

// Update match score
export const useUpdateMatchScore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ matchId, scoreData }) => {
      const url = API_ENDPOINTS.MATCHES.UPDATE_SCORE.replace(':id', matchId)
      const response = await apiClient.patch(url, scoreData)
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP_MATCHES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP_STANDINGS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAMPIONSHIP_STATS] })
      toast.success('Resultado atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar resultado')
    }
  })
}

// Custom hooks for championship-specific operations
export const useChampionshipOperations = (championshipId) => {
  const updateChampionship = useUpdateChampionship(championshipId)
  const addTeam = useAddTeamToChampionship()
  const generateMatches = useGenerateMatches()
  const updateScore = useUpdateMatchScore()

  return {
    updateChampionship: (updates) => updateChampionship.mutate(updates),
    addTeam: (teamId) => addTeam.mutate({ championshipId, teamId }),
    generateMatches: () => generateMatches.mutate(championshipId),
    updateMatchScore: (matchId, scoreData) => updateScore.mutate({ matchId, scoreData }),
    isUpdating: updateChampionship.isPending,
    isAddingTeam: addTeam.isPending,
    isGenerating: generateMatches.isPending,
    isUpdatingScore: updateScore.isPending
  }
}

// Hook for championship dashboard
export const useChampionshipDashboard = (championshipId) => {
  const championship = useChampionship(championshipId)
  const teams = useChampionshipTeams(championshipId)
  const matches = useChampionshipMatches(championshipId)
  const standings = useChampionshipStandings(championshipId)
  const stats = useChampionshipStats(championshipId)

  return {
    championship: championship.data,
    teams: teams.data || [],
    matches: matches.data || [],
    standings: standings.data || [],
    stats: stats.data,
    isLoading: championship.isLoading || teams.isLoading || matches.isLoading || standings.isLoading,
    error: championship.error || teams.error || matches.error || standings.error,
    refetch: () => {
      championship.refetch()
      teams.refetch()
      matches.refetch()
      standings.refetch()
      stats.refetch()
    }
  }
}

// Hook for calculating standings locally (for real-time updates)
export const useCalculateStandings = (matches, teams) => {
  const calculateStandings = () => {
    if (!matches || !teams) return []

    const standings = teams.map(team => ({
      teamId: team.id,
      name: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      gf: 0, // goals for
      ga: 0, // goals against
      gd: 0, // goal difference
      points: 0
    }))

    matches
      .filter(match => match.status === 'finished' && match.scoreHome !== null && match.scoreAway !== null)
      .forEach(match => {
        const home = standings.find(s => s.teamId === match.homeTeamId)
        const away = standings.find(s => s.teamId === match.awayTeamId)

        if (home && away) {
          home.played++
          away.played++
          home.gf += match.scoreHome
          home.ga += match.scoreAway
          away.gf += match.scoreAway
          away.ga += match.scoreHome

          if (match.scoreHome > match.scoreAway) {
            home.wins++
            home.points += POINTS_SYSTEM.WIN
            away.losses++
            away.points += POINTS_SYSTEM.LOSS
          } else if (match.scoreHome < match.scoreAway) {
            away.wins++
            away.points += POINTS_SYSTEM.WIN
            home.losses++
            home.points += POINTS_SYSTEM.LOSS
          } else {
            home.draws++
            away.draws++
            home.points += POINTS_SYSTEM.DRAW
            away.points += POINTS_SYSTEM.DRAW
          }

          home.gd = home.gf - home.ga
          away.gd = away.gf - away.ga
        }
      })

    // Sort by: points desc, goal difference desc, wins desc, goals for desc
    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.gd !== a.gd) return b.gd - a.gd
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.gf - a.gf
    })
  }

  return calculateStandings()
}

// Hook for getting top scorers from matches
export const useCalculateTopScorers = (matches) => {
  const calculateTopScorers = () => {
    if (!matches) return []

    const scorers = {}

    matches
      .filter(match => match.status === 'finished' && match.goals)
      .forEach(match => {
        match.goals.forEach(goal => {
          if (goal.type !== 'own_goal') { // Exclude own goals
            const key = goal.playerId
            if (!scorers[key]) {
              scorers[key] = {
                playerId: goal.playerId,
                name: goal.playerName || 'Jogador',
                teamId: goal.teamId,
                teamName: goal.teamName || 'Time',
                goals: 0
              }
            }
            scorers[key].goals++
          }
        })
      })

    return Object.values(scorers)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10) // Top 10
  }

  return calculateTopScorers()
}

// Hook for active championships
export const useActiveChampionships = () => {
  return useChampionships({ status: 'active' })
}