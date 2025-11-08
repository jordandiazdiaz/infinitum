import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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
import dashboardService from '../services/dashboardService'
import { toast } from 'react-toastify'

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

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [charts, setCharts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [metricsRes, chartsRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getCharts({ months: 6 })
      ])

      setMetrics(metricsRes.data)
      setCharts(chartsRes.data)
    } catch (error) {
      // Don't show error toast for 401 (will redirect to login)
      if (error.response?.status !== 401) {
        toast.error('Error al cargar el dashboard')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, change, changeType, link }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <div className="flex items-center mt-2 space-x-1">
              {changeType === 'up' ? (
                <FiArrowUp className="text-green-500 w-4 h-4" />
              ) : (
                <FiArrowDown className="text-red-500 w-4 h-4" />
              )}
              <span className={`text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}%
              </span>
              <span className="text-sm text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      {link && (
        <Link to={link} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          Ver detalles →
        </Link>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Chart configurations
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido a tu panel de control de Infinitum</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clientes"
          value={metrics?.clients?.total || 0}
          icon={FiUsers}
          change={15}
          changeType="up"
          link="/clients"
        />
        <StatCard
          title="Eventos Este Mes"
          value={metrics?.events?.completedThisMonth || 0}
          icon={FiCalendar}
          change={8}
          changeType="up"
          link="/events"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`S/ ${(metrics?.revenue?.thisMonth || 0).toLocaleString()}`}
          icon={FiDollarSign}
          change={12}
          changeType="up"
          link="/invoices"
        />
        <StatCard
          title="Tasa de Conversión"
          value={`${metrics?.quotations?.conversionRate || 0}%`}
          icon={FiTrendingUp}
          change={5}
          changeType="up"
          link="/quotations"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="card-header">Ingresos por Mes</h3>
          <div className="h-80">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Events Chart */}
        <div className="card">
          <h3 className="card-header">Eventos por Mes</h3>
          <div className="h-80">
            <Bar data={eventsChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Sources */}
        <div className="card">
          <h3 className="card-header">Fuentes de Clientes</h3>
          <div className="h-64">
            <Doughnut data={clientsSourceData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card lg:col-span-2">
          <h3 className="card-header">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-4 border-b">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiDollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">Pago recibido</p>
                <p className="text-sm text-gray-500">Cliente: María González - S/ 5,000</p>
                <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-4 border-b">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">Nueva cotización creada</p>
                <p className="text-sm text-gray-500">Boda - 150 invitados</p>
                <p className="text-xs text-gray-400 mt-1">Hace 5 horas</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-4 border-b">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">Evento confirmado</p>
                <p className="text-sm text-gray-500">Graduación - 15 de Diciembre</p>
                <p className="text-xs text-gray-400 mt-1">Hace 1 día</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUsers className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">Nuevo cliente registrado</p>
                <p className="text-sm text-gray-500">Ana López - Chatbot WhatsApp</p>
                <p className="text-xs text-gray-400 mt-1">Hace 2 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="card-header">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/clients/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <FiUsers className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Nuevo Cliente</p>
          </Link>

          <Link
            to="/events/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <FiCalendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Nuevo Evento</p>
          </Link>

          <Link
            to="/quotations/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <FiFileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Nueva Cotización</p>
          </Link>

          <Link
            to="/invoices/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <FiDollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Nueva Factura</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
