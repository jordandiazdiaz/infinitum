# SEVEM Platform - Monorepo

Este es un monorepo que contiene el frontend y backend de SEVEM Platform.

## Estructura

```
/
├── client/          # Frontend React + Vite
├── server/          # Backend Node.js + Express
├── DEPLOY_RAILWAY.md          # Guía completa de deploy
└── GOOGLE_CALENDAR_SETUP.md   # Setup de Google Calendar
```

## Deploy en Railway

**IMPORTANTE:** Este proyecto debe desplegarse como servicios separados en Railway.

### Configuración Correcta:

1. **Servicio Backend:**
   - Root Directory: `/server`
   - Build Command: Automático (npm install)
   - Start Command: `npm start`

2. **Servicio Frontend:**
   - Root Directory: `/client`
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **MongoDB:**
   - Agregar como Database en Railway

### Variables de Entorno:

Consulta los archivos:
- `server/.env.example` para el backend
- `client/.env.example` para el frontend

## Documentación Completa

Ver `DEPLOY_RAILWAY.md` para instrucciones paso a paso detalladas.
