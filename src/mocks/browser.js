import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth'
import { clubsHandlers } from './handlers/clubs'
import { athletesHandlers, inviteHandlers } from './handlers/athletes'
import { championshipsHandlers, matchHandlers } from './handlers/championships'

// Combine all handlers
const handlers = [
  ...authHandlers,
  ...clubsHandlers,
  ...athletesHandlers,
  ...inviteHandlers,
  ...championshipsHandlers,
  ...matchHandlers
]

// Setup MSW worker
export const worker = setupWorker(...handlers)

// Helper to start MSW in development
export const startMocking = async () => {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      })
      console.log('🚀 MSW: Mocking enabled')
    } catch (error) {
      console.error('❌ MSW: Failed to start mocking', error)
    }
  }
}

// Helper to stop MSW
export const stopMocking = () => {
  worker.stop()
  console.log('🛑 MSW: Mocking disabled')
}

// Helper to reset handlers (useful for testing)
export const resetHandlers = () => {
  worker.resetHandlers()
}

// Helper to use specific handlers (useful for testing)
export const useHandlers = (...newHandlers) => {
  worker.use(...newHandlers)
}

export default worker