import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Calendar, Users, MapPin } from 'lucide-react';
import { useActiveChampionships } from '../../hooks/useChampionships'; // CORRIGIDO: usar hook existente
import { Card } from '../../components/ui'; // CORRIGIDO: usar componente existente
import { DashboardLayout } from '../../components/layout/Layout'; // CORRIGIDO: usar layout existente

const ChampionshipExplorer = () => {
  // CORRIGIDO: Usar hook existente do projeto
  const { data: existingChampionships, isLoading: loadingExisting } = useActiveChampionships();
  
  const [championships, setChampionships] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Combinar campeonatos existentes com dados expandidos para exploração
    if (existingChampionships) {
      const expandedChampionships = existingChampionships.map(championship => ({
        ...championship,
        // Adicionar dados extras para exploração
        teams: championship.teams || Math.floor(Math.random() * 20) + 8,
        matches: championship.matches || Math.floor(Math.random() * 50) + 20,
        location: championship.location || "Campos Municipais",
        prize: championship.prize || "Troféu + Medalhas",
        organizer: championship.organizer || "Liga Local",
        logo: championship.logo || "/api/placeholder/80/80"
      }));

      // Adicionar alguns campeonatos mock para demonstração
      const mockChampionships = [
        {
          id: 999,
          name: "Copa da Várzea 2025",
          description: "Tradicional campeonato de várzea com 20 anos de história",
          status: "open",
          format: "Mata-mata",
          startDate: "2025-03-01",
          endDate: "2025-06-30",
          teams: 32,
          matches: 31,
          location: "Zona Sul - SP",
          prize: "R$ 8.000",
          organizer: "Associação da Várzea",
          logo: "/api/placeholder/80/80"
        },
        {
          id: 998,
          name: "Liga Amadora Paulista",
          description: "Liga semi-profissional para times amadores da região",
          status: "active",
          format: "Liga",
          startDate: "2025-02-01",
          endDate: "2025-08-30",
          teams: 12,
          matches: 66,
          location: "São Paulo - SP",
          prize: "R$ 15.000",
          organizer: "Liga Amadora SP",
          logo: "/api/placeholder/80/80"
        }
      ];

      setChampionships([...expandedChampionships, ...mockChampionships]);
      setSelectedChampionship(expandedChampionships[0] || mockChampionships[0]);
    }
    setLoading(loadingExisting);
  }, [existingChampionships, loadingExisting]);

  const getStatusBadge = (status) => {
    const configs = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: '🟢 Em Andamento' },
      open: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🔵 Inscrições Abertas' },
      finished: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚫ Finalizado' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🟡 Em Preparação' }
    };
    
    const config = configs[status] || configs.draft;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredChampionships = championships.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  if (loading) {
    return (
      <DashboardLayout 
        title="Explorar Campeonatos"
        subtitle="Carregando campeonatos disponíveis..."
      >
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Explorar Campeonatos"
      subtitle="Descubra campeonatos em andamento e oportunidades"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex justify-end">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Em Andamento</option>
            <option value="open">Inscrições Abertas</option>
            <option value="finished">Finalizados</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Campeonatos */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Campeonatos ({filteredChampionships.length})
            </h3>
            
            {filteredChampionships.map(championship => (
              <Card
                key={championship.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedChampionship?.id === championship.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedChampionship(championship)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {championship.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {championship.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(championship.status)}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detalhes do Campeonato */}
          <div className="lg:col-span-2">
            {selectedChampionship ? (
              <ChampionshipDetails championship={selectedChampionship} />
            ) : (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um campeonato
                </h3>
                <p className="text-gray-600">
                  Escolha um campeonato da lista para ver os detalhes completos
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Componente de Detalhes (simplificado e corrigido)
const ChampionshipDetails = ({ championship }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📋' },
    { id: 'standings', label: 'Classificação', icon: '🏆' },
    { id: 'matches', label: 'Jogos', icon: '⚽' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' }
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header do Campeonato */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start space-x-4">
          <img 
            src={championship.logo} 
            alt={championship.name}
            className="w-16 h-16 rounded-lg border border-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{championship.name}</h3>
                <p className="text-gray-600 mt-1">{championship.description}</p>
              </div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                👁️ Modo Visualização
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(championship.startDate).toLocaleDateString('pt-BR')} - {new Date(championship.endDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {championship.teams} times
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {championship.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab championship={championship} />}
        {activeTab === 'standings' && <StandingsTab />}
        {activeTab === 'matches' && <MatchesTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
    </Card>
  );
};

// Componentes das Tabs (simplificados)
const OverviewTab = ({ championship }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Formato</h4>
        <p className="text-gray-600">{championship.format}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Premiação</h4>
        <p className="text-gray-600">{championship.prize}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Organizador</h4>
        <p className="text-gray-600">{championship.organizer}</p>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Informações Gerais</h4>
      <div className="prose max-w-none text-gray-600">
        <p>Este campeonato conta com {championship.teams} times participantes e {championship.matches} jogos programados.</p>
        <p>Local de realização: {championship.location}</p>
        <p>Período: {new Date(championship.startDate).toLocaleDateString('pt-BR')} até {new Date(championship.endDate).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  </div>
);

const StandingsTab = () => {
  const mockStandings = [
    { pos: 1, team: "Flamengo Várzea", pts: 25, j: 10, v: 8, e: 1, d: 1 },
    { pos: 2, team: "Corinthians FC", pts: 22, j: 10, v: 7, e: 1, d: 2 },
    { pos: 3, team: "Palmeiras Unidos", pts: 19, j: 10, v: 6, e: 1, d: 3 },
    { pos: 4, team: "São Paulo Várzea", pts: 16, j: 10, v: 5, e: 1, d: 4 }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Pos</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Time</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Pts</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">J</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">V</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">E</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">D</th>
          </tr>
        </thead>
        <tbody>
          {mockStandings.map(team => (
            <tr key={team.pos} className="border-t border-gray-200">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{team.pos}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{team.team}</td>
              <td className="px-4 py-3 text-sm text-center font-medium">{team.pts}</td>
              <td className="px-4 py-3 text-sm text-center">{team.j}</td>
              <td className="px-4 py-3 text-sm text-center">{team.v}</td>
              <td className="px-4 py-3 text-sm text-center">{team.e}</td>
              <td className="px-4 py-3 text-sm text-center">{team.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MatchesTab = () => {
  const mockMatches = [
    { home: "Flamengo Várzea", away: "Corinthians FC", score: "2-1", date: "15/02/2025" },
    { home: "Palmeiras Unidos", away: "São Paulo Várzea", score: "1-0", date: "15/02/2025" },
    { home: "Santos FC", away: "Botafogo Várzea", score: "vs", date: "22/02/2025" }
  ];

  return (
    <div className="space-y-4">
      {mockMatches.map((match, index) => (
        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{match.date}</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{match.home}</span>
              <span className="text-gray-500">vs</span>
              <span className="font-medium">{match.away}</span>
            </div>
          </div>
          <div className="text-sm font-medium">
            {match.score}
          </div>
        </div>
      ))}
    </div>
  );
};

const StatsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Artilheiros</h4>
      <div className="space-y-2">
        {[
          { name: "João Silva", team: "Flamengo Várzea", goals: 12 },
          { name: "Pedro Santos", team: "Corinthians FC", goals: 10 },
          { name: "Carlos Lima", team: "Palmeiras Unidos", goals: 8 }
        ].map((player, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{player.name}</span>
              <span className="text-sm text-gray-500 ml-2">({player.team})</span>
            </div>
            <span className="font-bold">{player.goals} gols</span>
          </div>
        ))}
      </div>
    </div>
    
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Estatísticas Gerais</h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Total de gols</span>
          <span className="font-medium">156</span>
        </div>
        <div className="flex justify-between">
          <span>Média por jogo</span>
          <span className="font-medium">3.5</span>
        </div>
        <div className="flex justify-between">
          <span>Maior goleada</span>
          <span className="font-medium">5-0</span>
        </div>
      </div>
    </div>
  </div>
);

export default ChampionshipExplorer;