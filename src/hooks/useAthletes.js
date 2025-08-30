import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '../services/api'
import { API_ENDPOINTS } from '../utils/constants'

// Query keys
const QUERY_KEYS = {
  ATHLETES: 'athletes',
  ATHLETE: 'athlete',
  ATHLETE_INVITES: 'athleteInvites',
  ATHLETE_STATS: 'athleteStats'
}

// Get all athletes
export const useAthletes = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ATHLETES.BASE, { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single athlete
export const useAthlete = (athleteId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETE, athleteId],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BASE}/${athleteId}`)
      return response.data
    },
    enabled: enabled && !!athleteId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get athlete invites
export const useAthleteInvites = (athleteId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETE_INVITES, athleteId],
    queryFn: async () => {
      const url = API_ENDPOINTS.ATHLETES.INVITES.replace(':id', athleteId)
      const response = await apiClient.get(url)
      return response.data
    },
    enabled: enabled && !!athleteId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Update athlete profile
export const useUpdateAthlete = (athleteId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates) => {
      const response = await apiClient.put(`${API_ENDPOINTS.ATHLETES.BASE}/${athleteId}`, updates)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETE, athleteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETES] })
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar perfil')
    }
  })
}

// Accept invite
export const useAcceptInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteId) => {
      const url = API_ENDPOINTS.INVITES.ACCEPT.replace(':id', inviteId)
      const response = await apiClient.patch(url)
      return response.data
    },
    onSuccess: (data, inviteId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETE_INVITES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETES] })
      queryClient.invalidateQueries({ queryKey: ['clubAthletes'] })
      toast.success('Convite aceito! Você agora faz parte do clube.')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao aceitar convite')
    }
  })
}

// Reject invite
export const useRejectInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteId) => {
      const url = API_ENDPOINTS.INVITES.REJECT.replace(':id', inviteId)
      const response = await apiClient.patch(url)
      return response.data
    },
    onSuccess: (data, inviteId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETE_INVITES] })
      toast.success('Convite recusado.')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao recusar convite')
    }
  })
}

// Leave club
export const useLeaveClub = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (athleteId) => {
      const url = API_ENDPOINTS.ATHLETES.LEAVE.replace(':id', athleteId)
      const response = await apiClient.patch(url)
      return response.data
    },
    onSuccess: (data, athleteId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETE, athleteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATHLETES] })
      queryClient.invalidateQueries({ queryKey: ['clubAthletes'] })
      toast.success('Você saiu do clube.')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao sair do clube')
    }
  })
}

// Search athletes
export const useSearchAthletes = (query, filters = {}, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, 'search', query, filters],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ATHLETES.BASE, {
        params: { search: query, ...filters }
      })
      return response.data
    },
    enabled: enabled && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get athlete statistics
export const useAthleteStats = (athleteId, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETE_STATS, athleteId],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BASE}/${athleteId}/stats`)
      return response.data
    },
    enabled: enabled && !!athleteId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get free athletes (without club)
export const useFreeAthletes = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, 'free', params],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ATHLETES.BASE, {
        params: { ...params, status: 'free' }
      })
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Custom hooks for athlete-specific operations
export const useAthleteOperations = (athleteId) => {
  const updateAthlete = useUpdateAthlete(athleteId)
  const acceptInvite = useAcceptInvite()
  const rejectInvite = useRejectInvite()
  const leaveClub = useLeaveClub()

  return {
    updateProfile: (updates) => updateAthlete.mutate(updates),
    acceptInvite: (inviteId) => acceptInvite.mutate(inviteId),
    rejectInvite: (inviteId) => rejectInvite.mutate(inviteId),
    leaveClub: () => leaveClub.mutate(athleteId),
    isUpdating: updateAthlete.isPending,
    isProcessingInvite: acceptInvite.isPending || rejectInvite.isPending,
    isLeavingClub: leaveClub.isPending
  }
}

// Hook for athlete dashboard data
export const useAthleteDashboard = (athleteId) => {
  const athlete = useAthlete(athleteId)
  const invites = useAthleteInvites(athleteId)
  const stats = useAthleteStats(athleteId)

  return {
    athlete: athlete.data,
    invites: invites.data || [],
    stats: stats.data,
    isLoading: athlete.isLoading || invites.isLoading || stats.isLoading,
    error: athlete.error || invites.error || stats.error,
    refetch: () => {
      athlete.refetch()
      invites.refetch()
      stats.refetch()
    }
  }
}

// Hook for managing athlete invites
export const useAthleteInviteManager = (athleteId) => {
  const { data: invites, isLoading, error, refetch } = useAthleteInvites(athleteId)
  const operations = useAthleteOperations(athleteId)

  const pendingInvites = invites?.filter(invite => invite.status === 'pending') || []
  const processedInvites = invites?.filter(invite => invite.status !== 'pending') || []

  return {
    pendingInvites,
    processedInvites,
    totalInvites: invites?.length || 0,
    hasPendingInvites: pendingInvites.length > 0,
    isLoading,
    error,
    refetch,
    acceptInvite: operations.acceptInvite,
    rejectInvite: operations.rejectInvite,
    isProcessing: operations.isProcessingInvite
  }
}

// Hook for athlete profile management
export const useAthleteProfile = (athleteId) => {
  const { data: athlete, isLoading, error, refetch } = useAthlete(athleteId)
  const { updateProfile, isUpdating } = useAthleteOperations(athleteId)

  const profileData = {
    personalInfo: athlete ? {
      name: athlete.name,
      age: athlete.age,
      position: athlete.position,
      email: athlete.email
    } : null,
    clubInfo: athlete?.club ? {
      name: athlete.club.name,
      bairro: athlete.club.bairro,
      joinedAt: athlete.joinedAt
    } : null,
    status: athlete?.status || 'free'
  }

  return {
    athlete,
    profileData,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating,
    hasClub: !!athlete?.club,
    isFree: athlete?.status === 'free',
    isActive: athlete?.status === 'active',
    isPending: athlete?.status === 'pending'
  }
}