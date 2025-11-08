import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiDollarSign, FiAlertCircle, FiTrendingUp, FiClock, FiEye, FiSend } from 'react-icons/fi'
import invoiceService from '../../services/invoiceService'
import { toast } from 'react-toastify'
import { format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

const AccountsReceivable = () => {
  const [accountsData, setAccountsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadAccountsReceivable()
  }, [])

  const loadAccountsReceivable = async () => {
    try {
      const response = await invoiceService.getAccountsReceivable()
      setAccountsData(response.data)
    } catch (error) {
      toast.error('Error al cargar cuentas por cobrar')
    } finally {
      setLoading(false)
    }
  }

  const handleSendReminder = async (invoiceId) => {
    try {
      await invoiceService.sendPaymentReminder(invoiceId)
      toast.success('Recordatorio enviado correctamente')
    } catch (error) {
      toast.error('Error al enviar recordatorio')
    }
  }

  const getDaysOverdue = (dueDate) => {
    const days = differenceInDays(new Date(), new Date(dueDate))
    return days > 0 ? days : 0
  }

  const getPriorityBadge = (dueDate) => {
    const daysOverdue = getDaysOverdue(dueDate)
    if (daysOverdue > 30) {
      return <span className="badge badge-danger">Urgente</span>
    } else if (daysOverdue > 15) {
      return <span className="badge badge-warning">Alta</span>
    } else if (daysOverdue > 0) {
      return <span className="badge badge-info">Media</span>
    }
    return <span className="badge badge-success">Normal</span>
  }

  const getFilteredInvoices = () => {
    if (!accountsData) return []

    const pendingInvoices = Array.isArray(accountsData.pendingInvoices) ? accountsData.pendingInvoices : []
    const overdueInvoices = Array.isArray(accountsData.overdueInvoices) ? accountsData.overdueInvoices : []

    let invoices = [...pendingInvoices, ...overdueInvoices]

    if (filterStatus === 'overdue') {
      invoices = overdueInvoices
    } else if (filterStatus === 'pending') {
      invoices = pendingInvoices.filter(inv =>
        !overdueInvoices.find(o => o._id === inv._id)
      )
    } else if (filterStatus === 'partial') {
      invoices = invoices.filter(inv => inv.paymentStatus === 'partial')
    }

    return invoices.sort((a, b) => {
      const daysA = getDaysOverdue(a.dueDate)
      const daysB = getDaysOverdue(b.dueDate)
      return daysB - daysA
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cuentas por cobrar...</p>
        </div>
      </div>
    )
  }

  if (!accountsData) return null

  const filteredInvoices = getFilteredInvoices()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/invoices" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cuentas por Cobrar</h1>
            <p className="text-gray-600 mt-1">Gestiona tus pagos pendientes</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total por Cobrar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                S/ {accountsData.totalPending?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                S/ {accountsData.totalOverdue?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accountsData.overdueInvoices?.length} facturas
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                S/ {(accountsData.totalPending - accountsData.totalOverdue)?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accountsData.pendingInvoices?.length - accountsData.overdueInvoices?.length} facturas
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cobrado Este Mes</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                S/ {accountsData.collectedThisMonth?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                +{accountsData.collectionGrowth?.toFixed(1)}% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Aging Report */}
      <div className="card">
        <h3 className="card-header">Antigüedad de Saldos</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Vigente</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              S/ {accountsData.aging?.current?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">0-15 días</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">1-30 días</p>
            <p className="text-xl font-bold text-yellow-600 mt-1">
              S/ {accountsData.aging?.days1to30?.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">31-60 días</p>
            <p className="text-xl font-bold text-orange-600 mt-1">
              S/ {accountsData.aging?.days31to60?.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">61-90 días</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              S/ {accountsData.aging?.days61to90?.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-gray-600">+90 días</p>
            <p className="text-xl font-bold text-red-700 mt-1">
              S/ {accountsData.aging?.over90?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Facturas por Cobrar</h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">Todas</option>
            <option value="overdue">Vencidas</option>
            <option value="pending">Pendientes</option>
            <option value="partial">Pago Parcial</option>
          </select>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay facturas por cobrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Vencido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const daysOverdue = getDaysOverdue(invoice.dueDate)
                  return (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.client?.firstName} {invoice.client?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        S/ {invoice.total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        S/ {invoice.amountPaid?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        S/ {invoice.amountDue?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {daysOverdue > 0 ? (
                          <span className="text-red-600 font-medium">{daysOverdue} días</span>
                        ) : (
                          <span className="text-green-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <Link
                          to={`/invoices/${invoice._id}`}
                          className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleSendReminder(invoice._id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center ml-2"
                          title="Enviar recordatorio"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    Total por Cobrar:
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">
                    S/ {filteredInvoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0).toLocaleString()}
                  </td>
                  <td colSpan="4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Top Debtors */}
      {accountsData.topDebtors && accountsData.topDebtors.length > 0 && (
        <div className="card">
          <h3 className="card-header">Principales Deudores</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facturas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Adeudado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accountsData.topDebtors.map((debtor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {debtor.firstName} {debtor.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {debtor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {debtor.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {debtor.invoiceCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      S/ {debtor.totalOwed?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collection Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Consejos para Cobranza</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Envía recordatorios automáticos 3 días antes del vencimiento</li>
                <li>Contacta personalmente a clientes con deudas mayores a 30 días</li>
                <li>Ofrece facilidades de pago para montos elevados</li>
                <li>Mantén un registro detallado de todas las comunicaciones</li>
                <li>Considera incentivos por pronto pago</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountsReceivable
