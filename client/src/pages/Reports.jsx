import { useState, useEffect } from 'react'
import {
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import dashboardService from '../services/dashboardService'
import { toast } from 'react-toastify'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Reports = () => {
  const [dateRange, setDateRange] = useState('month') // week, month, year, custom
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [charts, setCharts] = useState(null)

  useEffect(() => {
    loadReportData()
  }, [dateRange, startDate, endDate])

  const loadReportData = async () => {
    try {
      setLoading(true)

      // Preparar parámetros según el rango de fecha seleccionado
      let params = {}
      if (startDate && endDate) {
        params = { startDate, endDate }
      } else if (dateRange === 'month') {
        params = { months: 1 }
      } else if (dateRange === 'year') {
        params = { months: 12 }
      } else if (dateRange === 'week') {
        params = { days: 7 }
      }

      const [metricsRes, chartsRes] = await Promise.all([
        dashboardService.getMetrics(params),
        dashboardService.getCharts({ months: 12 })
      ])

      setMetrics(metricsRes.data)
      setCharts(chartsRes.data)
    } catch (error) {
      toast.error('Error al cargar los reportes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Datos para gráfico de ingresos mensuales - usando data real del backend
  const revenueChartData = {
    labels: charts?.revenueByMonth?.map(d => d.month) || [],
    datasets: [
      {
        label: 'Ingresos',
        data: charts?.revenueByMonth?.map(d => d.revenue) || [],
        borderColor: 'rgb(255, 195, 0)',
        backgroundColor: 'rgba(255, 195, 0, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Datos para gráfico de eventos por mes - usando data real del backend
  const eventsChartData = {
    labels: charts?.eventsByMonth?.map(d => d.month) || [],
    datasets: [
      {
        label: 'Eventos',
        data: charts?.eventsByMonth?.map(d => d.events) || [],
        backgroundColor: 'rgba(255, 195, 0, 0.8)'
      }
    ]
  }

  // Datos para gráfico de fuentes de clientes - usando data real del backend
  const clientsSourceData = {
    labels: charts?.clientsBySource?.map(d => d._id) || [],
    datasets: [
      {
        data: charts?.clientsBySource?.map(d => d.count) || [],
        backgroundColor: [
          'rgba(255, 195, 0, 0.8)',
          'rgba(140, 120, 80, 0.8)',
          'rgba(66, 66, 66, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(76, 175, 80, 0.8)'
        ]
      }
    ]
  }

  // Configuración de opciones para gráficos
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'S/ ' + value.toLocaleString()
          }
        }
      }
    }
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'S/ ' + value.toLocaleString()
          }
        }
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  }

  // Función para exportar a PDF
  const exportToPDF = () => {
    alert('Exportando a PDF... (funcionalidad en desarrollo)')
    // Aquí integrarías una librería como jsPDF
  }

  // Función para exportar a Excel
  const exportToExcel = () => {
    alert('Exportando a Excel... (funcionalidad en desarrollo)')
    // Aquí integrarías una librería como xlsx
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">Análisis detallado de tu negocio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToPDF}
            className="btn btn-secondary"
          >
            <FiDownload className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={exportToExcel}
            className="btn btn-primary"
          >
            <FiDownload className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Este Mes
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Este Año
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
              placeholder="Desde"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
              placeholder="Hasta"
            />
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      {!loading && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ingresos Totales */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  S/ {(metrics.revenue?.thisMonth || 0).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Este período
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total de Eventos */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {metrics.events?.completedThisMonth || 0}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total de Clientes */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {metrics.clients?.total || 0}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Clientes activos
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Tasa de Conversión */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {metrics.quotations?.conversionRate || 0}%
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Cotizaciones a eventos
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos Principales */}
      {!loading && charts && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Ingresos Mensuales */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Últimos 12 meses</span>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={revenueChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Gráfico de Eventos por Mes */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Eventos por Mes</h3>
                <FiBarChart2 className="text-gray-400" />
              </div>
              <div style={{ height: '300px' }}>
                <Bar data={eventsChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          {/* Gráfico de Fuentes de Clientes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fuentes de Clientes</h3>
              <FiPieChart className="text-gray-400" />
            </div>
            <div style={{ height: '300px' }}>
              <Doughnut data={clientsSourceData} options={pieChartOptions} />
            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Reports
