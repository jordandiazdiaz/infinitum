import api from './api'

class QuotationService {
  async getQuotations(params = {}) {
    const response = await api.get('/quotations', { params })
    return response.data
  }

  async getQuotation(id) {
    const response = await api.get(`/quotations/${id}`)
    return response.data
  }

  async createQuotation(data) {
    const response = await api.post('/quotations', data)
    return response.data
  }

  async updateQuotation(id, data) {
    const response = await api.put(`/quotations/${id}`, data)
    return response.data
  }

  async deleteQuotation(id) {
    const response = await api.delete(`/quotations/${id}`)
    return response.data
  }

  async generatePDF(id) {
    const response = await api.post(`/quotations/${id}/generate-pdf`)
    return response.data
  }

  async sendQuotation(id) {
    const response = await api.post(`/quotations/${id}/send`)
    return response.data
  }
}

export default new QuotationService()
