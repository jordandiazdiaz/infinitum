import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit, FiTrash2, FiSend, FiDownload, FiDollarSign, FiCheckCircle } from 'react-icons/fi'
import invoiceService from '../../services/invoiceService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const InvoiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  })

  useEffect(() => {
    loadInvoice()
  }, [id])

  const loadInvoice = async () => {
    try {
      const response = await invoiceService.getInvoice(id)
      setInvoice(response.data)
      setPaymentData(prev => ({ ...prev, amount: response.data.amountDue || 0 }))
    } catch (error) {
      toast.error('Error al cargar factura')
      navigate('/invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta factura?')) return

    try {
      await invoiceService.deleteInvoice(id)
      toast.success('Factura eliminada correctamente')
      navigate('/invoices')
    } catch (error) {
      toast.error('Error al eliminar factura')
    }
  }

  const handleGeneratePDF = async () => {
    try {
      await invoiceService.generatePDF(id)
      toast.success('PDF generado correctamente')
      loadInvoice()
    } catch (error) {
      toast.error('Error al generar PDF')
    }
  }

  const handleSendInvoice = async () => {
    try {
      await invoiceService.sendInvoice(id)
      toast.success('Factura enviada correctamente')
      loadInvoice()
    } catch (error) {
      toast.error('Error al enviar factura')
    }
  }

  const handleRegisterPayment = async (e) => {
    e.preventDefault()
    try {
      await invoiceService.registerPayment(id, paymentData)
      toast.success('Pago registrado correctamente')
      setShowPaymentModal(false)
      loadInvoice()
    } catch (error) {
      toast.error('Error al registrar pago')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge badge-gray',
      sent: 'badge badge-info',
      paid: 'badge badge-success',
      overdue: 'badge badge-danger',
      cancelled: 'badge badge-gray'
    }
    const labels = {
      draft: 'Borrador',
      sent: 'Enviada',
      paid: 'Pagada',
      overdue: 'Vencida',
      cancelled: 'Cancelada'
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  const getPaymentStatusBadge = (status) => {
    const badges = {
      unpaid: 'badge badge-danger',
      partial: 'badge badge-warning',
      paid: 'badge badge-success'
    }
    const labels = {
      unpaid: 'Sin Pagar',
      partial: 'Pago Parcial',
      paid: 'Pagada'
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  const getSunatStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-gray',
      sent: 'badge badge-info',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger'
    }
    const labels = {
      pending: 'Pendiente',
      sent: 'Enviada a SUNAT',
      accepted: 'Aceptada por SUNAT',
      rejected: 'Rechazada por SUNAT'
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando factura...</p>
        </div>
      </div>
    )
  }

  if (!invoice) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/invoices" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
            <p className="text-gray-600 mt-1 capitalize">{invoice.invoiceType}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {invoice.amountDue > 0 && invoice.paymentStatus !== 'paid' && (
            <button onClick={() => setShowPaymentModal(true)} className="btn btn-success">
              <FiDollarSign className="w-4 h-4 mr-2" />
              Registrar Pago
            </button>
          )}
          {invoice.pdfUrl && (
            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FiDownload className="w-4 h-4 mr-2" />
              Descargar PDF
            </a>
          )}
          {!invoice.pdfUrl && (
            <button onClick={handleGeneratePDF} className="btn btn-outline">
              <FiDownload className="w-4 h-4 mr-2" />
              Generar PDF
            </button>
          )}
          <button onClick={handleSendInvoice} className="btn btn-primary">
            <FiSend className="w-4 h-4 mr-2" />
            Enviar por Email
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <FiTrash2 className="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="card">
            <h3 className="card-header">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre/Razón Social</label>
                <p className="text-gray-900 mt-1">
                  {invoice.client?.firstName} {invoice.client?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 mt-1">{invoice.client?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Documento</label>
                <p className="text-gray-900 mt-1">
                  {invoice.client?.documentType}: {invoice.client?.documentNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-gray-900 mt-1">{invoice.client?.phone}</p>
              </div>
              {invoice.client?.address && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-gray-900 mt-1">{invoice.client?.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <h3 className="card-header">Items de la Factura</h3>
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
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
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
                    <span className="font-medium text-gray-900">S/ {invoice.subtotal?.toLocaleString()}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento ({invoice.discount}%):</span>
                      <span className="font-medium text-red-600">
                        - S/ {((invoice.subtotal * invoice.discount) / 100).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGV ({invoice.tax}%):</span>
                    <span className="font-medium text-gray-900">
                      S/ {(((invoice.subtotal * (100 - invoice.discount)) / 100) * invoice.tax / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-primary-600">S/ {invoice.total?.toLocaleString()}</span>
                  </div>
                  {invoice.amountPaid > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pagado:</span>
                      <span className="font-medium text-green-600">S/ {invoice.amountPaid?.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.amountDue > 0 && (
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Saldo Pendiente:</span>
                      <span className="text-red-600">S/ {invoice.amountDue?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="card">
              <h3 className="card-header">Historial de Pagos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transacción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(payment.date), "d 'de' MMMM, yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          S/ {payment.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {payment.paymentMethod === 'cash' && 'Efectivo'}
                          {payment.paymentMethod === 'transfer' && 'Transferencia'}
                          {payment.paymentMethod === 'card' && 'Tarjeta'}
                          {payment.paymentMethod === 'yape' && 'Yape'}
                          {payment.paymentMethod === 'plin' && 'Plin'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.transactionId || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{payment.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="card">
              <h3 className="card-header">Notas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="card-header">Estado</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado del Documento</label>
                <p className="text-gray-900 mt-1">{getStatusBadge(invoice.status)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado de Pago</label>
                <p className="text-gray-900 mt-1">{getPaymentStatusBadge(invoice.paymentStatus)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado SUNAT</label>
                <p className="text-gray-900 mt-1">{getSunatStatusBadge(invoice.sunatStatus)}</p>
              </div>
              {invoice.sunatResponse && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Respuesta SUNAT</label>
                  <p className="text-gray-900 mt-1 text-xs">{invoice.sunatResponse}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="card-header">Fechas</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Emisión</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(invoice.issueDate), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(invoice.dueDate), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
              {invoice.sentAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Enviada</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(invoice.sentAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
              {invoice.paidAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Pagada</label>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(invoice.paidAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {invoice.event && (
            <div className="card">
              <h3 className="card-header">Evento Relacionado</h3>
              <Link
                to={`/events/${invoice.event._id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{invoice.event.name}</p>
                <p className="text-xs text-gray-500">{invoice.event.eventType}</p>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Pago</h3>
            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto a Pagar *
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                  className="input"
                  min="0"
                  max={invoice.amountDue}
                  step="0.01"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Saldo pendiente: S/ {invoice.amountDue?.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="input"
                  required
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="card">Tarjeta</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Transacción
                </label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                  className="input"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Notas adicionales del pago"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success flex-1">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDetail
