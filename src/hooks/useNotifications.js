// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Hook principal para notificações
export const useNotifications = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [lastCheck, setLastCheck] = useState(new Date())

  // Buscar notificações
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return []
      const response = await apiClient.get(`/api/users/${user.id}/notifications`)
      return response.data
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch a cada 30 segundos
    staleTime: 15000
  })

  // Marcar como lida
  const markAsRead = useMutation({
    mutationFn: async (notificationId) => {
      await apiClient.patch(`/api/notifications/${notificationId}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
    }
  })

  // Marcar todas como lidas
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await apiClient.patch(`/api/users/${user.id}/notifications/read-all`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Todas as notificações foram marcadas como lidas')
    }
  })

  // Deletar notificação
  const deleteNotification = useMutation({
    mutationFn: async (notificationId) => {
      await apiClient.delete(`/api/notifications/${notificationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notificação removida')
    }
  })

  // Estatísticas
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    today: notifications.filter(n => 
      new Date(n.createdAt).toDateString() === new Date().toDateString()
    ).length
  }

  // Notificações por categoria
  const categorizedNotifications = {
    invites: notifications.filter(n => n.type === 'invite'),
    matches: notifications.filter(n => n.type === 'match'),
    championships: notifications.filter(n => n.type === 'championship'),
    system: notifications.filter(n => n.type === 'system'),
    achievements: notifications.filter(n => n.type === 'achievement')
  }

  // Verificar novas notificações
  const checkForNew = useCallback(() => {
    const newNotifications = notifications.filter(n => 
      new Date(n.createdAt) > lastCheck && !n.read
    )
    
    newNotifications.forEach(notification => {
      showNotificationToast(notification)
    })
    
    setLastCheck(new Date())
  }, [notifications, lastCheck])

  useEffect(() => {
    checkForNew()
  }, [checkForNew])

  return {
    notifications,
    stats,
    categorizedNotifications,
    isLoading,
    refetch,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    isMarkingRead: markAsRead.isPending,
    isMarkingAllRead: markAllAsRead.isPending,
    isDeleting: deleteNotification.isPending
  }
}

// Hook para notificações em tempo real (simulado)
export const useRealtimeNotifications = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!user) return

    // Simular WebSocket ou polling para notificações em tempo real
    const interval = setInterval(() => {
      // Invalidar queries de notificações para buscar novas
      queryClient.invalidateQueries(['notifications'])
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [user, queryClient])

  // Simular notificações push (seria substituído por service worker real)
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const sendPushNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })
    }
  }

  return {
    requestNotificationPermission,
    sendPushNotification
  }
}

// Função para mostrar toast baseado no tipo de notificação
const showNotificationToast = (notification) => {
  const config = {
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    }
  }

  switch (notification.type) {
    case 'invite':
      toast(`🎯 ${notification.title}`, config)
      break
    case 'match':
      toast(`⚽ ${notification.title}`, config)
      break
    case 'championship':
      toast(`🏆 ${notification.title}`, config)
      break
    case 'achievement':
      toast(`🏅 ${notification.title}`, config)
      break
    default:
      toast(notification.title, config)
  }
}