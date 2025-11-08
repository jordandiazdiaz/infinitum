const { Client: WhatsAppClient, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const ChatbotConversation = require('../models/ChatbotConversation');
const Client = require('../models/Client');

class ChatbotService {
  constructor() {
    this.client = null;
    this.qrCode = null;
    this.isReady = false;
  }

  // Inicializar WhatsApp Client
  async initialize() {
    if (this.client) {
      console.log('✅ WhatsApp client ya está inicializado');
      return;
    }

    this.client = new WhatsAppClient({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // Evento: QR Code generado
    this.client.on('qr', async (qr) => {
      console.log('📱 Código QR recibido, escanéalo con WhatsApp');
      this.qrCode = await qrcode.toDataURL(qr);
    });

    // Evento: Cliente listo
    this.client.on('ready', () => {
      console.log('✅ WhatsApp Bot está listo!');
      this.isReady = true;
      this.qrCode = null;
    });

    // Evento: Mensaje recibido
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    // Evento: Cliente autenticado
    this.client.on('authenticated', () => {
      console.log('✅ WhatsApp autenticado');
    });

    // Evento: Error de autenticación
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Error de autenticación:', msg);
    });

    // Evento: Desconectado
    this.client.on('disconnected', (reason) => {
      console.log('⚠️ WhatsApp desconectado:', reason);
      this.isReady = false;
    });

    await this.client.initialize();
  }

  // Manejar mensajes entrantes
  async handleMessage(message) {
    try {
      // Ignorar mensajes de grupos y del propio bot
      if (message.from.includes('@g.us') || message.fromMe) {
        return;
      }

      const contact = await message.getContact();
      const chatId = message.from;

      // Buscar o crear conversación
      let conversation = await ChatbotConversation.findOne({
        platformUserId: chatId,
        platform: 'whatsapp',
        status: 'active'
      });

      if (!conversation) {
        conversation = await ChatbotConversation.create({
          user: null, // Se asignará después
          platform: 'whatsapp',
          platformUserId: chatId,
          contactName: contact.pushname || contact.number,
          contactPhone: contact.number,
          messages: []
        });
      }

      // Agregar mensaje del cliente
      conversation.messages.push({
        sender: 'client',
        content: message.body,
        messageType: 'text',
        timestamp: new Date()
      });

      // Procesar mensaje y generar respuesta
      const response = await this.processMessage(message.body, conversation);

      // Enviar respuesta
      await message.reply(response);

      // Agregar respuesta del bot
      conversation.messages.push({
        sender: 'bot',
        content: response,
        messageType: 'text',
        timestamp: new Date()
      });

      await conversation.save();
    } catch (error) {
      console.error('Error manejando mensaje:', error);
    }
  }

  // Procesar mensaje y generar respuesta inteligente
  async processMessage(messageBody, conversation) {
    const lowerMessage = messageBody.toLowerCase();

    // Mensaje de bienvenida
    if (!conversation.messages || conversation.messages.length === 1) {
      conversation.intent = 'consulta_general';
      await conversation.save();

      return `👋 ¡Hola! Soy el bot de *Social Event Manager*.

Indícame cuál sería el servicio del cual estás interesado o interesada:

📅 *Boda*
🎓 *Graduación*
🎂 *XV años*
🍼 *Bautizo*
✨ *Otra Celebración*

¿O prefieres hablar con una persona? Escribe "persona"`;
    }

    // Cliente quiere hablar con persona
    if (lowerMessage.includes('persona') || lowerMessage.includes('agente') || lowerMessage.includes('humano')) {
      conversation.followUpRequired = true;
      conversation.followUpDate = new Date();
      await conversation.save();

      return `Perfecto, en un momento uno de nuestros asesores se pondrá en contacto contigo. 📞

Mientras tanto, ¿podrías compartirme tu nombre completo y correo electrónico?`;
    }

    // Detectar tipo de evento
    if (lowerMessage.includes('boda')) {
      conversation.intent = 'cotizacion';
      conversation.capturedData.eventType = 'Boda';
      await conversation.save();

      return `¡Perfecto! Una *boda* es un momento muy especial 💒

Para poder ayudarte mejor, indícame:
1. ¿Tienes una fecha tentativa? (ej: Junio 2025)
2. ¿Cuántos invitados aproximadamente?
3. ¿Tienes un presupuesto estimado?`;
    }

    if (lowerMessage.includes('graduaci') || lowerMessage.includes('graduacion')) {
      conversation.intent = 'cotizacion';
      conversation.capturedData.eventType = 'Graduación';
      await conversation.save();

      return `¡Felicitaciones por tu *graduación*! 🎓

Para brindarte una cotización personalizada, necesito saber:
1. ¿Qué tipo de graduación es? (Pre-Grado, Maestría, etc.)
2. ¿Fecha tentativa del evento?
3. ¿Número de invitados?`;
    }

    if (lowerMessage.includes('xv') || lowerMessage.includes('quince')) {
      conversation.intent = 'cotizacion';
      conversation.capturedData.eventType = 'XV años';
      await conversation.save();

      return `¡Qué emoción! Una fiesta de *XV años* es un momento inolvidable ✨

Cuéntame:
1. ¿Cuándo sería la celebración?
2. ¿Cuántos invitados esperas?
3. ¿Qué tipo de temática tienes en mente?`;
    }

    if (lowerMessage.includes('bautizo') || lowerMessage.includes('bautismo')) {
      conversation.intent = 'cotizacion';
      conversation.capturedData.eventType = 'Bautizo';
      await conversation.save();

      return `¡Hermoso! Un *bautizo* es una celebración muy especial 👼

Para ayudarte mejor:
1. ¿Fecha tentativa?
2. ¿Número aproximado de invitados?
3. ¿Lugar donde se realizará?`;
    }

    // Detectar fecha
    const monthsRegex = /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i;
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
    if (monthsRegex.test(lowerMessage) || dateRegex.test(lowerMessage)) {
      conversation.capturedData.eventDate = messageBody;
      await conversation.save();

      return `Perfecto, anotado 📝

¿Y cuántos invitados aproximadamente tendrás?`;
    }

    // Detectar número de invitados
    const numberMatch = messageBody.match(/\d+/);
    if (numberMatch && !conversation.capturedData.numberOfGuests) {
      const number = parseInt(numberMatch[0]);
      if (number > 10 && number < 1000) {
        conversation.capturedData.numberOfGuests = number;
        await conversation.save();

        return `Genial, ${number} invitados 👥

¿Cuál es tu presupuesto aproximado para este evento? (en soles)`;
      }
    }

    // Detectar presupuesto
    if ((lowerMessage.includes('s/') || lowerMessage.includes('soles') || lowerMessage.includes('mil')) && !conversation.capturedData.budget) {
      conversation.capturedData.budget = messageBody;
      conversation.leadQuality = 'hot';
      await conversation.save();

      return `¡Excelente! 🎉

Ya tengo la información básica. Nuestro equipo preparará una cotización personalizada para ti.

¿Podrías compartirme tu:
- Nombre completo
- Email
- Número de teléfono (si es diferente a este)

¿Te gustaría agendar una cita para revisar la cotización personalmente?`;
    }

    // Consulta de precios
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
      return `Los precios varían según:
- Tipo de evento
- Número de invitados
- Servicios incluidos
- Fecha y ubicación

Para darte un precio exacto, necesito conocer más detalles de tu evento. ¿Me compartes qué tipo de evento estás planeando?`;
    }

    // Consulta de servicios
    if (lowerMessage.includes('servicio') || lowerMessage.includes('ofrecen') || lowerMessage.includes('incluye')) {
      return `Nuestros servicios incluyen:

✅ Planificación y coordinación completa
✅ Decoración personalizada
✅ Catering y bebidas
✅ Entretenimiento y música
✅ Fotografía y video
✅ Invitaciones digitales
✅ Coordinación de proveedores

¿Qué tipo de evento estás organizando? Así puedo darte más detalles específicos.`;
    }

    // Respuesta por defecto
    return `Gracias por tu mensaje 😊

Para ayudarte mejor, ¿podrías decirme:
- ¿Qué tipo de evento estás planeando?
- ¿O prefieres hablar con uno de nuestros asesores?

Escribe el tipo de evento o "persona" para contacto directo.`;
  }

  // Enviar mensaje a un cliente
  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp bot no está listo');
    }

    const chatId = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  // Obtener QR Code
  getQRCode() {
    return this.qrCode;
  }

  // Verificar estado
  getStatus() {
    return {
      isReady: this.isReady,
      hasQR: !!this.qrCode
    };
  }

  // Desconectar
  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.isReady = false;
    }
  }
}

// Exportar instancia única (singleton)
module.exports = new ChatbotService();
