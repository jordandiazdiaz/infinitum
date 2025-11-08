import { FiAlertTriangle } from 'react-icons/fi'

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null

  const typeClasses = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    info: 'btn-primary'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="ml-3 text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button onClick={onClose} className="btn btn-outline flex-1">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn ${typeClasses[type]} flex-1`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
