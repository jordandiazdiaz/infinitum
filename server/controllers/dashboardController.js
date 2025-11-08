const Event = require('../models/Event');
const Client = require('../models/Client');
const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

// @desc    Obtener métricas del dashboard
// @route   GET /api/dashboard/metrics
// @access  Private
exports.getMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query; // month, quarter, year

    // Calcular fechas
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    // Total de clientes
    const totalClients = await Client.countDocuments({ user: userId });

    // Nuevos clientes este mes
    const newClients = await Client.countDocuments({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Total de eventos
    const totalEvents = await Event.countDocuments({ user: userId });

    // Eventos próximos (siguientes 30 días)
    const upcomingEvents = await Event.countDocuments({
      user: userId,
      date: { $gte: now, $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) }
    });

    // Eventos completados este mes
    const completedEvents = await Event.countDocuments({
      user: userId,
      status: 'completed',
      date: { $gte: startDate, $lte: endDate }
    });

    // Ingresos totales
    const invoices = await Invoice.find({
      user: userId,
      status: 'paid'
    });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

    // Ingresos este mes
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          user: userId,
          status: 'paid',
          issueDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Cotizaciones pendientes
    const pendingQuotations = await Quotation.countDocuments({
      user: userId,
      status: { $in: ['sent', 'viewed'] }
    });

    // Tasa de conversión
    const sentQuotations = await Quotation.countDocuments({
      user: userId,
      status: { $in: ['sent', 'viewed', 'accepted'] }
    });
    const acceptedQuotations = await Quotation.countDocuments({
      user: userId,
      status: 'accepted'
    });
    const conversionRate = sentQuotations > 0 ? (acceptedQuotations / sentQuotations) * 100 : 0;

    // Cuentas por cobrar
    const accountsReceivable = await Invoice.aggregate([
      {
        $match: {
          user: userId,
          paymentStatus: { $in: ['unpaid', 'partial'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Eventos por tipo
    const eventsByType = await Event.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Rentabilidad promedio
    const profitabilityData = await Event.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          'profitability.netProfit': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgProfitMargin: { $avg: '$profitability.profitMargin' },
          totalProfit: { $sum: '$profitability.netProfit' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        clients: {
          total: totalClients,
          newThisMonth: newClients
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          completedThisMonth: completedEvents
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthlyRevenue[0]?.total || 0
        },
        quotations: {
          pending: pendingQuotations,
          conversionRate: conversionRate.toFixed(2)
        },
        accountsReceivable: accountsReceivable[0]?.total || 0,
        eventsByType,
        profitability: {
          avgMargin: profitabilityData[0]?.avgProfitMargin.toFixed(2) || 0,
          totalProfit: profitabilityData[0]?.totalProfit || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener datos para gráficos
// @route   GET /api/dashboard/charts
// @access  Private
exports.getCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    // Generar array de meses
    const monthsArray = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      monthsArray.push({
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: format(date, 'MMM yyyy')
      });
    }

    // Ingresos por mes
    const revenueByMonth = await Promise.all(
      monthsArray.map(async (month) => {
        const result = await Invoice.aggregate([
          {
            $match: {
              user: userId,
              status: 'paid',
              issueDate: { $gte: month.start, $lte: month.end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' }
            }
          }
        ]);
        return {
          month: month.label,
          revenue: result[0]?.total || 0
        };
      })
    );

    // Eventos por mes
    const eventsByMonth = await Promise.all(
      monthsArray.map(async (month) => {
        const count = await Event.countDocuments({
          user: userId,
          createdAt: { $gte: month.start, $lte: month.end }
        });
        return {
          month: month.label,
          events: count
        };
      })
    );

    // Clientes nuevos por mes
    const clientsByMonth = await Promise.all(
      monthsArray.map(async (month) => {
        const count = await Client.countDocuments({
          user: userId,
          createdAt: { $gte: month.start, $lte: month.end }
        });
        return {
          month: month.label,
          clients: count
        };
      })
    );

    // Distribución de estado de clientes
    const clientsByStatus = await Client.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Fuentes de clientes
    const clientsBySource = await Client.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueByMonth,
        eventsByMonth,
        clientsByMonth,
        clientsByStatus,
        clientsBySource
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener análisis de rentabilidad
// @route   GET /api/dashboard/profitability
// @access  Private
exports.getProfitabilityAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    // Eventos con rentabilidad calculada
    const events = await Event.find({
      user: userId,
      status: 'completed',
      'profitability.netProfit': { $exists: true }
    })
      .populate('client', 'firstName lastName')
      .select('name eventType date profitability')
      .sort({ 'profitability.profitMargin': -1 });

    // Rentabilidad por tipo de evento
    const profitabilityByType = await Event.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          'profitability.netProfit': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$eventType',
          avgMargin: { $avg: '$profitability.profitMargin' },
          totalProfit: { $sum: '$profitability.netProfit' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgMargin: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        events,
        byType: profitabilityByType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
