import api from './api'

class EventService {
  async getEvents(params = {}) {
    const response = await api.get('/events', { params })
    return response.data
  }

  async getEvent(id) {
    const response = await api.get(`/events/${id}`)
    return response.data
  }

  async createEvent(data) {
    const response = await api.post('/events', data)
    return response.data
  }

  async updateEvent(id, data) {
    const response = await api.put(`/events/${id}`, data)
    return response.data
  }

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`)
    return response.data
  }

  async calculateProfitability(id) {
    const response = await api.post(`/events/${id}/calculate-profitability`)
    return response.data
  }

  async addPayment(id, payment) {
    const response = await api.post(`/events/${id}/payments`, payment)
    return response.data
  }

  async addTask(id, task) {
    const response = await api.post(`/events/${id}/tasks`, task)
    return response.data
  }

  async updateTask(id, taskId, task) {
    const response = await api.put(`/events/${id}/tasks/${taskId}`, task)
    return response.data
  }
}

export default new EventService()
