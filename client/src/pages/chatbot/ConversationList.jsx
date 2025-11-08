import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiSearch, FiFilter, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import chatbotService from '../../services/chatbotService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const ConversationList = () => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: '',
    platform: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    count: 0
  })

  useEffect(() => {
    loadConversations()
  }, [filter, pagination.page])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filter
      }
      const response = await chatbotService.getConversations(params)
      setConversations(response.data)
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        count: response.count || 0
      }))
    } catch (error) {
      toast.error('Error al cargar conversaciones')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'whatsapp':
        return <FaWhatsapp className="w-5 h-5 text-green-500" />
      case 'facebook':
        return <FaFacebook className="w-5 h-5 text-blue-600" />
      case 'instagram':
        return <FaInstagram className="w-5 h-5 text-pink-600" />
      default:
        return <FiMessageSquare className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge badge-success', label: 'Activa' },
      pending: { class: 'badge badge-warning', label: 'Pendiente' },
      closed: { class: 'badge badge-gray', label: 'Cerrada' },
      converted: { class: 'badge badge-info', label: 'Convertida' }
    }
    const badge = badges[status] || badges.pending
    return <span className={badge.class}>{badge.label}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/chatbot" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todas las Conversaciones</h1>
            <p className="text-gray-600 mt-1">
              {pagination.count} conversaciones encontradas
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="closed">Cerradas</option>
            <option value="archived">Archivadas</option>
          </select>

          {/* Platform Filter */}
          <select
            value={filter.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="input"
          >
            <option value="">Todas las plataformas</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando conversaciones...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay conversaciones con estos filtros</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Mensaje</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interés</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <tr key={conversation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPlatformIcon(conversation.platform)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {conversation.leadData?.name || conversation.contactName || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500">{conversation.contactPhone || conversation.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-900 truncate">
                          {conversation.messages?.[conversation.messages.length - 1]?.content || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(conversation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {conversation.leadData?.eventType || conversation.capturedData?.eventType || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(conversation.lastMessageAt || conversation.createdAt), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/chatbot/conversations/${conversation._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn btn-outline inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-outline inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ConversationList
