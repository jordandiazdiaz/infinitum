# SEVEM Platform - Guía de Instalación y Configuración

## 📋 Requisitos Previos

- Node.js v18 o superior
- MongoDB v6 o superior
- npm o yarn
- Cuenta de Google Cloud (para Google Calendar API)
- Cuenta de desarrollador de Facebook/WhatsApp Business (para Chatbot)
- Cuenta SMTP (para envío de emails)

## 🚀 Instalación Rápida

### 1. Clonar el repositorio o copiar los archivos

```bash
cd sevem-platform
```

### 2. Instalar dependencias del Backend

```bash
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd client
npm install
cd ..
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sevem

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRE=30d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# WhatsApp Business API (opcional)
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=tu_token_de_whatsapp
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id

# Facebook & Instagram (opcional)
FACEBOOK_PAGE_ACCESS_TOKEN=tu_token
INSTAGRAM_ACCESS_TOKEN=tu_token

# Google Calendar API
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# SUNAT (Facturación electrónica Perú - opcional)
SUNAT_API_URL=https://api.sunat.gob.pe
SUNAT_RUC=20XXXXXXXXX
SUNAT_USERNAME=tu_usuario
SUNAT_PASSWORD=tu_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Configurar variables de entorno del Frontend

Crear `.env` en la carpeta `client`:

```bash
cd client
echo "VITE_API_URL=http://localhost:5000/api" > .env
cd ..
```

### 6. Iniciar MongoDB

```bash
# Si usas MongoDB local
mongod

# O si usas MongoDB Atlas, actualiza MONGODB_URI en .env
```

### 7. Iniciar el proyecto

Opción A - Modo desarrollo (Backend y Frontend por separado):

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm run dev
```

Opción B - Modo desarrollo (Ambos juntos):

```bash
npm run dev
```

### 8. Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Configuración de Integraciones

### Google Calendar

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar Google Calendar API
4. Crear credenciales OAuth 2.0
5. Copiar Client ID y Client Secret al `.env`

### WhatsApp Chatbot

Opción A - WhatsApp Web (Desarrollo):
- Se usará `whatsapp-web.js` automáticamente
- Al iniciar, escanea el código QR en la consola

Opción B - WhatsApp Business API (Producción):
1. Crear cuenta en [Meta for Developers](https://developers.facebook.com/)
2. Configurar WhatsApp Business API
3. Obtener token de acceso
4. Configurar en `.env`

### Email (Gmail)

1. Activar autenticación de 2 pasos en Google
2. Generar contraseña de aplicación
3. Usar la contraseña de aplicación en `EMAIL_PASSWORD`

### SUNAT (Facturación Electrónica - Perú)

1. Obtener certificado digital de SUNAT
2. Colocar certificado en `./certificates/`
3. Configurar credenciales en `.env`

## 👤 Crear Usuario Administrador

Después de iniciar la aplicación:

1. Ir a http://localhost:3000/register
2. Crear tu cuenta
3. El primer usuario será administrador automáticamente

O usar la API directamente:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@sevem.com",
    "password": "admin123",
    "role": "admin",
    "company": {
      "name": "Mi Empresa",
      "ruc": "20123456789",
      "phone": "+51 999 999 999"
    }
  }'
```

## 🔧 Comandos Disponibles

### Backend

```bash
npm run server    # Iniciar servidor en modo desarrollo
npm start         # Iniciar servidor en producción
```

### Frontend

```bash
cd client
npm run dev       # Modo desarrollo
npm run build     # Construir para producción
npm run preview   # Preview de producción
```

### Ambos

```bash
npm run dev          # Iniciar backend + frontend
npm run install:all  # Instalar todas las dependencias
```

## 🗂️ Estructura de Carpetas

```
sevem-platform/
├── server/                 # Backend
│   ├── models/            # Modelos de MongoDB
│   ├── controllers/       # Controladores de rutas
│   ├── routes/            # Definición de rutas
│   ├── services/          # Servicios externos
│   ├── middleware/        # Middleware de Express
│   └── index.js           # Punto de entrada
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas/Vistas
│   │   ├── services/      # Servicios API
│   │   ├── store/         # Estado global (Zustand)
│   │   └── utils/         # Utilidades
│   └── public/            # Archivos estáticos
├── uploads/               # Archivos subidos
├── certificates/          # Certificados (SUNAT, etc)
└── .env                   # Variables de entorno
```

## 🎨 Personalización

### Colores

Editar `client/tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#TU_COLOR_PRINCIPAL',
    // ...
  }
}
```

### Logo

Reemplazar archivos en `client/public/`

### Plantillas de Email/PDF

Editar archivos en:
- `server/services/emailService.js`
- `server/services/pdfService.js`

## 📊 Base de Datos

### Colecciones Principales

- `users` - Usuarios del sistema
- `clients` - Clientes y leads
- `events` - Eventos y bodas
- `quotations` - Cotizaciones
- `invoices` - Facturas y boletas
- `chatbotconversations` - Conversaciones del chatbot

### Backup

```bash
# Exportar
mongodump --db sevem --out ./backup

# Importar
mongorestore --db sevem ./backup/sevem
```

## 🐛 Solución de Problemas

### Error: Cannot connect to MongoDB

```bash
# Verificar que MongoDB esté corriendo
mongod --version
mongo --eval "db.version()"

# Verificar MONGODB_URI en .env
```

### Error: WhatsApp QR no aparece

```bash
# Limpiar caché
rm -rf .wwebjs_auth .wwebjs_cache

# Reiniciar servidor
```

### Error: Google Calendar no funciona

1. Verificar que las credenciales en `.env` sean correctas
2. Verificar que Google Calendar API esté habilitada
3. Verificar redirect URI en Google Cloud Console

## 📚 Documentación API

Ver documentación completa en: `/docs/API.md` (próximamente)

Endpoints principales:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/clients` - Listar clientes
- `POST /api/events` - Crear evento
- `GET /api/dashboard/metrics` - Métricas del dashboard

## 🚀 Despliegue en Producción

### Backend (Railway, Heroku, DigitalOcean)

1. Configurar variables de entorno en el servicio
2. Configurar MongoDB Atlas o similar
3. Desplegar:

```bash
npm run build
npm start
```

### Frontend (Vercel, Netlify)

```bash
cd client
npm run build
# Subir carpeta dist/
```

## 🔐 Seguridad

- Cambiar JWT_SECRET a algo seguro
- Usar HTTPS en producción
- Configurar CORS correctamente
- Usar variables de entorno, nunca código duro
- Actualizar dependencias regularmente

## 📞 Soporte

Para preguntas o problemas:
- Email: soporte@sevem.com
- GitHub Issues: (tu repositorio)

## 📄 Licencia

Propietario - SEVEM © 2025

---

**¡SEVEM - Transforma tus eventos sociales!** 🎉
