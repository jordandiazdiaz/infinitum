const User = require('../models/User');
const Event = require('../models/Event');
const googleCalendarService = require('../services/googleCalendarService');

// @desc    Obtener URL de autorización de Google
// @route   GET /api/calendar/auth-url
// @access  Private
exports.getAuthUrl = async (req, res) => {
  try {
    const authUrl = googleCalendarService.getAuthUrl();

    res.status(200).json({
      success: true,
      data: { authUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Callback de autorización de Google
// @route   POST /api/calendar/callback
// @access  Private
exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    const tokens = await googleCalendarService.getTokens(code);

    // Guardar tokens en el usuario
    await User.findByIdAndUpdate(req.user.id, {
      'googleCalendar.accessToken': tokens.access_token,
      'googleCalendar.refreshToken': tokens.refresh_token
    });

    res.status(200).json({
      success: true,
      message: 'Google Calendar conectado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Sincronizar evento con Google Calendar
// @route   POST /api/calendar/sync/:eventId
// @access  Private
exports.syncEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('client');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.googleCalendar?.accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Google Calendar no está conectado. Por favor autoriza primero.'
      });
    }

    let googleEventId;

    if (event.googleCalendarEventId) {
      // Actualizar evento existente
      await googleCalendarService.updateEvent(event.googleCalendarEventId, event, user);
      googleEventId = event.googleCalendarEventId;
    } else {
      // Crear nuevo evento
      googleEventId = await googleCalendarService.createEvent(event, user);
      event.googleCalendarEventId = googleEventId;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Evento sincronizado con Google Calendar',
      data: { googleEventId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Obtener eventos del calendario
// @route   GET /api/calendar/events
// @access  Private
exports.getCalendarEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Obtener eventos de la base de datos
    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query)
      .populate('client', 'firstName lastName')
      .select('name eventType date time location status numberOfGuests')
      .sort({ date: 1 });

    // Formatear eventos para el calendario
    const calendarEvents = events.map(event => ({
      id: event._id,
      title: event.name,
      start: new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`),
      end: new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`),
      type: event.eventType,
      status: event.status,
      client: event.client ? `${event.client.firstName} ${event.client.lastName}` : '',
      location: event.location?.venueName || '',
      guests: event.numberOfGuests,
      backgroundColor: getEventColor(event.status),
      borderColor: getEventColor(event.status)
    }));

    res.status(200).json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Desconectar Google Calendar
// @route   DELETE /api/calendar/disconnect
// @access  Private
exports.disconnectCalendar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { googleCalendar: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Google Calendar desconectado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Función auxiliar para obtener color según estado
function getEventColor(status) {
  const colors = {
    pending: '#FFC107',
    confirmed: '#4CAF50',
    'in-progress': '#2196F3',
    completed: '#9E9E9E',
    cancelled: '#F44336'
  };
  return colors[status] || '#757575';
}
