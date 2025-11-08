import api from './api'

class InvoiceService {
  async getInvoices(params = {}) {
    const response = await api.get('/invoices', { params })
    return response.data
  }

  async getInvoice(id) {
    const response = await api.get(`/invoices/${id}`)
    return response.data
  }

  async createInvoice(data) {
    const response = await api.post('/invoices', data)
    return response.data
  }

  async updateInvoice(id, data) {
    const response = await api.put(`/invoices/${id}`, data)
    return response.data
  }

  async deleteInvoice(id) {
    const response = await api.delete(`/invoices/${id}`)
    return response.data
  }

  async generatePDF(id) {
    const response = await api.post(`/invoices/${id}/generate-pdf`)
    return response.data
  }

  async sendInvoice(id) {
    const response = await api.post(`/invoices/${id}/send`)
    return response.data
  }

  async addPayment(id, payment) {
    const response = await api.post(`/invoices/${id}/payments`, payment)
    return response.data
  }

  async getAccountsReceivable() {
    const response = await api.get('/invoices/accounts-receivable')
    return response.data
  }
}

export default new InvoiceService()
