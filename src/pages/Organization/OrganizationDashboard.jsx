import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useChampionships } from '../../hooks/useChampionships'
import { Card, StatsCard, Button, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/Layout'
import { formatDate } from '../../utils/helpers'

const OrganizationDashboard = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const { 
    data: allChampionships, 
    isLoading, 
    error 
  } = useChampionships({ organizerId: user.id })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando painel da organização...</p>
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
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600">Tente recarregar a página</p>
        </div>
      </div>
    )
  }

  const championships = allChampionships?.data || []
  const activeChampionships = championships.filter(c => c.status === 'active')
  const draftChampionships = championships.filter(c => c.status === 'draft')
  const finishedChampionships = championships.filter(c => c.status === 'finished')
  
  const totalTeams = championships.reduce((sum, c) => sum + (c.teamsCount || 0), 0)
  const totalMatches = championships.reduce((sum, c) => sum + (c.matchesCount || 0), 0)

  return (
    <DashboardLayout
      title={`${user.name} 🏆`}
      subtitle="Painel de organização de campeonatos"
      actions={
        <Button onClick={() => setShowCreateModal(true)}>
          ➕ Criar Campeonato
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Campeonatos"
          value={championships.length}
          subtitle={`${activeChampionships.length} ativos`}
          icon="🏆"
          color="primary"
        />

        <StatsCard
          title="Times"
          value={totalTeams}
          subtitle="Participantes"
          icon="🏟️"
          color="secondary"
        />

        <StatsCard
          title="Jogos"
          value={totalMatches}
          subtitle="Organizados"
          icon="⚽"
          color="success"
        />

        <StatsCard
          title="Em Andamento"
          value={activeChampionships.length}
          subtitle="Campeonatos ativos"
          icon="🔥"
          color="warning"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Championships */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Campeonatos Ativos ({activeChampionships.length})
              </h3>
              <Link to="/organization/championships">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>

            {activeChampionships.length > 0 ? (
              <div className="space-y-4">
                {activeChampionships.slice(0, 3).map(championship => (
                  <div key={championship.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {championship.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>📅 {championship.season}</span>
                          <span>👥 {championship.teamsCount} times</span>
                          <span>⚽ {championship.matchesCount || 0} jogos</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Em andamento
                        </span>
                        <Link to={`/championships/${championship.id}`}>
                          <Button size="sm">
                            Gerenciar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-2xl mb-2">🏆</p>
                <p>Nenhum campeonato ativo</p>
                <p className="text-sm mt-1">
                  Crie um novo campeonato para começar
                </p>
              </div>
            )}
          </Card>

          {/* Draft Championships */}
          {draftChampionships.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Rascunhos ({draftChampionships.length})
                </h3>
              </div>

              <div className="space-y-3">
                {draftChampionships.slice(0, 3).map(championship => (
                  <div key={championship.id} className="border border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {championship.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Criado em {formatDate(championship.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Rascunho
                        </span>
                        <Link to={`/championships/${championship.id}`}>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Atividade Recente
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">🏆</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <strong>Copa da Várzea 2025</strong> - Novo time inscrito
                  </p>
                  <p className="text-xs text-gray-500">FC Barcelona do Bairro se inscreveu</p>
                </div>
                <span className="text-xs text-gray-400">2h</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">⚽</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <strong>Copa da Várzea 2025</strong> - Resultado atualizado
                  </p>
                  <p className="text-xs text-gray-500">FC Barcelona 2 x 1 Real Periferia</p>
                </div>
                <span className="text-xs text-gray-400">1d</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">📅</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <strong>Torneio de Verão 2025</strong> - Campeonato criado
                  </p>
                  <p className="text-xs text-gray-500">Novo campeonato em modo rascunho</p>
                </div>
                <span className="text-xs text-gray-400">3d</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="mr-2">➕</span>
                Criar Campeonato
              </Button>
              
              <Link to="/organization/championships" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🏆</span>
                  Gerenciar Campeonatos
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">📊</span>
                Ver Relatórios
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">⚙️</span>
                Configurações
              </Button>
            </div>
          </Card>

          {/* Championship Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumo dos Campeonatos
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de Campeonatos:</span>
                <span className="font-medium">{championships.length}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Em Andamento:</span>
                <span className="font-medium text-green-600">{activeChampionships.length}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rascunhos:</span>
                <span className="font-medium text-yellow-600">{draftChampionships.length}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Finalizados:</span>
                <span className="font-medium text-gray-600">{finishedChampionships.length}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Times Participantes:</span>
                  <span className="font-medium">{totalTeams}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jogos Organizados:</span>
                  <span className="font-medium">{totalMatches}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dicas de Organização 💡
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>•</strong> Defina regras claras antes de iniciar
              </p>
              <p>
                <strong>•</strong> Mantenha os resultados sempre atualizados
              </p>
              <p>
                <strong>•</strong> Comunique-se regularmente com os times
              </p>
              <p>
                <strong>•</strong> Use o sistema de compartilhamento
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Championship Modal */}
      <CreateChampionshipModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  )
}

// Simple Create Championship Modal
const CreateChampionshipModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    season: new Date().getFullYear().toString(),
    format: 'league',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, this would call the create championship mutation
    console.log('Creating championship:', formData)
    onClose()
    // Show success toast
    alert('Campeonato criado com sucesso!')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Campeonato" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Campeonato *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Copa da Várzea 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temporada *
              </label>
              <input
                type="text"
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato *
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="league">Pontos Corridos</option>
                <option value="knockout">Eliminatória</option>
                <option value="mixed">Misto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Descreva as regras e informações do campeonato..."
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            Criar Campeonato
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default OrganizationDashboard