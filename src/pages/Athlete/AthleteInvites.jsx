import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAthleteInviteManager } from '../../hooks/useAthletes'
import { Card, Button, Tabs, EmptyStateCard, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { formatDate, formatTime } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

const AthleteInvites = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedInvite, setSelectedInvite] = useState(null)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const {
    pendingInvites,
    processedInvites,
    totalInvites,
    hasPendingInvites,
    isLoading,
    error,
    refetch,
    acceptInvite,
    rejectInvite,
    isProcessing
  } = useAthleteInviteManager(user.id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando seus convites...</p>
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
            Erro ao carregar convites
          </h2>
          <p className="text-gray-600 mb-4">Tente recarregar a página</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  const handleAcceptInvite = (invite) => {
    setSelectedInvite(invite)
    setShowAcceptModal(true)
  }

  const handleRejectInvite = (invite) => {
    setSelectedInvite(invite)
    setShowRejectModal(true)
  }

  const confirmAcceptInvite = async () => {
    if (!selectedInvite) return
    
    try {
      await acceptInvite(selectedInvite.id)
      setShowAcceptModal(false)
      setSelectedInvite(null)
    } catch (error) {
      // Error handled in hook
    }
  }

  const confirmRejectInvite = async () => {
    if (!selectedInvite) return
    
    try {
      await rejectInvite(selectedInvite.id)
      setShowRejectModal(false)
      setSelectedInvite(null)
    } catch (error) {
      // Error handled in hook
    }
  }

  const tabs = [
    {
      id: 'pending',
      label: 'Pendentes',
      badge: pendingInvites.length,
      icon: '📩'
    },
    {
      id: 'history',
      label: 'Histórico',
      badge: processedInvites.length,
      icon: '📜'
    }
  ]

  return (
    <DashboardLayout
      title="Meus Convites 📩"
      subtitle={`${totalInvites} convites • ${pendingInvites.length} pendentes`}
      actions={
        <Button onClick={refetch} variant="outline" size="sm">
          🔄 Atualizar
        </Button>
      }
    >
      {/* Summary Cards */}
      {totalInvites > 0 && (
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {pendingInvites.length}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {processedInvites.filter(inv => inv.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Aceitos</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {processedInvites.filter(inv => inv.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Recusados</div>
          </Card>
        </div>
      )}

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

      {/* Pending Invites */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {pendingInvites.length > 0 ? (
            <>
              {/* Important Notice */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Atenção!</p>
                    <p>
                      Ao aceitar um convite, você automaticamente entrará no clube e 
                      todos os outros convites pendentes serão recusados.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                {pendingInvites.map(invite => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={() => handleAcceptInvite(invite)}
                    onReject={() => handleRejectInvite(invite)}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon="📭"
              title="Nenhum convite pendente"
              description="Você não tem convites aguardando resposta no momento."
              action={
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Para receber convites de clubes:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Seu ID único:
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-2 py-1 rounded border text-sm">
                        {user.id}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(user.id)
                          toast.success('ID copiado!')
                        }}
                      >
                        📋
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Compartilhe este ID com clubes para que possam te convidar
                  </p>
                </div>
              }
            />
          )}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {processedInvites.length > 0 ? (
            processedInvites.map(invite => (
              <HistoryInviteCard key={invite.id} invite={invite} />
            ))
          ) : (
            <EmptyStateCard
              icon="📜"
              title="Nenhum histórico"
              description="Você ainda não processou nenhum convite."
            />
          )}
        </div>
      )}

      {/* Accept Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Aceitar Convite"
        size="md"
      >
        <ModalBody>
          {selectedInvite && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aceitar convite do {selectedInvite.club?.name}?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Clube:</strong> {selectedInvite.club?.name}
                </p>
                <p>
                  <strong>Local:</strong> {selectedInvite.club?.bairro}
                </p>
                <p>
                  <strong>Convite enviado:</strong> {formatDate(selectedInvite.createdAt)}
                </p>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Ao aceitar, todos os outros convites pendentes serão automaticamente recusados.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowAcceptModal(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmAcceptInvite}
            loading={isProcessing}
          >
            Aceitar Convite
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Recusar Convite"
        size="md"
      >
        <ModalBody>
          {selectedInvite && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recusar convite do {selectedInvite.club?.name}?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Tem certeza que deseja recusar este convite? O clube poderá 
                  enviar um novo convite no futuro, se desejar.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowRejectModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmRejectInvite}
            loading={isProcessing}
          >
            Recusar Convite
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  )
}

// Pending Invite Card Component
const InviteCard = ({ invite, onAccept, onReject, isProcessing }) => (
  <Card className="p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-xl">🏟️</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {invite.club?.name || 'Clube'}
            </h3>
            <p className="text-sm text-gray-600">
              📍 {invite.club?.bairro || 'Local não informado'}
            </p>
            {invite.club?.foundedYear && (
              <p className="text-xs text-gray-500 mt-1">
                Fundado em {invite.club.foundedYear}
              </p>
            )}
          </div>
          
          <div className="text-right text-sm text-gray-500">
            <p>Enviado em</p>
            <p className="font-medium">
              {formatDate(invite.createdAt)}
            </p>
            <p className="text-xs">
              {formatTime(invite.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAccept}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial"
          >
            <span className="mr-1">✅</span>
            Aceitar Convite
          </Button>
          
          <Button
            variant="outline"
            onClick={onReject}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial"
          >
            <span className="mr-1">❌</span>
            Recusar
          </Button>
        </div>
      </div>
    </div>
  </Card>
)

// History Invite Card Component
const HistoryInviteCard = ({ invite }) => (
  <Card className="p-6 opacity-75">
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-lg">🏟️</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {invite.club?.name || 'Clube'}
            </h3>
            <p className="text-sm text-gray-600">
              📍 {invite.club?.bairro || 'Local não informado'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              invite.status === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {invite.status === 'accepted' ? '✅ Aceito' : '❌ Recusado'}
            </span>
            
            <div className="text-right text-xs text-gray-500">
              <p>
                {invite.status === 'accepted' ? 'Aceito' : 'Recusado'} em
              </p>
              <p className="font-medium">
                {formatDate(invite.acceptedAt || invite.rejectedAt || invite.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        {invite.status === 'accepted' && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              🎉 Parabéns! Você agora faz parte do {invite.club?.name}
            </p>
          </div>
        )}
        
        {invite.reason && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Motivo:</strong> {invite.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  </Card>
)

export default AthleteInvites