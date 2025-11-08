const Invoice = require('../models/Invoice');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');

// @desc    Obtener todas las facturas
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
  try {
    const { status, paymentStatus, clientId, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (clientId) query.client = clientId;

    const invoices = await Invoice.find(query)
      .populate('client', 'firstName lastName email phone documentNumber')
      .populate('event', 'name eventType date')
      .sort({ issueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Invoice.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener una factura
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('event')
      .populate('user', 'name email company');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    if (invoice.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear factura
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const invoice = await Invoice.create(req.body);

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar factura
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Eliminar factura
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Generar PDF de factura
// @route   POST /api/invoices/:id/generate-pdf
// @access  Private
exports.generatePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('user');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    const pdfUrl = await pdfService.generateInvoicePDF(invoice, invoice.user);

    invoice.pdfUrl = pdfUrl;
    await invoice.save();

    res.status(200).json({
      success: true,
      data: { pdfUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Enviar factura por email
// @route   POST /api/invoices/:id/send
// @access  Private
exports.sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('user');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    // Generar PDF si no existe
    if (!invoice.pdfUrl) {
      const pdfUrl = await pdfService.generateInvoicePDF(invoice, invoice.user);
      invoice.pdfUrl = pdfUrl;
    }

    // Enviar email
    await emailService.sendInvoiceEmail(invoice);

    invoice.sentToClient = true;
    invoice.sentDate = new Date();
    invoice.status = 'sent';
    await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Factura enviada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Registrar pago en factura
// @route   POST /api/invoices/:id/payments
// @access  Private
exports.addPayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    invoice.payments.push(req.body);
    await invoice.save();

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener cuentas por cobrar
// @route   GET /api/invoices/accounts-receivable
// @access  Private
exports.getAccountsReceivable = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      user: req.user.id,
      paymentStatus: { $in: ['unpaid', 'partial'] }
    })
      .populate('client', 'firstName lastName email phone')
      .populate('event', 'name eventType')
      .sort({ dueDate: 1 });

    const total = invoices.reduce((sum, inv) => {
      const paid = inv.payments.reduce((p, payment) => p + payment.amount, 0);
      return sum + (inv.total - paid);
    }, 0);

    const overdue = invoices.filter(inv => new Date(inv.dueDate) < new Date()).length;

    res.status(200).json({
      success: true,
      data: {
        invoices,
        summary: {
          total,
          count: invoices.length,
          overdue
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
