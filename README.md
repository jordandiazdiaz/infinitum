# SEVEM - Plataforma de Gestión de Eventos Sociales

![SEVEM](./assets/sevem-logo.png)

**Transforma tus eventos sociales**

SEVEM es una plataforma innovadora diseñada para transformar la gestión de eventos sociales. Dirigida a wedding planners, event planners y profesionales del sector de eventos sociales.

## 🌟 Características Principales

### 1. 🤖 Chatbot de Prospección de Clientes
- Atención automatizada 24/7
- Multiplataforma (Facebook, Instagram y WhatsApp)
- Respuestas inteligentes y personalizadas
- Captura automática de leads

### 2. 📊 Dashboard de Análisis de Datos
- Gráficos mensuales interactivos
- Eventos más solicitados
- Tasa de conversión de clientes
- Monto total de cotizaciones
- Nivel de rentabilidad
- Analítica de campañas publicitarias

### 3. 💰 Control de Cuentas por Cobrar
- Seguimiento en tiempo real
- Alertas de vencimiento
- Historial de pagos
- Estados de cuenta detallados

### 4. 🧾 Facturas y Boletas Electrónicas
- Automatización completa
- Integración con SUNAT (Perú)
- Generación de PDF
- Envío automático por email

### 5. 📅 Calendario de Eventos
- Vinculado a Google Calendar
- Vista mensual, semanal y diaria
- Recordatorios automáticos
- Sincronización multi-dispositivo

### 6. 💵 Liquidación y Rentabilidad
- Cálculo automático de rentabilidad por evento
- Análisis de costos vs ingresos
- Reportes detallados
- Proyecciones financieras

### 7. 📝 Cotizaciones y Contratos
- Generación automatizada
- Plantillas personalizables
- Firma electrónica
- Seguimiento de estado

### 8. 📧 Mensajes de Seguimiento
- Correos automatizados
- Mensajes de WhatsApp programados
- Plantillas personalizadas
- Seguimiento de leads

## 🚀 Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- WhatsApp Web.js
- Google Calendar API
- Nodemailer

### Frontend
- React + Vite
- TailwindCSS
- Chart.js
- React Router
- Axios

## 📦 Instalación

### Prerrequisitos
- Node.js v18+
- MongoDB
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sevem-platform.git
cd sevem-platform
```

2. **Instalar dependencias**
```bash
npm run install:all
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Estructura del Proyecto

```
sevem-platform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios API
│   │   ├── context/       # Context API
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utilidades
│   └── public/
├── server/                # Backend Node.js
│   ├── models/           # Modelos MongoDB
│   ├── routes/           # Rutas API
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middleware
│   ├── services/         # Servicios externos
│   └── utils/            # Utilidades
├── uploads/              # Archivos subidos
└── docs/                 # Documentación
```

## 🔧 Configuración

### Chatbot de WhatsApp

1. Escanear el código QR que aparece en consola
2. El bot se conectará automáticamente
3. Configurar mensajes en `/server/config/chatbot.config.js`

### Google Calendar

1. Crear proyecto en Google Cloud Console
2. Habilitar Google Calendar API
3. Descargar credenciales OAuth 2.0
4. Configurar en `.env`

### Facturación Electrónica (SUNAT - Perú)

1. Obtener certificado digital
2. Configurar credenciales SUNAT
3. Colocar certificado en `/certificates`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento
- `GET /api/events/:id` - Obtener evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Cotizaciones
- `GET /api/quotations` - Listar cotizaciones
- `POST /api/quotations` - Crear cotización
- `POST /api/quotations/:id/generate-pdf` - Generar PDF

### Facturas
- `GET /api/invoices` - Listar facturas
- `POST /api/invoices` - Crear factura
- `POST /api/invoices/:id/send` - Enviar factura

### Dashboard
- `GET /api/dashboard/metrics` - Obtener métricas
- `GET /api/dashboard/charts` - Obtener datos para gráficos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propietario de SEVEM. Todos los derechos reservados.

## 📞 Contacto

**SEVEM** - Transforma tus eventos sociales

- Website: https://eventos.eskalup.com/agendar
- Email: info@sevem.com
- WhatsApp: +51 XXX XXX XXX

## 👥 Clientes

SEVEM trabaja con más de 30 clientes en la industria de eventos sociales, incluyendo:
- Wedding Planners
- Event Planners
- Catering Services
- Venues & Salones

---

**Impulsa tus ventas y aumenta tu rentabilidad con SEVEM** 🚀
