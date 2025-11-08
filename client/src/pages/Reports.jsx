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

  // Datos simulados (en producción vendrían del backend)
  const [reportData, setReportData] = useState({
    totalRevenue: 125500,
    totalEvents: 48,
    totalClients: 156,
    averageEventValue: 2615,
    revenueGrowth: 23.5,
    eventsGrowth: 15.2,
    clientsGrowth: 18.7
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 1000)
  }, [dateRange, startDate, endDate])

  // Datos para gráfico de ingresos mensuales
  const revenueChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ingresos 2025',
        data: [8500, 12000, 15000, 18500, 22000, 19500, 25000, 28000, 23500, 26000, 29000, 31500],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Ingresos 2024',
        data: [7000, 9500, 11000, 14000, 16500, 15000, 18000, 20000, 17500, 19000, 21000, 23000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  }

  // Datos para gráfico de eventos por tipo
  const eventTypeChartData = {
    labels: ['Bodas', 'XV Años', 'Cumpleaños', 'Corporativos', 'Baby Shower', 'Otros'],
    datasets: [
      {
        label: 'Eventos por Tipo',
        data: [25, 12, 8, 5, 4, 6],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
          'rgb(107, 114, 128)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Datos para gráfico de ingresos por tipo
  const revenueByTypeChartData = {
    labels: ['Bodas', 'XV Años', 'Cumpleaños', 'Corporativos', 'Baby Shower', 'Otros'],
    datasets: [
      {
        label: 'Ingresos por Tipo (S/)',
        data: [85000, 28000, 15000, 22000, 8000, 12000],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ingresos Totales */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                S/ {reportData.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +{reportData.revenueGrowth}% vs mes anterior
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
                {reportData.totalEvents}
              </h3>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +{reportData.eventsGrowth}% vs mes anterior
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
                {reportData.totalClients}
              </h3>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +{reportData.clientsGrowth}% vs mes anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Valor Promedio por Evento */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                S/ {reportData.averageEventValue.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Por evento
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos Mensuales */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Comparación anual</span>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={revenueChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Gráfico de Eventos por Tipo */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Eventos por Tipo</h3>
            <FiPieChart className="text-gray-400" />
          </div>
          <div style={{ height: '300px' }}>
            <Doughnut data={eventTypeChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Gráfico de Ingresos por Tipo */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ingresos por Tipo de Evento</h3>
          <span className="text-sm text-gray-500">En Soles (S/)</span>
        </div>
        <div style={{ height: '300px' }}>
          <Bar data={revenueByTypeChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Top Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mejores Clientes */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejores Clientes</h3>
          <div className="space-y-4">
            {[
              { name: 'María González', events: 5, revenue: 45000 },
              { name: 'Juan Pérez', events: 3, revenue: 28000 },
              { name: 'Ana Torres', events: 4, revenue: 24500 },
              { name: 'Carlos Ramírez', events: 2, revenue: 18000 },
              { name: 'Lucía Fernández', events: 3, revenue: 15500 }
            ].map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.events} eventos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">S/ {client.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eventos Más Rentables */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Más Rentables</h3>
          <div className="space-y-4">
            {[
              { name: 'Boda María & Juan', date: '15 Mar 2025', revenue: 18500, type: 'Boda' },
              { name: 'XV Años Sofía', date: '22 Feb 2025', revenue: 12000, type: 'XV Años' },
              { name: 'Evento Corporativo Tech', date: '10 Abr 2025', revenue: 15000, type: 'Corporativo' },
              { name: 'Boda Ana & Carlos', date: '5 May 2025', revenue: 19800, type: 'Boda' },
              { name: 'Cumpleaños Roberto', date: '18 Mar 2025', revenue: 8500, type: 'Cumpleaños' }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">S/ {event.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasa de Conversión */}
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Tasa de Conversión</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">68%</span>
            <span className="text-sm text-green-600">+5% vs anterior</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Cotizaciones → Eventos confirmados</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Ticket Promedio</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">S/ 2,615</span>
            <span className="text-sm text-green-600">+12%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Valor promedio por evento</p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mínimo: S/ 800</span>
              <span>Máximo: S/ 19,800</span>
            </div>
          </div>
        </div>

        {/* Clientes Recurrentes */}
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Clientes Recurrentes</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">42%</span>
            <span className="text-sm text-green-600">+8%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Clientes con 2+ eventos</p>
          <div className="mt-4 flex gap-2">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Nuevos</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Recurrentes</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
