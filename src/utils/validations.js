import * as yup from 'yup'
import { VALIDATION, POSITIONS, USER_TYPES } from './constants'

// Base schemas
const requiredString = (fieldName, min = VALIDATION.NAME_MIN_LENGTH, max = VALIDATION.NAME_MAX_LENGTH) =>
  yup.string()
    .required(`${fieldName} é obrigatório`)
    .min(min, `${fieldName} deve ter pelo menos ${min} caracteres`)
    .max(max, `${fieldName} deve ter no máximo ${max} caracteres`)
    .trim()

const email = yup.string()
  .required('Email é obrigatório')
  .email('Email inválido')
  .lowercase()
  .trim()

const password = yup.string()
  .required('Senha é obrigatória')
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Senha deve ter pelo menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`)

// Auth schemas
export const loginSchema = yup.object({
  email,
  password: yup.string().required('Senha é obrigatória')
})

export const registerBaseSchema = yup.object({
  name: requiredString('Nome'),
  email,
  password,
  confirmPassword: yup.string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password')], 'Senhas não coincidem'),
  type: yup.string()
    .required('Tipo de usuário é obrigatório')
    .oneOf(Object.values(USER_TYPES), 'Tipo de usuário inválido')
})

export const athleteRegisterSchema = registerBaseSchema.shape({
  age: yup.number()
    .required('Idade é obrigatória')
    .min(VALIDATION.AGE_MIN, `Idade mínima: ${VALIDATION.AGE_MIN} anos`)
    .max(VALIDATION.AGE_MAX, `Idade máxima: ${VALIDATION.AGE_MAX} anos`)
    .integer('Idade deve ser um número inteiro'),
  position: yup.string()
    .required('Posição é obrigatória')
    .oneOf(POSITIONS, 'Posição inválida')
})

export const clubRegisterSchema = registerBaseSchema.shape({
  bairro: requiredString('Bairro'),
  foundedYear: yup.number()
    .nullable()
    .min(VALIDATION.FOUNDED_YEAR_MIN, `Ano mínimo: ${VALIDATION.FOUNDED_YEAR_MIN}`)
    .max(VALIDATION.FOUNDED_YEAR_MAX, `Ano máximo: ${VALIDATION.FOUNDED_YEAR_MAX}`)
    .integer('Ano deve ser um número inteiro')
})

export const organizationRegisterSchema = registerBaseSchema.shape({
  description: yup.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim()
})

// Profile schemas
export const updateProfileSchema = yup.object({
  name: requiredString('Nome'),
  email: email.test('email-unchanged', 'Email não pode ser alterado', function(value) {
    // This would be handled by backend validation in real app
    return true
  })
})

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Senha atual é obrigatória'),
  newPassword: password,
  confirmPassword: yup.string()
    .required('Confirme a nova senha')
    .oneOf([yup.ref('newPassword')], 'Senhas não coincidem')
})

// Club schemas
export const inviteAthleteSchema = yup.object({
  athleteId: yup.string()
    .required('ID do atleta é obrigatório')
    .trim()
    .min(3, 'ID deve ter pelo menos 3 caracteres')
})

// Championship schemas
export const createChampionshipSchema = yup.object({
  name: requiredString('Nome do campeonato', 3, 100),
  season: yup.string()
    .required('Temporada é obrigatória')
    .matches(/^\d{4}$/, 'Temporada deve ser um ano válido (ex: 2025)')
    .test('valid-year', 'Ano deve estar entre 2020 e 2030', (value) => {
      const year = parseInt(value)
      return year >= 2020 && year <= 2030
    }),
  format: yup.string()
    .required('Formato é obrigatório')
    .oneOf(['league', 'knockout', 'mixed'], 'Formato inválido'),
  description: yup.string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),
  maxTeams: yup.number()
    .min(4, 'Mínimo de 4 times')
    .max(32, 'Máximo de 32 times')
    .integer('Número de times deve ser um inteiro'),
  startDate: yup.date()
    .min(new Date(), 'Data de início deve ser futura'),
  endDate: yup.date()
    .min(yup.ref('startDate'), 'Data de fim deve ser após a data de início')
})

// Match schemas
export const updateScoreSchema = yup.object({
  scoreHome: yup.number()
    .required('Placar do time da casa é obrigatório')
    .min(0, 'Placar não pode ser negativo')
    .max(50, 'Placar muito alto')
    .integer('Placar deve ser um número inteiro'),
  scoreAway: yup.number()
    .required('Placar do time visitante é obrigatório')
    .min(0, 'Placar não pode ser negativo')
    .max(50, 'Placar muito alto')
    .integer('Placar deve ser um número inteiro'),
  goals: yup.array().of(
    yup.object({
      playerId: yup.string().required('Jogador é obrigatório'),
      teamId: yup.string().required('Time é obrigatório'),
      minute: yup.number()
        .required('Minuto é obrigatório')
        .min(1, 'Minuto deve ser maior que 0')
        .max(120, 'Minuto deve ser menor que 120')
        .integer('Minuto deve ser um número inteiro'),
      type: yup.string()
        .oneOf(['goal', 'own_goal', 'penalty'], 'Tipo de gol inválido')
        .default('goal')
    })
  ).default([])
})

// Goal schemas
export const addGoalSchema = yup.object({
  playerId: yup.string().required('Jogador é obrigatório'),
  minute: yup.number()
    .required('Minuto é obrigatório')
    .min(1, 'Minuto deve ser maior que 0')
    .max(120, 'Minuto deve ser menor que 120')
    .integer('Minuto deve ser um número inteiro'),
  type: yup.string()
    .oneOf(['goal', 'own_goal', 'penalty'], 'Tipo de gol inválido')
    .default('goal')
})

// Search schemas
export const searchSchema = yup.object({
  query: yup.string()
    .min(2, 'Busca deve ter pelo menos 2 caracteres')
    .max(100, 'Busca deve ter no máximo 100 caracteres')
    .trim(),
  type: yup.string()
    .oneOf(['all', 'athletes', 'clubs', 'championships'], 'Tipo de busca inválido')
    .default('all'),
  limit: yup.number()
    .min(1, 'Limite mínimo: 1')
    .max(100, 'Limite máximo: 100')
    .integer('Limite deve ser um número inteiro')
    .default(20)
})

// Helper function to get validation schema based on user type
export const getRegisterSchema = (userType) => {
  switch (userType) {
    case USER_TYPES.ATHLETE:
      return athleteRegisterSchema
    case USER_TYPES.CLUB:
      return clubRegisterSchema
    case USER_TYPES.ORGANIZATION:
      return organizationRegisterSchema
    default:
      return registerBaseSchema
  }
}

// Helper function to validate form data
export const validateFormData = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach(err => {
      errors[err.path] = err.message
    })
    return { isValid: false, errors }
  }
}

// Custom validation rules
export const customValidationRules = {
  uniqueEmail: async (email, excludeId = null) => {
    // This would make an API call in a real app
    // For now, just simulate validation
    return true
  },
  
  athleteAvailable: async (athleteId) => {
    // This would check if athlete is available for invitation
    return true
  },
  
  clubExists: async (clubId) => {
    // This would check if club exists
    return true
  }
}