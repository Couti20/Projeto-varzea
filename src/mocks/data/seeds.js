import { generateId } from '../../utils/helpers'

// Seed data for development
export const seedData = {
  // Users (combined with their specific type data)
  users: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456', // In real app, this would be hashed
      type: 'athlete',
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'FC Barcelona do Bairro',
      email: 'fcb@email.com',
      password: '123456',
      type: 'club',
      createdAt: '2024-12-01T11:00:00Z'
    },
    {
      id: '3',
      name: 'Liga Zona Sul',
      email: 'liga@email.com',
      password: '123456',
      type: 'organization',
      createdAt: '2024-12-01T12:00:00Z'
    },
    {
      id: '4',
      name: 'Pedro Santos',
      email: 'pedro@email.com',
      password: '123456',
      type: 'athlete',
      createdAt: '2024-12-02T09:00:00Z'
    },
    {
      id: '5',
      name: 'Real Periferia',
      email: 'real@email.com',
      password: '123456',
      type: 'club',
      createdAt: '2024-12-02T10:00:00Z'
    }
  ],

  // Athletes
  athletes: [
    {
      id: '1',
      name: 'João Silva',
      age: 25,
      position: 'Atacante',
      clubId: null,
      status: 'free',
      email: 'joao@email.com',
      phone: '(11) 99999-1111',
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '4',
      name: 'Pedro Santos',
      age: 23,
      position: 'Meio-campo',
      clubId: '2',
      status: 'active',
      email: 'pedro@email.com',
      phone: '(11) 99999-2222',
      createdAt: '2024-12-02T09:00:00Z'
    },
    {
      id: '6',
      name: 'Carlos Rocha',
      age: 28,
      position: 'Zagueiro',
      clubId: '5',
      status: 'active',
      email: 'carlos@email.com',
      phone: '(11) 99999-3333',
      createdAt: '2024-12-02T11:00:00Z'
    },
    {
      id: '7',
      name: 'Lucas Lima',
      age: 26,
      position: 'Goleiro',
      clubId: '8',
      status: 'active',
      email: 'lucas@email.com',
      phone: '(11) 99999-4444',
      createdAt: '2024-12-02T12:00:00Z'
    },
    {
      id: '8',
      name: 'Rafael Costa',
      age: 24,
      position: 'Lateral Direito',
      clubId: null,
      status: 'free',
      email: 'rafael@email.com',
      phone: '(11) 99999-5555',
      createdAt: '2024-12-03T08:00:00Z'
    },
    {
      id: '9',
      name: 'Gabriel Oliveira',
      age: 22,
      position: 'Atacante',
      clubId: null,
      status: 'free',
      email: 'gabriel@email.com',
      phone: '(11) 99999-6666',
      createdAt: '2024-12-03T09:00:00Z'
    }
  ],

  // Clubs
  clubs: [
    {
      id: '2',
      name: 'FC Barcelona do Bairro',
      bairro: 'Vila Madalena',
      foundedYear: 2020,
      athletes: ['4'],
      email: 'fcb@email.com',
      phone: '(11) 98888-1111',
      createdAt: '2024-12-01T11:00:00Z'
    },
    {
      id: '5',
      name: 'Real Periferia',
      bairro: 'Capão Redondo',
      foundedYear: 2019,
      athletes: ['6'],
      email: 'real@email.com',
      phone: '(11) 98888-2222',
      createdAt: '2024-12-02T10:00:00Z'
    },
    {
      id: '8',
      name: 'Santos da Quebrada',
      bairro: 'Cidade Tiradentes',
      foundedYear: 2021,
      athletes: ['7'],
      email: 'santos@email.com',
      phone: '(11) 98888-3333',
      createdAt: '2024-12-02T13:00:00Z'
    },
    {
      id: '9',
      name: 'Corinthians do Povo',
      bairro: 'Itaquera',
      foundedYear: 2018,
      athletes: [],
      email: 'corinthians@email.com',
      phone: '(11) 98888-4444',
      createdAt: '2024-12-02T14:00:00Z'
    }
  ],

  // Organizations
  organizations: [
    {
      id: '3',
      name: 'Liga Zona Sul',
      description: 'Organização de campeonatos da zona sul de São Paulo',
      email: 'liga@email.com',
      phone: '(11) 97777-1111',
      createdAt: '2024-12-01T12:00:00Z'
    }
  ],

  // Invites
  invites: [
    {
      id: 'inv1',
      clubId: '9',
      athleteId: '1',
      status: 'pending',
      createdAt: '2024-12-10T10:00:00Z'
    },
    {
      id: 'inv2',
      clubId: '2',
      athleteId: '8',
      status: 'pending',
      createdAt: '2024-12-10T11:00:00Z'
    }
  ],

  // Championships
  championships: [
    {
      id: 'champ1',
      name: 'Copa da Várzea 2025',
      season: '2025',
      organizerId: '3',
      status: 'active',
      format: 'league',
      teamIds: ['2', '5', '8', '9'],
      maxTeams: 8,
      startDate: '2025-01-15T00:00:00Z',
      endDate: '2025-06-15T00:00:00Z',
      description: 'Campeonato de pontos corridos entre os times da várzea paulistana',
      createdAt: '2024-12-15T09:00:00Z'
    },
    {
      id: 'champ2',
      name: 'Torneio de Verão 2025',
      season: '2025',
      organizerId: '3',
      status: 'draft',
      format: 'knockout',
      teamIds: [],
      maxTeams: 16,
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-03-31T00:00:00Z',
      description: 'Torneio eliminatório de verão',
      createdAt: '2024-12-16T10:00:00Z'
    }
  ],

  // Matches
  matches: [
    {
      id: 'match1',
      championshipId: 'champ1',
      round: 1,
      homeTeamId: '2',
      awayTeamId: '5',
      date: '2025-01-20T15:00:00Z',
      venue: 'Campo da Vila Madalena',
      scoreHome: 2,
      scoreAway: 1,
      status: 'finished',
      goals: [
        {
          id: 'goal1',
          playerId: '4',
          playerName: 'Pedro Santos',
          teamId: '2',
          minute: 15,
          type: 'goal'
        },
        {
          id: 'goal2',
          playerId: '6',
          playerName: 'Carlos Rocha',
          teamId: '5',
          minute: 32,
          type: 'goal'
        },
        {
          id: 'goal3',
          playerId: '4',
          playerName: 'Pedro Santos',
          teamId: '2',
          minute: 78,
          type: 'goal'
        }
      ],
      createdAt: '2024-12-20T09:00:00Z'
    },
    {
      id: 'match2',
      championshipId: 'champ1',
      round: 1,
      homeTeamId: '8',
      awayTeamId: '9',
      date: '2025-01-20T17:00:00Z',
      venue: 'Campo da Cidade Tiradentes',
      scoreHome: 1,
      scoreAway: 0,
      status: 'finished',
      goals: [
        {
          id: 'goal4',
          playerId: '7',
          playerName: 'Lucas Lima',
          teamId: '8',
          minute: 45,
          type: 'penalty'
        }
      ],
      createdAt: '2024-12-20T10:00:00Z'
    },
    {
      id: 'match3',
      championshipId: 'champ1',
      round: 2,
      homeTeamId: '5',
      awayTeamId: '8',
      date: '2025-01-27T15:00:00Z',
      venue: 'Campo do Capão Redondo',
      scoreHome: null,
      scoreAway: null,
      status: 'scheduled',
      goals: [],
      createdAt: '2024-12-20T11:00:00Z'
    },
    {
      id: 'match4',
      championshipId: 'champ1',
      round: 2,
      homeTeamId: '9',
      awayTeamId: '2',
      date: '2025-01-27T17:00:00Z',
      venue: 'Campo de Itaquera',
      scoreHome: null,
      scoreAway: null,
      status: 'scheduled',
      goals: [],
      createdAt: '2024-12-20T12:00:00Z'
    },
    {
      id: 'match5',
      championshipId: 'champ1',
      round: 3,
      homeTeamId: '2',
      awayTeamId: '8',
      date: '2025-02-03T15:00:00Z',
      venue: 'Campo da Vila Madalena',
      scoreHome: null,
      scoreAway: null,
      status: 'scheduled',
      goals: [],
      createdAt: '2024-12-20T13:00:00Z'
    },
    {
      id: 'match6',
      championshipId: 'champ1',
      round: 3,
      homeTeamId: '5',
      awayTeamId: '9',
      date: '2025-02-03T17:00:00Z',
      venue: 'Campo do Capão Redondo',
      scoreHome: null,
      scoreAway: null,
      status: 'scheduled',
      goals: [],
      createdAt: '2024-12-20T14:00:00Z'
    }
  ],

  // Pre-calculated standings (would be calculated from matches in real app)
  standings: [
    {
      id: 'stand1',
      championshipId: 'champ1',
      teamId: '2',
      teamName: 'FC Barcelona do Bairro',
      played: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      gf: 2,
      ga: 1,
      gd: 1,
      points: 3,
      position: 1
    },
    {
      id: 'stand2',
      championshipId: 'champ1',
      teamId: '8',
      teamName: 'Santos da Quebrada',
      played: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      gf: 1,
      ga: 0,
      gd: 1,
      points: 3,
      position: 2
    },
    {
      id: 'stand3',
      championshipId: 'champ1',
      teamId: '5',
      teamName: 'Real Periferia',
      played: 1,
      wins: 0,
      draws: 0,
      losses: 1,
      gf: 1,
      ga: 2,
      gd: -1,
      points: 0,
      position: 3
    },
    {
      id: 'stand4',
      championshipId: 'champ1',
      teamId: '9',
      teamName: 'Corinthians do Povo',
      played: 1,
      wins: 0,
      draws: 0,
      losses: 1,
      gf: 0,
      ga: 1,
      gd: -1,
      points: 0,
      position: 4
    }
  ],

  // Statistics
  topScorers: [
    {
      id: 'scorer1',
      championshipId: 'champ1',
      playerId: '4',
      playerName: 'Pedro Santos',
      teamId: '2',
      teamName: 'FC Barcelona do Bairro',
      goals: 2
    },
    {
      id: 'scorer2',
      championshipId: 'champ1',
      playerId: '6',
      playerName: 'Carlos Rocha',
      teamId: '5',
      teamName: 'Real Periferia',
      goals: 1
    },
    {
      id: 'scorer3',
      championshipId: 'champ1',
      playerId: '7',
      playerName: 'Lucas Lima',
      teamId: '8',
      teamName: 'Santos da Quebrada',
      goals: 1
    }
  ],

  // Goalkeepers (least goals conceded)
  goalkeepers: [
    {
      id: 'gk1',
      championshipId: 'champ1',
      playerId: '7',
      playerName: 'Lucas Lima',
      teamId: '8',
      teamName: 'Santos da Quebrada',
      goalsConceded: 0,
      cleanSheets: 1,
      matchesPlayed: 1
    }
  ]
}

// Helper functions for data manipulation
export const createUser = (userData) => ({
  id: generateId(),
  createdAt: new Date().toISOString(),
  ...userData
})

export const createAthlete = (athleteData) => ({
  id: generateId(),
  status: 'free',
  clubId: null,
  createdAt: new Date().toISOString(),
  ...athleteData
})

export const createClub = (clubData) => ({
  id: generateId(),
  athletes: [],
  createdAt: new Date().toISOString(),
  ...clubData
})

export const createChampionship = (championshipData) => ({
  id: generateId(),
  status: 'draft',
  format: 'league',
  teamIds: [],
  createdAt: new Date().toISOString(),
  ...championshipData
})

export const createMatch = (matchData) => ({
  id: generateId(),
  scoreHome: null,
  scoreAway: null,
  status: 'scheduled',
  goals: [],
  createdAt: new Date().toISOString(),
  ...matchData
})

export const createInvite = (inviteData) => ({
  id: generateId(),
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...inviteData
})

// Data getters
export const getUser = (id) => seedData.users.find(u => u.id === id)
export const getUserByEmail = (email) => seedData.users.find(u => u.email === email)
export const getAthlete = (id) => seedData.athletes.find(a => a.id === id)
export const getClub = (id) => seedData.clubs.find(c => c.id === id)
export const getChampionship = (id) => seedData.championships.find(c => c.id === id)
export const getMatch = (id) => seedData.matches.find(m => m.id === id)

// Data filters
export const getAthletesByClub = (clubId) => 
  seedData.athletes.filter(a => a.clubId === clubId)

export const getFreeAthletes = () => 
  seedData.athletes.filter(a => a.status === 'free' && !a.clubId)

export const getClubsByUser = (userId) => 
  seedData.clubs.filter(c => c.id === userId)

export const getChampionshipsByOrganizer = (organizerId) => 
  seedData.championships.filter(c => c.organizerId === organizerId)

export const getMatchesByChampionship = (championshipId) => 
  seedData.matches.filter(m => m.championshipId === championshipId)

export const getStandingsByChampionship = (championshipId) => 
  seedData.standings.filter(s => s.championshipId === championshipId)
    .sort((a, b) => a.position - b.position)

export const getTopScorersByChampionship = (championshipId) => 
  seedData.topScorers.filter(s => s.championshipId === championshipId)
    .sort((a, b) => b.goals - a.goals)

export const getInvitesByAthlete = (athleteId) => 
  seedData.invites.filter(i => i.athleteId === athleteId)

export const getInvitesByClub = (clubId) => 
  seedData.invites.filter(i => i.clubId === clubId)

export default seedData