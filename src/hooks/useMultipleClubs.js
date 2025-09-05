// src/hooks/useMultipleClubs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '../services/api'
import { QUERY_KEYS, API_ENDPOINTS } from '../services/config'

// Hook para atletas com múltiplos clubes
export const useAthleteClubs = (athleteId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, athleteId, 'clubs'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BY_ID}/${athleteId}/clubs`)
      return response.data
    },
    enabled: !!athleteId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para dashboard do atleta com múltiplos clubes
export const useAthleteMultiClubDashboard = (athleteId) => {
  const athlete = useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, athleteId],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BY_ID}/${athleteId}`)
      return response.data
    },
    enabled: !!athleteId,
  })

  const clubs = useAthleteClubs(athleteId)
  
  const invites = useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, athleteId, 'invites'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BY_ID}/${athleteId}/invites`)
      return response.data
    },
    enabled: !!athleteId,
  })

  const stats = useQuery({
    queryKey: [QUERY_KEYS.ATHLETES, athleteId, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.ATHLETES.BY_ID}/${athleteId}/stats`)
      return response.data
    },
    enabled: !!athleteId,
  })

  return {
    athlete: athlete.data,
    clubs: clubs.data || [],
    invites: invites.data || [],
    stats: stats.data,
    isLoading: athlete.isLoading || clubs.isLoading || invites.isLoading || stats.isLoading,
    error: athlete.error || clubs.error || invites.error || stats.error,
    refetch: () => {
      athlete.refetch()
      clubs.refetch()
      invites.refetch()
      stats.refetch()
    }
  }
}

// Hook para operações com múltiplos clubes
export const useMultiClubOperations = (athleteId) => {
  const queryClient = useQueryClient()

  const acceptInvite = useMutation({
    mutationFn: async (inviteId) => {
      const response = await apiClient.post(`${API_ENDPOINTS.INVITES}/${inviteId}/accept`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ATHLETES, athleteId])
      toast.success('Convite aceito! Você agora faz parte do clube.')
    },
    onError: () => {
      toast.error('Erro ao aceitar convite.')
    }
  })

  const rejectInvite = useMutation({
    mutationFn: async (inviteId) => {
      const response = await apiClient.post(`${API_ENDPOINTS.INVITES}/${inviteId}/reject`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ATHLETES, athleteId])
      toast.success('Convite rejeitado.')
    },
    onError: () => {
      toast.error('Erro ao rejeitar convite.')
    }
  })

  const leaveClub = useMutation({
    mutationFn: async (clubId) => {
      const response = await apiClient.delete(`${API_ENDPOINTS.ATHLETES.BY_ID}/${athleteId}/clubs/${clubId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ATHLETES, athleteId])
      toast.success('Você saiu do clube.')
    },
    onError: () => {
      toast.error('Erro ao sair do clube.')
    }
  })

  return {
    acceptInvite: acceptInvite.mutate,
    rejectInvite: rejectInvite.mutate,
    leaveClub: leaveClub.mutate,
    isAccepting: acceptInvite.isPending,
    isRejecting: rejectInvite.isPending,
    isLeaving: leaveClub.isPending
  }
}

// Componente de Card do Clube para o Dashboard do Atleta
export const ClubCard = ({ club, onLeave, isLeaving }) => {
  const [showLeaveModal, setShowLeaveModal] = React.useState(false)

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏟️</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{club.name}</h3>
              <p className="text-sm text-gray-600">{club.bairro}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                club.membershipStatus === 'active' ? 'bg-green-100 text-green-800' :
                club.membershipStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {club.membershipStatus === 'active' ? 'Ativo' :
                 club.membershipStatus === 'pending' ? 'Pendente' : 'Inativo'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to={`/clubs/${club.id}`}>
              <Button variant="outline" size="sm">
                Ver Perfil
              </Button>
            </Link>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="text-red-600 hover:text-red-700 p-1"
              title="Sair do clube"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estatísticas do clube */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">{club.matchesPlayed || 0}</div>
              <div className="text-gray-600">Jogos</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{club.goalsScored || 0}</div>
              <div className="text-gray-600">Gols</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{club.championshipsActive || 0}</div>
              <div className="text-gray-600">Campeonatos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      <Modal 
        isOpen={showLeaveModal} 
        onClose={() => setShowLeaveModal(false)}
        title="Sair do Clube"
      >
        <ModalBody>
          <div className="text-center">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Deseja realmente sair do {club.name}?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Você perderá acesso aos campeonatos ativos deste clube e suas estatísticas serão mantidas.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Você pode receber novos convites deste clube no futuro.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowLeaveModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onLeave(club.id)
              setShowLeaveModal(false)
            }}
            loading={isLeaving}
          >
            Sair do Clube
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}