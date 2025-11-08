import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch, FiEye, FiSend, FiDownload } from 'react-icons/fi'
import quotationService from '../../services/quotationService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const QuotationList = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadQuotations()
  }, [statusFilter])

  const loadQuotations = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const response = await quotationService.getQuotations(params)
      setQuotations(response.data)
    } catch (error) {
      toast.error('Error al cargar cotizaciones')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge badge-gray',
      sent: 'badge badge-info',
      viewed: 'badge badge-warning',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger',
      expired: 'badge badge-gray'
    }
    const labels = {
      draft: 'Borrador',
      sent: 'Enviada',
      viewed: 'Vista',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
      expired: 'Expirada'
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cotizaciones</h1>
          <p className="text-gray-600 mt-1">Gestiona tus cotizaciones</p>
        </div>
        <Link to="/quotations/new" className="btn btn-primary inline-flex items-center justify-center">
          <FiPlus className="w-5 h-5 mr-2" />
          Nueva Cotización
        </Link>
      </div>

      <div className="card">
        <div className="mb-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input max-w-xs">
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="sent">Enviada</option>
            <option value="viewed">Vista</option>
            <option value="accepted">Aceptada</option>
            <option value="rejected">Rechazada</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotations.map((quotation) => (
                  <tr key={quotation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quotation.quotationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quotation.client?.firstName} {quotation.client?.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{quotation.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      S/ {quotation.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(quotation.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(quotation.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/quotations/${quotation._id}`}
                        className="inline-flex items-center justify-center p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <FiEye className="w-4 h-4" />
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

export default QuotationList
