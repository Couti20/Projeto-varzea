import { http, HttpResponse } from 'msw'
import { 
  seedData, 
  getClub, 
  getAthletesByClub,
  getAthlete,
  createInvite
} from '../data/seeds'

export const clubsHandlers = [
  // GET /api/clubs
  http.get('/api/clubs', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const limit = parseInt(url.searchParams.get('limit')) || 20
      const offset = parseInt(url.searchParams.get('offset')) || 0

      let clubs = [...seedData.clubs]

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase()
        clubs = clubs.filter(club => 
          club.name.toLowerCase().includes(searchLower) ||
          club.bairro.toLowerCase().includes(searchLower)
        )
      }

      // Pagination
      const total = clubs.length
      clubs = clubs.slice(offset, offset + limit)

      return HttpResponse.json({
        data: clubs,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      })
    } catch (error) {
      console.error('Get clubs error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/clubs/:id
  http.get('/api/clubs/:id', async ({ params }) => {
    try {
      const { id } = params
      const club = getClub(id)

      if (!club) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      return HttpResponse.json(club)
    } catch (error) {
      console.error('Get club error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/clubs/:id/athletes
  http.get('/api/clubs/:id/athletes', async ({ params }) => {
    try {
      const { id } = params
      const club = getClub(id)

      if (!club) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      const athletes = getAthletesByClub(id)

      return HttpResponse.json(athletes)
    } catch (error) {
      console.error('Get club athletes error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/clubs/:id/invite
  http.post('/api/clubs/:id/invite', async ({ params, request }) => {
    try {
      const { id: clubId } = params
      const body = await request.json()
      const { athleteId } = body

      // Validate club exists
      const club = getClub(clubId)
      if (!club) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      // Validate athlete exists
      const athlete = getAthlete(athleteId)
      if (!athlete) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      // Check if athlete is free
      if (athlete.clubId) {
        return HttpResponse.json(
          { message: 'Atleta já pertence a um clube' },
          { status: 400 }
        )
      }

      // Check if invite already exists
      const existingInvite = seedData.invites.find(
        inv => inv.clubId === clubId && inv.athleteId === athleteId && inv.status === 'pending'
      )

      if (existingInvite) {
        return HttpResponse.json(
          { message: 'Convite já enviado para este atleta' },
          { status: 409 }
        )
      }

      // Create invite
      const invite = createInvite({
        clubId,
        athleteId
      })

      seedData.invites.push(invite)

      return HttpResponse.json({
        invite,
        message: 'Convite enviado com sucesso'
      }, { status: 201 })
    } catch (error) {
      console.error('Invite athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PATCH /api/clubs/:id/remove/:athleteId
  http.patch('/api/clubs/:id/remove/:athleteId', async ({ params }) => {
    try {
      const { id: clubId, athleteId } = params

      // Validate club exists
      const club = getClub(clubId)
      if (!club) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      // Validate athlete exists and belongs to club
      const athleteIndex = seedData.athletes.findIndex(a => a.id === athleteId)
      if (athleteIndex === -1) {
        return HttpResponse.json(
          { message: 'Atleta não encontrado' },
          { status: 404 }
        )
      }

      const athlete = seedData.athletes[athleteIndex]
      if (athlete.clubId !== clubId) {
        return HttpResponse.json(
          { message: 'Atleta não pertence a este clube' },
          { status: 400 }
        )
      }

      // Remove athlete from club
      seedData.athletes[athleteIndex] = {
        ...athlete,
        clubId: null,
        status: 'free',
        updatedAt: new Date().toISOString()
      }

      // Update club athletes list
      const clubIndex = seedData.clubs.findIndex(c => c.id === clubId)
      if (clubIndex !== -1) {
        seedData.clubs[clubIndex].athletes = seedData.clubs[clubIndex].athletes.filter(
          id => id !== athleteId
        )
        seedData.clubs[clubIndex].updatedAt = new Date().toISOString()
      }

      return HttpResponse.json({
        message: 'Atleta removido do clube com sucesso'
      })
    } catch (error) {
      console.error('Remove athlete error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PUT /api/clubs/:id
  http.put('/api/clubs/:id', async ({ params, request }) => {
    try {
      const { id } = params
      const body = await request.json()

      const clubIndex = seedData.clubs.findIndex(c => c.id === id)
      if (clubIndex === -1) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      // Validate required fields
      const { name, bairro } = body
      if (!name || !bairro) {
        return HttpResponse.json(
          { message: 'Nome e bairro são obrigatórios' },
          { status: 400 }
        )
      }

      // Update club
      const updates = {
        name: name.trim(),
        bairro: bairro.trim(),
        foundedYear: body.foundedYear || seedData.clubs[clubIndex].foundedYear,
        phone: body.phone || seedData.clubs[clubIndex].phone,
        description: body.description || seedData.clubs[clubIndex].description,
        updatedAt: new Date().toISOString()
      }

      seedData.clubs[clubIndex] = {
        ...seedData.clubs[clubIndex],
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
        club: seedData.clubs[clubIndex],
        message: 'Clube atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update club error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/clubs
  http.post('/api/clubs', async ({ request }) => {
    try {
      const body = await request.json()
      const { name, bairro, foundedYear, email, phone, description } = body

      // Validate required fields
      if (!name || !bairro || !email) {
        return HttpResponse.json(
          { message: 'Nome, bairro e email são obrigatórios' },
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
        id: `club-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        type: 'club',
        password: 'temp123', // In real app, user would set password
        createdAt: new Date().toISOString()
      }

      // Create club record
      const club = {
        id: user.id,
        name: user.name,
        email: user.email,
        bairro: bairro.trim(),
        foundedYear: foundedYear || null,
        phone: phone || null,
        description: description || null,
        athletes: [],
        createdAt: new Date().toISOString()
      }

      seedData.users.push(user)
      seedData.clubs.push(club)

      return HttpResponse.json({
        club,
        message: 'Clube criado com sucesso'
      }, { status: 201 })
    } catch (error) {
      console.error('Create club error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // GET /api/clubs/:id/stats
  http.get('/api/clubs/:id/stats', async ({ params }) => {
    try {
      const { id } = params
      const club = getClub(id)

      if (!club) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      const athletes = getAthletesByClub(id)
      
      // Calculate basic stats
      const stats = {
        totalAthletes: athletes.length,
        activeAthletes: athletes.filter(a => a.status === 'active').length,
        pendingAthletes: athletes.filter(a => a.status === 'pending').length,
        athletesByPosition: athletes.reduce((acc, athlete) => {
          const position = athlete.position || 'Não definido'
          acc[position] = (acc[position] || 0) + 1
          return acc
        }, {}),
        averageAge: athletes.length > 0 
          ? Math.round(athletes.reduce((sum, a) => sum + (a.age || 0), 0) / athletes.length)
          : 0,
        // Championship stats would be calculated from matches
        totalMatches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      }

      return HttpResponse.json(stats)
    } catch (error) {
      console.error('Get club stats error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // DELETE /api/clubs/:id
  http.delete('/api/clubs/:id', async ({ params }) => {
    try {
      const { id } = params

      const clubIndex = seedData.clubs.findIndex(c => c.id === id)
      if (clubIndex === -1) {
        return HttpResponse.json(
          { message: 'Clube não encontrado' },
          { status: 404 }
        )
      }

      // Remove all athletes from this club
      seedData.athletes.forEach((athlete, index) => {
        if (athlete.clubId === id) {
          seedData.athletes[index] = {
            ...athlete,
            clubId: null,
            status: 'free',
            updatedAt: new Date().toISOString()
          }
        }
      })

      // Remove invites
      seedData.invites = seedData.invites.filter(inv => inv.clubId !== id)

      // Remove from championships
      seedData.championships.forEach((championship, index) => {
        if (championship.teamIds.includes(id)) {
          seedData.championships[index] = {
            ...championship,
            teamIds: championship.teamIds.filter(teamId => teamId !== id),
            updatedAt: new Date().toISOString()
          }
        }
      })

      // Remove club
      seedData.clubs.splice(clubIndex, 1)

      // Remove user
      const userIndex = seedData.users.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        seedData.users.splice(userIndex, 1)
      }

      return HttpResponse.json({
        message: 'Clube removido com sucesso'
      })
    } catch (error) {
      console.error('Delete club error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]