import { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div 
          className={clsx(
            'relative bg-white rounded-lg shadow-xl w-full',
            sizes[size],
            'transform transition-all duration-200',
            'max-h-[90vh] overflow-hidden flex flex-col',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Fechar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Modal compound components
export const ModalHeader = ({ children, className = '' }) => (
  <div className={clsx('p-6 border-b border-gray-200', className)}>
    {children}
  </div>
)

export const ModalTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-lg font-medium text-gray-900', className)}>
    {children}
  </h3>
)

export const ModalBody = ({ children, className = '' }) => (
  <div className={clsx('p-6', className)}>
    {children}
  </div>
)

export const ModalFooter = ({ children, className = '' }) => (
  <div className={clsx('px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3', className)}>
    {children}
  </div>
)

// Specialized modal variants
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}) => {
  const typeStyles = {
    danger: {
      icon: '⚠️',
      confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      icon: '⚡',
      confirmClass: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    },
    info: {
      icon: 'ℹ️',
      confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    success: {
      icon: '✅',
      confirmClass: 'bg-green-600 hover:bg-green-700 text-white'
    }
  }

  const style = typeStyles[type] || typeStyles.danger

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBody>
        <div className="text-center">
          <div className="text-4xl mb-4">{style.icon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          {message && (
            <p className="text-sm text-gray-600 mb-6">{message}</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
            style.confirmClass
          )}
        >
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export const LoadingModal = ({ isOpen, message = 'Carregando...' }) => (
  <Modal 
    isOpen={isOpen} 
    onClose={() => {}} 
    size="sm" 
    closeOnOverlayClick={false}
    closeOnEscape={false}
    showCloseButton={false}
  >
    <ModalBody>
      <div className="text-center py-4">
        <div className="spinner w-8 h-8 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </ModalBody>
  </Modal>
)

export default Modal