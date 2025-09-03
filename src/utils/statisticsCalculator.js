// src/utils/statisticsCalculator.js
export class ChampionshipStatistics {
  constructor(teams, matches, championship) {
    this.teams = teams;
    this.matches = matches;
    this.championship = championship;
    this.finishedMatches = matches.filter(m => m.status === 'finished');
  }

  // Calcular classificação completa
  calculateStandings() {
    const standings = this.teams.map(team => ({
      ...team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
      homeRecord: { wins: 0, draws: 0, losses: 0 },
      awayRecord: { wins: 0, draws: 0, losses: 0 },
      disciplinary: { yellowCards: 0, redCards: 0 },
      scoringStats: { goals: 0, conceded: 0, cleanSheets: 0 }
    }));

    this.finishedMatches.forEach(match => {
      const homeTeam = standings.find(t => t.id === match.homeTeamId);
      const awayTeam = standings.find(t => t.id === match.awayTeamId);

      if (homeTeam && awayTeam) {
        // Estatísticas básicas
        homeTeam.played++;
        awayTeam.played++;
        
        homeTeam.goalsFor += match.scoreHome;
        homeTeam.goalsAgainst += match.scoreAway;
        awayTeam.goalsFor += match.scoreAway;
        awayTeam.goalsAgainst += match.scoreHome;

        // Clean sheets
        if (match.scoreAway === 0) homeTeam.scoringStats.cleanSheets++;
        if (match.scoreHome === 0) awayTeam.scoringStats.cleanSheets++;

        // Resultado do jogo
        if (match.scoreHome > match.scoreAway) {
          // Vitória do time da casa
          homeTeam.wins++;
          homeTeam.points += 3;
          homeTeam.form.push('V');
          homeTeam.homeRecord.wins++;
          
          awayTeam.losses++;
          awayTeam.form.push('D');
          awayTeam.awayRecord.losses++;
        } else if (match.scoreHome < match.scoreAway) {
          // Vitória do time visitante
          awayTeam.wins++;
          awayTeam.points += 3;
          awayTeam.form.push('V');
          awayTeam.awayRecord.wins++;
          
          homeTeam.losses++;
          homeTeam.form.push('D');
          homeTeam.homeRecord.losses++;
        } else {
          // Empate
          homeTeam.draws++;
          homeTeam.points += 1;
          homeTeam.form.push('E');
          homeTeam.homeRecord.draws++;
          
          awayTeam.draws++;
          awayTeam.points += 1;
          awayTeam.form.push('E');
          awayTeam.awayRecord.draws++;
        }
      }
    });

    // Calcular saldo de gols e limitar form
    standings.forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
      team.form = team.form.slice(-5); // Últimos 5 jogos
    });

    // Ordenar classificação
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });

    return standings.map((team, index) => ({ ...team, position: index + 1 }));
  }

  // Calcular artilheiros
  calculateTopScorers() {
    const scorers = [];

    this.finishedMatches.forEach(match => {
      if (match.goals && match.goals.length > 0) {
        match.goals.forEach(goal => {
          if (goal.type === 'goal') {
            let scorer = scorers.find(s => s.playerId === goal.playerId);
            
            if (!scorer) {
              scorer = {
                playerId: goal.playerId,
                playerName: goal.playerName,
                teamId: goal.teamId,
                teamName: this.teams.find(t => t.id === goal.teamId)?.name,
                goals: 0,
                matches: new Set(),
                avgPerMatch: 0
              };
              scorers.push(scorer);
            }
            
            scorer.goals++;
            scorer.matches.add(match.id);
          }
        });
      }
    });

    // Calcular média por jogo
    scorers.forEach(scorer => {
      scorer.matchesPlayed = scorer.matches.size;
      scorer.avgPerMatch = scorer.matchesPlayed > 0 ? (scorer.goals / scorer.matchesPlayed).toFixed(1) : 0;
      delete scorer.matches; // Remove Set para serialização
    });

    return scorers.sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      return a.playerName.localeCompare(b.playerName);
    });
  }

  // Estatísticas gerais do campeonato
  calculateGeneralStats() {
    const totalMatches = this.matches.length;
    const finishedMatches = this.finishedMatches.length;
    const totalGoals = this.finishedMatches.reduce((sum, match) => sum + match.scoreHome + match.scoreAway, 0);
    const averageGoals = finishedMatches > 0 ? (totalGoals / finishedMatches).toFixed(1) : 0;

    // Maior goleada
    let biggestWin = null;
    let biggestMargin = 0;

    this.finishedMatches.forEach(match => {
      const margin = Math.abs(match.scoreHome - match.scoreAway);
      if (margin > biggestMargin) {
        biggestMargin = margin;
        biggestWin = {
          homeTeam: this.teams.find(t => t.id === match.homeTeamId)?.name,
          awayTeam: this.teams.find(t => t.id === match.awayTeamId)?.name,
          score: `${match.scoreHome}x${match.scoreAway}`,
          margin,
          date: match.date
        };
      }
    });

    // Jogos com mais gols
    const highestScoringMatch = this.finishedMatches.reduce((max, match) => {
      const totalGoals = match.scoreHome + match.scoreAway;
      const maxGoals = max ? max.scoreHome + max.scoreAway : 0;
      return totalGoals > maxGoals ? match : max;
    }, null);

    // Estatísticas de gols por rodada/tempo
    const goalsByRound = {};
    this.finishedMatches.forEach(match => {
      if (!goalsByRound[match.round]) {
        goalsByRound[match.round] = 0;
      }
      goalsByRound[match.round] += match.scoreHome + match.scoreAway;
    });

    return {
      totalMatches,
      finishedMatches,
      totalGoals,
      averageGoals: parseFloat(averageGoals),
      biggestWin,
      highestScoringMatch: highestScoringMatch ? {
        homeTeam: this.teams.find(t => t.id === highestScoringMatch.homeTeamId)?.name,
        awayTeam: this.teams.find(t => t.id === highestScoringMatch.awayTeamId)?.name,
        score: `${highestScoringMatch.scoreHome}x${highestScoringMatch.scoreAway}`,
        totalGoals: highestScoringMatch.scoreHome + highestScoringMatch.scoreAway,
        date: highestScoringMatch.date
      } : null,
      goalsByRound,
      completionPercentage: totalMatches > 0 ? Math.round((finishedMatches / totalMatches) * 100) : 0,
      teamsCount: this.teams.length
    };
  }

  // Estatísticas por time
  calculateTeamStats(teamId) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return null;

    const teamMatches = this.finishedMatches.filter(
      m => m.homeTeamId === teamId || m.awayTeamId === teamId
    );

    const homeMatches = teamMatches.filter(m => m.homeTeamId === teamId);
    const awayMatches = teamMatches.filter(m => m.awayTeamId === teamId);

    let stats = {
      team,
      totalMatches: teamMatches.length,
      homeMatches: homeMatches.length,
      awayMatches: awayMatches.length,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homeRecord: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
      awayRecord: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
      biggestWin: null,
      biggestLoss: null,
      cleanSheets: 0,
      failedToScore: 0,
      form: []
    };

    teamMatches.forEach(match => {
      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const opponentScore = isHome ? match.scoreAway : match.scoreHome;

      stats.goalsFor += teamScore;
      stats.goalsAgainst += opponentScore;

      if (isHome) {
        stats.homeRecord.goalsFor += teamScore;
        stats.homeRecord.goalsAgainst += opponentScore;
      } else {
        stats.awayRecord.goalsFor += teamScore;
        stats.awayRecord.goalsAgainst += opponentScore;
      }

      // Clean sheets e falhou em marcar
      if (opponentScore === 0) stats.cleanSheets++;
      if (teamScore === 0) stats.failedToScore++;

      // Resultado
      if (teamScore > opponentScore) {
        stats.wins++;
        stats.form.push('V');
        if (isHome) stats.homeRecord.wins++;
        else stats.awayRecord.wins++;

        // Maior vitória
        const margin = teamScore - opponentScore;
        if (!stats.biggestWin || margin > stats.biggestWin.margin) {
          stats.biggestWin = {
            opponent: this.teams.find(t => t.id === (isHome ? match.awayTeamId : match.homeTeamId))?.name,
            score: `${teamScore}x${opponentScore}`,
            margin,
            date: match.date,
            venue: isHome ? 'Casa' : 'Fora'
          };
        }
      } else if (teamScore < opponentScore) {
        stats.losses++;
        stats.form.push('D');
        if (isHome) stats.homeRecord.losses++;
        else stats.awayRecord.losses++;

        // Maior derrota
        const margin = opponentScore - teamScore;
        if (!stats.biggestLoss || margin > stats.biggestLoss.margin) {
          stats.biggestLoss = {
            opponent: this.teams.find(t => t.id === (isHome ? match.awayTeamId : match.homeTeamId))?.name,
            score: `${teamScore}x${opponentScore}`,
            margin,
            date: match.date,
            venue: isHome ? 'Casa' : 'Fora'
          };
        }
      } else {
        stats.draws++;
        stats.form.push('E');
        if (isHome) stats.homeRecord.draws++;
        else stats.awayRecord.draws++;
      }
    });

    stats.form = stats.form.slice(-10); // Últimos 10 jogos
    stats.points = stats.wins * 3 + stats.draws;
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
    stats.averageGoalsFor = stats.totalMatches > 0 ? (stats.goalsFor / stats.totalMatches).toFixed(1) : 0;
    stats.averageGoalsAgainst = stats.totalMatches > 0 ? (stats.goalsAgainst / stats.totalMatches).toFixed(1) : 0;

    return stats;
  }

  // Confrontos diretos entre dois times
  calculateHeadToHead(team1Id, team2Id) {
    const matches = this.finishedMatches.filter(
      m => (m.homeTeamId === team1Id && m.awayTeamId === team2Id) ||
           (m.homeTeamId === team2Id && m.awayTeamId === team1Id)
    );

    let team1Stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
    let team2Stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };

    matches.forEach(match => {
      const team1IsHome = match.homeTeamId === team1Id;
      const team1Score = team1IsHome ? match.scoreHome : match.scoreAway;
      const team2Score = team1IsHome ? match.scoreAway : match.scoreHome;

      team1Stats.goalsFor += team1Score;
      team1Stats.goalsAgainst += team2Score;
      team2Stats.goalsFor += team2Score;
      team2Stats.goalsAgainst += team1Score;

      if (team1Score > team2Score) {
        team1Stats.wins++;
        team2Stats.losses++;
      } else if (team1Score < team2Score) {
        team1Stats.losses++;
        team2Stats.wins++;
      } else {
        team1Stats.draws++;
        team2Stats.draws++;
      }
    });

    return {
      team1: {
        ...this.teams.find(t => t.id === team1Id),
        ...team1Stats
      },
      team2: {
        ...this.teams.find(t => t.id === team2Id),
        ...team2Stats
      },
      matches,
      totalMatches: matches.length
    };
  }

  // Análise de desempenho por período
  calculatePerformanceAnalysis() {
    const monthlyStats = {};
    const weekdayStats = {};

    this.finishedMatches.forEach(match => {
      const date = new Date(match.date);
      const month = date.toISOString().substring(0, 7); // YYYY-MM
      const weekday = date.getDay();

      // Estatísticas mensais
      if (!monthlyStats[month]) {
        monthlyStats[month] = { matches: 0, goals: 0 };
      }
      monthlyStats[month].matches++;
      monthlyStats[month].goals += match.scoreHome + match.scoreAway;

      // Estatísticas por dia da semana
      if (!weekdayStats[weekday]) {
        weekdayStats[weekday] = { matches: 0, goals: 0 };
      }
      weekdayStats[weekday].matches++;
      weekdayStats[weekday].goals += match.scoreHome + match.scoreAway;
    });

    return {
      monthlyStats,
      weekdayStats
    };
  }

  // Relatório completo
  generateFullReport() {
    return {
      standings: this.calculateStandings(),
      topScorers: this.calculateTopScorers(),
      generalStats: this.calculateGeneralStats(),
      performanceAnalysis: this.calculatePerformanceAnalysis(),
      championship: this.championship,
      generatedAt: new Date().toISOString()
    };
  }
}

// Hook para usar o calculador de estatísticas
export const useStatisticsCalculator = (teams, matches, championship) => {
  const calculator = new ChampionshipStatistics(teams, matches, championship);
  
  return {
    calculateStandings: () => calculator.calculateStandings(),
    calculateTopScorers: () => calculator.calculateTopScorers(),
    calculateGeneralStats: () => calculator.calculateGeneralStats(),
    calculateTeamStats: (teamId) => calculator.calculateTeamStats(teamId),
    calculateHeadToHead: (team1Id, team2Id) => calculator.calculateHeadToHead(team1Id, team2Id),
    calculatePerformanceAnalysis: () => calculator.calculatePerformanceAnalysis(),
    generateFullReport: () => calculator.generateFullReport()
  };
};

// Utilitários para formatação
export const formatters = {
  percentage: (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  },

  winRate: (wins, total) => {
    if (total === 0) return '0%';
    return `${Math.round((wins / total) * 100)}%`;
  },

  goalAverage: (goals, matches) => {
    if (matches === 0) return '0.0';
    return (goals / matches).toFixed(1);
  },

  efficiency: (points, maxPoints) => {
    if (maxPoints === 0) return '0%';
    return `${Math.round((points / maxPoints) * 100)}%`;
  },

  form: (formArray) => {
    return formArray.map(result => {
      switch (result) {
        case 'V': return { letter: 'V', color: 'green', label: 'Vitória' };
        case 'E': return { letter: 'E', color: 'gray', label: 'Empate' };
        case 'D': return { letter: 'D', color: 'red', label: 'Derrota' };
        default: return { letter: '?', color: 'gray', label: 'Desconhecido' };
      }
    });
  }
};