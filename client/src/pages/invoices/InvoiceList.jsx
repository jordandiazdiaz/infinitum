import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch, FiEye, FiDollarSign } from 'react-icons/fi'
import invoiceService from '../../services/invoiceService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')

  useEffect(() => {
    loadInvoices()
  }, [statusFilter, paymentStatusFilter])

  const loadInvoices = async () => {
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter

      const response = await invoiceService.getInvoices(params)
      setInvoices(response.data)
    } catch (error) {
      toast.error('Error al cargar facturas')
    } finally {
      setLoading(false)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturas y Boletas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus comprobantes electrónicos</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/accounts-receivable" className="btn btn-outline">
            <FiDollarSign className="w-5 h-5 mr-2" />
            Cuentas por Cobrar
          </Link>
          <Link to="/invoices/new" className="btn btn-primary">
            <FiPlus className="w-5 h-5 mr-2" />
            Nueva Factura
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="sent">Enviada</option>
            <option value="paid">Pagada</option>
            <option value="overdue">Vencida</option>
          </select>

          <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} className="input">
            <option value="">Todos los pagos</option>
            <option value="unpaid">Sin Pagar</option>
            <option value="partial">Pago Parcial</option>
            <option value="paid">Pagada</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {invoice.invoiceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.client?.firstName} {invoice.client?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      S/ {invoice.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPaymentStatusBadge(invoice.paymentStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.issueDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link to={`/invoices/${invoice._id}`} className="text-primary-600 hover:text-primary-900">
                        <FiEye className="inline w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceList
