import api from './api'

class CalendarService {
  async getAuthUrl() {
    const response = await api.get('/calendar/auth-url')
    return response.data
  }

  async handleCallback(code) {
    const response = await api.post('/calendar/callback', { code })
    return response.data
  }

  async syncEvent(eventId) {
    const response = await api.post(`/calendar/sync/${eventId}`)
    return response.data
  }

  async getCalendarEvents(params = {}) {
    const response = await api.get('/calendar/events', { params })
    return response.data
  }

  async disconnectCalendar() {
    const response = await api.delete('/calendar/disconnect')
    return response.data
  }
}

export default new CalendarService()
