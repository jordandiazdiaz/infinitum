const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Por favor ingrese el nombre'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Por favor ingrese el apellido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese un email'],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    required: [true, 'Por favor ingrese un teléfono']
  },
  whatsapp: String,
  documentType: {
    type: String,
    enum: ['DNI', 'RUC', 'Pasaporte', 'Carnet de Extranjería'],
    default: 'DNI'
  },
  documentNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Perú' },
    zipCode: String
  },
  status: {
    type: String,
    enum: ['lead', 'contacted', 'interested', 'proposal-sent', 'client', 'inactive'],
    default: 'lead'
  },
  source: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp', 'website', 'referral', 'other'],
    default: 'other'
  },
  tags: [String],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  interactions: [{
    type: {
      type: String,
      enum: ['call', 'email', 'whatsapp', 'meeting', 'other']
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar updatedAt antes de guardar
ClientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para obtener el nombre completo
ClientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Client', ClientSchema);
