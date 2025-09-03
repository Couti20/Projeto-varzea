// src/utils/exportUtils.js
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Classe principal para exportação
export class ChampionshipExporter {
  constructor(championship, teams, matches, standings, statistics) {
    this.championship = championship;
    this.teams = teams;
    this.matches = matches;
    this.standings = standings;
    this.statistics = statistics;
  }

  // Exportar como CSV
  exportToCSV(type = 'standings') {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'standings':
        csvContent = this.generateStandingsCSV();
        filename = `classificacao-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
        break;
      case 'matches':
        csvContent = this.generateMatchesCSV();
        filename = `jogos-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
        break;
      case 'scorers':
        csvContent = this.generateScorersCSV();
        filename = `artilheiros-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
        break;
      case 'teams':
        csvContent = this.generateTeamsCSV();
        filename = `times-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
        break;
      default:
        throw new Error(`Tipo de exportação não suportado: ${type}`);
    }

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Exportar como JSON
  exportToJSON() {
    const data = {
      championship: {
        ...this.championship,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0'
      },
      teams: this.teams,
      matches: this.matches,
      standings: this.standings,
      statistics: this.statistics
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const filename = `campeonato-completo-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  // Exportar como HTML (para impressão)
  exportToHTML() {
    const htmlContent = this.generateHTMLReport();
    const filename = `relatorio-${this.championship.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    this.downloadFile(htmlContent, `${filename}.html`, 'text/html');
  }

  // Gerar relatório completo em texto
  generateTextReport() {
    const report = [];
    
    // Cabeçalho
    report.push('='.repeat(60));
    report.push(`RELATÓRIO COMPLETO - ${this.championship.name.toUpperCase()}`);
    report.push('='.repeat(60));
    report.push('');
    
    // Informações gerais
    report.push('INFORMAÇÕES GERAIS:');
    report.push(`Nome: ${this.championship.name}`);
    report.push(`Temporada: ${this.championship.season}`);
    report.push(`Formato: ${this.getFormatLabel(this.championship.format)}`);
    report.push(`Status: ${this.getStatusLabel(this.championship.status)}`);
    report.push(`Data de início: ${this.formatDate(this.championship.startDate)}`);
    report.push(`Data de fim: ${this.formatDate(this.championship.endDate)}`);
    report.push('');

    // Estatísticas gerais
    report.push('ESTATÍSTICAS GERAIS:');
    report.push(`Times participantes: ${this.teams.length}`);
    report.push(`Total de jogos: ${this.matches.length}`);
    report.push(`Jogos realizados: ${this.matches.filter(m => m.status === 'finished').length}`);
    report.push(`Total de gols: ${this.statistics.totalGoals}`);
    report.push(`Média de gols por jogo: ${this.statistics.averageGoals}`);
    report.push('');

    // Classificação
    if (this.standings && this.standings.length > 0) {
      report.push('CLASSIFICAÇÃO:');
      report.push('-'.repeat(80));
      report.push('Pos | Time                    | PJ | V  | E  | D  | GP | GC | SG  | Pts');
      report.push('-'.repeat(80));
      
      this.standings.forEach(team => {
        const line = [
          team.position.toString().padStart(3),
          team.name.substr(0, 23).padEnd(23),
          team.played.toString().padStart(2),
          team.wins.toString().padStart(2),
          team.draws.toString().padStart(2),
          team.losses.toString().padStart(2),
          team.goalsFor.toString().padStart(2),
          team.goalsAgainst.toString().padStart(2),
          team.goalDifference.toString().padStart(3),
          team.points.toString().padStart(3)
        ].join(' | ');
        
        report.push(line);
      });
      report.push('-'.repeat(80));
      report.push('');
    }

    // Artilheiros
    if (this.statistics.topScorers && this.statistics.topScorers.length > 0) {
      report.push('ARTILHEIROS:');
      report.push('-'.repeat(50));
      
      this.statistics.topScorers.slice(0, 10).forEach((scorer, index) => {
        report.push(`${(index + 1).toString().padStart(2)}. ${scorer.playerName.padEnd(25)} ${scorer.goals.toString().padStart(2)} gols (${scorer.teamName})`);
      });
      report.push('');
    }

    // Destaques
    if (this.statistics.biggestWin) {
      report.push('DESTAQUES:');
      report.push(`Maior goleada: ${this.statistics.biggestWin.homeTeam} ${this.statistics.biggestWin.score} ${this.statistics.biggestWin.awayTeam}`);
      report.push(`Diferença: ${this.statistics.biggestWin.margin} gol(s)`);
      report.push('');
    }

    // Rodapé
    report.push('-'.repeat(60));
    report.push(`Relatório gerado em: ${this.formatDate(new Date(), 'dd/MM/yyyy HH:mm')}`);
    report.push('Futebol de Várzea - Sistema de Gestão de Campeonatos');
    report.push('-'.repeat(60));

    return report.join('\n');
  }

  // Métodos auxiliares para gerar CSVs específicos
  generateStandingsCSV() {
    const headers = [
      'Posição', 'Time', 'Jogos', 'Vitórias', 'Empates', 'Derrotas', 
      'Gols Pró', 'Gols Contra', 'Saldo', 'Pontos', 'Aproveitamento'
    ];

    const rows = this.standings.map(team => [
      team.position,
      `"${team.name}"`,
      team.played,
      team.wins,
      team.draws,
      team.losses,
      team.goalsFor,
      team.goalsAgainst,
      team.goalDifference,
      team.points,
      team.played > 0 ? `${Math.round((team.points / (team.played * 3)) * 100)}%` : '0%'
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  generateMatchesCSV() {
    const headers = [
      'Data', 'Horário', 'Rodada', 'Time Casa', 'Time Visitante', 
      'Placar Casa', 'Placar Visitante', 'Status', 'Local'
    ];

    const rows = this.matches.map(match => {
      const homeTeam = this.teams.find(t => t.id === match.homeTeamId);
      const awayTeam = this.teams.find(t => t.id === match.awayTeamId);
      
      return [
        match.date ? this.formatDate(match.date, 'dd/MM/yyyy') : '',
        match.date ? this.formatDate(match.date, 'HH:mm') : '',
        match.round || '',
        `"${homeTeam?.name || 'N/A'}"`,
        `"${awayTeam?.name || 'N/A'}"`,
        match.scoreHome ?? '',
        match.scoreAway ?? '',
        this.getStatusLabel(match.status),
        `"${match.venue || ''}"`
      ];
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  generateScorersCSV() {
    const headers = ['Posição', 'Jogador', 'Time', 'Gols', 'Jogos', 'Média'];

    const rows = this.statistics.topScorers.map((scorer, index) => [
      index + 1,
      `"${scorer.playerName}"`,
      `"${scorer.teamName}"`,
      scorer.goals,
      scorer.matchesPlayed,
      scorer.avgPerMatch
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  generateTeamsCSV() {
    const headers = [
      'Time', 'Capitão', 'Telefone', 'Email', 'Atletas', 
      'Status', 'Pagamento', 'Bairro', 'Data Inscrição'
    ];

    const rows = this.teams.map(team => [
      `"${team.name}"`,
      `"${team.captain || ''}"`,
      `"${team.phone || ''}"`,
      `"${team.email || ''}"`,
      team.players || 0,
      this.getStatusLabel(team.status),
      team.paymentStatus === 'paid' ? 'Pago' : 'Pendente',
      `"${team.neighborhood || ''}"`,
      team.enrolledAt ? this.formatDate(team.enrolledAt) : ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Gerar relatório HTML para impressão
  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório - ${this.championship.name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #22c55e;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #22c55e;
            margin: 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #374151;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stats-card {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .stats-card h3 {
            margin: 0;
            color: #22c55e;
            font-size: 24px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #d1d5db;
            color: #6b7280;
        }
        @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.championship.name}</h1>
        <p>Relatório Completo - Temporada ${this.championship.season}</p>
        <p>Gerado em: ${this.formatDate(new Date(), 'dd/MM/yyyy HH:mm')}</p>
    </div>

    <div class="section">
        <h2>Informações Gerais</h2>
        <div class="stats-grid">
            <div class="stats-card">
                <h3>${this.teams.length}</h3>
                <p>Times Participantes</p>
            </div>
            <div class="stats-card">
                <h3>${this.matches.length}</h3>
                <p>Total de Jogos</p>
            </div>
            <div class="stats-card">
                <h3>${this.matches.filter(m => m.status === 'finished').length}</h3>
                <p>Jogos Realizados</p>
            </div>
            <div class="stats-card">
                <h3>${this.statistics.totalGoals || 0}</h3>
                <p>Total de Gols</p>
            </div>
        </div>
    </div>

    ${this.generateStandingsHTML()}
    ${this.generateScorersHTML()}
    ${this.generateMatchesHTML()}

    <div class="footer">
        <p>Futebol de Várzea - Sistema de Gestão de Campeonatos</p>
    </div>
</body>
</html>`;
  }

  generateStandingsHTML() {
    if (!this.standings || this.standings.length === 0) return '';

    return `
    <div class="section">
        <h2>Classificação</h2>
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Time</th>
                    <th>PJ</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>GP</th>
                    <th>GC</th>
                    <th>SG</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                ${this.standings.map(team => `
                    <tr>
                        <td>${team.position}</td>
                        <td>${team.name}</td>
                        <td>${team.played}</td>
                        <td>${team.wins}</td>
                        <td>${team.draws}</td>
                        <td>${team.losses}</td>
                        <td>${team.goalsFor}</td>
                        <td>${team.goalsAgainst}</td>
                        <td>${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
                        <td><strong>${team.points}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
  }

  generateScorersHTML() {
    if (!this.statistics.topScorers || this.statistics.topScorers.length === 0) return '';

    return `
    <div class="section">
        <h2>Artilheiros</h2>
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Jogador</th>
                    <th>Time</th>
                    <th>Gols</th>
                    <th>Jogos</th>
                    <th>Média</th>
                </tr>
            </thead>
            <tbody>
                ${this.statistics.topScorers.slice(0, 10).map((scorer, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${scorer.playerName}</td>
                        <td>${scorer.teamName}</td>
                        <td><strong>${scorer.goals}</strong></td>
                        <td>${scorer.matchesPlayed}</td>
                        <td>${scorer.avgPerMatch}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
  }

  generateMatchesHTML() {
    const recentMatches = this.matches
      .filter(m => m.status === 'finished')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    if (recentMatches.length === 0) return '';

    return `
    <div class="section">
        <h2>Últimos Resultados</h2>
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Time Casa</th>
                    <th>Placar</th>
                    <th>Time Visitante</th>
                    <th>Local</th>
                </tr>
            </thead>
            <tbody>
                ${recentMatches.map(match => {
                  const homeTeam = this.teams.find(t => t.id === match.homeTeamId);
                  const awayTeam = this.teams.find(t => t.id === match.awayTeamId);
                  
                  return `
                    <tr>
                        <td>${this.formatDate(match.date, 'dd/MM')}</td>
                        <td>${homeTeam?.name || 'N/A'}</td>
                        <td><strong>${match.scoreHome} × ${match.scoreAway}</strong></td>
                        <td>${awayTeam?.name || 'N/A'}</td>
                        <td>${match.venue || '-'}</td>
                    </tr>
                  `;
                }).join('')}
            </tbody>
        </table>
    </div>`;
  }

  // Utilitários
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  formatDate(date, format = 'dd/MM/yyyy') {
    if (!date) return 'N/A';
    try {
      return formatDate(new Date(date), format, { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  }

  getFormatLabel(format) {
    const formats = {
      'league': 'Pontos Corridos',
      'knockout': 'Eliminatória',
      'mixed': 'Misto'
    };
    return formats[format] || format;
  }

  getStatusLabel(status) {
    const statuses = {
      'draft': 'Rascunho',
      'open': 'Inscrições Abertas',
      'active': 'Em Andamento',
      'finished': 'Finalizado',
      'cancelled': 'Cancelado',
      'scheduled': 'Agendado',
      'live': 'Ao Vivo',
      'confirmed': 'Confirmado',
      'pending': 'Pendente'
    };
    return statuses[status] || status;
  }
}

// Hook para usar o exportador
export const useChampionshipExporter = () => {
  const createExporter = (championship, teams, matches, standings, statistics) => {
    return new ChampionshipExporter(championship, teams, matches, standings, statistics);
  };

  const exportQuick = (type, data) => {
    const { championship, teams, matches, standings, statistics } = data;
    const exporter = createExporter(championship, teams, matches, standings, statistics);
    
    switch (type) {
      case 'standings-csv':
        exporter.exportToCSV('standings');
        break;
      case 'matches-csv':
        exporter.exportToCSV('matches');
        break;
      case 'full-json':
        exporter.exportToJSON();
        break;
      case 'report-html':
        exporter.exportToHTML();
        break;
      case 'report-text':
        const textReport = exporter.generateTextReport();
        exporter.downloadFile(textReport, `relatorio-${championship.name.toLowerCase().replace(/\s+/g, '-')}.txt`, 'text/plain');
        break;
      default:
        throw new Error(`Tipo de exportação não suportado: ${type}`);
    }
  };

  const generateShareableReport = (championship, teams, matches, standings, statistics) => {
    const exporter = createExporter(championship, teams, matches, standings, statistics);
    
    // Gerar resumo para compartilhamento
    const summary = {
      championship: championship.name,
      teams: teams.length,
      matches: matches.filter(m => m.status === 'finished').length,
      totalMatches: matches.length,
      leader: standings[0]?.name || 'TBD',
      topScorer: statistics.topScorers[0]?.playerName || 'N/A',
      totalGoals: statistics.totalGoals || 0
    };

    return {
      summary,
      textReport: exporter.generateTextReport(),
      htmlReport: exporter.generateHTMLReport()
    };
  };

  return {
    createExporter,
    exportQuick,
    generateShareableReport
  };
};