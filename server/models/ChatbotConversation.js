const mongoose = require('mongoose');

const ChatbotConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  platform: {
    type: String,
    enum: ['whatsapp', 'facebook', 'instagram'],
    required: true
  },
  platformUserId: {
    type: String,
    required: true
  },
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  status: {
    type: String,
    enum: ['active', 'closed', 'archived'],
    default: 'active'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['bot', 'client', 'agent'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'document', 'audio', 'button', 'template'],
      default: 'text'
    },
    mediaUrl: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    },
    delivered: {
      type: Boolean,
      default: false
    }
  }],
  intent: {
    type: String,
    enum: ['consulta_general', 'cotizacion', 'disponibilidad', 'precios', 'servicios', 'otro']
  },
  capturedData: {
    eventType: String,
    eventDate: Date,
    numberOfGuests: Number,
    budget: Number,
    location: String,
    interests: [String]
  },
  leadQuality: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar lastMessageAt cuando se agrega un mensaje
ChatbotConversationSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  this.updatedAt = Date.now();
  next();
});

// Índices para búsqueda rápida
ChatbotConversationSchema.index({ platformUserId: 1, platform: 1 });
ChatbotConversationSchema.index({ user: 1, status: 1 });
ChatbotConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('ChatbotConversation', ChatbotConversationSchema);
