const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
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
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  invoiceType: {
    type: String,
    enum: ['factura', 'boleta'],
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  series: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    description: {
      type: String,
      required: true
    },
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
      default: 0
    },
    taxRate: {
      type: Number,
      default: 18
    },
    total: Number
  }],
  subtotal: Number,
  taxAmount: Number,
  discountAmount: Number,
  total: Number,
  currency: {
    type: String,
    default: 'PEN',
    enum: ['PEN', 'USD']
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'transferencia', 'tarjeta', 'yape', 'plin', 'cheque']
  },
  payments: [{
    amount: Number,
    date: Date,
    method: String,
    reference: String,
    notes: String
  }],
  // Datos para facturación electrónica SUNAT
  sunat: {
    cdr: String, // Constancia de Recepción
    hash: String,
    qrCode: String,
    xmlUrl: String,
    cdrUrl: String,
    sentToSunat: {
      type: Boolean,
      default: false
    },
    sentDate: Date,
    sunatResponse: String,
    sunatStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'voided'],
      default: 'pending'
    }
  },
  pdfUrl: String,
  xmlUrl: String,
  notes: String,
  sentToClient: {
    type: Boolean,
    default: false
  },
  sentDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generar número de factura automático
InvoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const invoiceType = this.invoiceType === 'factura' ? 'F' : 'B';
    this.series = this.series || `${invoiceType}001`;

    const count = await mongoose.model('Invoice').countDocuments({
      invoiceType: this.invoiceType,
      series: this.series
    });

    this.invoiceNumber = `${this.series}-${String(count + 1).padStart(8, '0')}`;
  }

  this.updatedAt = Date.now();
  next();
});

// Calcular totales antes de guardar
InvoiceSchema.pre('save', function(next) {
  // Calcular total de cada item
  this.items.forEach(item => {
    const subtotal = item.unitPrice * item.quantity;
    const discountAmount = (subtotal * item.discount) / 100;
    const subtotalWithDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalWithDiscount * item.taxRate) / 100;
    item.total = subtotalWithDiscount + taxAmount;
  });

  // Calcular subtotal (sin impuestos)
  this.subtotal = this.items.reduce((sum, item) => {
    const subtotal = item.unitPrice * item.quantity;
    const discountAmount = (subtotal * item.discount) / 100;
    return sum + (subtotal - discountAmount);
  }, 0);

  // Calcular descuento total
  this.discountAmount = this.items.reduce((sum, item) => {
    const subtotal = item.unitPrice * item.quantity;
    return sum + ((subtotal * item.discount) / 100);
  }, 0);

  // Calcular impuestos
  this.taxAmount = (this.subtotal * 18) / 100; // IGV 18%

  // Calcular total final
  this.total = this.subtotal + this.taxAmount;

  // Actualizar estado de pago
  const totalPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  if (totalPaid === 0) {
    this.paymentStatus = 'unpaid';
  } else if (totalPaid < this.total) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'paid';
    this.status = 'paid';
  }

  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
