import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiTrash2, FiSend, FiDownload, FiPrinter } from 'react-icons/fi'
import quotationService from '../../services/quotationService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const QuotationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotation()
  }, [id])

  const loadQuotation = async () => {
    try {
      const response = await quotationService.getQuotation(id)
      setQuotation(response.data)
    } catch (error) {
      toast.error('Error al cargar cotización')
      navigate('/quotations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta cotización?')) return

    try {
      await quotationService.deleteQuotation(id)
      toast.success('Cotización eliminada correctamente')
      navigate('/quotations')
    } catch (error) {
      toast.error('Error al eliminar cotización')
    }
  }

  const handleGeneratePDF = async () => {
    try {
      await quotationService.generatePDF(id)
      toast.success('PDF generado correctamente')
      loadQuotation()
    } catch (error) {
      toast.error('Error al generar PDF')
    }
  }

  const handleSendQuotation = async () => {
    try {
      await quotationService.sendQuotation(id)
      toast.success('Cotización enviada correctamente')
      loadQuotation()
    } catch (error) {
      toast.error('Error al enviar cotización')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cotización...</p>
        </div>
      </div>
    )
  }

  if (!quotation) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/quotations" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quotation.quotationNumber}</h1>
            <p className="text-gray-600 mt-1">{quotation.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {quotation.pdfUrl && (
            <a href={quotation.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-flex items-center justify-center">
              <FiDownload className="w-4 h-4 mr-2" />
              Descargar PDF
            </a>
          )}
          {!quotation.pdfUrl && (
            <button onClick={handleGeneratePDF} className="btn btn-outline inline-flex items-center justify-center">
              <FiPrinter className="w-4 h-4 mr-2" />
              Generar PDF
            </button>
          )}
          <button onClick={handleSendQuotation} className="btn btn-primary inline-flex items-center justify-center">
            <FiSend className="w-4 h-4 mr-2" />
            Enviar por Email
          </button>
          <button onClick={handleDelete} className="btn btn-danger inline-flex items-center justify-center">
            <FiTrash2 className="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="card">
            <h3 className="card-header">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-gray-900 mt-1">
                  {quotation.client?.firstName} {quotation.client?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 mt-1">{quotation.client?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-gray-900 mt-1">{quotation.client?.phone}</p>
              </div>
              {quotation.eventDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha del Evento</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(quotation.eventDate), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <h3 className="card-header">Items de la Cotización</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cant.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P. Unit.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desc.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotation.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">S/ {item.unitPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.discount}%</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">S/ {item.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">S/ {quotation.subtotal?.toLocaleString()}</span>
                  </div>
                  {quotation.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento ({quotation.discount}%):</span>
                      <span className="font-medium text-red-600">
                        - S/ {((quotation.subtotal * quotation.discount) / 100).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGV ({quotation.tax}%):</span>
                    <span className="font-medium text-gray-900">
                      S/ {(((quotation.subtotal * (100 - quotation.discount)) / 100) * quotation.tax / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-primary-600">S/ {quotation.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Notes */}
          {quotation.terms && (
            <div className="card">
              <h3 className="card-header">Términos y Condiciones</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{quotation.terms}</p>
            </div>
          )}

          {quotation.notes && (
            <div className="card">
              <h3 className="card-header">Notas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="card-header">Detalles</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="text-gray-900 mt-1 capitalize">{quotation.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Creada</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(quotation.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Válida hasta</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(quotation.validUntil), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
              {quotation.sentAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Enviada</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(quotation.sentAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
              {quotation.viewedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Vista</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(quotation.viewedAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
              {quotation.numberOfGuests && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Invitados</label>
                  <p className="text-gray-900 mt-1">{quotation.numberOfGuests}</p>
                </div>
              )}
            </div>
          </div>

          {quotation.event && (
            <div className="card">
              <h3 className="card-header">Evento Relacionado</h3>
              <Link
                to={`/events/${quotation.event._id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{quotation.event.name}</p>
                <p className="text-xs text-gray-500">{quotation.event.eventType}</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuotationDetail
