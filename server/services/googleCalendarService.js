const { google } = require('googleapis');

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = null;
  }

  // Configurar cliente OAuth2
  getOAuth2Client() {
    if (!this.oauth2Client) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
    }
    return this.oauth2Client;
  }

  // Obtener URL de autorización
  getAuthUrl() {
    const oauth2Client = this.getOAuth2Client();

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Obtener tokens desde código de autorización
  async getTokens(code) {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  // Establecer credenciales
  setCredentials(tokens) {
    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials(tokens);
  }

  // Crear evento en Google Calendar
  async createEvent(event, user) {
    try {
      // Configurar credenciales del usuario
      this.setCredentials({
        access_token: user.googleCalendar.accessToken,
        refresh_token: user.googleCalendar.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: this.getOAuth2Client() });

      // Construir objeto de evento
      const eventDate = new Date(event.date);
      const [hours, minutes] = event.time.split(':');
      eventDate.setHours(parseInt(hours), parseInt(minutes));

      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + (event.duration?.hours || 4));

      const calendarEvent = {
        summary: event.name,
        description: `Tipo de Evento: ${event.eventType}\nCliente: ${event.client.firstName} ${event.client.lastName}\nInvitados: ${event.numberOfGuests || 'N/A'}`,
        location: event.location?.address || '',
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: user.preferences?.timezone || 'America/Lima'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: user.preferences?.timezone || 'America/Lima'
        },
        attendees: [
          { email: event.client.email }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 60 } // 1 hora antes
          ]
        }
      };

      const response = await calendar.events.insert({
        calendarId: user.googleCalendar.calendarId || 'primary',
        resource: calendarEvent,
        sendUpdates: 'all'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creando evento en Google Calendar:', error);
      throw error;
    }
  }

  // Actualizar evento en Google Calendar
  async updateEvent(eventId, event, user) {
    try {
      this.setCredentials({
        access_token: user.googleCalendar.accessToken,
        refresh_token: user.googleCalendar.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: this.getOAuth2Client() });

      const eventDate = new Date(event.date);
      const [hours, minutes] = event.time.split(':');
      eventDate.setHours(parseInt(hours), parseInt(minutes));

      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + (event.duration?.hours || 4));

      const calendarEvent = {
        summary: event.name,
        description: `Tipo de Evento: ${event.eventType}\nCliente: ${event.client.firstName} ${event.client.lastName}\nInvitados: ${event.numberOfGuests || 'N/A'}`,
        location: event.location?.address || '',
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: user.preferences?.timezone || 'America/Lima'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: user.preferences?.timezone || 'America/Lima'
        }
      };

      const response = await calendar.events.update({
        calendarId: user.googleCalendar.calendarId || 'primary',
        eventId: eventId,
        resource: calendarEvent,
        sendUpdates: 'all'
      });

      return response.data;
    } catch (error) {
      console.error('Error actualizando evento en Google Calendar:', error);
      throw error;
    }
  }

  // Eliminar evento de Google Calendar
  async deleteEvent(eventId, user) {
    try {
      this.setCredentials({
        access_token: user.googleCalendar.accessToken,
        refresh_token: user.googleCalendar.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: this.getOAuth2Client() });

      await calendar.events.delete({
        calendarId: user.googleCalendar.calendarId || 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      return true;
    } catch (error) {
      console.error('Error eliminando evento de Google Calendar:', error);
      throw error;
    }
  }

  // Listar eventos del calendario
  async listEvents(user, timeMin, timeMax) {
    try {
      this.setCredentials({
        access_token: user.googleCalendar.accessToken,
        refresh_token: user.googleCalendar.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: this.getOAuth2Client() });

      const response = await calendar.events.list({
        calendarId: user.googleCalendar.calendarId || 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items;
    } catch (error) {
      console.error('Error listando eventos de Google Calendar:', error);
      throw error;
    }
  }
}

module.exports = new GoogleCalendarService();
