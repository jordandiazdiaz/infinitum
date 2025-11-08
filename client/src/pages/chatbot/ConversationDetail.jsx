import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiSend, FiUser, FiCheckCircle, FiX, FiCalendar, FiDollarSign, FiMail, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import chatbotService from '../../services/chatbotService'
import clientService from '../../services/clientService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ConversationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)

  useEffect(() => {
    loadConversation()
    const interval = setInterval(loadConversation, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const loadConversation = async () => {
    try {
      const response = await chatbotService.getConversation(id)
      setConversation(response.data)
    } catch (error) {
      toast.error('Error al cargar conversación')
      navigate('/chatbot')
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      await chatbotService.sendMessage(id, { content: newMessage })
      setNewMessage('')
      loadConversation()
    } catch (error) {
      toast.error('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleConvertToClient = async () => {
    try {
      const clientData = {
        firstName: conversation.leadData?.name?.split(' ')[0] || 'Sin nombre',
        lastName: conversation.leadData?.name?.split(' ').slice(1).join(' ') || '',
        email: conversation.leadData?.email || '',
        phone: conversation.phoneNumber,
        status: 'client',
        eventType: conversation.leadData?.eventType || '',
        eventDate: conversation.leadData?.eventDate || null,
        estimatedBudget: conversation.leadData?.budget || 0,
        source: conversation.platform,
        notes: `Convertido desde chatbot. Conversación iniciada el ${format(new Date(conversation.createdAt), "d 'de' MMMM, yyyy", { locale: es })}`
      }

      await clientService.createClient(clientData)
      await chatbotService.updateConversationStatus(id, 'converted')
      toast.success('Lead convertido a cliente correctamente')
      setShowConvertModal(false)
      navigate('/clients')
    } catch (error) {
      toast.error('Error al convertir a cliente')
    }
  }

  const handleCloseConversation = async () => {
    if (!window.confirm('¿Estás seguro de cerrar esta conversación?')) return

    try {
      await chatbotService.updateConversationStatus(id, 'closed')
      toast.success('Conversación cerrada')
      loadConversation()
    } catch (error) {
      toast.error('Error al cerrar conversación')
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'whatsapp':
        return <FaWhatsapp className="w-6 h-6 text-green-500" />
      case 'facebook':
        return <FaFacebook className="w-6 h-6 text-blue-600" />
      case 'instagram':
        return <FaInstagram className="w-6 h-6 text-pink-600" />
      default:
        return <FiUser className="w-6 h-6 text-gray-500" />
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
          <p className="mt-4 text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    )
  }

  if (!conversation) return null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/chatbot" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-3">
            {getPlatformIcon(conversation.platform)}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {conversation.leadData?.name || 'Sin nombre'}
              </h1>
              <p className="text-sm text-gray-600">{conversation.phoneNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(conversation.status)}
          {conversation.status === 'active' && (
            <>
              <button onClick={() => setShowConvertModal(true)} className="btn btn-success inline-flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Convertir a Cliente
              </button>
              <button onClick={handleCloseConversation} className="btn btn-outline inline-flex items-center justify-center">
                <FiX className="w-4 h-4 mr-2" />
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="card flex-1 flex flex-col" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'bot' || message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'bot' || message.sender === 'agent'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === 'bot' || message.sender === 'agent'
                            ? 'text-primary-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.sender === 'bot' ? 'Bot' : message.sender === 'agent' ? 'Tú' : conversation.leadData?.name || 'Cliente'}
                      </p>
                      <p
                        className={`text-xs ${
                          message.sender === 'bot' || message.sender === 'agent'
                            ? 'text-primary-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {conversation.status === 'active' && (
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="input flex-1"
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSend className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Lead Information Sidebar */}
        <div className="space-y-6">
          {/* Lead Data */}
          <div className="card">
            <h3 className="card-header">Información del Lead</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-gray-900 mt-1">{conversation.leadData?.name || 'No proporcionado'}</p>
              </div>
              {conversation.leadData?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <FiMail className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  <p className="text-gray-900 mt-1">{conversation.leadData.email}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <FiPhone className="w-4 h-4 mr-1" />
                  Teléfono
                </label>
                <p className="text-gray-900 mt-1">{conversation.phoneNumber}</p>
              </div>
              {conversation.leadData?.eventType && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Evento</label>
                  <p className="text-gray-900 mt-1 capitalize">{conversation.leadData.eventType}</p>
                </div>
              )}
              {conversation.leadData?.eventDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    Fecha del Evento
                  </label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(conversation.leadData.eventDate), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
              {conversation.leadData?.budget && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    Presupuesto Estimado
                  </label>
                  <p className="text-gray-900 mt-1">S/ {conversation.leadData.budget.toLocaleString()}</p>
                </div>
              )}
              {conversation.leadData?.numberOfGuests && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Invitados</label>
                  <p className="text-gray-900 mt-1">{conversation.leadData.numberOfGuests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Stats */}
          <div className="card">
            <h3 className="card-header">Estadísticas</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Plataforma</label>
                <p className="text-gray-900 mt-1 capitalize flex items-center">
                  {getPlatformIcon(conversation.platform)}
                  <span className="ml-2">{conversation.platform}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Iniciada</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(conversation.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Último Mensaje</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(conversation.lastMessageAt || conversation.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total de Mensajes</label>
                <p className="text-gray-900 mt-1">{conversation.messages?.length || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="text-gray-900 mt-1">{getStatusBadge(conversation.status)}</p>
              </div>
            </div>
          </div>

          {/* Lead Score */}
          {conversation.leadData && (
            <div className="card">
              <h3 className="card-header">Calificación del Lead</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Información Completa</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(() => {
                        let score = 0
                        if (conversation.leadData.name) score += 20
                        if (conversation.leadData.email) score += 20
                        if (conversation.leadData.eventType) score += 20
                        if (conversation.leadData.eventDate) score += 20
                        if (conversation.leadData.budget) score += 20
                        return score
                      })()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (() => {
                          let score = 0
                          if (conversation.leadData.name) score += 20
                          if (conversation.leadData.email) score += 20
                          if (conversation.leadData.eventType) score += 20
                          if (conversation.leadData.eventDate) score += 20
                          if (conversation.leadData.budget) score += 20
                          return score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        })()
                      }`}
                      style={{
                        width: `${(() => {
                          let score = 0
                          if (conversation.leadData.name) score += 20
                          if (conversation.leadData.email) score += 20
                          if (conversation.leadData.eventType) score += 20
                          if (conversation.leadData.eventDate) score += 20
                          if (conversation.leadData.budget) score += 20
                          return score
                        })()}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      {conversation.leadData.name ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      Nombre
                    </li>
                    <li className="flex items-center">
                      {conversation.leadData.email ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      Email
                    </li>
                    <li className="flex items-center">
                      {conversation.leadData.eventType ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      Tipo de Evento
                    </li>
                    <li className="flex items-center">
                      {conversation.leadData.eventDate ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      Fecha del Evento
                    </li>
                    <li className="flex items-center">
                      {conversation.leadData.budget ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      Presupuesto
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Client Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Convertir a Cliente</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de convertir este lead en cliente? Se creará un nuevo registro con la información recopilada.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Información que se guardará:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nombre: {conversation.leadData?.name || 'No proporcionado'}</li>
                <li>• Email: {conversation.leadData?.email || 'No proporcionado'}</li>
                <li>• Teléfono: {conversation.phoneNumber}</li>
                <li>• Tipo de Evento: {conversation.leadData?.eventType || 'No proporcionado'}</li>
                {conversation.leadData?.eventDate && (
                  <li>
                    • Fecha: {format(new Date(conversation.leadData.eventDate), "d 'de' MMMM, yyyy", { locale: es })}
                  </li>
                )}
                {conversation.leadData?.budget && <li>• Presupuesto: S/ {conversation.leadData.budget.toLocaleString()}</li>}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowConvertModal(false)} className="btn btn-outline flex-1 inline-flex items-center justify-center">
                Cancelar
              </button>
              <button onClick={handleConvertToClient} className="btn btn-success flex-1 inline-flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConversationDetail
