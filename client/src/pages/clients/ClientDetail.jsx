import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiPhone, FiMapPin, FiCalendar, FiMessageSquare } from 'react-icons/fi'
import clientService from '../../services/clientService'
import { toast } from 'react-toastify'

const ClientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    loadClient()
  }, [id])

  const loadClient = async () => {
    try {
      const response = await clientService.getClient(id)
      setClient(response.data)
    } catch (error) {
      toast.error('Error al cargar cliente')
      navigate('/clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      await clientService.deleteClient(id)
      toast.success('Cliente eliminado correctamente')
      navigate('/clients')
    } catch (error) {
      toast.error('Error al eliminar cliente')
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      await clientService.addNote(id, newNote)
      toast.success('Nota agregada')
      setNewNote('')
      loadClient()
    } catch (error) {
      toast.error('Error al agregar nota')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cliente...</p>
        </div>
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/clients" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-gray-600 mt-1">Información del cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/clients/${id}/edit`} className="btn btn-outline inline-flex items-center justify-center">
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
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Información
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notas ({client.notes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'interactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interacciones ({client.interactions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Eventos
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="card-header">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiMail className="text-gray-400" />
                    <span className="text-gray-900">{client.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiPhone className="text-gray-400" />
                    <span className="text-gray-900">{client.phone}</span>
                  </div>
                </div>
                {client.whatsapp && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <FiMessageSquare className="text-gray-400" />
                      <span className="text-gray-900">{client.whatsapp}</span>
                    </div>
                  </div>
                )}
                {client.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <FiMapPin className="text-gray-400" />
                      <span className="text-gray-900">
                        {client.address.street}, {client.address.city}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {client.documentNumber && (
              <div className="card">
                <h3 className="card-header">Información de Documento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-gray-900 mt-1">{client.documentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número</label>
                    <p className="text-gray-900 mt-1">{client.documentNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="card-header">Estado</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado Actual</label>
                  <p className="text-gray-900 mt-1 capitalize">{client.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fuente</label>
                  <p className="text-gray-900 mt-1 capitalize">{client.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiCalendar className="text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(client.createdAt).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {client.tags && client.tags.length > 0 && (
              <div className="card">
                <h3 className="card-header">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, index) => (
                    <span key={index} className="badge badge-info">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card">
          <h3 className="card-header">Notas</h3>

          {/* Add Note Form */}
          <div className="mb-6">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Agregar una nota..."
              className="input min-h-[100px]"
            />
            <button onClick={handleAddNote} className="btn btn-primary mt-2 inline-flex items-center justify-center">
              Agregar Nota
            </button>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {client.notes && client.notes.length > 0 ? (
              client.notes.map((note, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-gray-900">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString('es-PE')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay notas todavía</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'interactions' && (
        <div className="card">
          <h3 className="card-header">Historial de Interacciones</h3>
          <div className="space-y-4">
            {client.interactions && client.interactions.length > 0 ? (
              client.interactions.map((interaction, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{interaction.type}</p>
                      <p className="text-gray-600 mt-1">{interaction.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(interaction.date).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay interacciones registradas</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="card">
          <h3 className="card-header">Eventos del Cliente</h3>
          <p className="text-gray-500 text-center py-8">Eventos próximamente</p>
        </div>
      )}
    </div>
  )
}

export default ClientDetail
