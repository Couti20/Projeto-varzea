import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Card, Select } from '../components/ui'
import { getRegisterSchema } from '../utils/validations'
import { USER_TYPES, POSITIONS } from '../utils/constants'

const Register = () => {
  const [userType, setUserType] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(getRegisterSchema(userType)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      type: ''
    }
  })

  const watchedType = watch('type')

  // Update userType when form type changes
  React.useEffect(() => {
    if (watchedType !== userType) {
      setUserType(watchedType)
      // Reset form when type changes to trigger new validation schema
      reset({
        ...watch(),
        type: watchedType
      })
    }
  }, [watchedType, userType, reset, watch])

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = data
      await registerUser(userData)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the registerUser function (toast)
    }
  }

  const userTypeOptions = [
    { value: '', label: 'Selecione o tipo de usuário' },
    { value: USER_TYPES.ATHLETE, label: '⚽ Atleta' },
    { value: USER_TYPES.CLUB, label: '🏟️ Clube' },
    { value: USER_TYPES.ORGANIZATION, label: '🏆 Organização' }
  ]

  const positionOptions = [
    { value: '', label: 'Selecione sua posição' },
    ...POSITIONS.map(position => ({ value: position, label: position }))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <span className="text-3xl">⚽</span>
            <span className="text-2xl font-bold">Futebol de Várzea</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              faça login se já tem conta
            </Link>
          </p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuário *
              </label>
              <select
                {...register('type')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {userTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome completo"
                placeholder={
                  userType === USER_TYPES.ATHLETE ? 'João Silva' :
                  userType === USER_TYPES.CLUB ? 'FC Barcelona do Bairro' :
                  userType === USER_TYPES.ORGANIZATION ? 'Liga Zona Sul' :
                  'Seu nome'
                }
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
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

              <div className="relative">
                <Input
                  label="Confirmar senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Type-specific fields */}
            {userType === USER_TYPES.ATHLETE && (
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    ⚽ Informações do Atleta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Idade"
                      type="number"
                      min="16"
                      max="50"
                      placeholder="25"
                      error={errors.age?.message}
                      {...register('age')}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posição *
                      </label>
                      <select
                        {...register('position')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        {positionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userType === USER_TYPES.CLUB && (
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    🏟️ Informações do Clube
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Bairro"
                      placeholder="Vila Madalena"
                      error={errors.bairro?.message}
                      {...register('bairro')}
                    />

                    <Input
                      label="Ano de fundação"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="2020"
                      error={errors.foundedYear?.message}
                      {...register('foundedYear')}
                    />
                  </div>
                </div>
              </div>
            )}

            {userType === USER_TYPES.ORGANIZATION && (
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    🏆 Informações da Organização
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Descreva sua organização e os tipos de campeonatos que organiza..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Eu concordo com os{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Política de Privacidade
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting || !userType}
              className="w-full"
              size="lg"
            >
              {loading || isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register