import { http, HttpResponse } from 'msw'
import { 
  seedData, 
  createUser, 
  createAthlete, 
  createClub, 
  getUserByEmail 
} from '../data/seeds'

// Helper to generate mock JWT token
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`
}

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json()
      const { email, password } = body

      // Validation
      if (!email || !password) {
        return HttpResponse.json(
          { message: 'Email e senha são obrigatórios' },
          { status: 400 }
        )
      }

      if (!isValidEmail(email)) {
        return HttpResponse.json(
          { message: 'Email inválido' },
          { status: 400 }
        )
      }

      // Find user
      const user = getUserByEmail(email.toLowerCase())
      
      if (!user || user.password !== password) {
        return HttpResponse.json(
          { message: 'Credenciais inválidas' },
          { status: 401 }
        )
      }

      // Generate token
      const token = generateToken(user.id)

      // Return user data without password
      const { password: _, ...userData } = user
      
      return HttpResponse.json({
        user: userData,
        token,
        message: 'Login realizado com sucesso'
      })
    } catch (error) {
      console.error('Login error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    try {
      const body = await request.json()
      const { name, email, password, type, ...typeSpecificData } = body

      // Basic validation
      if (!name || !email || !password || !type) {
        return HttpResponse.json(
          { message: 'Todos os campos obrigatórios devem ser preenchidos' },
          { status: 400 }
        )
      }

      if (!isValidEmail(email)) {
        return HttpResponse.json(
          { message: 'Email inválido' },
          { status: 400 }
        )
      }

      if (password.length < 6) {
        return HttpResponse.json(
          { message: 'Senha deve ter pelo menos 6 caracteres' },
          { status: 400 }
        )
      }

      if (!['athlete', 'club', 'organization'].includes(type)) {
        return HttpResponse.json(
          { message: 'Tipo de usuário inválido' },
          { status: 400 }
        )
      }

      // Check if email already exists
      if (getUserByEmail(email.toLowerCase())) {
        return HttpResponse.json(
          { message: 'Este email já está em uso' },
          { status: 409 }
        )
      }

      // Type-specific validation
      if (type === 'athlete') {
        const { age, position } = typeSpecificData
        if (!age || !position) {
          return HttpResponse.json(
            { message: 'Idade e posição são obrigatórias para atletas' },
            { status: 400 }
          )
        }
        if (age < 16 || age > 50) {
          return HttpResponse.json(
            { message: 'Idade deve estar entre 16 e 50 anos' },
            { status: 400 }
          )
        }
      }

      if (type === 'club') {
        const { bairro } = typeSpecificData
        if (!bairro) {
          return HttpResponse.json(
            { message: 'Bairro é obrigatório para clubes' },
            { status: 400 }
          )
        }
      }

      // Create new user
      const newUser = createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // In real app, this would be hashed
        type
      })

      // Add to users array
      seedData.users.push(newUser)

      // Create type-specific record
      if (type === 'athlete') {
        const athlete = createAthlete({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          ...typeSpecificData
        })
        seedData.athletes.push(athlete)
      } else if (type === 'club') {
        const club = createClub({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          ...typeSpecificData
        })
        seedData.clubs.push(club)
      } else if (type === 'organization') {
        const organization = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          description: typeSpecificData.description || '',
          createdAt: new Date().toISOString()
        }
        seedData.organizations.push(organization)
      }

      // Generate token
      const token = generateToken(newUser.id)

      // Return user data without password
      const { password: _, ...userData } = newUser

      return HttpResponse.json({
        user: userData,
        token,
        message: 'Cadastro realizado com sucesso'
      }, { status: 201 })
    } catch (error) {
      console.error('Register error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/auth/refresh
  http.post('/api/auth/refresh', async ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Token não fornecido' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      
      // Extract user ID from token (in real app, would verify JWT)
      const tokenParts = token.split('-')
      if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt' || tokenParts[2] !== 'token') {
        return HttpResponse.json(
          { message: 'Token inválido' },
          { status: 401 }
        )
      }

      const userId = tokenParts[3]
      const user = seedData.users.find(u => u.id === userId)

      if (!user) {
        return HttpResponse.json(
          { message: 'Token inválido' },
          { status: 401 }
        )
      }

      // Generate new token
      const newToken = generateToken(user.id)

      // Return user data without password
      const { password: _, ...userData } = user

      return HttpResponse.json({
        user: userData,
        token: newToken,
        message: 'Token renovado com sucesso'
      })
    } catch (error) {
      console.error('Refresh token error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async ({ request }) => {
    // In a real app, you might invalidate the token server-side
    return HttpResponse.json({
      message: 'Logout realizado com sucesso'
    })
  }),

  // GET /api/users/profile
  http.get('/api/users/profile', async ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Token não fornecido' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      
      // Extract user ID from token
      const tokenParts = token.split('-')
      if (tokenParts.length < 4) {
        return HttpResponse.json(
          { message: 'Token inválido' },
          { status: 401 }
        )
      }

      const userId = tokenParts[3]
      const user = seedData.users.find(u => u.id === userId)

      if (!user) {
        return HttpResponse.json(
          { message: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      // Return user data without password
      const { password: _, ...userData } = user

      return HttpResponse.json(userData)
    } catch (error) {
      console.error('Get profile error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // PUT /api/users/update
  http.put('/api/users/update', async ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Token não fornecido' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const tokenParts = token.split('-')
      if (tokenParts.length < 4) {
        return HttpResponse.json(
          { message: 'Token inválido' },
          { status: 401 }
        )
      }

      const userId = tokenParts[3]
      const userIndex = seedData.users.findIndex(u => u.id === userId)

      if (userIndex === -1) {
        return HttpResponse.json(
          { message: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      const body = await request.json()
      const updates = body

      // Prevent certain fields from being updated
      delete updates.id
      delete updates.email // Email changes would need special verification
      delete updates.type
      delete updates.createdAt

      // Update user
      seedData.users[userIndex] = {
        ...seedData.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Update type-specific record
      const user = seedData.users[userIndex]
      if (user.type === 'athlete') {
        const athleteIndex = seedData.athletes.findIndex(a => a.id === userId)
        if (athleteIndex !== -1) {
          seedData.athletes[athleteIndex] = {
            ...seedData.athletes[athleteIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } else if (user.type === 'club') {
        const clubIndex = seedData.clubs.findIndex(c => c.id === userId)
        if (clubIndex !== -1) {
          seedData.clubs[clubIndex] = {
            ...seedData.clubs[clubIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } else if (user.type === 'organization') {
        const orgIndex = seedData.organizations.findIndex(o => o.id === userId)
        if (orgIndex !== -1) {
          seedData.organizations[orgIndex] = {
            ...seedData.organizations[orgIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      }

      // Return updated user data without password
      const { password: _, ...userData } = seedData.users[userIndex]

      return HttpResponse.json({
        user: userData,
        message: 'Perfil atualizado com sucesso'
      })
    } catch (error) {
      console.error('Update profile error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/auth/change-password
  http.post('/api/auth/change-password', async ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Token não fornecido' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const tokenParts = token.split('-')
      if (tokenParts.length < 4) {
        return HttpResponse.json(
          { message: 'Token inválido' },
          { status: 401 }
        )
      }

      const userId = tokenParts[3]
      const userIndex = seedData.users.findIndex(u => u.id === userId)

      if (userIndex === -1) {
        return HttpResponse.json(
          { message: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      const body = await request.json()
      const { currentPassword, newPassword } = body

      if (!currentPassword || !newPassword) {
        return HttpResponse.json(
          { message: 'Senha atual e nova senha são obrigatórias' },
          { status: 400 }
        )
      }

      if (seedData.users[userIndex].password !== currentPassword) {
        return HttpResponse.json(
          { message: 'Senha atual incorreta' },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return HttpResponse.json(
          { message: 'Nova senha deve ter pelo menos 6 caracteres' },
          { status: 400 }
        )
      }

      // Update password
      seedData.users[userIndex].password = newPassword
      seedData.users[userIndex].updatedAt = new Date().toISOString()

      return HttpResponse.json({
        message: 'Senha alterada com sucesso'
      })
    } catch (error) {
      console.error('Change password error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }),

  // POST /api/auth/check-email
  http.post('/api/auth/check-email', async ({ request }) => {
    try {
      const body = await request.json()
      const { email } = body

      if (!email || !isValidEmail(email)) {
        return HttpResponse.json(
          { message: 'Email inválido' },
          { status: 400 }
        )
      }

      const exists = !!getUserByEmail(email.toLowerCase())

      return HttpResponse.json({
        exists,
        message: exists ? 'Email já cadastrado' : 'Email disponível'
      })
    } catch (error) {
      console.error('Check email error:', error)
      return HttpResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
]