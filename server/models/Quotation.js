const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
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
  quotationNumber: {
    type: String,
    unique: true,
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  eventDate: Date,
  numberOfGuests: Number,
  items: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    total: Number
  }],
  subtotal: Number,
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 18 // IGV en Perú
  },
  total: Number,
  currency: {
    type: String,
    default: 'PEN',
    enum: ['PEN', 'USD']
  },
  validUntil: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  terms: {
    type: String,
    default: 'Válido por 15 días. Se requiere adelanto del 50% para confirmar la reserva.'
  },
  notes: String,
  pdfUrl: String,
  sentAt: Date,
  viewedAt: Date,
  respondedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generar número de cotización automático
QuotationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Quotation').countDocuments();
    const year = new Date().getFullYear();
    this.quotationNumber = `C${year}-${String(count + 1).padStart(6, '0')}`;
  }

  this.updatedAt = Date.now();
  next();
});

// Calcular totales antes de guardar
QuotationSchema.pre('save', function(next) {
  // Calcular total de cada item
  this.items.forEach(item => {
    const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
    item.total = (item.unitPrice * item.quantity) - discountAmount;
  });

  // Calcular subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Aplicar descuento general
  const discountAmount = (this.subtotal * this.discount) / 100;
  const subtotalWithDiscount = this.subtotal - discountAmount;

  // Calcular impuesto
  const taxAmount = (subtotalWithDiscount * this.tax) / 100;

  // Calcular total final
  this.total = subtotalWithDiscount + taxAmount;

  next();
});

module.exports = mongoose.model('Quotation', QuotationSchema);
