// src/context/NotificationsContext.jsx
import React, { createContext, useContext } from 'react'
import { useNotifications, useRealtimeNotifications } from '../hooks/useNotifications'

const NotificationsContext = createContext()

export const NotificationsProvider = ({ children }) => {
  const notificationsData = useNotifications()
  const realtimeFeatures = useRealtimeNotifications()
  
  return (
    <NotificationsContext.Provider value={{
      ...notificationsData,
      ...realtimeFeatures
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationsProvider')
  }
  return context
}