import { useState, useEffect } from 'react'
import { FiSave, FiRefreshCw, FiMail, FiCalendar, FiCreditCard, FiMessageSquare, FiKey, FiGlobe } from 'react-icons/fi'
import { FaWhatsapp, FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import calendarService from '../services/calendarService'
import { useAuthStore } from '../store/authStore'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  // Company Settings
  const [companyData, setCompanyData] = useState({
    companyName: '',
    ruc: '',
    address: '',
    city: '',
    country: 'Perú',
    phone: '',
    email: '',
    website: '',
    logo: ''
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: ''
  })

  // SUNAT Settings
  const [sunatSettings, setSunatSettings] = useState({
    sunatUser: '',
    sunatPassword: '',
    sunatClientId: '',
    sunatClientSecret: '',
    sunatEnvironment: 'test'
  })

  // Google Calendar Settings
  const [googleSettings, setGoogleSettings] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    connected: false
  })

  // WhatsApp Settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    autoResponse: true,
    welcomeMessage: '¡Hola! 👋 Gracias por contactarnos. Soy el asistente virtual de SEVEM. ¿En qué puedo ayudarte?',
    collectName: true,
    collectEmail: true,
    collectEventType: true,
    collectEventDate: true,
    collectBudget: true,
    thankYouMessage: 'Gracias por tu información. Un asesor se pondrá en contacto contigo pronto. 😊'
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newLeadEmail: true,
    newQuotationEmail: true,
    newInvoiceEmail: true,
    paymentReminderEmail: true,
    eventReminderEmail: true
  })

  // Verificar si Google Calendar está conectado
  useEffect(() => {
    if (user?.googleCalendar?.accessToken) {
      setGoogleSettings(prev => ({ ...prev, connected: true }))
    }
  }, [user])

  const handleSaveCompany = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuración de empresa guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuración de email guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSunat = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuración de SUNAT guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleConnectGoogle = async () => {
    setLoading(true)
    try {
      // Obtener URL de autorización de Google
      const response = await calendarService.getAuthUrl()
      const authUrl = response.data.authUrl

      // Abrir ventana de autorización
      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const authWindow = window.open(
        authUrl,
        'Google Calendar Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // Escuchar mensaje de respuesta
      window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          authWindow?.close()

          try {
            await calendarService.handleCallback(event.data.code)
            toast.success('Google Calendar conectado correctamente')
            setGoogleSettings(prev => ({ ...prev, connected: true }))
          } catch (error) {
            toast.error('Error al procesar autorización')
            console.error(error)
          }
        }
      }, { once: true })

    } catch (error) {
      toast.error('Error al conectar con Google Calendar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnectGoogle = async () => {
    if (!window.confirm('¿Estás seguro de desconectar Google Calendar?')) return

    setLoading(true)
    try {
      await calendarService.disconnectCalendar()
      toast.success('Google Calendar desconectado')
      setGoogleSettings(prev => ({ ...prev, connected: false }))
    } catch (error) {
      toast.error('Error al desconectar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWhatsApp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuración de WhatsApp guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuración de notificaciones guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'company', label: 'Empresa', icon: FiGlobe },
    { id: 'email', label: 'Email', icon: FiMail },
    { id: 'sunat', label: 'SUNAT', icon: FiCreditCard },
    { id: 'google', label: 'Google Calendar', icon: FiCalendar },
    { id: 'whatsapp', label: 'WhatsApp Bot', icon: FaWhatsapp },
    { id: 'notifications', label: 'Notificaciones', icon: FiMessageSquare }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Administra la configuración de tu plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Company Settings */}
          {activeTab === 'company' && (
            <div className="card">
              <h3 className="card-header">Información de la Empresa</h3>
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      value={companyData.companyName}
                      onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RUC *</label>
                    <input
                      type="text"
                      value={companyData.ruc}
                      onChange={(e) => setCompanyData({ ...companyData, ruc: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      value={companyData.city}
                      onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <input
                      type="text"
                      value={companyData.country}
                      onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSave className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="card">
              <h3 className="card-header">Configuración de Email (SMTP)</h3>
              <form onSubmit={handleSaveEmail} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servidor SMTP *
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                      className="input"
                      placeholder="smtp.gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Puerto *</label>
                    <input
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                    <input
                      type="text"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Envío *
                    </label>
                    <input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Envío *
                    </label>
                    <input
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSave className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUNAT Settings */}
          {activeTab === 'sunat' && (
            <div className="card">
              <h3 className="card-header">Configuración de SUNAT - Facturación Electrónica</h3>
              <form onSubmit={handleSaveSunat} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    Requisitos para Facturación Electrónica SUNAT
                  </p>
                  <p className="text-sm text-blue-800">
                    Esta configuración es necesaria para la emisión de comprobantes electrónicos válidos ante SUNAT.
                    Debes obtener tus credenciales desde{' '}
                    <a
                      href="https://www.sunat.gob.pe/operaciones-en-linea/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      SUNAT Operaciones en Línea
                    </a>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Usuario SOL *
                    </label>
                    <input
                      type="text"
                      value={sunatSettings.sunatUser}
                      onChange={(e) => setSunatSettings({ ...sunatSettings, sunatUser: e.target.value })}
                      className="input"
                      placeholder="Ej: MODDATOS"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Usuario de SUNAT Operaciones en Línea (SOL)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave SOL *
                    </label>
                    <input
                      type="password"
                      value={sunatSettings.sunatPassword}
                      onChange={(e) => setSunatSettings({ ...sunatSettings, sunatPassword: e.target.value })}
                      className="input"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contraseña de SUNAT Operaciones en Línea (SOL)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client ID (API) *
                    </label>
                    <input
                      type="text"
                      value={sunatSettings.sunatClientId}
                      onChange={(e) => setSunatSettings({ ...sunatSettings, sunatClientId: e.target.value })}
                      className="input"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ID de credenciales API generado en portal SUNAT
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Secret (API) *
                    </label>
                    <input
                      type="password"
                      value={sunatSettings.sunatClientSecret}
                      onChange={(e) => setSunatSettings({ ...sunatSettings, sunatClientSecret: e.target.value })}
                      className="input"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Clave de credenciales API generada en portal SUNAT
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ambiente *
                    </label>
                    <select
                      value={sunatSettings.sunatEnvironment}
                      onChange={(e) => setSunatSettings({ ...sunatSettings, sunatEnvironment: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="test">Pruebas (Beta)</option>
                      <option value="production">Producción</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Usa "Pruebas" para realizar validaciones antes de pasar a producción
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700">
                    <strong>Nota:</strong> El RUC de tu empresa se configura en la sección "Empresa".
                    Para obtener tus credenciales API, ingresa a{' '}
                    <a
                      href="https://www.sunat.gob.pe/operaciones-en-linea/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 underline"
                    >
                      SUNAT SOL
                    </a>
                    {' '}con tu Clave SOL y genera las credenciales en la sección de Emisión Electrónica.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSave className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Google Calendar Settings */}
          {activeTab === 'google' && (
            <div className="card">
              <h3 className="card-header">Integración con Google Calendar</h3>
              {googleSettings.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <FaGoogle className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Google Calendar Conectado</p>
                        <p className="text-xs text-green-700">Los eventos se sincronizarán automáticamente</p>
                      </div>
                    </div>
                    <button onClick={handleDisconnectGoogle} disabled={loading} className="btn btn-outline btn-sm inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                      Desconectar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      ¿Qué es Google Calendar?
                    </p>
                    <p className="text-sm text-blue-800 mb-3">
                      Conecta tu cuenta de Google Calendar para sincronizar automáticamente todos los eventos que crees en SEVEM.
                      Esto te permitirá ver todos tus eventos en tu calendario de Google y recibir notificaciones.
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> El administrador debe configurar las credenciales de Google OAuth en el archivo .env del servidor antes de poder conectar.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900 font-medium mb-2">
                      Instrucciones de configuración
                    </p>
                    <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                      <li>Crear proyecto en Google Cloud Console</li>
                      <li>Habilitar Google Calendar API</li>
                      <li>Crear credenciales OAuth 2.0</li>
                      <li>Configurar URI de redirección: http://localhost:5173/auth/google/callback</li>
                      <li>Copiar Client ID y Client Secret al archivo .env del servidor</li>
                    </ol>
                  </div>

                  <button onClick={handleConnectGoogle} disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaGoogle className="w-4 h-4 mr-2" />
                    Conectar con Google Calendar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WhatsApp Bot Settings */}
          {activeTab === 'whatsapp' && (
            <div className="card">
              <h3 className="card-header">Configuración del Bot de WhatsApp</h3>
              <form onSubmit={handleSaveWhatsApp} className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={whatsappSettings.autoResponse}
                      onChange={(e) => setWhatsappSettings({ ...whatsappSettings, autoResponse: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Activar respuesta automática</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje de Bienvenida
                  </label>
                  <textarea
                    value={whatsappSettings.welcomeMessage}
                    onChange={(e) => setWhatsappSettings({ ...whatsappSettings, welcomeMessage: e.target.value })}
                    className="input min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información a Recopilar
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappSettings.collectName}
                        onChange={(e) => setWhatsappSettings({ ...whatsappSettings, collectName: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Nombre</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappSettings.collectEmail}
                        onChange={(e) => setWhatsappSettings({ ...whatsappSettings, collectEmail: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappSettings.collectEventType}
                        onChange={(e) => setWhatsappSettings({ ...whatsappSettings, collectEventType: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Tipo de Evento</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappSettings.collectEventDate}
                        onChange={(e) => setWhatsappSettings({ ...whatsappSettings, collectEventDate: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Fecha del Evento</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={whatsappSettings.collectBudget}
                        onChange={(e) => setWhatsappSettings({ ...whatsappSettings, collectBudget: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Presupuesto Estimado</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje de Agradecimiento
                  </label>
                  <textarea
                    value={whatsappSettings.thankYouMessage}
                    onChange={(e) => setWhatsappSettings({ ...whatsappSettings, thankYouMessage: e.target.value })}
                    className="input min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSave className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h3 className="card-header">Preferencias de Notificaciones</h3>
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Activar notificaciones por email</span>
                  </label>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newLeadEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, newLeadEmail: e.target.checked })}
                      disabled={!notificationSettings.emailNotifications}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Nuevo lead desde chatbot</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newQuotationEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, newQuotationEmail: e.target.checked })}
                      disabled={!notificationSettings.emailNotifications}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Nueva cotización creada</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newInvoiceEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, newInvoiceEmail: e.target.checked })}
                      disabled={!notificationSettings.emailNotifications}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Nueva factura emitida</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentReminderEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminderEmail: e.target.checked })}
                      disabled={!notificationSettings.emailNotifications}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Recordatorios de pago</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.eventReminderEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, eventReminderEmail: e.target.checked })}
                      disabled={!notificationSettings.emailNotifications}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Recordatorios de eventos</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSave className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
