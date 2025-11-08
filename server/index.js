const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const eventRoutes = require('./routes/events');
const quotationRoutes = require('./routes/quotations');
const invoiceRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');
const chatbotRoutes = require('./routes/chatbot');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notifications');

// Inicializar app
const app = express();

// Middleware de seguridad
app.use(helmet());

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware de compresión
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Archivos estáticos
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🎉 SEVEM API - Transforma tus eventos sociales',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clients: '/api/clients',
      events: '/api/events',
      quotations: '/api/quotations',
      invoices: '/api/invoices',
      dashboard: '/api/dashboard',
      chatbot: '/api/chatbot',
      calendar: '/api/calendar'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║     🎉 SEVEM - Plataforma de Eventos 🎉      ║
  ║                                               ║
  ║     Servidor corriendo en puerto ${PORT}        ║
  ║     Modo: ${process.env.NODE_ENV || 'development'}                    ║
  ║                                               ║
  ║     Transforma tus eventos sociales           ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
