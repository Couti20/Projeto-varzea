import { http, HttpResponse } from 'msw'
import { 
  seedData, 
  getAthlete, 
  getInvitesByAthlete,
  getClub
} from '../data/seeds'

export const athletesHandlers = [
  // GET /api/athletes
  http.get('/api/athletes', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const status = url.searchParams.get('status')
      const position = url.searchParams.get('position')
      const clubId = url.searchParams.get('clubId')
      const limit = parseInt(url.searchParams.get('limit')) || 20
      const offset = parseInt(url.searchParams.get('offset')) || 0

      let athletes = [...seedData.athletes]

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase()
        athletes = athletes.filter(athlete => 
          athlete.name.toLowerCase().includes(searchLower) ||
          athlete.position.toLowerCase().includes(searchLower)
        )
      }

      // Filter by status
      if (status) {
        athletes = athletes.filter(athlete => athlete.status === status)
      }

      // Filter by position
      if (position) {
        athletes = athletes.filter(athlete => athlete.position === position)
      }

      // Filter by club
      if (clubId) {
        athletes = athletes.filter(athlete => athlete.clubId === clubId)
      }

      // Add club information
      athletes = athletes.map(athlete => {
        if (athlete.clubId) {
          const club = getClub(athlete.clubId)
          return {
            ...athlete,
            club: club ? { id: club.id, name: club.name, bairro: club.bairro } : null
          }
        }
        return athlete
      })

      // Pagination
      const total = athletes.length
      athletes = athletes.slice(offset, offset + limit)

      return HttpResponse.json({
        data: athletes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      })
    } catch (error) {
      console.error('Get athletes error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/athletes/:id
  http.get('/api/athletes/:id', async ({ params }) => {
    try {
      const { id } = params
      const athlete = getAthlete(id)

      if (!athlete) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      // Add club information
      let athleteWithClub = { ...athlete }
      if (athlete.clubId) {
        const club = getClub(athlete.clubId)
        athleteWithClub.club = club ? {
          id: club.id,
          name: club.name,
          bairro: club.bairro,
          foundedYear: club.foundedYear
        } : null
      }

      return HttpResponse.json(athleteWithClub)
    } catch (error) {
      console.error('Get athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/athletes/:id/invites
  http.get('/api/athletes/:id/invites', async ({ params }) => {
    try {
      const { id } = params
      const athlete = getAthlete(id)

      if (!athlete) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      const invites = getInvitesByAthlete(id).map(invite => {
        const club = getClub(invite.clubId)
        return {
          ...invite,
          club: club ? {
            id: club.id,
            name: club.name,
            bairro: club.bairro,
            foundedYear: club.foundedYear
          } : null
        }
      })

      // Sort by creation date (newest first)
      invites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return HttpResponse.json(invites)
    } catch (error) {
      console.error('Get athlete invites error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PUT /api/athletes/:id
  http.put('/api/athletes/:id', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const athleteIndex = seedData.athletes.findIndex(a => a.id === id)
      if (athleteIndex === -1) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      // Validate required fields
      const { name, age, position } = body
      if (!name || !age || !position) {
        return HttpResponse.json(
          { message: 'Nome, idade e posição são obrigatórios' },
          { status: 400 }
        )
      }

      if (age < 16 || age > 50) {
        return HttpResponse.json(
          { message: 'Idade deve estar entre 16 e 50 anos' },
          { status: 400 }
        )
      }

      // Update athlete
      const updates = {
        name: name.trim(),
        age: parseInt(age),
        position: position.trim(),
        phone: body.phone || seedData.athletes[athleteIndex].phone,
        updatedAt: new Date().toISOString()
      }

      seedData.athletes[athleteIndex] = {
        ...seedData.athletes[athleteIndex],
        ...updates
      }

      // Also update user record if exists
      const userIndex = seedData.users.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        seedData.users[userIndex] = {
          ...seedData.users[userIndex],
          name: updates.name,
          updatedAt: updates.updatedAt
        }
      }

      return HttpResponse.json({
        athlete: seedData.athletes[athleteIndex],
        message: 'Perfil atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PATCH /api/athletes/:id/leave
  http.patch('/api/athletes/:id/leave', async ({ params }) => {
    try {
      const { id } = params

      const athleteIndex = seedData.athletes.findIndex(a => a.id === id)
      if (athleteIndex === -1) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      const athlete = seedData.athletes[athleteIndex]
      
      if (!athlete.clubId) {
        return HttpResponse.json(
          { message: 'Atleta não pertence a nenhum clube' },
          { status: 400 }
        )
      }

      const oldClubId = athlete.clubId

      // Update athlete status
      seedData.athletes[athleteIndex] = {
        ...athlete,
        clubId: null,
        status: 'free',
        updatedAt: new Date().toISOString()
      }

      // Remove from club's athletes list
      const clubIndex = seedData.clubs.findIndex(c => c.id === oldClubId)
      if (clubIndex !== -1) {
        seedData.clubs[clubIndex].athletes = seedData.clubs[clubIndex].athletes.filter(
          athleteId => athleteId !== id
        )
        seedData.clubs[clubIndex].updatedAt = new Date().toISOString()
      }

      return HttpResponse.json({
        message: 'Você saiu do clube com sucesso'
      })
    } catch (error) {
      console.error('Leave club error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/athletes/:id/stats
  http.get('/api/athletes/:id/stats', async ({ params }) => {
    try {
      const { id } = params
      const athlete = getAthlete(id)

      if (!athlete) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      // Calculate stats from matches (mock data for now)
      const stats = {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        yellowCards: 0,
        redCards: 0,
        championships: 0,
        currentStreak: 0,
        // Position-specific stats
        ...(athlete.position === 'Goleiro' ? {
          cleanSheets: 0,
          goalsConceded: 0,
          saves: 0
        } : {})
      }

      // Get stats from matches where this athlete participated
      const athleteMatches = seedData.matches.filter(match => 
        match.status === 'finished' && 
        match.goals.some(goal => goal.playerId === id)
      )

      stats.totalMatches = athleteMatches.length
      
      // Count goals (excluding own goals)
      stats.totalGoals = seedData.matches
        .flatMap(match => match.goals || [])
        .filter(goal => goal.playerId === id && goal.type !== 'own_goal')
        .length

      return HttpResponse.json(stats)
    } catch (error) {
      console.error('Get athlete stats error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/athletes
  http.post('/api/athletes', async ({ request }) => {
    try {
      const body = await request.json()
      const { name, email, age, position, phone } = body

      // Validate required fields
      if (!name || !email || !age || !position) {
        return HttpResponse.json(
          { message: 'Nome, email, idade e posição são obrigatórios' },
          { status: 400 }
        )
      }

      if (age < 16 || age > 50) {
        return HttpResponse.json(
          { message: 'Idade deve estar entre 16 e 50 anos' },
          { status: 400 }
        )
      }

      // Check if email already exists
      const existingUser = seedData.users.find(u => u.email === email.toLowerCase())
      if (existingUser) {
        return HttpResponse.json(
          { message: 'Este email já está em uso' },
          { status: 409 }
        )
      }

      // Create user record
      const user = {
        id: `athlete-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        type: 'athlete',
        password: 'temp123', // In real app, user would set password
        createdAt: new Date().toISOString()
      }

      // Create athlete record
      const athlete = {
        id: user.id,
        name: user.name,
        email: user.email,
        age: parseInt(age),
        position: position.trim(),
        phone: phone || null,
        clubId: null,
        status: 'free',
        createdAt: new Date().toISOString()
      }

      seedData.users.push(user)
      seedData.athletes.push(athlete)

      return HttpResponse.json({
        athlete,
        message: 'Atleta criado com sucesso'
      }, { status: 201 })
    } catch (error) {
      console.error('Create athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // DELETE /api/athletes/:id
  http.delete('/api/athletes/:id', async ({ params }) => {
    try {
      const { id } = params

      const athleteIndex = seedData.athletes.findIndex(a => a.id === id)
      if (athleteIndex === -1) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      const athlete = seedData.athletes[athleteIndex]

      // Remove from club if belongs to one
      if (athlete.clubId) {
        const clubIndex = seedData.clubs.findIndex(c => c.id === athlete.clubId)
        if (clubIndex !== -1) {
          seedData.clubs[clubIndex].athletes = seedData.clubs[clubIndex].athletes.filter(
            athleteId => athleteId !== id
          )
          seedData.clubs[clubIndex].updatedAt = new Date().toISOString()
        }
      }

      // Remove invites
      seedData.invites = seedData.invites.filter(inv => inv.athleteId !== id)

      // Remove from match goals (keep the goals but mark player as unknown)
      seedData.matches.forEach((match, matchIndex) => {
        if (match.goals && match.goals.length > 0) {
          seedData.matches[matchIndex].goals = match.goals.map(goal => 
            goal.playerId === id 
              ? { ...goal, playerId: null, playerName: 'Jogador removido' }
              : goal
          )
        }
      })

      // Remove athlete
      seedData.athletes.splice(athleteIndex, 1)

      // Remove user
      const userIndex = seedData.users.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        seedData.users.splice(userIndex, 1)
      }

      return HttpResponse.json({
        message: 'Atleta removido com sucesso'
      })
    } catch (error) {
      console.error('Delete athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]

// Invite handlers (related to athletes)
export const inviteHandlers = [
  // PATCH /api/invites/:id/accept
  http.patch('/api/invites/:id/accept', async ({ params }) => {
    try {
      const { id } = params

      const inviteIndex = seedData.invites.findIndex(inv => inv.id === id)
      if (inviteIndex === -1) {
        return HttpResponse.json(
          { message: 'Convite não encontrado' },
          { status: 404 }
        )
      }

      const invite = seedData.invites[inviteIndex]

      if (invite.status !== 'pending') {
        return HttpResponse.json(
          { message: 'Este convite já foi processado' },
          { status: 400 }
        )
      }

      // Check if athlete still exists and is free
      const athleteIndex = seedData.athletes.findIndex(a => a.id === invite.athleteId)
      if (athleteIndex === -1) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      const athlete = seedData.athletes[athleteIndex]
      if (athlete.clubId) {
        return HttpResponse.json(
          { message: 'Atleta já pertence a um clube' },
          { status: 400 }
        )
      }

      // Check if club still exists
      const clubIndex = seedData.clubs.findIndex(c => c.id === invite.clubId)
      if (clubIndex === -1) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      // Accept invite
      seedData.invites[inviteIndex] = {
        ...invite,
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      }

      // Update athlete
      seedData.athletes[athleteIndex] = {
        ...athlete,
        clubId: invite.clubId,
        status: 'active',
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add athlete to club
      if (!seedData.clubs[clubIndex].athletes.includes(invite.athleteId)) {
        seedData.clubs[clubIndex].athletes.push(invite.athleteId)
        seedData.clubs[clubIndex].updatedAt = new Date().toISOString()
      }

      // Reject any other pending invites for this athlete
      seedData.invites.forEach((inv, idx) => {
        if (inv.athleteId === invite.athleteId && inv.status === 'pending' && inv.id !== id) {
          seedData.invites[idx] = {
            ...inv,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            reason: 'Atleta aceitou convite de outro clube'
          }
        }
      })

      return HttpResponse.json({
        message: 'Convite aceito com sucesso'
      })
    } catch (error) {
      console.error('Accept invite error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PATCH /api/invites/:id/reject
  http.patch('/api/invites/:id/reject', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json().catch(() => ({}))

      const inviteIndex = seedData.invites.findIndex(inv => inv.id === id)
      if (inviteIndex === -1) {
        return HttpResponse.json(
          { message: 'Convite não encontrado' },
          { status: 404 }
        )
      }

      const invite = seedData.invites[inviteIndex]

      if (invite.status !== 'pending') {
        return HttpResponse.json(
          { message: 'Este convite já foi processado' },
          { status: 400 }
        )
      }

      // Reject invite
      seedData.invites[inviteIndex] = {
        ...invite,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        reason: body.reason || 'Recusado pelo atleta'
      }

      return HttpResponse.json({
        message: 'Convite recusado'
      })
    } catch (error) {
      console.error('Reject invite error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/invites
  http.get('/api/invites', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const clubId = url.searchParams.get('clubId')
      const athleteId = url.searchParams.get('athleteId')
      const status = url.searchParams.get('status')

      let invites = [...seedData.invites]

      // Filter by club
      if (clubId) {
        invites = invites.filter(inv => inv.clubId === clubId)
      }

      // Filter by athlete
      if (athleteId) {
        invites = invites.filter(inv => inv.athleteId === athleteId)
      }

      // Filter by status
      if (status) {
        invites = invites.filter(inv => inv.status === status)
      }

      // Add related data
      invites = invites.map(invite => {
        const club = getClub(invite.clubId)
        const athlete = getAthlete(invite.athleteId)
        
        return {
          ...invite,
          club: club ? {
            id: club.id,
            name: club.name,
            bairro: club.bairro
          } : null,
          athlete: athlete ? {
            id: athlete.id,
            name: athlete.name,
            position: athlete.position,
            age: athlete.age
          } : null
        }
      })

      // Sort by creation date (newest first)
      invites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return HttpResponse.json(invites)
    } catch (error) {
      console.error('Get invites error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // DELETE /api/invites/:id
  http.delete('/api/invites/:id', async ({ params }) => {
    try {
      const { id } = params

      const inviteIndex = seedData.invites.findIndex(inv => inv.id === id)
      if (inviteIndex === -1) {
        return HttpResponse.json(
          { message: 'Convite não encontrado' },
          { status: 404 }
        )
      }

      seedData.invites.splice(inviteIndex, 1)

      return HttpResponse.json({
        message: 'Convite removido com sucesso'
      })
    } catch (error) {
      console.error('Delete invite error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]