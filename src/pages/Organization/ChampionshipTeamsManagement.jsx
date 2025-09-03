// src/pages/Organization/ChampionshipTeamsManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Users, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shuffle,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '../../components/ui';
import MatchGeneration from '../../components/championship/MatchGeneration';

const ChampionshipTeamsManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showMatchGeneration, setShowMatchGeneration] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - Em produção viria da API
  useEffect(() => {
    setTimeout(() => {
      setChampionship({
        id: 1,
        name: 'Copa da Várzea 2025',
        season: '2025',
        format: 'league',
        status: 'open',
        maxTeams: 16,
        registrationDeadline: '2025-02-01',
        registrationFee: 150
      });

      // Times já inscritos
      const enrolledTeams = [
        {
          id: 1,
          clubId: 101,
          name: 'FC Barcelona do Bairro',
          shortName: 'BAR',
          logo: '🔵',
          captain: 'João Silva',
          phone: '(11) 99999-0001',
          email: 'barcelona.bairro@email.com',
          players: 18,
          status: 'confirmed',
          paymentStatus: 'paid',
          enrolledAt: '2025-01-10T10:00:00Z',
          foundedYear: 2020,
          neighborhood: 'Vila Madalena'
        },
        {
          id: 2,
          clubId: 102,
          name: 'Real Periferia',
          shortName: 'REA',
          logo: '⚪',
          captain: 'Pedro Santos',
          phone: '(11) 99999-0002',
          email: 'real.periferia@email.com',
          players: 16,
          status: 'pending',
          paymentStatus: 'pending',
          enrolledAt: '2025-01-12T14:30:00Z',
          foundedYear: 2018,
          neighborhood: 'Cidade Tiradentes'
        },
        {
          id: 3,
          clubId: 103,
          name: 'Santos da Quebrada',
          shortName: 'SAN',
          logo: '⚫',
          captain: 'Carlos Oliveira',
          phone: '(11) 99999-0003',
          email: 'santos.quebrada@email.com',
          players: 20,
          status: 'confirmed',
          paymentStatus: 'paid',
          enrolledAt: '2025-01-08T16:45:00Z',
          foundedYear: 2019,
          neighborhood: 'Capão Redondo'
        }
      ];
      setTeams(enrolledTeams);

      // Clubes disponíveis para convite
      const clubs = [
        {
          id: 104,
          name: 'Palmeiras da Vila',
          shortName: 'PAL',
          logo: '🟢',
          captain: 'Luis Fernando',
          neighborhood: 'Vila Olímpia',
          players: 15
        },
        {
          id: 105,
          name: 'Corinthians do Morro',
          shortName: 'COR',
          logo: '⚫',
          captain: 'Ricardo Alves',
          neighborhood: 'Heliópolis',
          players: 22
        }
      ];
      setAvailableClubs(clubs);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Filtrar times
  const getFilteredTeams = () => {
    let filtered = teams;
    
    if (searchTerm) {
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(team => team.status === filterStatus);
    }
    
    return filtered;
  };

  // Adicionar time ao campeonato
  const handleAddTeam = (club) => {
    const newTeam = {
      id: Date.now(),
      clubId: club.id,
      name: club.name,
      shortName: club.shortName,
      logo: club.logo,
      captain: club.captain,
      phone: '(11) 99999-0000',
      email: `${club.shortName.toLowerCase()}@email.com`,
      players: club.players,
      status: 'pending',
      paymentStatus: 'pending',
      enrolledAt: new Date().toISOString(),
      foundedYear: 2020,
      neighborhood: club.neighborhood
    };

    setTeams(prev => [...prev, newTeam]);
    setShowAddTeam(false);
  };

  // Remover time
  const handleRemoveTeam = (teamId) => {
    if (window.confirm('Tem certeza que deseja remover este time?')) {
      setTeams(prev => prev.filter(team => team.id !== teamId));
    }
  };

  // Confirmar time
  const handleConfirmTeam = (teamId) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, status: 'confirmed', paymentStatus: 'paid' }
        : team
    ));
  };

  // Gerar jogos
  const handleGenerateMatches = (matches) => {
    // Salvar jogos gerados
    console.log('Jogos gerados:', matches);
    // Navegar para página de jogos
    navigate(`/organization/championships/${id}/matches`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando times...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showMatchGeneration) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowMatchGeneration(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Times</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Gerar Jogos - {championship.name}
          </h1>
        </div>
        
        <MatchGeneration
          championship={championship}
          teams={teams.filter(t => t.status === 'confirmed')}
          onGenerate={handleGenerateMatches}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/organization/championships/${id}/manage`)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
            <p className="text-gray-600">Gestão de times e participantes</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowAddTeam(true)}
            disabled={teams.length >= championship.maxTeams}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Convidar Time</span>
          </Button>
          
          <Button
            onClick={() => setShowMatchGeneration(true)}
            disabled={teams.filter(t => t.status === 'confirmed').length < 2}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Gerar Jogos</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
          <div className="text-sm text-gray-600">Times Inscritos</div>
          <div className="text-xs text-gray-500">
            de {championship.maxTeams} máximo
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {teams.filter(t => t.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600">Confirmados</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {teams.filter(t => t.paymentStatus === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pagamento Pendente</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {teams.reduce((total, team) => total + (team.players || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total de Atletas</div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por time, capitão ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmados</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Exportar lista')}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Lista de Times */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">
            Times Participantes ({getFilteredTeams().length})
          </h3>
        </div>
        
        <div className="divide-y">
          {getFilteredTeams().map(team => (
            <div key={team.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Logo e Nome */}
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{team.logo}</div>
                    <div>
                      <div className="font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-500">{team.shortName}</div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      team.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      team.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {team.status === 'confirmed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirmado
                        </>
                      ) : team.status === 'pending' ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pendente
                        </>
                      ) : (
                        'Desconhecido'
                      )}
                    </span>
                    
                    {team.paymentStatus === 'pending' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pagar Taxa
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Informações e Ações */}
                <div className="flex items-center space-x-4">
                  {/* Informações */}
                  <div className="text-right text-sm text-gray-600 hidden lg:block">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{team.players} atletas</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>{team.captain}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{team.neighborhood}</span>
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      Inscrito em {new Date(team.enrolledAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  {/* Menu de Ações */}
                  <div className="flex items-center space-x-2">
                    {team.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleConfirmTeam(team.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmar
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTeam(team)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveTeam(team.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Informações Móveis */}
              <div className="lg:hidden mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{team.players} atletas</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>{team.captain}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{team.neighborhood}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(team.enrolledAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {getFilteredTeams().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum time encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Time */}
      {showAddTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Convidar Time para o Campeonato
              </h3>
              <button
                onClick={() => setShowAddTeam(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {availableClubs.length > 0 ? (
                availableClubs.map(club => (
                  <div 
                    key={club.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{club.logo}</div>
                      <div>
                        <div className="font-medium text-gray-900">{club.name}</div>
                        <div className="text-sm text-gray-500">
                          {club.captain} • {club.neighborhood} • {club.players} atletas
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddTeam(club)}
                      size="sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Convidar
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum clube disponível para convite.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Time */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detalhes do Time
              </h3>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl">{selectedTeam.logo}</div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedTeam.name}
                  </div>
                  <div className="text-gray-600">{selectedTeam.shortName}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capitão
                  </label>
                  <div className="text-gray-900">{selectedTeam.captain}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atletas
                  </label>
                  <div className="text-gray-900">{selectedTeam.players}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <div className="text-gray-900">{selectedTeam.neighborhood}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fundado em
                  </label>
                  <div className="text-gray-900">{selectedTeam.foundedYear}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <div className="text-gray-900">{selectedTeam.phone}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-gray-900">{selectedTeam.email}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">Status: </span>
                    <span className={`font-medium ${
                      selectedTeam.status === 'confirmed' ? 'text-green-600' :
                      selectedTeam.status === 'pending' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {selectedTeam.status === 'confirmed' ? 'Confirmado' :
                       selectedTeam.status === 'pending' ? 'Pendente' : 'Desconhecido'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Pagamento: </span>
                    <span className={`font-medium ${
                      selectedTeam.paymentStatus === 'paid' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {selectedTeam.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionshipTeamsManagement;