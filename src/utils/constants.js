// Storage keys
export const STORAGE_KEYS = {
  USER: 'futebol_varzea_user',
  TOKEN: 'futebol_varzea_token',
  THEME: 'futebol_varzea_theme'
}

// User types
export const USER_TYPES = {
  ATHLETE: 'athlete',
  CLUB: 'club',
  ORGANIZATION: 'organization'
}

// Athlete status
export const ATHLETE_STATUS = {
  FREE: 'free',
  PENDING: 'pending',
  ACTIVE: 'active'
}

// Invite status
export const INVITE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

// Championship status
export const CHAMPIONSHIP_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  ACTIVE: 'active',
  FINISHED: 'finished'
}

// Match status
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
}

// Player positions
export const POSITIONS = [
  'Goleiro',
  'Zagueiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Volante',
  'Meio-campo',
  'Meia Atacante',
  'Ponta Direita',
  'Ponta Esquerda',
  'Centroavante',
  'Atacante'
]

// Championship formats
export const CHAMPIONSHIP_FORMATS = {
  LEAGUE: 'league',
  KNOCKOUT: 'knockout',
  MIXED: 'mixed'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update'
  },
  ATHLETES: {
    BASE: '/athletes',
    INVITES: '/athletes/:id/invites',
    LEAVE: '/athletes/:id/leave'
  },
  CLUBS: {
    BASE: '/clubs',
    INVITE: '/clubs/:id/invite',
    REMOVE: '/clubs/:id/remove/:athleteId',
    ATHLETES: '/clubs/:id/athletes'
  },
  CHAMPIONSHIPS: {
    BASE: '/championships',
    TEAMS: '/championships/:id/teams',
    MATCHES: '/championships/:id/matches',
    STANDINGS: '/championships/:id/standings',
    STATS: '/championships/:id/stats',
    GENERATE_MATCHES: '/championships/:id/generate-matches'
  },
  MATCHES: {
    BASE: '/matches',
    UPDATE_SCORE: '/matches/:id/score',
    GOALS: '/matches/:id/goals'
  },
  INVITES: {
    BASE: '/invites',
    ACCEPT: '/invites/:id/accept',
    REJECT: '/invites/:id/reject'
  }
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  AGE_MIN: 16,
  AGE_MAX: 50,
  FOUNDED_YEAR_MIN: 1900,
  FOUNDED_YEAR_MAX: new Date().getFullYear()
}

// Match constants
export const MATCH_CONSTANTS = {
  MAX_GOALS_PER_MATCH: 50,
  MAX_MINUTES: 120,
  DEFAULT_MATCH_DURATION: 90
}

// Points system
export const POINTS_SYSTEM = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0
}

// Theme colors
export const THEME_COLORS = {
  PRIMARY: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },
  SECONDARY: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  }
}

// App metadata
export const APP_CONFIG = {
  NAME: 'Futebol de Várzea',
  VERSION: '1.0.0',
  DESCRIPTION: 'Aplicativo para gerenciar futebol de várzea',
  CONTACT_EMAIL: 'contato@futeboldevarzea.com'
}