import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiUsers, FiCheckCircle, FiClock, FiRefreshCw, FiPower, FiAlertCircle } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import chatbotService from '../../services/chatbotService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ChatbotDashboard = () => {
  const [status, setStatus] = useState(null)
  const [conversations, setConversations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statusRes, conversationsRes, statsRes] = await Promise.all([
        chatbotService.getStatus(),
        chatbotService.getConversations({ limit: 10 }),
        chatbotService.getStats()
      ])
      setStatus(statusRes.data)
      setConversations(conversationsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Error al cargar datos del chatbot')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setShowQR(true)
      const response = await chatbotService.connect()
      setQrCode(response.data.qr)
      toast.success('Escanea el código QR con WhatsApp')
    } catch (error) {
      toast.error('Error al conectar con WhatsApp')
      setShowQR(false)
    }
  }

  const handleDisconnect = async () => {
    if (!window.confirm('¿Estás seguro de desconectar el bot de WhatsApp?')) return

    try {
      await chatbotService.disconnect()
      toast.success('Bot desconectado correctamente')
      loadDashboardData()
      setShowQR(false)
    } catch (error) {
      toast.error('Error al desconectar')
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    loadDashboardData()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando chatbot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot de Prospección</h1>
          <p className="text-gray-600 mt-1">Gestiona tus conversaciones automáticas 24/7</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-outline inline-flex items-center justify-center">
          <FiRefreshCw className="w-5 h-5 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Connection Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-lg ${status?.whatsapp?.connected ? 'bg-green-100' : 'bg-red-100'}`}>
              <FaWhatsapp className={`w-8 h-8 ${status?.whatsapp?.connected ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business</h3>
              <p className={`text-sm ${status?.whatsapp?.connected ? 'text-green-600' : 'text-red-600'}`}>
                {status?.whatsapp?.connected ? 'Conectado y activo' : 'Desconectado'}
              </p>
              {status?.whatsapp?.phoneNumber && (
                <p className="text-xs text-gray-500 mt-1">Número: {status.whatsapp.phoneNumber}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!status?.whatsapp?.connected ? (
              <button onClick={handleConnect} className="btn btn-success inline-flex items-center justify-center">
                <FiPower className="w-4 h-4 mr-2" />
                Conectar WhatsApp
              </button>
            ) : (
              <button onClick={handleDisconnect} className="btn btn-danger inline-flex items-center justify-center">
                <FiPower className="w-4 h-4 mr-2" />
                Desconectar
              </button>
            )}
          </div>
        </div>

        {/* Platform Status - Facebook and Instagram (Coming Soon) */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaFacebook className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Facebook Messenger</p>
                <p className="text-xs text-gray-500">Próximamente</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaInstagram className="w-6 h-6 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Instagram Direct</p>
                <p className="text-xs text-gray-500">Próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Escanea este código QR con WhatsApp</h3>
            <div className="flex justify-center mb-4">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-64 h-64 border-4 border-white rounded-lg shadow-lg" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-white border-4 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Generando código QR...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">Instrucciones:</h4>
              <ol className="text-left text-sm text-gray-600 space-y-1">
                <li>1. Abre WhatsApp en tu teléfono</li>
                <li>2. Ve a Configuración {'>'} Dispositivos vinculados</li>
                <li>3. Toca en "Vincular un dispositivo"</li>
                <li>4. Escanea este código QR</li>
              </ol>
            </div>
            <button onClick={() => setShowQR(false)} className="btn btn-outline mt-4 inline-flex items-center justify-center">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversaciones Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalConversations}</p>
                <p className="text-xs text-gray-500 mt-1">+{stats.newToday} hoy</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FiMessageSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversaciones Activas</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.activeConversations}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Generados</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.leadsGenerated}</p>
                <p className="text-xs text-gray-500 mt-1">Este mes</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{stats.conversions} clientes</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Conversations */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Conversaciones Recientes</h3>
          <Link to="/chatbot/conversations" className="btn btn-outline btn-sm inline-flex items-center justify-center">
            Ver Todas
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay conversaciones recientes</p>
          </div>
        ) : (
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
                          {conversation.leadData?.name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500">{conversation.phoneNumber}</p>
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
                      {conversation.leadData?.eventType || '-'}
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
        )}
      </div>

      {/* Bot Configuration Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Consejos para Optimizar tu Chatbot</h3>
            <div className="mt-2 text-sm text-green-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Mantén el bot conectado 24/7 para no perder oportunidades</li>
                <li>Revisa las conversaciones activas al menos 2 veces al día</li>
                <li>Personaliza las respuestas automáticas desde Configuración</li>
                <li>Convierte los leads calificados en clientes rápidamente</li>
                <li>El bot recopila: nombre, email, teléfono, tipo de evento, fecha y presupuesto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {stats && stats.responseTime && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Tiempo Promedio de Respuesta</h4>
            <p className="text-2xl font-bold text-gray-900">{stats.responseTime}s</p>
            <p className="text-xs text-green-600 mt-1">Excelente</p>
          </div>

          <div className="card">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Mensajes Procesados Hoy</h4>
            <p className="text-2xl font-bold text-gray-900">{stats.messagesToday}</p>
            <p className="text-xs text-gray-500 mt-1">+{((stats.messagesToday / stats.messagesYesterday - 1) * 100).toFixed(1)}% vs ayer</p>
          </div>

          <div className="card">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Satisfacción del Cliente</h4>
            <p className="text-2xl font-bold text-gray-900">{stats.satisfaction}%</p>
            <p className="text-xs text-green-600 mt-1">Muy buena</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotDashboard
