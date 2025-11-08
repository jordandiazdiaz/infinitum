import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import eventService from '../../services/eventService'
import clientService from '../../services/clientService'
import { toast } from 'react-toastify'

const EventCreate = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'Boda',
    client: '',
    date: '',
    time: '',
    duration: {
      hours: 4,
      minutes: 0
    },
    location: {
      venueName: '',
      address: '',
      city: ''
    },
    numberOfGuests: 0,
    status: 'pending',
    budget: {
      estimated: 0,
      currency: 'PEN'
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 })
      setClients(response.data)
    } catch (error) {
      toast.error('Error al cargar clientes')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }))
    } else if (name.startsWith('duration.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        duration: { ...prev.duration, [field]: parseInt(value) || 0 }
      }))
    } else if (name.startsWith('budget.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        budget: { ...prev.budget, [field]: field === 'estimated' ? parseFloat(value) || 0 : value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await eventService.createEvent(formData)
      toast.success('Evento creado correctamente')
      navigate('/events')
    } catch (error) {
      toast.error('Error al crear evento')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/events" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Evento</h1>
          <p className="text-gray-600 mt-1">Crea un nuevo evento</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="card-header">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Evento *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Boda de María y Juan"
                required
              />
            </div>

            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="Boda">Boda</option>
                <option value="Graduación">Graduación</option>
                <option value="XV años">XV años</option>
                <option value="Bautizo">Bautizo</option>
                <option value="Primera Comunión">Primera Comunión</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Aniversario">Aniversario</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Hora *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Invitados
              </label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmado</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="card-header">Ubicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="location.venueName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Local
              </label>
              <input
                type="text"
                id="location.venueName"
                name="location.venueName"
                value={formData.location.venueName}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Quinta Victoria"
              />
            </div>

            <div>
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <h3 className="card-header">Presupuesto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget.estimated" className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto Estimado
              </label>
              <input
                type="number"
                id="budget.estimated"
                name="budget.estimated"
                value={formData.budget.estimated}
                onChange={handleChange}
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="budget.currency" className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                id="budget.currency"
                name="budget.currency"
                value={formData.budget.currency}
                onChange={handleChange}
                className="input"
              >
                <option value="PEN">Soles (S/)</option>
                <option value="USD">Dólares ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="card">
          <h3 className="card-header">Duración</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration.hours" className="block text-sm font-medium text-gray-700 mb-2">
                Horas
              </label>
              <input
                type="number"
                id="duration.hours"
                name="duration.hours"
                value={formData.duration.hours}
                onChange={handleChange}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="duration.minutes" className="block text-sm font-medium text-gray-700 mb-2">
                Minutos
              </label>
              <input
                type="number"
                id="duration.minutes"
                name="duration.minutes"
                value={formData.duration.minutes}
                onChange={handleChange}
                className="input"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-4">
          <Link to="/events" className="btn btn-outline inline-flex items-center justify-center">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <FiSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventCreate
