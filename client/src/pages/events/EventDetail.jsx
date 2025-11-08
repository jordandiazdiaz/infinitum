import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiTrash2, FiCalendar, FiUser, FiMapPin, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi'
import eventService from '../../services/eventService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      const response = await eventService.getEvent(id)
      setEvent(response.data)
    } catch (error) {
      toast.error('Error al cargar evento')
      navigate('/events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return

    try {
      await eventService.deleteEvent(id)
      toast.success('Evento eliminado correctamente')
      navigate('/events')
    } catch (error) {
      toast.error('Error al eliminar evento')
    }
  }

  const calculateProfitability = async () => {
    try {
      const response = await eventService.calculateProfitability(id)
      toast.success('Rentabilidad calculada')
      loadEvent()
    } catch (error) {
      toast.error('Error al calcular rentabilidad')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/events" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-600 mt-1">{event.eventType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/events/${id}/edit`} className="btn btn-outline inline-flex items-center justify-center">
            <FiEdit className="w-4 h-4 mr-2" />
            Editar
          </Link>
          <button onClick={handleDelete} className="btn btn-danger inline-flex items-center justify-center">
            <FiTrash2 className="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['info', 'services', 'payments', 'tasks', 'profitability'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'info' ? 'Información' :
               tab === 'services' ? 'Servicios' :
               tab === 'payments' ? 'Pagos' :
               tab === 'tasks' ? 'Tareas' : 'Rentabilidad'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="card-header">Detalles del Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiCalendar className="text-gray-400" />
                    <span className="text-gray-900">
                      {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hora</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiClock className="text-gray-400" />
                    <span className="text-gray-900">{event.time}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cliente</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiUser className="text-gray-400" />
                    <Link
                      to={`/clients/${event.client?._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {event.client?.firstName} {event.client?.lastName}
                    </Link>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Invitados</label>
                  <p className="text-gray-900 mt-1">{event.numberOfGuests || 'N/A'}</p>
                </div>
                {event.location?.venueName && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <FiMapPin className="text-gray-400" />
                      <span className="text-gray-900">
                        {event.location.venueName} - {event.location.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="card-header">Presupuesto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimado</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiDollarSign className="text-gray-400" />
                    <span className="text-gray-900">
                      S/ {(event.budget?.estimated || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Real</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiDollarSign className="text-gray-400" />
                    <span className="text-gray-900">
                      S/ {(event.budget?.actual || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="card-header">Estado</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado Actual</label>
                  <p className="text-gray-900 mt-1 capitalize">{event.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creado</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(event.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </div>

            {event.quotation && (
              <div className="card">
                <h3 className="card-header">Documentos</h3>
                <div className="space-y-2">
                  <Link
                    to={`/quotations/${event.quotation._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-900">Cotización</p>
                    <p className="text-xs text-gray-500">
                      {event.quotation.quotationNumber}
                    </p>
                  </Link>
                  {event.contract && (
                    <Link
                      to={`/contracts/${event.contract._id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-900">Contrato</p>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="card">
          <h3 className="card-header">Servicios Contratados</h3>
          {event.services && event.services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.services.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{service.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">S/ {service.unitPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">S/ {service.total?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{service.provider || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay servicios registrados</p>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card">
          <h3 className="card-header">Pagos</h3>
          {event.payments && event.payments.length > 0 ? (
            <div className="space-y-4">
              {event.payments.map((payment, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">S/ {payment.amount?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{payment.method}</p>
                      {payment.reference && (
                        <p className="text-sm text-gray-500">Ref: {payment.reference}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`badge ${payment.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                        {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Vence: {format(new Date(payment.dueDate), 'd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay pagos registrados</p>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card">
          <h3 className="card-header">Tareas</h3>
          {event.tasks && event.tasks.length > 0 ? (
            <div className="space-y-4">
              {event.tasks.map((task, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FiCheckCircle className={`w-5 h-5 mt-0.5 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Vence: {format(new Date(task.dueDate), 'd/MM/yyyy')}
                      </p>
                    )}
                  </div>
                  <span className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'gray'}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay tareas registradas</p>
          )}
        </div>
      )}

      {activeTab === 'profitability' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Análisis de Rentabilidad</h3>
              <button onClick={calculateProfitability} className="btn btn-primary inline-flex items-center justify-center">
                Calcular Rentabilidad
              </button>
            </div>

            {event.profitability ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    S/ {event.profitability.totalIncome?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Costos Totales</p>
                  <p className="text-2xl font-bold text-red-900 mt-2">
                    S/ {event.profitability.totalCosts?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Ganancia Neta</p>
                  <p className="text-2xl font-bold text-green-900 mt-2">
                    S/ {event.profitability.netProfit?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Margen de Ganancia</p>
                  <p className="text-2xl font-bold text-purple-900 mt-2">
                    {event.profitability.profitMargin?.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Haz clic en "Calcular Rentabilidad" para ver el análisis
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetail
