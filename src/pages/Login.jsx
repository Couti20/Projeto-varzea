import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Card } from '../components/ui'
import { loginSchema } from '../utils/validations'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by the login function (toast)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <span className="text-3xl">⚽</span>
            <span className="text-2xl font-bold">Futebol de Várzea</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Faça login na sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              crie uma nova conta
            </Link>
          </p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Sua senha"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
              className="w-full"
              size="lg"
            >
              {loading || isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Contas de teste</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <DemoAccount
                type="Atleta"
                email="joao@email.com"
                icon="⚽"
                onLogin={() => {
                  register('email').onChange({ target: { value: 'joao@email.com' } })
                  register('password').onChange({ target: { value: '123456' } })
                }}
              />
              <DemoAccount
                type="Clube"
                email="fcb@email.com"
                icon="🏟️"
                onLogin={() => {
                  register('email').onChange({ target: { value: 'fcb@email.com' } })
                  register('password').onChange({ target: { value: '123456' } })
                }}
              />
              <DemoAccount
                type="Organização"
                email="liga@email.com"
                icon="🏆"
                onLogin={() => {
                  register('email').onChange({ target: { value: 'liga@email.com' } })
                  register('password').onChange({ target: { value: '123456' } })
                }}
              />
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Use essas contas para testar o sistema. Senha: 123456
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Não tem conta?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Component for demo account buttons
const DemoAccount = ({ type, email, icon, onLogin }) => (
  <button
    type="button"
    onClick={onLogin}
    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center space-x-3">
      <span className="text-lg">{icon}</span>
      <div className="text-left">
        <div className="text-sm font-medium text-gray-900">{type}</div>
        <div className="text-xs text-gray-500">{email}</div>
      </div>
    </div>
    <span className="text-xs text-primary-600 font-medium">Usar</span>
  </button>
)

export default Login