// src/pages/Organization/ChampionshipReports.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Filter,
  BarChart3,
  TrendingUp,
  Target,
  Trophy,
  Users,
  Calendar,
  Clock,
  Star,
  Zap,
  Shield,
  Eye,
   Printer,
     Printer as Print
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useStatisticsCalculator, formatters } from '../../utils/statisticsCalculator';

const ChampionshipReports = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Mock data
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
          date: '2025-01-20T15:00:00Z',
          goals: [
            { playerId: 101, playerName: 'João Silva', teamId: 1, minute: 15, type: 'goal' },
            { playerId: 102, playerName: 'Pedro Santos', teamId: 2, minute: 32, type: 'goal' },
            { playerId: 103, playerName: 'Carlos Lima', teamId: 1, minute: 78, type: 'goal' }
          ]
        },
        {
          id: 2, round: 1, homeTeamId: 3, awayTeamId: 4,
          scoreHome: 0, scoreAway: 3, status: 'finished',
          date: '2025-01-20T17:00:00Z',
          goals: [
            { playerId: 104, playerName: 'Luis Fernando', teamId: 4, minute: 12, type: 'goal' },
            { playerId: 105, playerName: 'Roberto Silva', teamId: 4, minute: 45, type: 'goal' },
            { playerId: 104, playerName: 'Luis Fernando', teamId: 4, minute: 67, type: 'goal' }
          ]
        },
        {
          id: 3, round: 1, homeTeamId: 5, awayTeamId: 6,
          scoreHome: 1, scoreAway: 1, status: 'finished',
          date: '2025-01-21T15:00:00Z',
          goals: [
            { playerId: 106, playerName: 'Ricardo Alves', teamId: 5, minute: 25, type: 'goal' },
            { playerId: 107, playerName: 'Fernando Costa', teamId: 6, minute: 55, type: 'goal' }
          ]
        },
        {
          id: 4, round: 2, homeTeamId: 2, awayTeamId: 3,
          scoreHome: 2, scoreAway: 0, status: 'finished',
          date: '2025-01-27T15:00:00Z',
          goals: [
            { playerId: 102, playerName: 'Pedro Santos', teamId: 2, minute: 30, type: 'goal' },
            { playerId: 108, playerName: 'André Lima', teamId: 2, minute: 72, type: 'goal' }
          ]
        }
      ];
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Calculadora de estatísticas
  const statistics = useStatisticsCalculator(teams, matches, championship);

  // Dados calculados
  const reportData = useMemo(() => {
    if (!championship || teams.length === 0 || matches.length === 0) return null;
    
    return {
      standings: statistics.calculateStandings(),
      topScorers: statistics.calculateTopScorers(),
      generalStats: statistics.calculateGeneralStats(),
      performanceAnalysis: statistics.calculatePerformanceAnalysis(),
      fullReport: statistics.generateFullReport()
    };
  }, [teams, matches, championship]);

  // Exportar relatório
  const exportReport = (format) => {
    const data = reportData.fullReport;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${championship.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      // Exportar classificação como CSV
      const standings = data.standings;
      const headers = ['Posição', 'Time', 'PJ', 'V', 'E', 'D', 'GP', 'GC', 'SG', 'Pts'];
      const csvData = [
        headers.join(','),
        ...standings.map(team => [
          team.position,
          team.name,
          team.played,
          team.wins,
          team.draws,
          team.losses,
          team.goalsFor,
          team.goalsAgainst,
          team.goalDifference,
          team.points
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `classificacao-${championship.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Gerando relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Dados Insuficientes
          </h2>
          <p className="text-gray-600">
            Não há dados suficientes para gerar relatórios ainda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">
              Relatórios - {championship.name}
            </h1>
            <p className="text-gray-600">Análises detalhadas e estatísticas avançadas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => exportReport('csv')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </Button>
          
          <Button
            variant="outline" 
            onClick={() => exportReport('json')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center space-x-2"
          >
            <Print className="w-4 h-4" />
            <span>Imprimir</span>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'standings', label: 'Classificação', icon: Trophy },
              { id: 'scorers', label: 'Artilheiros', icon: Target },
              { id: 'teams', label: 'Times', icon: Users },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeReport === tab.id
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
          {/* Overview Report */}
          {activeReport === 'overview' && (
            <div className="space-y-6">
              {/* Estatísticas Resumidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Jogos Realizados</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {reportData.generalStats.finishedMatches}
                      </p>
                      <p className="text-sm text-blue-600">
                        de {reportData.generalStats.totalMatches} total
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Total de Gols</p>
                      <p className="text-3xl font-bold text-green-900">
                        {reportData.generalStats.totalGoals}
                      </p>
                      <p className="text-sm text-green-600">
                        Média: {reportData.generalStats.averageGoals} por jogo
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Times Ativos</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {reportData.generalStats.teamsCount}
                      </p>
                      <p className="text-sm text-purple-600">
                        Participando
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-medium">Progresso</p>
                      <p className="text-3xl font-bold text-orange-900">
                        {reportData.generalStats.completionPercentage}%
                      </p>
                      <p className="text-sm text-orange-600">
                        Concluído
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Destaques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Maior Goleada */}
                {reportData.generalStats.biggestWin && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-900">Maior Goleada</h3>
                        <p className="text-sm text-yellow-700">Diferença de {reportData.generalStats.biggestWin.margin} gol(s)</p>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-yellow-900">
                      <strong>{reportData.generalStats.biggestWin.homeTeam}</strong>{' '}
                      <span className="text-2xl font-bold text-yellow-700">
                        {reportData.generalStats.biggestWin.score}
                      </span>{' '}
                      <strong>{reportData.generalStats.biggestWin.awayTeam}</strong>
                    </p>
                    <p className="text-sm text-yellow-600 mt-2">
                      {new Date(reportData.generalStats.biggestWin.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {/* Jogo com Mais Gols */}
                {reportData.generalStats.highestScoringMatch && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-900">Jogo com Mais Gols</h3>
                        <p className="text-sm text-red-700">{reportData.generalStats.highestScoringMatch.totalGoals} gols no total</p>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-red-900">
                      <strong>{reportData.generalStats.highestScoringMatch.homeTeam}</strong>{' '}
                      <span className="text-2xl font-bold text-red-700">
                        {reportData.generalStats.highestScoringMatch.score}
                      </span>{' '}
                      <strong>{reportData.generalStats.highestScoringMatch.awayTeam}</strong>
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      {new Date(reportData.generalStats.highestScoringMatch.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              {/* Líderes Atuais */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Liderança Atual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportData.standings.slice(0, 3).map((team, index) => (
                    <div key={team.id} className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl ${
                        index === 0 ? 'bg-yellow-100' :
                        index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <p className="font-medium text-green-900">{team.name}</p>
                      <p className="text-sm text-green-700">
                        {team.points} pontos • {team.played} jogos
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Standings Report */}
          {activeReport === 'standings' && (
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
                      <th className="pb-3 text-center">Aproveit.</th>
                      <th className="pb-3 text-center">Forma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.standings.map((team, index) => {
                      const maxPoints = team.played * 3;
                      const efficiency = formatters.efficiency(team.points, maxPoints);
                      
                      return (
                        <tr 
                          key={team.id}
                          className={`border-b hover:bg-gray-50 ${
                            index < 2 ? 'bg-green-50' : 
                            index >= reportData.standings.length - 2 ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className={`w-1 h-8 rounded mr-3 ${
                                index < 2 ? 'bg-green-500' : 
                                index >= reportData.standings.length - 2 ? 'bg-red-500' : 'bg-gray-300'
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
                          <td className="py-3 text-center font-medium">{team.played}</td>
                          <td className="py-3 text-center text-green-600 font-medium">{team.wins}</td>
                          <td className="py-3 text-center text-gray-600">{team.draws}</td>
                          <td className="py-3 text-center text-red-600 font-medium">{team.losses}</td>
                          <td className="py-3 text-center">{team.goalsFor}</td>
                          <td className="py-3 text-center">{team.goalsAgainst}</td>
                          <td className={`py-3 text-center font-medium ${
                            team.goalDifference > 0 ? 'text-green-600' : 
                            team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </td>
                          <td className="py-3 text-center font-bold text-primary-600 text-lg">
                            {team.points}
                          </td>
                          <td className="py-3 text-center text-sm font-medium">
                            {efficiency}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex justify-center space-x-1">
                              {formatters.form(team.form.slice(-5)).map((result, idx) => (
                                <span
                                  key={idx}
                                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                    result.color === 'green' ? 'bg-green-500' :
                                    result.color === 'gray' ? 'bg-gray-400' : 'bg-red-500'
                                  }`}
                                  title={result.label}
                                >
                                  {result.letter}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Scorers Report */}
          {activeReport === 'scorers' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-orange-500" />
                  Artilharia do Campeonato
                </h3>
                
                <div className="space-y-3">
                  {reportData.topScorers.slice(0, 10).map((scorer, index) => (
                    <div key={scorer.playerId} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-50 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900">{scorer.playerName}</div>
                          <div className="text-sm text-gray-600">{scorer.teamName}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {scorer.goals}
                        </div>
                        <div className="text-xs text-gray-500">
                          {scorer.matchesPlayed} jogos • {scorer.avgPerMatch} média
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Teams Performance Report */}
          {activeReport === 'teams' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportData.standings.map(team => {
                  const teamStats = statistics.calculateTeamStats(team.id);
                  
                  return (
                    <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-3xl">{team.logo}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-600">
                            {team.position}° lugar • {team.points} pontos
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{team.wins}</div>
                          <div className="text-xs text-gray-600">Vitórias</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-600">{team.draws}</div>
                          <div className="text-xs text-gray-600">Empates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{team.losses}</div>
                          <div className="text-xs text-gray-600">Derrotas</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Média de gols pró:</span>
                          <span className="font-medium">{formatters.goalAverage(team.goalsFor, team.played)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Média de gols contra:</span>
                          <span className="font-medium">{formatters.goalAverage(team.goalsAgainst, team.played)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aproveitamento:</span>
                          <span className="font-medium">{formatters.efficiency(team.points, team.played * 3)}</span>
                        </div>
                        {teamStats && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jogos sem sofrer:</span>
                              <span className="font-medium">{teamStats.cleanSheets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jogos sem marcar:</span>
                              <span className="font-medium">{teamStats.failedToScore}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Forma recente */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-600 mb-2">Últimos 5 jogos:</p>
                        <div className="flex space-x-1">
                          {formatters.form(team.form.slice(-5)).map((result, idx) => (
                            <span
                              key={idx}
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                result.color === 'green' ? 'bg-green-500' :
                                result.color === 'gray' ? 'bg-gray-400' : 'bg-red-500'
                              }`}
                              title={result.label}
                            >
                              {result.letter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Performance Analysis */}
          {activeReport === 'performance' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Análise de Performance
                </h3>
                
                {/* Estatísticas por Rodada */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Gols por Rodada</h4>
                  <div className="space-y-2">
                    {Object.entries(reportData.generalStats.goalsByRound).map(([round, goals]) => (
                      <div key={round} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm text-gray-600">Rodada {round}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${Math.min((goals / 20) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{goals}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eficiência dos Times */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Eficiência por Time</h4>
                  <div className="space-y-2">
                    {reportData.standings.map(team => {
                      const maxPoints = team.played * 3;
                      const efficiency = maxPoints > 0 ? (team.points / maxPoints) * 100 : 0;
                      
                      return (
                        <div key={team.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{team.logo}</span>
                            <span className="text-sm text-gray-900">{team.shortName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  efficiency >= 70 ? 'bg-green-500' :
                                  efficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${efficiency}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12">{efficiency.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionshipReports;