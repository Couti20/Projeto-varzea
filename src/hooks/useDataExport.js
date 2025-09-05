// src/hooks/useDataExport.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { apiClient } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Hook principal para exportação de dados
export const useDataExport = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [exportProgress, setExportProgress] = useState(null)

  // Buscar histórico de exports
  const { data: exportHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['export-history', user?.id],
    queryFn: async () => {
      if (!user) return []
      const response = await apiClient.get(`/api/users/${user.id}/exports`)
      return response.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000
  })

  // Criar novo export
  const createExport = useMutation({
    mutationFn: async (exportConfig) => {
      setExportProgress({ status: 'preparing', progress: 0 })
      
      const response = await apiClient.post('/api/exports', {
        ...exportConfig,
        userId: user.id
      })
      
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['export-history'])
      pollExportStatus(data.id)
    },
    onError: (error) => {
      setExportProgress(null)
      toast.error('Erro ao iniciar exportação: ' + error.message)
    }
  })

  // Polling para acompanhar progresso
  const pollExportStatus = async (exportId) => {
    const checkStatus = async () => {
      try {
        const response = await apiClient.get(`/api/exports/${exportId}/status`)
        const { status, progress, downloadUrl } = response.data

        setExportProgress({ status, progress, downloadUrl })

        if (status === 'completed') {
          toast.success('Exportação concluída! Download iniciado.')
          if (downloadUrl) {
            // Iniciar download automaticamente
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `export-${exportId}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
          setExportProgress(null)
          return
        }

        if (status === 'failed') {
          toast.error('Falha na exportação')
          setExportProgress(null)
          return
        }

        // Continuar polling se ainda processando
        if (status === 'processing') {
          setTimeout(checkStatus, 2000)
        }
      } catch (error) {
        toast.error('Erro ao verificar status da exportação')
        setExportProgress(null)
      }
    }

    checkStatus()
  }

  // Download de export existente
  const downloadExport = useMutation({
    mutationFn: async (exportId) => {
      const response = await apiClient.get(`/api/exports/${exportId}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `export-${exportId}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onSuccess: () => {
      toast.success('Download iniciado!')
    },
    onError: () => {
      toast.error('Erro ao fazer download')
    }
  })

  // Deletar export
  const deleteExport = useMutation({
    mutationFn: async (exportId) => {
      await apiClient.delete(`/api/exports/${exportId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['export-history'])
      toast.success('Export removido com sucesso')
    }
  })

  return {
    exportHistory,
    historyLoading,
    exportProgress,
    createExport: createExport.mutate,
    downloadExport: downloadExport.mutate,
    deleteExport: deleteExport.mutate,
    isCreating: createExport.isPending,
    isDownloading: downloadExport.isPending,
    isDeleting: deleteExport.isPending
  }
}

// Hook para backup automático
export const useAutoBackup = () => {
  const { user } = useAuth()

  // Configurações de backup
  const { data: backupSettings } = useQuery({
    queryKey: ['backup-settings', user?.id],
    queryFn: async () => {
      if (!user) return null
      const response = await apiClient.get(`/api/users/${user.id}/backup-settings`)
      return response.data
    },
    enabled: !!user
  })

  // Atualizar configurações
  const updateBackupSettings = useMutation({
    mutationFn: async (settings) => {
      const response = await apiClient.put(`/api/users/${user.id}/backup-settings`, settings)
      return response.data
    },
    onSuccess: () => {
      toast.success('Configurações de backup atualizadas')
    }
  })

  // Último backup
  const { data: lastBackup } = useQuery({
    queryKey: ['last-backup', user?.id],
    queryFn: async () => {
      if (!user) return null
      const response = await apiClient.get(`/api/users/${user.id}/last-backup`)
      return response.data
    },
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000 // Verificar a cada 5 minutos
  })

  return {
    backupSettings,
    lastBackup,
    updateBackupSettings: updateBackupSettings.mutate,
    isUpdating: updateBackupSettings.isPending
  }
}

// Componente de Export de Dados
export const DataExportModal = ({ isOpen, onClose, entityType, entityId }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'json',
    includeMedia: false,
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    includeStatistics: true,
    includeHistory: true
  })

  const { createExport, isCreating, exportProgress } = useDataExport()

  const formatOptions = [
    { value: 'json', label: 'JSON (Estruturado)' },
    { value: 'csv', label: 'CSV (Planilha)' },
    { value: 'pdf', label: 'PDF (Relatório)' },
    { value: 'excel', label: 'Excel (Completo)' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Todos os dados' },
    { value: '1m', label: 'Último mês' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ]

  const handleExport = () => {
    const config = {
      ...exportConfig,
      entityType,
      entityId
    }
    createExport(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Exportar Dados
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress */}
        {exportProgress && (
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 capitalize">
                  {exportProgress.status === 'preparing' ? 'Preparando exportação...' :
                   exportProgress.status === 'processing' ? 'Processando dados...' :
                   'Finalizando...'}
                </p>
                <AdvancedProgressBar
                  value={exportProgress.progress || 0}
                  max={100}
                  color="blue"
                  size="sm"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formato de Exportação
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={exportConfig.format === option.value}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, format: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período dos Dados
            </label>
            <select
              value={exportConfig.dateRange}
              onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {exportConfig.dateRange === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Data inicial</label>
                  <input
                    type="date"
                    value={exportConfig.customStartDate}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, customStartDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Data final</label>
                  <input
                    type="date"
                    value={exportConfig.customEndDate}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, customEndDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Opções adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dados a Incluir
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.includeStatistics}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includeStatistics: e.target.checked }))}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">Estatísticas e métricas</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.includeHistory}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includeHistory: e.target.checked }))}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">Histórico completo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.includeMedia}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includeMedia: e.target.checked }))}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">Arquivos e imagens</span>
              </label>
            </div>
          </div>

          {/* Aviso */}
          <AdvancedAlert
            type="info"
            title="Informações sobre a exportação"
          >
            <ul className="text-sm space-y-1">
              <li>• O arquivo será gerado e enviado para download</li>
              <li>• Exportações grandes podem levar alguns minutos</li>
              <li>• Os dados exportados ficam disponíveis por 7 dias</li>
              <li>• Formatos PDF e Excel incluem formatação visual</li>
            </ul>
          </AdvancedAlert>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <LoadingButton
            onClick={handleExport}
            loading={isCreating || !!exportProgress}
            loadingText={exportProgress?.status === 'preparing' ? 'Preparando...' : 'Exportando...'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Exportar Dados
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

// Componente de Histórico de Exports
export const ExportHistoryPanel = () => {
  const { exportHistory, historyLoading, downloadExport, deleteExport } = useDataExport()

  if (historyLoading) {
    return <LoadingSkeleton lines={3} className="p-6" />
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Histórico de Exportações
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie suas exportações de dados anteriores
        </p>
      </div>

      <div className="p-6">
        {exportHistory.length > 0 ? (
          <div className="space-y-4">
            {exportHistory.map((exportItem) => (
              <div
                key={exportItem.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      exportItem.status === 'completed' ? 'bg-green-500' :
                      exportItem.status === 'failed' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {exportItem.name || `Export ${exportItem.format.toUpperCase()}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(exportItem.createdAt).toLocaleDateString()} • 
                        {exportItem.format.toUpperCase()} • 
                        {exportItem.fileSize ? `${(exportItem.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Processando...'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {exportItem.status === 'completed' && (
                    <button
                      onClick={() => downloadExport(exportItem.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </button>
                  )}
                  <button
                    onClick={() => deleteExport(exportItem.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p>Nenhuma exportação encontrada</p>
            <p className="text-sm">Suas exportações aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de Configurações de Backup
export const BackupSettingsPanel = () => {
  const { backupSettings, lastBackup, updateBackupSettings, isUpdating } = useAutoBackup()
  const [settings, setSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    includeMedia: true,
    retentionDays: 30,
    notifyOnCompletion: true
  })

  React.useEffect(() => {
    if (backupSettings) {
      setSettings(backupSettings)
    }
  }, [backupSettings])

  const handleSave = () => {
    updateBackupSettings(settings)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Configurações de Backup Automático
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure backups automáticos dos seus dados
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status do último backup */}
        {lastBackup && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Último backup realizado com sucesso
                </p>
                <p className="text-sm text-green-700">
                  {new Date(lastBackup.completedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Configurações */}
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm font-medium text-gray-700">Ativar backup automático</span>
          </label>

          {settings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência do Backup
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retenção de Backups (dias)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeMedia}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeMedia: e.target.checked }))}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Incluir arquivos e imagens</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnCompletion}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifyOnCompletion: e.target.checked }))}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Notificar quando backup for concluído</span>
                </label>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <LoadingButton
            onClick={handleSave}
            loading={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar Configurações
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}