const Client = require('../models/Client');

// @desc    Obtener todos los clientes
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const { status, source, search, page = 1, limit = 10 } = req.query;

    // Construir query
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener un cliente
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name')
      .populate('interactions.createdBy', 'name');

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    // Verificar que el cliente pertenece al usuario
    if (client.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para ver este cliente'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Crear cliente
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Actualizar cliente
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    // Verificar que el cliente pertenece al usuario
    if (client.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para actualizar este cliente'
      });
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Eliminar cliente
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    // Verificar que el cliente pertenece al usuario
    if (client.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para eliminar este cliente'
      });
    }

    await client.deleteOne();

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

// @desc    Agregar nota a cliente
// @route   POST /api/clients/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    client.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });

    await client.save();

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Agregar interacción a cliente
// @route   POST /api/clients/:id/interactions
// @access  Private
exports.addInteraction = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    client.interactions.push({
      type: req.body.type,
      description: req.body.description,
      createdBy: req.user.id
    });

    await client.save();

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
