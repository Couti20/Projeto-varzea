// src/pages/Organization/ChampionshipResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Target, 
  TrendingUp,
  Download,
  Share2,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui';

const ChampionshipResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('standings');
  const [selectedRound, setSelectedRound] = useState('all');
  const [searchTeam, setSearchTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - Em produção, viria da API
  useEffect(() => {
    setTimeout(() => {
      setChampionship({
        id: 1,
        name: 'Copa da Várzea 2025',
        season: '2025',
        format: 'league',
        status: 'active',
        startDate: '2025-01-15',
        endDate: '2025-06-15'
      });

      const mockTeams = [
        { id: 1, name: 'FC Barcelona do Bairro', shortName: 'BAR', logo: '🔵' },
        { id: 2, name: 'Real Periferia', shortName: 'REA', logo: '⚪' },
        { id: 3, name: 'Santos da Quebrada', shortName: 'SAN', logo: '⚫' },
        { id: 4, name: 'Palmeiras da Vila', shortName: 'PAL', logo: '🟢' },
        { id: 5, name: 'Corinthians do Morro', shortName: 'COR', logo: '⚫' },
        { id: 6, name: 'São Paulo FC Local', shortName: 'SAO', logo: '🔴' }
      ];
      setTeams(mockTeams);

      const mockMatches = [
        {
          id: 1, round: 1, homeTeamId: 1, awayTeamId: 2, 
          scoreHome: 2, scoreAway: 1, status: 'finished',
          date: '2025-01-20T15:00:00Z', venue: 'Campo da Vila'
        },
        {
          id: 2, round: 1, homeTeamId: 3, awayTeamId: 4,
          scoreHome: 0, scoreAway: 3, status: 'finished',
          date: '2025-01-20T17:00:00Z', venue: 'Campo Central'
        },
        {
          id: 3, round: 1, homeTeamId: 5, awayTeamId: 6,
          scoreHome: 1, scoreAway: 1, status: 'finished',
          date: '2025-01-21T15:00:00Z', venue: 'Campo do Bairro'
        },
        {
          id: 4, round: 2, homeTeamId: 2, awayTeamId: 3,
          scoreHome: null, scoreAway: null, status: 'scheduled',
          date: '2025-01-27T15:00:00Z', venue: 'Campo da Vila'
        }
      ];
      setMatches(mockMatches);

      // Calcular classificação
      const calculatedStandings = calculateStandings(mockTeams, mockMatches);
      setStandings(calculatedStandings);

      // Calcular estatísticas
      const stats = calculateStatistics(mockMatches, mockTeams);
      setStatistics(stats);

      setLoading(false);
    }, 1000);
  }, [id]);

  // Calcular tabela de classificação
  const calculateStandings = (teams, matches) => {
    const standings = teams.map(team => ({
      ...team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: []
    }));

    matches
      .filter(match => match.status === 'finished')
      .forEach(match => {
        const homeTeam = standings.find(t => t.id === match.homeTeamId);
        const awayTeam = standings.find(t => t.id === match.awayTeamId);

        if (homeTeam && awayTeam) {
          // Estatísticas do time da casa
          homeTeam.played++;
          homeTeam.goalsFor += match.scoreHome;
          homeTeam.goalsAgainst += match.scoreAway;

          // Estatísticas do time visitante
          awayTeam.played++;
          awayTeam.goalsFor += match.scoreAway;
          awayTeam.goalsAgainst += match.scoreHome;

          // Resultado
          if (match.scoreHome > match.scoreAway) {
            homeTeam.wins++;
            homeTeam.points += 3;
            homeTeam.form.push('V');
            awayTeam.losses++;
            awayTeam.form.push('D');
          } else if (match.scoreHome < match.scoreAway) {
            awayTeam.wins++;
            awayTeam.points += 3;
            awayTeam.form.push('V');
            homeTeam.losses++;
            homeTeam.form.push('D');
          } else {
            homeTeam.draws++;
            homeTeam.points += 1;
            homeTeam.form.push('E');
            awayTeam.draws++;
            awayTeam.points += 1;
            awayTeam.form.push('E');
          }
        }
      });

    // Calcular saldo de gols
    standings.forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
      team.form = team.form.slice(-5); // Últimas 5 partidas
    });

    // Ordenar classificação
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });

    return standings.map((team, index) => ({ ...team, position: index + 1 }));
  };

  // Calcular estatísticas gerais
  const calculateStatistics = (matches, teams) => {
    const finishedMatches = matches.filter(m => m.status === 'finished');
    
    const stats = {
      totalMatches: matches.length,
      finishedMatches: finishedMatches.length,
      totalGoals: 0,
      averageGoals: 0,
      topScorers: [],
      cleanSheets: {},
      biggestWin: null
    };

    let biggestMargin = 0;
    
    finishedMatches.forEach(match => {
      const totalGoals = match.scoreHome + match.scoreAway;
      stats.totalGoals += totalGoals;
      
      // Maior goleada
      const margin = Math.abs(match.scoreHome - match.scoreAway);
      if (margin > biggestMargin) {
        biggestMargin = margin;
        stats.biggestWin = {
          homeTeam: teams.find(t => t.id === match.homeTeamId)?.name,
          awayTeam: teams.find(t => t.id === match.awayTeamId)?.name,
          score: `${match.scoreHome}x${match.scoreAway}`,
          margin
        };
      }
    });

    stats.averageGoals = finishedMatches.length > 0 
      ? (stats.totalGoals / finishedMatches.length).toFixed(1)
      : 0;

    return stats;
  };

  // Filtrar jogos
  const getFilteredMatches = () => {
    let filtered = matches;
    
    if (selectedRound !== 'all') {
      filtered = filtered.filter(match => match.round === parseInt(selectedRound));
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(match => match.status === filterStatus);
    }
    
    if (searchTeam) {
      filtered = filtered.filter(match => {
        const homeTeam = teams.find(t => t.id === match.homeTeamId);
        const awayTeam = teams.find(t => t.id === match.awayTeamId);
        return homeTeam?.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
               awayTeam?.name.toLowerCase().includes(searchTeam.toLowerCase());
      });
    }
    
    return filtered;
  };

  // Obter nome do time
  const getTeamName = (teamId) => {
    return teams.find(t => t.id === teamId)?.name || 'Time não encontrado';
  };

  // Obter nome curto do time
  const getTeamShortName = (teamId) => {
    return teams.find(t => t.id === teamId)?.shortName || 'N/A';
  };

  // Exportar dados
  const exportData = (type) => {
    // Implementar exportação
    console.log(`Exportando ${type}...`);
  };

  // Compartilhar
  const shareResults = () => {
    // Implementar compartilhamento
    console.log('Compartilhando resultados...');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando resultados...</p>
          </div>
        </div>
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
            <p className="text-gray-600">Resultados e classificação</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </Button>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={shareResults}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm" 
            onClick={() => exportData('pdf')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{statistics.finishedMatches}</div>
          <div className="text-sm text-gray-600">Jogos Realizados</div>
          <div className="text-xs text-gray-500">
            de {statistics.totalMatches} total
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{statistics.totalGoals}</div>
          <div className="text-sm text-gray-600">Gols Marcados</div>
          <div className="text-xs text-gray-500">
            Média: {statistics.averageGoals} por jogo
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{teams.length}</div>
          <div className="text-sm text-gray-600">Times Participando</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round((statistics.finishedMatches / statistics.totalMatches) * 100) || 0}%
          </div>
          <div className="text-sm text-gray-600">Campeonato Concluído</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'standings', label: 'Classificação', icon: Trophy },
              { id: 'matches', label: 'Jogos', icon: Calendar },
              { id: 'statistics', label: 'Estatísticas', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Classificação */}
          {activeTab === 'standings' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-gray-500">
                      <th className="pb-3">Pos</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3 text-center">PJ</th>
                      <th className="pb-3 text-center">V</th>
                      <th className="pb-3 text-center">E</th>
                      <th className="pb-3 text-center">D</th>
                      <th className="pb-3 text-center">GP</th>
                      <th className="pb-3 text-center">GC</th>
                      <th className="pb-3 text-center">SG</th>
                      <th className="pb-3 text-center">Pts</th>
                      <th className="pb-3 text-center">Últimos 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr 
                        key={team.id}
                        className={`border-b hover:bg-gray-50 ${
                          index < 2 ? 'bg-green-50' : 
                          index >= standings.length - 2 ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className={`w-1 h-8 rounded mr-3 ${
                              index < 2 ? 'bg-green-500' : 
                              index >= standings.length - 2 ? 'bg-red-500' : 'bg-gray-300'
                            }`}></span>
                            <span className="font-medium">{team.position}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{team.logo}</span>
                            <div>
                              <div className="font-medium text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">{team.shortName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">{team.played}</td>
                        <td className="py-3 text-center text-green-600">{team.wins}</td>
                        <td className="py-3 text-center text-gray-600">{team.draws}</td>
                        <td className="py-3 text-center text-red-600">{team.losses}</td>
                        <td className="py-3 text-center">{team.goalsFor}</td>
                        <td className="py-3 text-center">{team.goalsAgainst}</td>
                        <td className={`py-3 text-center font-medium ${
                          team.goalDifference > 0 ? 'text-green-600' : 
                          team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </td>
                        <td className="py-3 text-center font-bold text-primary-600">
                          {team.points}
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center space-x-1">
                            {team.form.slice(-5).map((result, idx) => (
                              <span
                                key={idx}
                                className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                  result === 'V' ? 'bg-green-500' :
                                  result === 'E' ? 'bg-gray-400' : 'bg-red-500'
                                }`}
                              >
                                {result}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Jogos */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar time..."
                      value={searchTeam}
                      onChange={(e) => setSearchTeam(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todas as rodadas</option>
                  {Array.from(new Set(matches.map(m => m.round))).map(round => (
                    <option key={round} value={round}>
                      Rodada {round}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="scheduled">Agendados</option>
                  <option value="live">Ao vivo</option>
                  <option value="finished">Finalizados</option>
                </select>
              </div>

              {/* Lista de Jogos */}
              <div className="space-y-3">
                {getFilteredMatches().map(match => (
                  <div key={match.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="font-medium text-gray-900">
                                {getTeamShortName(match.homeTeamId)}
                              </div>
                              <div className="text-sm text-gray-500">Casa</div>
                            </div>
                            
                            <div className="text-center px-4">
                              {match.status === 'finished' ? (
                                <div className="text-2xl font-bold text-gray-900">
                                  {match.scoreHome} - {match.scoreAway}
                                </div>
                              ) : (
                                <div className="text-lg font-medium text-gray-500">
                                  vs
                                </div>
                              )}
                            </div>
                            
                            <div className="text-center">
                              <div className="font-medium text-gray-900">
                                {getTeamShortName(match.awayTeamId)}
                              </div>
                              <div className="text-sm text-gray-500">Visitante</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              match.status === 'finished' ? 'bg-green-100 text-green-800' :
                              match.status === 'live' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {match.status === 'finished' ? 'Finalizado' :
                               match.status === 'live' ? 'Ao vivo' : 'Agendado'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(match.date).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(match.date).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {match.venue && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{match.venue}</span>
                            </div>
                          )}
                          
                          <span className="text-primary-600">
                            Rodada {match.round}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {getFilteredMatches().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum jogo encontrado com os filtros aplicados.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Estatísticas */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Total de Gols</p>
                      <p className="text-3xl font-bold text-blue-900">{statistics.totalGoals}</p>
                      <p className="text-sm text-blue-600">
                        Média: {statistics.averageGoals} por jogo
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Jogos Realizados</p>
                      <p className="text-3xl font-bold text-green-900">
                        {statistics.finishedMatches}
                      </p>
                      <p className="text-sm text-green-600">
                        de {statistics.totalMatches} total
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Times Ativos</p>
                      <p className="text-3xl font-bold text-purple-900">{teams.length}</p>
                      <p className="text-sm text-purple-600">
                        Participando do campeonato
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Maior Goleada */}
              {statistics.biggestWin && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-medium text-yellow-900 mb-3">
                    🏆 Maior Goleada do Campeonato
                  </h3>
                  <p className="text-lg">
                    <strong>{statistics.biggestWin.homeTeam}</strong>{' '}
                    <span className="font-bold text-yellow-700">{statistics.biggestWin.score}</span>{' '}
                    <strong>{statistics.biggestWin.awayTeam}</strong>
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Diferença de {statistics.biggestWin.margin} gol(s)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionshipResults;