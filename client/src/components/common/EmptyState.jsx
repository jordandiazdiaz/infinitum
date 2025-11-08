import { FiInbox } from 'react-icons/fi'

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No hay datos',
  description = '',
  action = null
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState
