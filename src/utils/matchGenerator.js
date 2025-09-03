// src/utils/matchGenerator.js
export class MatchGenerator {
  constructor(teams, format = 'league') {
    this.teams = teams;
    this.format = format;
    this.matches = [];
  }

  // Gera jogos no formato de pontos corridos (todos contra todos)
  generateLeagueMatches() {
    const matches = [];
    let matchId = 1;

    for (let i = 0; i < this.teams.length; i++) {
      for (let j = i + 1; j < this.teams.length; j++) {
        // Jogo de ida
        matches.push({
          id: matchId++,
          round: 1,
          homeTeamId: this.teams[i].id,
          awayTeamId: this.teams[j].id,
          homeTeam: this.teams[i],
          awayTeam: this.teams[j],
          date: null, // Será definido pelo organizador
          venue: null,
          scoreHome: null,
          scoreAway: null,
          status: 'scheduled',
          goals: []
        });

        // Jogo de volta (pontos corridos duplo)
        matches.push({
          id: matchId++,
          round: 2,
          homeTeamId: this.teams[j].id,
          awayTeamId: this.teams[i].id,
          homeTeam: this.teams[j],
          awayTeam: this.teams[i],
          date: null,
          venue: null,
          scoreHome: null,
          scoreAway: null,
          status: 'scheduled',
          goals: []
        });
      }
    }

    return matches;
  }

  // Gera jogos no formato de eliminatória
  generateKnockoutMatches() {
    const matches = [];
    let matchId = 1;
    const totalTeams = this.teams.length;

    // Verificar se o número de times é potência de 2
    if (!this.isPowerOfTwo(totalTeams)) {
      throw new Error('Para mata-mata, o número de times deve ser 2, 4, 8, 16, 32...');
    }

    // Gerar primeira fase
    const firstRoundMatches = [];
    for (let i = 0; i < totalTeams; i += 2) {
      firstRoundMatches.push({
        id: matchId++,
        round: 1,
        phase: this.getPhaseNameByTeams(totalTeams),
        homeTeamId: this.teams[i].id,
        awayTeamId: this.teams[i + 1].id,
        homeTeam: this.teams[i],
        awayTeam: this.teams[i + 1],
        date: null,
        venue: null,
        scoreHome: null,
        scoreAway: null,
        status: 'scheduled',
        goals: [],
        nextMatchId: null // Será preenchido depois
      });
    }

    matches.push(...firstRoundMatches);

    // Gerar fases subsequentes (vazias, serão preenchidas conforme os resultados)
    let currentTeams = totalTeams / 2;
    let round = 2;

    while (currentTeams > 1) {
      for (let i = 0; i < currentTeams; i += 2) {
        matches.push({
          id: matchId++,
          round: round,
          phase: this.getPhaseNameByTeams(currentTeams * 2),
          homeTeamId: null, // Será definido pelo vencedor
          awayTeamId: null, // Será definido pelo vencedor
          homeTeam: null,
          awayTeam: null,
          date: null,
          venue: null,
          scoreHome: null,
          scoreAway: null,
          status: 'waiting_teams',
          goals: []
        });
      }
      
      currentTeams = currentTeams / 2;
      round++;
    }

    return matches;
  }

  // Gera jogos em grupos + mata-mata
  generateMixedMatches(groupsConfig) {
    const matches = [];
    let matchId = 1;

    // Dividir times em grupos
    const groups = this.divideIntoGroups(groupsConfig);

    // Gerar jogos de cada grupo (pontos corridos)
    groups.forEach((group, groupIndex) => {
      const groupLetter = String.fromCharCode(65 + groupIndex);
      
      for (let i = 0; i < group.teams.length; i++) {
        for (let j = i + 1; j < group.teams.length; j++) {
          matches.push({
            id: matchId++,
            round: 1,
            phase: 'group',
            group: groupLetter,
            homeTeamId: group.teams[i].id,
            awayTeamId: group.teams[j].id,
            homeTeam: group.teams[i],
            awayTeam: group.teams[j],
            date: null,
            venue: null,
            scoreHome: null,
            scoreAway: null,
            status: 'scheduled',
            goals: []
          });
        }
      }
    });

    // Calcular quantos times se classificam
    const qualifiedCount = groups.length * groupsConfig.qualifyPerGroup;
    
    // Gerar mata-mata com times classificados (inicialmente vazios)
    const knockoutMatches = this.generateKnockoutForQualified(qualifiedCount, matchId);
    matches.push(...knockoutMatches);

    return matches;
  }

  // Utilitários
  isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
  }

  getPhaseNameByTeams(teams) {
    const phases = {
      32: 'Primeira Fase',
      16: 'Oitavas de Final',
      8: 'Quartas de Final',
      4: 'Semifinal',
      2: 'Final'
    };
    return phases[teams] || `Fase de ${teams} times`;
  }

  divideIntoGroups(config) {
    const groups = [];
    const teamsPerGroup = config.teamsPerGroup || 4;
    const totalGroups = Math.ceil(this.teams.length / teamsPerGroup);

    for (let i = 0; i < totalGroups; i++) {
      const startIndex = i * teamsPerGroup;
      const endIndex = Math.min(startIndex + teamsPerGroup, this.teams.length);
      
      groups.push({
        id: String.fromCharCode(65 + i), // A, B, C...
        teams: this.teams.slice(startIndex, endIndex)
      });
    }

    return groups;
  }

  generateKnockoutForQualified(qualifiedCount, startId) {
    const matches = [];
    let matchId = startId;

    // Garantir que o número seja potência de 2
    const knockoutTeams = this.getNextPowerOfTwo(qualifiedCount);
    
    let currentTeams = knockoutTeams;
    let round = 2; // Round 1 são os grupos

    while (currentTeams > 1) {
      for (let i = 0; i < currentTeams; i += 2) {
        matches.push({
          id: matchId++,
          round: round,
          phase: this.getPhaseNameByTeams(currentTeams),
          homeTeamId: null, // Será preenchido conforme classificação
          awayTeamId: null,
          homeTeam: null,
          awayTeam: null,
          date: null,
          venue: null,
          scoreHome: null,
          scoreAway: null,
          status: 'waiting_teams',
          goals: []
        });
      }
      
      currentTeams = currentTeams / 2;
      round++;
    }

    return matches;
  }

  getNextPowerOfTwo(n) {
    let power = 1;
    while (power < n) {
      power *= 2;
    }
    return power;
  }

  // Método principal que escolhe o formato
  generate() {
    switch (this.format) {
      case 'league':
        return this.generateLeagueMatches();
      case 'knockout':
        return this.generateKnockoutMatches();
      case 'mixed':
        return this.generateMixedMatches({
          teamsPerGroup: 4,
          qualifyPerGroup: 2
        });
      default:
        throw new Error(`Formato ${this.format} não suportado`);
    }
  }
}

// Hook para usar o gerador
export const useMatchGenerator = () => {
  const generateMatches = (teams, format, config = {}) => {
    try {
      const generator = new MatchGenerator(teams, format);
      
      if (format === 'mixed' && config.groupsConfig) {
        return generator.generateMixedMatches(config.groupsConfig);
      }
      
      return generator.generate();
    } catch (error) {
      console.error('Erro ao gerar jogos:', error);
      throw error;
    }
  };

  return { generateMatches };
};

// Utilitário para calcular estatísticas dos jogos gerados
export const calculateMatchStatistics = (matches) => {
  const stats = {
    totalMatches: matches.length,
    scheduledMatches: matches.filter(m => m.status === 'scheduled').length,
    finishedMatches: matches.filter(m => m.status === 'finished').length,
    phases: {},
    rounds: {}
  };

  matches.forEach(match => {
    // Contar por fase
    if (match.phase) {
      stats.phases[match.phase] = (stats.phases[match.phase] || 0) + 1;
    }

    // Contar por rodada
    if (match.round) {
      stats.rounds[match.round] = (stats.rounds[match.round] || 0) + 1;
    }
  });

  return stats;
};