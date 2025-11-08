import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import notificationService from '../../services/notificationService'
import { toast } from 'react-toastify'

const Header = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Load notifications
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications()
      setNotifications(response.data)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error loading notifications:', error)
      }
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.data.count)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error loading unread count:', error)
      }
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      loadNotifications()
      loadUnreadCount()
    } catch (error) {
      toast.error('Error al marcar notificación como leída')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      loadNotifications()
      loadUnreadCount()
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch (error) {
      toast.error('Error al marcar notificaciones')
    }
  }

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    if (seconds < 60) return 'Hace unos segundos'
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`
    return new Date(date).toLocaleDateString()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Panel de Control
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) {
                loadNotifications()
              }
            }}
            className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{unreadCount}</span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No tienes notificaciones
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleMarkAsRead(notification._id)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900 font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {user?.name || 'Usuario'}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  navigate('/profile')
                  setShowUserMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FiUser className="w-4 h-4" />
                <span>Mi Perfil</span>
              </button>
              <button
                onClick={() => {
                  navigate('/settings')
                  setShowUserMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FiSettings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
