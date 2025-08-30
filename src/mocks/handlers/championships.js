import { http, HttpResponse } from 'msw'
import { 
  seedData, 
  getChampionship, 
  getMatchesByChampionship,
  getStandingsByChampionship,
  getTopScorersByChampionship,
  getClub,
  createChampionship,
  createMatch
} from '../data/seeds'
import { POINTS_SYSTEM } from '../../utils/constants'

export const championshipsHandlers = [
  // GET /api/championships
  http.get('/api/championships', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const status = url.searchParams.get('status')
      const organizerId = url.searchParams.get('organizerId')
      const limit = parseInt(url.searchParams.get('limit')) || 20
      const offset = parseInt(url.searchParams.get('offset')) || 0

      let championships = [...seedData.championships]

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase()
        championships = championships.filter(championship => 
          championship.name.toLowerCase().includes(searchLower) ||
          championship.season.includes(search)
        )
      }

      // Filter by status
      if (status) {
        championships = championships.filter(championship => championship.status === status)
      }

      // Filter by organizer
      if (organizerId) {
        championships = championships.filter(championship => championship.organizerId === organizerId)
      }

      // Add organizer and teams data
      championships = championships.map(championship => {
        const organizer = seedData.organizations.find(org => org.id === championship.organizerId) ||
                         seedData.users.find(u => u.id === championship.organizerId)
        
        const teams = championship.teamIds.map(teamId => getClub(teamId)).filter(Boolean)

        return {
          ...championship,
          organizer: organizer ? {
            id: organizer.id,
            name: organizer.name
          } : null,
          teams,
          teamsCount: teams.length
        }
      })

      // Sort by creation date (newest first)
      championships.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Pagination
      const total = championships.length
      championships = championships.slice(offset, offset + limit)

      return HttpResponse.json({
        data: championships,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      })
    } catch (error) {
      console.error('Get championships error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/championships/:id
  http.get('/api/championships/:id', async ({ params }) => {
    try {
      const { id } = params
      const championship = getChampionship(id)

      if (!championship) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      // Add related data
      const organizer = seedData.organizations.find(org => org.id === championship.organizerId) ||
                       seedData.users.find(u => u.id === championship.organizerId)
      
      const teams = championship.teamIds.map(teamId => getClub(teamId)).filter(Boolean)

      const championshipWithData = {
        ...championship,
        organizer: organizer ? {
          id: organizer.id,
          name: organizer.name,
          email: organizer.email
        } : null,
        teams,
        teamsCount: teams.length,
        matchesCount: getMatchesByChampionship(id).length
      }

      return HttpResponse.json(championshipWithData)
    } catch (error) {
      console.error('Get championship error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/championships/:id/teams
  http.get('/api/championships/:id/teams', async ({ params }) => {
    try {
      const { id } = params
      const championship = getChampionship(id)

      if (!championship) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      const teams = championship.teamIds.map(teamId => getClub(teamId)).filter(Boolean)

      return HttpResponse.json(teams)
    } catch (error) {
      console.error('Get championship teams error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/championships/:id/matches
  http.get('/api/championships/:id/matches', async ({ params }) => {
    try {
      const { id } = params
      const championship = getChampionship(id)

      if (!championship) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      let matches = getMatchesByChampionship(id)

      // Add team data
      matches = matches.map(match => {
        const homeTeam = getClub(match.homeTeamId)
        const awayTeam = getClub(match.awayTeamId)

        return {
          ...match,
          homeTeam: homeTeam ? {
            id: homeTeam.id,
            name: homeTeam.name,
            bairro: homeTeam.bairro
          } : null,
          awayTeam: awayTeam ? {
            id: awayTeam.id,
            name: awayTeam.name,
            bairro: awayTeam.bairro
          } : null
        }
      })

      // Sort by date and round
      matches.sort((a, b) => {
        if (a.round !== b.round) return a.round - b.round
        return new Date(a.date) - new Date(b.date)
      })

      return HttpResponse.json(matches)
    } catch (error) {
      console.error('Get championship matches error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/championships/:id/standings
  http.get('/api/championships/:id/standings', async ({ params }) => {
    try {
      const { id } = params
      const championship = getChampionship(id)

      if (!championship) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      // Calculate standings from matches (real-time calculation)
      const matches = getMatchesByChampionship(id)
      const teams = championship.teamIds.map(teamId => getClub(teamId)).filter(Boolean)
      
      const standings = teams.map(team => ({
        teamId: team.id,
        name: team.name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0, // goals for
        ga: 0, // goals against
        gd: 0, // goal difference
        points: 0,
        form: [] // last 5 matches
      }))

      // Process finished matches
      matches
        .filter(match => match.status === 'finished' && match.scoreHome !== null && match.scoreAway !== null)
        .forEach(match => {
          const home = standings.find(s => s.teamId === match.homeTeamId)
          const away = standings.find(s => s.teamId === match.awayTeamId)

          if (home && away) {
            home.played++
            away.played++
            home.gf += match.scoreHome
            home.ga += match.scoreAway
            away.gf += match.scoreAway
            away.ga += match.scoreHome

            if (match.scoreHome > match.scoreAway) {
              // Home win
              home.wins++
              home.points += POINTS_SYSTEM.WIN
              away.losses++
              away.points += POINTS_SYSTEM.LOSS
              home.form.unshift('W')
              away.form.unshift('L')
            } else if (match.scoreHome < match.scoreAway) {
              // Away win
              away.wins++
              away.points += POINTS_SYSTEM.WIN
              home.losses++
              home.points += POINTS_SYSTEM.LOSS
              away.form.unshift('W')
              home.form.unshift('L')
            } else {
              // Draw
              home.draws++
              away.draws++
              home.points += POINTS_SYSTEM.DRAW
              away.points += POINTS_SYSTEM.DRAW
              home.form.unshift('D')
              away.form.unshift('D')
            }

            home.gd = home.gf - home.ga
            away.gd = away.gf - away.ga

            // Keep only last 5 matches
            home.form = home.form.slice(0, 5)
            away.form = away.form.slice(0, 5)
          }
        })

      // Sort by: points desc, goal difference desc, wins desc, goals for desc
      standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.gd !== a.gd) return b.gd - a.gd
        if (b.wins !== a.wins) return b.wins - a.wins
        return b.gf - a.gf
      })

      // Add position
      standings.forEach((team, index) => {
        team.position = index + 1
      })

      return HttpResponse.json(standings)
    } catch (error) {
      console.error('Get championship standings error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/championships/:id/stats
  http.get('/api/championships/:id/stats', async ({ params }) => {
    try {
      const { id } = params
      const championship = getChampionship(id)

      if (!championship) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      const matches = getMatchesByChampionship(id)
      const finishedMatches = matches.filter(m => m.status === 'finished')

      // Calculate top scorers
      const scorers = {}
      finishedMatches.forEach(match => {
        if (match.goals) {
          match.goals.forEach(goal => {
            if (goal.type !== 'own_goal' && goal.playerId) {
              if (!scorers[goal.playerId]) {
                const team = getClub(goal.teamId)
                scorers[goal.playerId] = {
                  playerId: goal.playerId,
                  name: goal.playerName || 'Jogador',
                  teamId: goal.teamId,
                  teamName: team?.name || 'Time',
                  goals: 0
                }
              }
              scorers[goal.playerId].goals++
            }
          })
        }
      })

      const topScorers = Object.values(scorers)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10)

      // Calculate goalkeepers stats (simplified)
      const goalkeepers = championship.teamIds.map(teamId => {
        const team = getClub(teamId)
        const teamMatches = finishedMatches.filter(m => 
          m.homeTeamId === teamId || m.awayTeamId === teamId
        )
        
        const goalsConceded = teamMatches.reduce((total, match) => {
          if (match.homeTeamId === teamId) {
            return total + (match.scoreAway || 0)
          } else {
            return total + (match.scoreHome || 0)
          }
        }, 0)

        const cleanSheets = teamMatches.filter(match => {
          if (match.homeTeamId === teamId) {
            return match.scoreAway === 0
          } else {
            return match.scoreHome === 0
          }
        }).length

        return {
          teamId,
          teamName: team?.name || 'Time',
          matchesPlayed: teamMatches.length,
          goalsConceded,
          cleanSheets,
          average: teamMatches.length > 0 ? (goalsConceded / teamMatches.length).toFixed(2) : 0
        }
      }).filter(gk => gk.matchesPlayed > 0)
      .sort((a, b) => parseFloat(a.average) - parseFloat(b.average))

      // General stats
      const totalGoals = finishedMatches.reduce((total, match) => 
        total + (match.scoreHome || 0) + (match.scoreAway || 0), 0
      )

      const stats = {
        totalMatches: matches.length,
        finishedMatches: finishedMatches.length,
        scheduledMatches: matches.filter(m => m.status === 'scheduled').length,
        totalGoals,
        averageGoalsPerMatch: finishedMatches.length > 0 ? (totalGoals / finishedMatches.length).toFixed(2) : 0,
        topScorers,
        goalkeepers: goalkeepers.slice(0, 5),
        biggestWin: null, // Could be calculated
        longestWinStreak: null // Could be calculated
      }

      return HttpResponse.json(stats)
    } catch (error) {
      console.error('Get championship stats error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/championships
  http.post('/api/championships', async ({ request }) => {
    try {
      const body = await request.json()
      const { name, season, format, description, maxTeams, startDate, endDate } = body

      // Get organizer ID from auth header (simplified)
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Token não fornecido' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const tokenParts = token.split('-')
      const organizerId = tokenParts[3]

      // Validate required fields
      if (!name || !season || !format) {
        return HttpResponse.json(
          { message: 'Nome, temporada e formato são obrigatórios' },
          { status: 400 }
        )
      }

      // Create championship
      const championship = createChampionship({
        name: name.trim(),
        season: season.trim(),
        organizerId,
        format,
        description: description?.trim() || '',
        maxTeams: maxTeams || 16,
        startDate: startDate || null,
        endDate: endDate || null
      })

      seedData.championships.push(championship)

      return HttpResponse.json({
        championship,
        message: 'Campeonato criado com sucesso'
      }, { status: 201 })
    } catch (error) {
      console.error('Create championship error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PUT /api/championships/:id
  http.put('/api/championships/:id', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const championshipIndex = seedData.championships.findIndex(c => c.id === id)
      if (championshipIndex === -1) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      // Validate required fields
      const { name, season, format } = body
      if (!name || !season || !format) {
        return HttpResponse.json(
          { message: 'Nome, temporada e formato são obrigatórios' },
          { status: 400 }
        )
      }

      // Update championship
      const updates = {
        name: name.trim(),
        season: season.trim(),
        format,
        description: body.description?.trim() || '',
        maxTeams: body.maxTeams || seedData.championships[championshipIndex].maxTeams,
        startDate: body.startDate || seedData.championships[championshipIndex].startDate,
        endDate: body.endDate || seedData.championships[championshipIndex].endDate,
        updatedAt: new Date().toISOString()
      }

      seedData.championships[championshipIndex] = {
        ...seedData.championships[championshipIndex],
        ...updates
      }

      return HttpResponse.json({
        championship: seedData.championships[championshipIndex],
        message: 'Campeonato atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update championship error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/championships/:id/teams
  http.post('/api/championships/:id/teams', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()
      const { teamId } = body

      const championshipIndex = seedData.championships.findIndex(c => c.id === id)
      if (championshipIndex === -1) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      const championship = seedData.championships[championshipIndex]

      // Check if team exists
      const team = getClub(teamId)
      if (!team) {
        return HttpResponse.json(
          { message: 'Time não encontrado' },
          { status: 404 }
        )
      }

      // Check if team is already in championship
      if (championship.teamIds.includes(teamId)) {
        return HttpResponse.json(
          { message: 'Time já está inscrito neste campeonato' },
          { status: 409 }
        )
      }

      // Check max teams limit
      if (championship.teamIds.length >= championship.maxTeams) {
        return HttpResponse.json(
          { message: 'Campeonato já atingiu o limite máximo de times' },
          { status: 400 }
        )
      }

      // Add team to championship
      seedData.championships[championshipIndex] = {
        ...championship,
        teamIds: [...championship.teamIds, teamId],
        updatedAt: new Date().toISOString()
      }

      return HttpResponse.json({
        message: 'Time adicionado ao campeonato com sucesso'
      })
    } catch (error) {
      console.error('Add team to championship error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/championships/:id/generate-matches
  http.post('/api/championships/:id/generate-matches', async ({ params }) => {
    try {
      const { id } = params

      const championshipIndex = seedData.championships.findIndex(c => c.id === id)
      if (championshipIndex === -1) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      const championship = seedData.championships[championshipIndex]

      // Check if championship has enough teams
      if (championship.teamIds.length < 2) {
        return HttpResponse.json(
          { message: 'Campeonato precisa de pelo menos 2 times para gerar jogos' },
          { status: 400 }
        )
      }

      // Check if matches already exist
      const existingMatches = getMatchesByChampionship(id)
      if (existingMatches.length > 0) {
        return HttpResponse.json(
          { message: 'Jogos já foram gerados para este campeonato' },
          { status: 409 }
        )
      }

      // Generate matches based on format
      const teams = championship.teamIds
      const matches = []

      if (championship.format === 'league') {
        // Round-robin tournament (todos contra todos)
        const totalRounds = (teams.length - 1) * 2 // ida e volta
        let round = 1
        let matchDate = new Date(championship.startDate || Date.now())

        // First leg (ida)
        for (let i = 0; i < teams.length - 1; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            const match = createMatch({
              championshipId: id,
              round: round,
              homeTeamId: teams[i],
              awayTeamId: teams[j],
              date: new Date(matchDate).toISOString(),
              venue: `Campo do ${getClub(teams[i])?.name || 'Time'}`
            })
            matches.push(match)
            
            // Add 1 week between matches
            matchDate.setDate(matchDate.getDate() + 7)
          }
          round++
        }

        // Second leg (volta) - swap home/away
        for (let i = 0; i < teams.length - 1; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            const match = createMatch({
              championshipId: id,
              round: round,
              homeTeamId: teams[j], // Swapped
              awayTeamId: teams[i], // Swapped
              date: new Date(matchDate).toISOString(),
              venue: `Campo do ${getClub(teams[j])?.name || 'Time'}`
            })
            matches.push(match)
            
            matchDate.setDate(matchDate.getDate() + 7)
          }
          round++
        }
      } else if (championship.format === 'knockout') {
        // Simple elimination tournament
        // TODO: Implement knockout logic
        return HttpResponse.json(
          { message: 'Formato eliminatório ainda não implementado' },
          { status: 501 }
        )
      }

      // Add matches to seed data
      seedData.matches.push(...matches)

      // Update championship status
      seedData.championships[championshipIndex] = {
        ...championship,
        status: 'active',
        updatedAt: new Date().toISOString()
      }

      return HttpResponse.json({
        matches,
        message: `${matches.length} jogos gerados com sucesso`
      })
    } catch (error) {
      console.error('Generate matches error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // DELETE /api/championships/:id
  http.delete('/api/championships/:id', async ({ params }) => {
    try {
      const { id } = params

      const championshipIndex = seedData.championships.findIndex(c => c.id === id)
      if (championshipIndex === -1) {
        return HttpResponse.json(
          { message: 'Campeonato não encontrado' },
          { status: 404 }
        )
      }

      // Remove all matches
      seedData.matches = seedData.matches.filter(m => m.championshipId !== id)

      // Remove all standings
      seedData.standings = seedData.standings.filter(s => s.championshipId !== id)

      // Remove top scorers
      seedData.topScorers = seedData.topScorers.filter(s => s.championshipId !== id)

      // Remove championship
      seedData.championships.splice(championshipIndex, 1)

      return HttpResponse.json({
        message: 'Campeonato removido com sucesso'
      })
    } catch (error) {
      console.error('Delete championship error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]

// Match handlers
export const matchHandlers = [
  // GET /api/matches
  http.get('/api/matches', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const championshipId = url.searchParams.get('championshipId')
      const status = url.searchParams.get('status')
      const teamId = url.searchParams.get('teamId')
      const round = url.searchParams.get('round')
      const limit = parseInt(url.searchParams.get('limit')) || 20
      const offset = parseInt(url.searchParams.get('offset')) || 0

      let matches = [...seedData.matches]

      // Filters
      if (championshipId) {
        matches = matches.filter(m => m.championshipId === championshipId)
      }

      if (status) {
        matches = matches.filter(m => m.status === status)
      }

      if (teamId) {
        matches = matches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId)
      }

      if (round) {
        matches = matches.filter(m => m.round === parseInt(round))
      }

      // Add team data
      matches = matches.map(match => {
        const homeTeam = getClub(match.homeTeamId)
        const awayTeam = getClub(match.awayTeamId)
        const championship = getChampionship(match.championshipId)

        return {
          ...match,
          homeTeam: homeTeam ? {
            id: homeTeam.id,
            name: homeTeam.name,
            bairro: homeTeam.bairro
          } : null,
          awayTeam: awayTeam ? {
            id: awayTeam.id,
            name: awayTeam.name,
            bairro: awayTeam.bairro
          } : null,
          championship: championship ? {
            id: championship.id,
            name: championship.name
          } : null
        }
      })

      // Sort by date
      matches.sort((a, b) => new Date(a.date) - new Date(b.date))

      // Pagination
      const total = matches.length
      matches = matches.slice(offset, offset + limit)

      return HttpResponse.json({
        data: matches,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      })
    } catch (error) {
      console.error('Get matches error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/matches/:id
  http.get('/api/matches/:id', async ({ params }) => {
    try {
      const { id } = params
      const match = seedData.matches.find(m => m.id === id)

      if (!match) {
        return HttpResponse.json(
          { message: 'Jogo não encontrado' },
          { status: 404 }
        )
      }

      // Add related data
      const homeTeam = getClub(match.homeTeamId)
      const awayTeam = getClub(match.awayTeamId)
      const championship = getChampionship(match.championshipId)

      const matchWithData = {
        ...match,
        homeTeam: homeTeam ? {
          id: homeTeam.id,
          name: homeTeam.name,
          bairro: homeTeam.bairro
        } : null,
        awayTeam: awayTeam ? {
          id: awayTeam.id,
          name: awayTeam.name,
          bairro: awayTeam.bairro
        } : null,
        championship: championship ? {
          id: championship.id,
          name: championship.name
        } : null
      }

      return HttpResponse.json(matchWithData)
    } catch (error) {
      console.error('Get match error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PATCH /api/matches/:id/score
  http.patch('/api/matches/:id/score', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const matchIndex = seedData.matches.findIndex(m => m.id === id)
      if (matchIndex === -1) {
        return HttpResponse.json(
          { message: 'Jogo não encontrado' },
          { status: 404 }
        )
      }

      const match = seedData.matches[matchIndex]

      // Validate scores
      const { scoreHome, scoreAway, goals } = body
      
      if (typeof scoreHome !== 'number' || typeof scoreAway !== 'number' || 
          scoreHome < 0 || scoreAway < 0) {
        return HttpResponse.json(
          { message: 'Placares devem ser números não negativos' },
          { status: 400 }
        )
      }

      // Validate goals if provided
      if (goals && Array.isArray(goals)) {
        const totalGoals = scoreHome + scoreAway
        if (goals.length > totalGoals) {
          return HttpResponse.json(
            { message: 'Número de gols não confere com o placar' },
            { status: 400 }
          )
        }
      }

      // Update match
      seedData.matches[matchIndex] = {
        ...match,
        scoreHome,
        scoreAway,
        goals: goals || match.goals,
        status: 'finished',
        finishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return HttpResponse.json({
        match: seedData.matches[matchIndex],
        message: 'Resultado atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update match score error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/matches/:id/goals
  http.post('/api/matches/:id/goals', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const matchIndex = seedData.matches.findIndex(m => m.id === id)
      if (matchIndex === -1) {
        return HttpResponse.json(
          { message: 'Jogo não encontrado' },
          { status: 404 }
        )
      }

      const match = seedData.matches[matchIndex]
      const { playerId, playerName, teamId, minute, type = 'goal' } = body

      // Validate goal data
      if (!playerId || !playerName || !teamId || !minute) {
        return HttpResponse.json(
          { message: 'Dados do gol incompletos' },
          { status: 400 }
        )
      }

      if (teamId !== match.homeTeamId && teamId !== match.awayTeamId) {
        return HttpResponse.json(
          { message: 'Time não participa deste jogo' },
          { status: 400 }
        )
      }

      // Add goal
      const goal = {
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        playerId,
        playerName,
        teamId,
        minute: parseInt(minute),
        type,
        createdAt: new Date().toISOString()
      }

      const updatedGoals = [...(match.goals || []), goal]

      seedData.matches[matchIndex] = {
        ...match,
        goals: updatedGoals,
        updatedAt: new Date().toISOString()
      }

      return HttpResponse.json({
        goal,
        message: 'Gol adicionado com sucesso'
      })
    } catch (error) {
      console.error('Add goal error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PUT /api/matches/:id
  http.put('/api/matches/:id', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const matchIndex = seedData.matches.findIndex(m => m.id === id)
      if (matchIndex === -1) {
        return HttpResponse.json(
          { message: 'Jogo não encontrado' },
          { status: 404 }
        )
      }

      const match = seedData.matches[matchIndex]

      // Update match details (date, venue, etc.)
      const updates = {
        date: body.date || match.date,
        venue: body.venue || match.venue,
        round: body.round || match.round,
        updatedAt: new Date().toISOString()
      }

      seedData.matches[matchIndex] = {
        ...match,
        ...updates
      }

      return HttpResponse.json({
        match: seedData.matches[matchIndex],
        message: 'Jogo atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update match error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // DELETE /api/matches/:id
  http.delete('/api/matches/:id', async ({ params }) => {
    try {
      const { id } = params

      const matchIndex = seedData.matches.findIndex(m => m.id === id)
      if (matchIndex === -1) {
        return HttpResponse.json(
          { message: 'Jogo não encontrado' },
          { status: 404 }
        )
      }

      seedData.matches.splice(matchIndex, 1)

      return HttpResponse.json({
        message: 'Jogo removido com sucesso'
      })
    } catch (error) {
      console.error('Delete match error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]