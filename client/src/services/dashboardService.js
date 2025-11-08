import api from './api'

class DashboardService {
  async getMetrics(params = {}) {
    const response = await api.get('/dashboard/metrics', { params })
    return response.data
  }

  async getCharts(params = {}) {
    const response = await api.get('/dashboard/charts', { params })
    return response.data
  }

  async getProfitabilityAnalysis() {
    const response = await api.get('/dashboard/profitability')
    return response.data
  }
}

export default new DashboardService()
