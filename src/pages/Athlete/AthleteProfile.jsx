import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../context/AuthContext'
import { useAthleteProfile } from '../../hooks/useAthletes'
import { Card, Button, Input, Select, Modal, ModalBody, ModalFooter } from '../../components/ui'
import { CardLayout } from '../../components/layout/Layout'
import { updateProfileSchema, changePasswordSchema } from '../../utils/validations'
import { POSITIONS } from '../../utils/constants'
import { toast } from 'react-hot-toast'

const AthleteProfile = () => {
  const { user, logout } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLeaveClubModal, setShowLeaveClubModal] = useState(false)
  
  const {
    athlete,
    profileData,
    isLoading,
    updateProfile,
    isUpdating,
    hasClub,
    isActive,
    isFree
  } = useAthleteProfile(user.id)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: athlete?.name || '',
      email: athlete?.email || '',
      age: athlete?.age || '',
      position: athlete?.position || '',
      phone: athlete?.phone || ''
    }
  })

  // Reset form when athlete data loads
  React.useEffect(() => {
    if (athlete) {
      reset({
        name: athlete.name || '',
        email: athlete.email || '',
        age: athlete.age || '',
        position: athlete.position || '',
        phone: athlete.phone || ''
      })
    }
  }, [athlete, reset])

  const onSubmit = async (data) => {
    try {
      await updateProfile(data)
      reset(data) // Reset form to remove dirty state
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id)
    toast.success('ID copiado para a área de transferência!')
  }

  const handleLeaveClub = () => {
    // This would call the leave club mutation
    console.log('Leaving club...')
    setShowLeaveClubModal(false)
    toast.success('Você saiu do clube com sucesso!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const positionOptions = [
    { value: '', label: 'Selecione sua posição' },
    ...POSITIONS.map(position => ({ value: position, label: position }))
  ]

  return (
    <CardLayout
      title="Meu Perfil ⚽"
      description="Gerencie suas informações pessoais e configurações"
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Informações Pessoais
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  placeholder="Seu nome completo"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled
                  hint="O email não pode ser alterado"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

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

                <Select
                  label="Posição"
                  options={positionOptions}
                  error={errors.position?.message}
                  {...register('position')}
                />
              </div>

              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  loading={isUpdating}
                  disabled={!isDirty || isUpdating}
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                
                {isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Club Information */}
          {hasClub && profileData.clubInfo && (
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Informações do Clube
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isActive ? 'Ativo' : 'Pendente'}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🏟️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {profileData.clubInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {profileData.clubInfo.bairro}
                      </p>
                      {profileData.clubInfo.joinedAt && (
                        <p className="text-xs text-gray-500">
                          Membro desde {new Date(profileData.clubInfo.joinedAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLeaveClubModal(true)}
                  >
                    Sair do Clube
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* ID Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Seu ID Único
            </h3>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                ⚽
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Compartilhe este ID com clubes para receber convites
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                  <code className="text-sm font-mono text-gray-900">
                    {user.id}
                  </code>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="w-full"
              >
                📋 Copiar ID
              </Button>
            </div>
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status da Conta
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium flex items-center">
                  <span className="mr-1">⚽</span>
                  Atleta
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isActive ? 'bg-green-100 text-green-800' :
                  profileData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {isActive ? 'Ativo' : 
                   profileData.status === 'pending' ? 'Pendente' : 'Livre'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Membro desde:</span>
                <span className="text-sm font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações da Conta
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowPasswordModal(true)}
              >
                <span className="mr-2">🔒</span>
                Alterar Senha
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <span className="mr-2">📧</span>
                Preferências de Email
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <span className="mr-2">🌙</span>
                Modo Escuro
              </Button>
              
              <div className="border-t pt-3 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <span className="mr-2">🚪</span>
                  Sair da Conta
                </Button>
              </div>
            </div>
          </Card>

          {/* Help */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Precisa de Ajuda? 🤔
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>ID Único:</strong> Use para receber convites
              </p>
              <p>
                <strong>Status:</strong> Livre = sem clube, Ativo = jogando
              </p>
              <p>
                <strong>Convites:</strong> Aceite para entrar em clubes
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Ver Tutorial Completo
            </Button>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Leave Club Modal */}
      <Modal
        isOpen={showLeaveClubModal}
        onClose={() => setShowLeaveClubModal(false)}
        title="Sair do Clube"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tem certeza que deseja sair?
            </h3>
            <p className="text-sm text-gray-600">
              Você não poderá mais participar dos jogos e campeonatos do clube{' '}
              <strong>{profileData.clubInfo?.name}</strong>.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowLeaveClubModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleLeaveClub}
          >
            Sair do Clube
          </Button>
        </ModalFooter>
      </Modal>
    </CardLayout>
  )
}

// Change Password Modal Component
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(changePasswordSchema)
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // This would call the change password API
      console.log('Changing password...', data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success('Senha alterada com sucesso!')
      reset()
      onClose()
    } catch (error) {
      toast.error('Erro ao alterar senha')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setShowPasswords({ current: false, new: false, confirm: false })
    onClose()
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Alterar Senha" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div className="relative">
            <Input
              label="Senha atual"
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Digite sua senha atual"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Nova senha"
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Digite a nova senha"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirmar nova senha"
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Digite a nova senha novamente"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? '🙈' : '👁️'}
            </button>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isLoading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default AthleteProfile