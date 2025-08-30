import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '../services/api'
import { API_ENDPOINTS } from '../utils/constants'

// Query keys
const QUERY_KEYS = {
  CLUBS: 'clubs',
  CLUB: 'club',
  CLUB_ATHLETES: 'clubAthletes',
  INVITES: 'invites'
}

// Get all clubs
export const useClubs = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLUBS, params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CLUBS.BASE, { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single club
export const useClub = (clubId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLUB, clubId],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.CLUBS.BASE}/${clubId}`)
      return response.data
    },
    enabled: enabled && !!clubId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get club athletes
export const useClubAthletes = (clubId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLUB_ATHLETES, clubId],
    queryFn: async () => {
      const url = API_ENDPOINTS.CLUBS.ATHLETES.replace(':id', clubId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!clubId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Create club
export const useCreateClub = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clubData) => {
      const response = await apiClient.post(API_ENDPOINTS.CLUBS.BASE, clubData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLUBS] })
      toast.success('Clube criado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar clube')
    }
  })
}

// Update club
export const useUpdateClub = (clubId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates) => {
      const response = await apiClient.put(`${API_ENDPOINTS.CLUBS.BASE}/${clubId}`, updates)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLUB, clubId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLUBS] })
      toast.success('Clube atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar clube')
    }
  })
}

// Invite athlete to club
export const useInviteAthlete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ clubId, athleteId }) => {
      const url = API_ENDPOINTS.CLUBS.INVITE.replace(':id', clubId)
      const response = await apiClient.post(url, { athleteId })
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVITES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLUB_ATHLETES, variables.clubId] })
      toast.success('Convite enviado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao enviar convite')
    }
  })
}

// Remove athlete from club
export const useRemoveAthlete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ clubId, athleteId }) => {
      const url = API_ENDPOINTS.CLUBS.REMOVE.replace(':id', clubId).replace(':athleteId', athleteId)
      const response = await apiClient.patch(url)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLUB_ATHLETES, variables.clubId] })
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      toast.success('Atleta removido do clube')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao remover atleta')
    }
  })
}

// Search clubs
export const useSearchClubs = (query, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLUBS, 'search', query],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CLUBS.BASE, {
        params: { search: query }
      })
      return response.data
    },
    enabled: enabled && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get club statistics
export const useClubStats = (clubId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CLUB, clubId, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.CLUBS.BASE}/${clubId}/stats`)
      return response.data
    },
    enabled: enabled && !!clubId,
    staleTime: 5 * 60 * 1000,
  })
}

// Custom hooks for club-specific operations
export const useClubOperations = (clubId) => {
  const inviteAthlete = useInviteAthlete()
  const removeAthlete = useRemoveAthlete()
  const updateClub = useUpdateClub(clubId)

  return {
    inviteAthlete: (athleteId) => inviteAthlete.mutate({ clubId, athleteId }),
    removeAthlete: (athleteId) => removeAthlete.mutate({ clubId, athleteId }),
    updateClub: (updates) => updateClub.mutate(updates),
    isInviting: inviteAthlete.isPending,
    isRemoving: removeAthlete.isPending,
    isUpdating: updateClub.isPending
  }
}

// Hook for club dashboard data
export const useClubDashboard = (clubId) => {
  const club = useClub(clubId)
  const athletes = useClubAthletes(clubId)
  const stats = useClubStats(clubId)

  return {
    club: club.data,
    athletes: athletes.data || [],
    stats: stats.data,
    isLoading: club.isLoading || athletes.isLoading || stats.isLoading,
    error: club.error || athletes.error || stats.error,
    refetch: () => {
      club.refetch()
      athletes.refetch()
      stats.refetch()
    }
  }
}

// Hook for managing club team
export const useClubTeam = (clubId) => {
  const { data: athletes, isLoading, error, refetch } = useClubAthletes(clubId)
  const operations = useClubOperations(clubId)

  const getAthletesByPosition = () => {
    if (!athletes) return {}

    return athletes.reduce((acc, athlete) => {
      const position = athlete.position || 'Não definido'
      if (!acc[position]) acc[position] = []
      acc[position].push(athlete)
      return acc
    }, {})
  }

  const getTeamStats = () => {
    if (!athletes) return { total: 0, active: 0, pending: 0 }

    return athletes.reduce((acc, athlete) => {
      acc.total++
      if (athlete.status === 'active') acc.active++
      if (athlete.status === 'pending') acc.pending++
      return acc
    }, { total: 0, active: 0, pending: 0 })
  }

  return {
    athletes: athletes || [],
    athletesByPosition: getAthletesByPosition(),
    stats: getTeamStats(),
    isLoading,
    error,
    refetch,
    ...operations
  }
}