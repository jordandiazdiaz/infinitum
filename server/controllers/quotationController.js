const Quotation = require('../models/Quotation');
const Client = require('../models/Client');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');

// @desc    Obtener todas las cotizaciones
// @route   GET /api/quotations
// @access  Private
exports.getQuotations = async (req, res) => {
  try {
    const { status, clientId, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (clientId) query.client = clientId;

    const quotations = await Quotation.find(query)
      .populate('client', 'firstName lastName email phone')
      .populate('event', 'name eventType date')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Quotation.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: quotations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener una cotización
// @route   GET /api/quotations/:id
// @access  Private
exports.getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('client')
      .populate('event');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    if (quotation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    res.status(200).json({
      success: true,
      data: quotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear cotización
// @route   POST /api/quotations
// @access  Private
exports.createQuotation = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Validar que el cliente existe
    const client = await Client.findById(req.body.client);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    const quotation = await Quotation.create(req.body);

    res.status(201).json({
      success: true,
      data: quotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar cotización
// @route   PUT /api/quotations/:id
// @access  Private
exports.updateQuotation = async (req, res) => {
  try {
    let quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    if (quotation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: quotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Eliminar cotización
// @route   DELETE /api/quotations/:id
// @access  Private
exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    if (quotation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    await quotation.deleteOne();

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

// @desc    Generar PDF de cotización
// @route   POST /api/quotations/:id/generate-pdf
// @access  Private
exports.generatePDF = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('client')
      .populate('user');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    if (quotation.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    const pdfUrl = await pdfService.generateQuotationPDF(quotation, quotation.user);

    quotation.pdfUrl = pdfUrl;
    await quotation.save();

    res.status(200).json({
      success: true,
      data: {
        pdfUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Enviar cotización por email
// @route   POST /api/quotations/:id/send
// @access  Private
exports.sendQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('client')
      .populate('user');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Cotización no encontrada'
      });
    }

    if (quotation.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    // Generar PDF si no existe
    if (!quotation.pdfUrl) {
      const pdfUrl = await pdfService.generateQuotationPDF(quotation, quotation.user);
      quotation.pdfUrl = pdfUrl;
    }

    // Enviar email
    await emailService.sendQuotationEmail(quotation);

    quotation.status = 'sent';
    quotation.sentAt = new Date();
    await quotation.save();

    res.status(200).json({
      success: true,
      message: 'Cotización enviada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
