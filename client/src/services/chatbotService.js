import api from './api'

class ChatbotService {
  async initialize() {
    const response = await api.post('/chatbot/initialize')
    return response.data
  }

  async getQRCode() {
    const response = await api.get('/chatbot/qr')
    return response.data
  }

  async connect() {
    const response = await api.post('/chatbot/connect')
    return response.data
  }

  async disconnect() {
    const response = await api.post('/chatbot/disconnect')
    return response.data
  }

  async getStatus() {
    const response = await api.get('/chatbot/status')
    return response.data
  }

  async getConversations(params = {}) {
    const response = await api.get('/chatbot/conversations', { params })
    return response.data
  }

  async getConversation(id) {
    const response = await api.get(`/chatbot/conversations/${id}`)
    return response.data
  }

  async sendMessage(data) {
    const response = await api.post('/chatbot/send', data)
    return response.data
  }

  async convertToClient(id, clientData) {
    const response = await api.post(`/chatbot/conversations/${id}/convert`, clientData)
    return response.data
  }

  async assignConversation(id, userId) {
    const response = await api.put(`/chatbot/conversations/${id}/assign`, { userId })
    return response.data
  }

  async closeConversation(id) {
    const response = await api.put(`/chatbot/conversations/${id}/close`)
    return response.data
  }

  async getStats() {
    const response = await api.get('/chatbot/stats')
    return response.data
  }
}

export default new ChatbotService()
