const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del evento'],
    trim: true
  },
  eventType: {
    type: String,
    enum: ['Boda', 'Graduación', 'XV años', 'Bautizo', 'Primera Comunión', 'Cumpleaños', 'Aniversario', 'Corporativo', 'Otro'],
    required: [true, 'Por favor seleccione el tipo de evento']
  },
  date: {
    type: Date,
    required: [true, 'Por favor ingrese la fecha del evento']
  },
  time: {
    type: String,
    required: [true, 'Por favor ingrese la hora del evento']
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  location: {
    venueName: String,
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  numberOfGuests: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  services: [{
    name: String,
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number,
    provider: String
  }],
  budget: {
    estimated: Number,
    actual: Number,
    currency: {
      type: String,
      default: 'PEN'
    }
  },
  payments: [{
    amount: Number,
    date: Date,
    method: {
      type: String,
      enum: ['efectivo', 'transferencia', 'tarjeta', 'yape', 'plin']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    dueDate: Date,
    paidDate: Date,
    reference: String
  }],
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation'
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  tasks: [{
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
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
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  googleCalendarEventId: String,
  profitability: {
    totalIncome: Number,
    totalCosts: Number,
    netProfit: Number,
    profitMargin: Number
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
EventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calcular rentabilidad
EventSchema.methods.calculateProfitability = function() {
  const totalIncome = this.payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCosts = this.services
    .reduce((sum, s) => sum + (s.total || 0), 0);

  const netProfit = totalIncome - totalCosts;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  this.profitability = {
    totalIncome,
    totalCosts,
    netProfit,
    profitMargin
  };

  return this.profitability;
};

module.exports = mongoose.model('Event', EventSchema);
