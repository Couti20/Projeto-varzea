import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../context/AuthContext'
import { useClubTeam } from '../../hooks/useClubs'
import { Card, Button, Input, Tabs, EmptyStateCard, Modal, ModalBody, ModalFooter, StatsCard } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { inviteAthleteSchema } from '../../utils/validations'
import { formatDate } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

const ClubTeam = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('active')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [showRemoveModal, setShowRemoveModal] = useState(false)

  const {
    athletes,
    athletesByPosition,
    stats,
    isLoading,
    error,
    refetch,
    inviteAthlete,
    removeAthlete,
    isInviting,
    isRemoving
  } = useClubTeam(user.id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando elenco...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar elenco
          </h2>
          <p className="text-gray-600 mb-4">Tente recarregar a página</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  const activeAthletes = athletes.filter(a => a.status === 'active')
  const pendingAthletes = athletes.filter(a => a.status === 'pending')

  const handleRemoveAthlete = (athlete) => {
    setSelectedAthlete(athlete)
    setShowRemoveModal(true)
  }

  const confirmRemoveAthlete = async () => {
    if (!selectedAthlete) return
    
    try {
      await removeAthlete(selectedAthlete.id)
      setShowRemoveModal(false)
      setSelectedAthlete(null)
    } catch (error) {
      // Error handled in hook
    }
  }

  const tabs = [
    {
      id: 'active',
      label: 'Elenco Ativo',
      badge: stats.active,
      icon: '⚽'
    },
    {
      id: 'pending',
      label: 'Convites Enviados',
      badge: stats.pending,
      icon: '⏳'
    },
    {
      id: 'positions',
      label: 'Por Posição',
      badge: Object.keys(athletesByPosition).length,
      icon: '📋'
    }
  ]

  return (
    <DashboardLayout
      title="Gestão do Elenco 👥"
      subtitle={`${stats.total} atletas • ${stats.active} ativos • ${stats.pending} pendentes`}
      actions={
        <div className="flex space-x-3">
          <Button onClick={refetch} variant="outline" size="sm">
            🔄 Atualizar
          </Button>
          <Button onClick={() => setShowInviteModal(true)}>
            ➕ Convidar Atleta
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatsCard
          title="Total"
          value={stats.total}
          icon="👥"
          color="primary"
        />
        <StatsCard
          title="Ativos"
          value={stats.active}
          icon="⚽"
          color="success"
        />
        <StatsCard
          title="Pendentes"
          value={stats.pending}
          icon="⏳"
          color="warning"
        />
        <StatsCard
          title="Posições"
          value={Object.keys(athletesByPosition).length}
          icon="📋"
          color="secondary"
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs.map(tab => ({
          ...tab,
          label: (
            <span className="flex items-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px]">
                  {tab.badge}
                </span>
              )}
            </span>
          )
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Active Athletes */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeAthletes.length > 0 ? (
            <>
              {/* Quick Actions */}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <div className="text-sm text-green-800">
                      <p className="font-medium">
                        Você tem {activeAthletes.length} atleta{activeAthletes.length !== 1 ? 's' : ''} ativo{activeAthletes.length !== 1 ? 's' : ''}
                      </p>
                      <p>Gerencie convites, remova atletas ou convide novos jogadores</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setShowInviteModal(true)}>
                    ➕ Convidar Mais
                  </Button>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeAthletes.map(athlete => (
                  <AthleteCard
                    key={athlete.id}
                    athlete={athlete}
                    onRemove={() => handleRemoveAthlete(athlete)}
                    isRemoving={isRemoving}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon="👥"
              title="Nenhum atleta no elenco"
              description="Seu clube ainda não possui atletas ativos. Comece convidando jogadores!"
              action={
                <div className="space-y-4">
                  <Button onClick={() => setShowInviteModal(true)}>
                    Convidar Primeiro Atleta
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">💡 <strong>Como funciona:</strong></p>
                    <div className="bg-gray-50 p-3 rounded-lg text-left space-y-1">
                      <p>1. Peça o <strong>ID único</strong> do atleta</p>
                      <p>2. Envie o convite pelo sistema</p>
                      <p>3. O atleta recebe e pode aceitar/recusar</p>
                      <p>4. Se aceitar, entra automaticamente no elenco</p>
                    </div>
                  </div>
                </div>
              }
            />
          )}
        </div>
      )}

      {/* Pending Athletes */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingAthletes.length > 0 ? (
            <>
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600 text-xl">⏳</span>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">
                      {pendingAthletes.length} convite{pendingAthletes.length !== 1 ? 's' : ''} aguardando resposta
                    </p>
                    <p>
                      Os atletas receberam o convite e podem aceitar ou recusar a qualquer momento.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                {pendingAthletes.map(athlete => (
                  <PendingAthleteCard
                    key={athlete.id}
                    athlete={athlete}
                    onRemove={() => handleRemoveAthlete(athlete)}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon="📩"
              title="Nenhum convite pendente"
              description="Você não tem convites aguardando resposta no momento."
              action={
                <Button onClick={() => setShowInviteModal(true)}>
                  Enviar Novo Convite
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* Athletes by Position */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          {Object.keys(athletesByPosition).length > 0 ? (
            Object.entries(athletesByPosition).map(([position, positionAthletes]) => (
              <Card key={position} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {position} ({positionAthletes.length})
                  </h3>
                  <span className="text-sm text-gray-500">
                    {positionAthletes.filter(a => a.status === 'active').length} ativos
                  </span>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {positionAthletes.map(athlete => (
                    <div key={athlete.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{athlete.name}</h4>
                          <p className="text-sm text-gray-600">{athlete.age} anos</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            athlete.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {athlete.status === 'active' ? 'Ativo' : 'Pendente'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAthlete(athlete)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <EmptyStateCard
              icon="📋"
              title="Nenhum atleta por posição"
              description="Adicione atletas ao seu elenco para ver a distribuição por posições."
            />
          )}
        </div>
      )}

      {/* Invite Athlete Modal */}
      <InviteAthleteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={inviteAthlete}
        isInviting={isInviting}
      />

      {/* Remove Athlete Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        title="Remover Atleta"
        size="md"
      >
        <ModalBody>
          {selectedAthlete && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Remover {selectedAthlete.name}?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Atleta:</strong> {selectedAthlete.name}
                </p>
                <p>
                  <strong>Posição:</strong> {selectedAthlete.position}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAthlete.status === 'active' ? 'Ativo' : 'Pendente'}
                </p>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  Esta ação não pode ser desfeita. O atleta será removido do clube 
                  e poderá receber novos convites no futuro.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowRemoveModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmRemoveAthlete}
            loading={isRemoving}
          >
            Remover Atleta
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  )
}

// Active Athlete Card Component
const AthleteCard = ({ athlete, onRemove, isRemoving }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">⚽</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900">{athlete.name}</h3>
          <p className="text-sm text-gray-600">{athlete.position}</p>
          <p className="text-sm text-gray-600">{athlete.age} anos</p>
          {athlete.phone && (
            <p className="text-xs text-gray-500 mt-1">{athlete.phone}</p>
          )}
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-800">
            Ativo
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
        >
          🗑️
        </Button>
      </div>
    </div>
  </Card>
)

// Pending Athlete Card Component
const PendingAthleteCard = ({ athlete, onRemove }) => (
  <Card className="p-4 bg-yellow-50 border-yellow-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">⏳</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{athlete.name}</h3>
          <p className="text-sm text-gray-600">
            {athlete.position} • {athlete.age} anos
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Convite enviado • Aguardando resposta
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
      >
        Cancelar Convite
      </Button>
    </div>
  </Card>
)

// Invite Athlete Modal Component
const InviteAthleteModal = ({ isOpen, onClose, onInvite, isInviting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(inviteAthleteSchema)
  })

  const onSubmit = async (data) => {
    try {
      await onInvite(data.athleteId)
      reset()
      onClose()
    } catch (error) {
      // Error handled in parent component
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Convidar Atleta" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <Input
              label="ID do Atleta"
              placeholder="Digite o ID único do atleta"
              hint="O atleta deve fornecer seu ID único para você"
              error={errors.athleteId?.message}
              {...register('athleteId')}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. Peça ao atleta o <strong>ID único</strong> dele</p>
              <p>2. Cole o ID no campo acima</p>
              <p>3. O atleta receberá o convite automaticamente</p>
              <p>4. Ele pode aceitar ou recusar o convite</p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isInviting}>
            {isInviting ? 'Enviando...' : 'Enviar Convite'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default ClubTeam