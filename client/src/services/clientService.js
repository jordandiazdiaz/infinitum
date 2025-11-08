import api from './api'

class ClientService {
  async getClients(params = {}) {
    const response = await api.get('/clients', { params })
    return response.data
  }

  async getClient(id) {
    const response = await api.get(`/clients/${id}`)
    return response.data
  }

  async createClient(data) {
    const response = await api.post('/clients', data)
    return response.data
  }

  async updateClient(id, data) {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  }

  async deleteClient(id) {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  }

  async addNote(id, note) {
    const response = await api.post(`/clients/${id}/notes`, { content: note })
    return response.data
  }

  async addInteraction(id, interaction) {
    const response = await api.post(`/clients/${id}/interactions`, interaction)
    return response.data
  }
}

export default new ClientService()
