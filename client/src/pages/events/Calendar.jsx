import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import calendarService from '../../services/calendarService'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)

      const response = await calendarService.getCalendarEvents({
        startDate: start.toISOString(),
        endDate: end.toISOString()
      })

      setEvents(response.data)
    } catch (error) {
      toast.error('Error al cargar eventos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // 0 = Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return isSameDay(eventDate, day)
    })
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const today = () => {
    setCurrentDate(new Date())
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      'in-progress': 'bg-blue-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const days = getDaysInMonth()
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600 mt-1">Visualiza todos tus eventos</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/events" className="btn btn-outline inline-flex items-center justify-center">
            Ver Lista
          </Link>
          <Link to="/events/new" className="btn btn-primary inline-flex items-center justify-center">
            <FiPlus className="w-5 h-5 mr-2" />
            Nuevo Evento
          </Link>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={previousMonth} className="btn btn-outline p-2 inline-flex items-center justify-center">
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={today} className="btn btn-outline px-4 inline-flex items-center justify-center">
              Hoy
            </button>
            <button onClick={nextMonth} className="btn btn-outline p-2 inline-flex items-center justify-center">
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando calendario...</p>
          </div>
        ) : (
          <div>
            {/* Week Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
              {weekDays.map((day) => (
                <div key={day} className="bg-gray-50 py-2 text-center">
                  <span className="text-sm font-semibold text-gray-700">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
              {days.map((day, dayIdx) => {
                const dayEvents = getEventsForDay(day)
                const isToday = isSameDay(day, new Date())
                const isCurrentMonth = isSameMonth(day, currentDate)

                return (
                  <div
                    key={day.toString()}
                    className={`min-h-[120px] bg-white p-2 ${
                      !isCurrentMonth ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isToday
                            ? 'flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full'
                            : isCurrentMonth
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>

                    {/* Events for this day */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          className="block"
                        >
                          <div className={`text-xs p-1 rounded ${getStatusColor(event.status)} bg-opacity-10 border-l-2 border-${getStatusColor(event.status).replace('bg-', '')}`}>
                            <p className="font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                            {event.client && (
                              <p className="text-gray-600 truncate">{event.client}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 3} más
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Leyenda</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">En Progreso</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-600">Completado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
