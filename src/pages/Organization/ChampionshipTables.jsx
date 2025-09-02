import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  ArrowLeft,
  Plus,
  Edit,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  AlertCircle,
  Users 
} from 'lucide-react'

const ChampionshipTables = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [championship, setChampionship] = useState(null)
  const [groups, setGroups] = useState([])
  const [matches, setMatches] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingMatch, setEditingMatch] = useState(null)
  const [showAddMatchModal, setShowAddMatchModal] = useState(false)
  const [confirmMatch, setConfirmMatch] = useState(null) // Para confirmação de resultado

  // Estados para o modal de adicionar jogo
  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '15:00',
    groupId: ''
  })

  // Mock data - será substituído pela API
  useEffect(() => {
    setTimeout(() => {
      // Configuração do campeonato
      setChampionship({
        id: id,
        name: 'Campeonato Várzea 2025',
        pointsWin: 3,
        pointsDraw: 1,
        pointsLoss: 0,
        classifyPerGroup: 2,
        tiebreakers: ['points', 'wins', 'goal_difference', 'goals_for', 'head_to_head']
      })

      // Grupos com times
      setGroups([
        {
          id: 'A',
          name: 'Grupo A',
          classifyCount: 2,
          teams: [
            { id: 1, name: 'Real Várzea FC', abbreviation: 'RVF' },
            { id: 2, name: 'Barcelona da Quebrada', abbreviation: 'BCQ' },
            { id: 3, name: 'Juventus do Bairro', abbreviation: 'JDB' },
            { id: 4, name: 'Milan da Vila', abbreviation: 'MDV' }
          ]
        },
        {
          id: 'B',
          name: 'Grupo B',
          classifyCount: 2,
          teams: [
            { id: 5, name: 'Santos da Praça', abbreviation: 'SDP' },
            { id: 6, name: 'Corinthians do Campo', abbreviation: 'CDC' },
            { id: 7, name: 'Palmeiras da Rua', abbreviation: 'PDR' },
            { id: 8, name: 'São Paulo FC Amador', abbreviation: 'SPA' }
          ]
        },
        {
          id: 'C',
          name: 'Grupo C',
          classifyCount: 2,
          teams: [
            { id: 9, name: 'Flamengo Várzea', abbreviation: 'FLV' },
            { id: 10, name: 'Vasco da Comunidade', abbreviation: 'VDC' },
            { id: 11, name: 'Botafogo do Morro', abbreviation: 'BDM' },
            { id: 12, name: 'Fluminense Popular', abbreviation: 'FLP' }
          ]
        }
      ])

      // Jogos realizados
      setMatches([
        // Grupo A
        { id: 1, groupId: 'A', homeTeamId: 1, awayTeamId: 2, homeScore: 2, awayScore: 1, date: '2025-09-15', status: 'finished' },
        { id: 2, groupId: 'A', homeTeamId: 3, awayTeamId: 4, homeScore: 0, awayScore: 0, date: '2025-09-15', status: 'finished' },
        { id: 3, groupId: 'A', homeTeamId: 1, awayTeamId: 3, homeScore: 3, awayScore: 2, date: '2025-09-22', status: 'finished' },
        { id: 4, groupId: 'A', homeTeamId: 2, awayTeamId: 4, homeScore: 1, awayScore: 1, date: '2025-09-22', status: 'finished' },
        { id: 5, groupId: 'A', homeTeamId: 1, awayTeamId: 4, homeScore: null, awayScore: null, date: '2025-09-29', status: 'scheduled' },
        { id: 6, groupId: 'A', homeTeamId: 2, awayTeamId: 3, homeScore: null, awayScore: null, date: '2025-09-29', status: 'scheduled' },
        
        // Grupo B
        { id: 7, groupId: 'B', homeTeamId: 5, awayTeamId: 6, homeScore: 1, awayScore: 2, date: '2025-09-16', status: 'finished' },
        { id: 8, groupId: 'B', homeTeamId: 7, awayTeamId: 8, homeScore: 3, awayScore: 1, date: '2025-09-16', status: 'finished' },
        { id: 9, groupId: 'B', homeTeamId: 5, awayTeamId: 7, homeScore: 0, awayScore: 2, date: '2025-09-23', status: 'finished' },
        { id: 10, groupId: 'B', homeTeamId: 6, awayTeamId: 8, homeScore: 2, awayScore: 0, date: '2025-09-23', status: 'finished' },
        
        // Grupo C - menos jogos
        { id: 11, groupId: 'C', homeTeamId: 9, awayTeamId: 10, homeScore: 4, awayScore: 0, date: '2025-09-17', status: 'finished' },
        { id: 12, groupId: 'C', homeTeamId: 11, awayTeamId: 12, homeScore: 1, awayScore: 1, date: '2025-09-17', status: 'finished' }
      ])

      setLoading(false)
    }, 1000)
  }, [id])

  // Calcular estatísticas de cada time
  const calculateTeamStats = (teamId, groupId) => {
    // CORREÇÃO: Garantir que apenas jogos do grupo específico sejam considerados
    const teamMatches = matches.filter(
      match => match.groupId === groupId && 
      match.status === 'finished' &&
      (match.homeTeamId === teamId || match.awayTeamId === teamId)
    )

    console.log(`Calculando stats para time ${teamId} no grupo ${groupId}:`, teamMatches.length, 'jogos')

    let stats = {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [] // Últimos 5 jogos
    }

    teamMatches.forEach(match => {
      stats.played++
      
      if (match.homeTeamId === teamId) {
        stats.goalsFor += match.homeScore
        stats.goalsAgainst += match.awayScore
        
        if (match.homeScore > match.awayScore) {
          stats.wins++
          stats.points += championship.pointsWin
          stats.form.push('W')
        } else if (match.homeScore === match.awayScore) {
          stats.draws++
          stats.points += championship.pointsDraw
          stats.form.push('D')
        } else {
          stats.losses++
          stats.points += championship.pointsLoss
          stats.form.push('L')
        }
      } else {
        stats.goalsFor += match.awayScore
        stats.goalsAgainst += match.homeScore
        
        if (match.awayScore > match.homeScore) {
          stats.wins++
          stats.points += championship.pointsWin
          stats.form.push('W')
        } else if (match.awayScore === match.homeScore) {
          stats.draws++
          stats.points += championship.pointsDraw
          stats.form.push('D')
        } else {
          stats.losses++
          stats.points += championship.pointsLoss
          stats.form.push('L')
        }
      }
    })

    stats.goalDifference = stats.goalsFor - stats.goalsAgainst
    stats.form = stats.form.slice(-5) // Apenas últimos 5 jogos

    return stats
  }

  // Calcular tabela de classificação para um grupo
  const calculateGroupTable = (group) => {
    const table = group.teams.map(team => {
      const stats = calculateTeamStats(team.id, group.id)
      return {
        ...team,
        ...stats
      }
    })

    // Ordenar pela classificação
    table.sort((a, b) => {
      // 1. Pontos
      if (b.points !== a.points) return b.points - a.points
      
      // 2. Vitórias
      if (b.wins !== a.wins) return b.wins - a.wins
      
      // 3. Saldo de gols
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      
      // 4. Gols pró
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
      
      // 5. Ordem alfabética (desempate final)
      return a.name.localeCompare(b.name)
    })

    // Adicionar posição
    table.forEach((team, index) => {
      team.position = index + 1
      team.qualified = index < group.classifyCount
    })

    return table
  }

  // Confirmar resultado antes de salvar
  const confirmMatchResult = (matchId, homeScore, awayScore) => {
    const match = matches.find(m => m.id === matchId)
    setConfirmMatch({
      id: matchId,
      homeTeamName: getTeamName(match.homeTeamId),
      awayTeamName: getTeamName(match.awayTeamId),
      homeScore,
      awayScore
    })
  }

  // Atualizar resultado de um jogo (após confirmação)
  const updateMatchResult = (matchId, homeScore, awayScore) => {
    setMatches(matches.map(match => 
      match.id === matchId 
        ? { ...match, homeScore, awayScore, status: 'finished' }
        : match
    ))
    setEditingMatch(null)
    setConfirmMatch(null)
  }

  // Obter nome do time
  const getTeamName = (teamId, abbreviation = false) => {
    for (const group of groups) {
      const team = group.teams.find(t => t.id === teamId)
      if (team) return abbreviation ? team.abbreviation : team.name
    }
    return 'Time'
  }

  // Obter times disponíveis baseado no grupo selecionado
  const getAvailableTeams = () => {
    if (!newMatch.groupId) {
      // Se não selecionou grupo, mostrar todos os times
      return groups.flatMap(group => 
        group.teams.map(team => ({...team, groupName: group.name}))
      )
    }
    
    // Se selecionou grupo, mostrar apenas times do grupo
    const selectedGroupObj = groups.find(g => g.id === newMatch.groupId)
    return selectedGroupObj ? selectedGroupObj.teams.map(team => ({...team, groupName: selectedGroupObj.name})) : []
  }

  // Adicionar novo jogo
  const addNewMatch = () => {
    // Validações
    if (!newMatch.homeTeamId || !newMatch.awayTeamId) {
      alert('Selecione os times que vão jogar')
      return
    }
    
    if (newMatch.homeTeamId === newMatch.awayTeamId) {
      alert('Os times devem ser diferentes')
      return
    }
    
    if (!newMatch.date) {
      alert('Selecione a data do jogo')
      return
    }

    // CORREÇÃO: Determinar o grupo do jogo de forma mais precisa
    let matchGroupId = newMatch.groupId
    
    if (!matchGroupId) {
      // Encontrar grupo dos times selecionados
      const homeTeamGroup = groups.find(g => 
        g.teams.some(t => t.id === parseInt(newMatch.homeTeamId))
      )
      const awayTeamGroup = groups.find(g => 
        g.teams.some(t => t.id === parseInt(newMatch.awayTeamId))
      )
      
      if (homeTeamGroup && awayTeamGroup) {
        if (homeTeamGroup.id === awayTeamGroup.id) {
          // Times do mesmo grupo
          matchGroupId = homeTeamGroup.id
        } else {
          // Times de grupos diferentes - usar primeiro grupo encontrado por enquanto
          matchGroupId = homeTeamGroup.id
          console.warn('Times de grupos diferentes - usando grupo do time da casa')
        }
      } else {
        console.error('Erro: Não foi possível determinar o grupo dos times')
        alert('Erro: Não foi possível determinar o grupo dos times')
        return
      }
    }

    console.log('Criando jogo para grupo:', matchGroupId)

    // Criar novo jogo
    const newMatchObj = {
      id: Math.max(...matches.map(m => m.id), 0) + 1,
      groupId: matchGroupId,
      homeTeamId: parseInt(newMatch.homeTeamId),
      awayTeamId: parseInt(newMatch.awayTeamId),
      homeScore: null,
      awayScore: null,
      date: newMatch.date,
      time: newMatch.time,
      status: 'scheduled'
    }

    console.log('Novo jogo criado:', newMatchObj)

    // Adicionar à lista de jogos
    setMatches([...matches, newMatchObj])

    // Limpar formulário e fechar modal
    setNewMatch({
      homeTeamId: '',
      awayTeamId: '',
      date: '',
      time: '15:00',
      groupId: ''
    })
    setShowAddMatchModal(false)
    
    // Mostrar mensagem de sucesso
    alert('Jogo adicionado com sucesso!')
  }

  // Reset modal ao fechar
  const closeModal = () => {
    setShowAddMatchModal(false)
    setNewMatch({
      homeTeamId: '',
      awayTeamId: '',
      date: '',
      time: '15:00',
      groupId: ''
    })
  }

  // Filtrar grupos para exibição
  const filteredGroups = selectedGroup === 'all' 
    ? groups 
    : groups.filter(g => g.id === selectedGroup)

  // Debug: Verificar dados
  console.log('Selected group:', selectedGroup)
  console.log('Filtered groups:', filteredGroups.map(g => g.id))
  console.log('All matches:', matches.map(m => ({ id: m.id, groupId: m.groupId })))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando tabelas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/organization/championships/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{championship.name}</h1>
          <p className="text-gray-600">Tabelas e Classificação</p>
        </div>
        <button
          onClick={() => setShowAddMatchModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Adicionar Jogo
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sistema de Pontos</p>
              <p className="text-lg font-semibold text-gray-900">
                V: {championship.pointsWin} | E: {championship.pointsDraw} | D: {championship.pointsLoss}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classificados por Grupo</p>
              <p className="text-lg font-semibold text-gray-900">
                {championship.classifyPerGroup} times
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Grupos</p>
              <p className="text-lg font-semibold text-gray-900">
                {groups.length} grupos
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabs de Grupos */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`
              py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap
              ${selectedGroup === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Todos os Grupos
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`
                py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap
                ${selectedGroup === group.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {group.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tabelas de Classificação */}
      <div className="space-y-6">
        {filteredGroups.map(group => {
          const table = calculateGroupTable(group)
          // CORREÇÃO: Filtrar jogos APENAS do grupo atual
          const groupMatches = matches.filter(m => m.groupId === group.id)
          
          return (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{group.name}</h2>
                  <span className="text-sm text-gray-600">
                    Classificam: {group.classifyCount} times
                  </span>
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">J</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">V</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">E</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">D</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">GP</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">GC</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SG</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pts</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Últimos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {table.map((team, index) => (
                      <tr 
                        key={team.id}
                        className={`
                          ${team.qualified ? 'bg-green-50' : ''}
                          hover:bg-gray-50 transition-colors
                        `}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`
                              font-semibold text-sm
                              ${team.qualified ? 'text-green-600' : 'text-gray-600'}
                            `}>
                              {team.position}
                            </span>
                            {team.qualified && (
                              <div className="w-1 h-4 bg-green-500 rounded-full" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.abbreviation}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{team.played}</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{team.wins}</td>
                        <td className="px-4 py-3 text-center text-sm text-yellow-600 font-medium">{team.draws}</td>
                        <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">{team.losses}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{team.goalsFor}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{team.goalsAgainst}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`
                            text-sm font-medium
                            ${team.goalDifference > 0 ? 'text-green-600' : ''}
                            ${team.goalDifference < 0 ? 'text-red-600' : ''}
                            ${team.goalDifference === 0 ? 'text-gray-600' : ''}
                          `}>
                            {team.goalDifference > 0 && '+'}{team.goalDifference}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-gray-900">{team.points}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-center">
                            {team.form.map((result, i) => (
                              <div
                                key={i}
                                className={`
                                  w-5 h-5 rounded-sm flex items-center justify-center text-xs font-bold text-white
                                  ${result === 'W' ? 'bg-green-500' : ''}
                                  ${result === 'D' ? 'bg-yellow-500' : ''}
                                  ${result === 'L' ? 'bg-red-500' : ''}
                                `}
                              >
                                {result}
                              </div>
                            ))}
                            {team.form.length === 0 && (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Jogos do Grupo */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Jogos do {group.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {groupMatches.length} {groupMatches.length === 1 ? 'jogo' : 'jogos'}
                  </span>
                </div>
                
                {groupMatches.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum jogo criado para este grupo ainda</p>
                    <p className="text-xs mt-1">Use o botão "Adicionar Jogo" para criar partidas</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupMatches.map(match => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="text-xs text-gray-500">
                          <div>{new Date(match.date).toLocaleDateString('pt-BR')}</div>
                          {match.time && (
                            <div className="mt-0.5">{match.time}</div>
                          )}
                        </div>
                        
                        {editingMatch === match.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {getTeamName(match.homeTeamId, true)}
                            </span>
                            <input
                              type="number"
                              defaultValue={match.homeScore}
                              className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                              id={`home-${match.id}`}
                              min="0"
                            />
                            <span className="text-gray-500">x</span>
                            <input
                              type="number"
                              defaultValue={match.awayScore}
                              className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                              id={`away-${match.id}`}
                              min="0"
                            />
                            <span className="text-sm font-medium">
                              {getTeamName(match.awayTeamId, true)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {getTeamName(match.homeTeamId, true)}
                            </span>
                            {match.status === 'finished' ? (
                              <>
                                <span className="px-2 py-1 bg-white rounded text-sm font-bold">
                                  {match.homeScore}
                                </span>
                                <span className="text-gray-500">x</span>
                                <span className="px-2 py-1 bg-white rounded text-sm font-bold">
                                  {match.awayScore}
                                </span>
                              </>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                Agendado
                              </span>
                            )}
                            <span className="text-sm font-medium">
                              {getTeamName(match.awayTeamId, true)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingMatch === match.id ? (
                          <>
                            <button
                              onClick={() => {
                                const homeScore = parseInt(document.getElementById(`home-${match.id}`).value)
                                const awayScore = parseInt(document.getElementById(`away-${match.id}`).value)
                                confirmMatchResult(match.id, homeScore, awayScore)
                              }}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingMatch(null)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingMatch(match.id)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title={match.status === 'finished' ? 'Editar resultado' : 'Adicionar resultado'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                                      ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legenda</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Classificado para próxima fase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">V</div>
            <span className="text-gray-600">Vitória</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded">E</div>
            <span className="text-gray-600">Empate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">D</div>
            <span className="text-gray-600">Derrota</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Critérios de desempate:</strong> 1º Pontos | 2º Vitórias | 3º Saldo de gols | 4º Gols pró | 5º Confronto direto
          </p>
        </div>
      </div>

      {/* Modal Adicionar Jogo */}
      {showAddMatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Adicionar Novo Jogo</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Seletor de Grupo (Opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo (opcional)
                </label>
                <select
                  value={newMatch.groupId}
                  onChange={(e) => setNewMatch({...newMatch, groupId: e.target.value, homeTeamId: '', awayTeamId: ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos os grupos</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Deixe vazio para permitir jogos entre grupos diferentes
                </p>
              </div>

              {/* Time da Casa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time da Casa *
                </label>
                <select
                  value={newMatch.homeTeamId}
                  onChange={(e) => setNewMatch({...newMatch, homeTeamId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecione o time da casa</option>
                  {getAvailableTeams().map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} {team.groupName && `(${team.groupName})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Visitante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Visitante *
                </label>
                <select
                  value={newMatch.awayTeamId}
                  onChange={(e) => setNewMatch({...newMatch, awayTeamId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecione o time visitante</option>
                  {getAvailableTeams()
                    .filter(team => team.id.toString() !== newMatch.homeTeamId)
                    .map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} {team.groupName && `(${team.groupName})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Jogo *
                </label>
                <input
                  type="date"
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Horário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Visualização do jogo */}
              {newMatch.homeTeamId && newMatch.awayTeamId && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Prévia do jogo:</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {getTeamName(parseInt(newMatch.homeTeamId))}
                    </span>
                    <span className="text-gray-500">vs</span>
                    <span className="font-medium text-gray-900">
                      {getTeamName(parseInt(newMatch.awayTeamId))}
                    </span>
                  </div>
                  {newMatch.date && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(newMatch.date).toLocaleDateString('pt-BR')}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{newMatch.time}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addNewMatch}
                disabled={!newMatch.homeTeamId || !newMatch.awayTeamId || !newMatch.date}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Adicionar Jogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Resultado */}
      {confirmMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Resultado</h3>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Confirma o resultado abaixo? As tabelas serão atualizadas automaticamente.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{confirmMatch.homeTeamName}</p>
                    <p className="text-2xl font-bold text-primary-600">{confirmMatch.homeScore}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">vs</p>
                    <p className="text-xl font-bold text-gray-400">×</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{confirmMatch.awayTeamName}</p>
                    <p className="text-2xl font-bold text-primary-600">{confirmMatch.awayScore}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Após confirmar, as tabelas de classificação serão atualizadas imediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setConfirmMatch(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => updateMatchResult(confirmMatch.id, confirmMatch.homeScore, confirmMatch.awayScore)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmar Resultado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChampionshipTables