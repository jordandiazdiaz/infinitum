# 🚀 Guía Rápida de Deploy - SEVEM Platform

## ✅ Todo Está Listo para Deploy

Tu proyecto SEVEM está completamente configurado y listo para ser desplegado en Railway.app.

---

## 📦 Archivos Creados

✅ `.gitignore` - Ignora archivos sensibles  
✅ `railway.json` - Configuración de Railway  
✅ `server/nixpacks.toml` - Build config del backend  
✅ `client/nixpacks.toml` - Build config del frontend  
✅ `server/.env.example` - Template de variables de entorno  
✅ `client/.env.example` - Template de variables de entorno  
✅ `client/.env.production` - Variables para producción  
✅ `DEPLOY_RAILWAY.md` - Guía completa paso a paso  
✅ `GOOGLE_CALENDAR_SETUP.md` - Setup de Google Calendar  

---

## 🎯 Próximos Pasos

### Opción 1: Deploy Inmediato (Recomendado)

**Sigue la guía completa:** `DEPLOY_RAILWAY.md`

**Resumen super rápido:**

1. **Sube a GitHub:**
```bash
cd /Users/jordandiaz/Downloads/sevem-platform
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/TU-USUARIO/sevem-platform.git
git push -u origin main
```

2. **Ve a Railway.app:**
   - Login con GitHub: https://railway.app/
   - New Project
   - Deploy from GitHub repo

3. **Crea 3 servicios:**
   - **MongoDB** (Database)
   - **Backend** (GitHub repo, root: `/server`)
   - **Frontend** (GitHub repo, root: `/client`)

4. **Configura variables:**
   - Backend: Copia de `server/.env.example`
   - Frontend: `VITE_API_URL=URL-de-tu-backend`

5. **¡Listo!** 🎉
   - Tu app estará en: `https://tu-app.railway.app`

---

### Opción 2: Probar Localmente Primero

```bash
# Terminal 1 - Backend
cd /Users/jordandiaz/Downloads/sevem-platform/server
npm install
cp .env.example .env
# Edita .env con tus datos
npm run dev

# Terminal 2 - Frontend
cd /Users/jordandiaz/Downloads/sevem-platform/client
npm install
echo "VITE_API_URL=http://localhost:5001" > .env
npm run dev
```

Abre: http://localhost:5173

---

## 📊 Costos Estimados

| Plataforma | Costo Mensual | Ideal Para |
|------------|---------------|------------|
| **Railway** | $0-5 (gratis) → $5-10 | ⭐ Recomendado para empezar |
| Render | $0 (limitado) | Solo pruebas |
| Vercel + Railway | $0-5 | Mejor performance |
| DigitalOcean | $5+ | Más control |

---

## 🔑 Configuraciones Importantes

### Variables de Entorno Críticas

**Backend (`server/.env`):**
```env
MONGODB_URI=mongodb://... (Railway te da esto)
JWT_SECRET=CAMBIA-ESTO-POR-ALGO-SUPER-SEGURO
CLIENT_URL=https://tu-frontend.railway.app
```

**Frontend (`client/.env.production`):**
```env
VITE_API_URL=https://tu-backend.railway.app
```

### Después del Deploy

1. **Google Calendar** (Opcional):
   - Lee `GOOGLE_CALENDAR_SETUP.md`
   - Obtén credenciales de Google Cloud Console
   - Agrega variables en Railway

2. **SUNAT** (Cuando tengas credenciales):
   - Obtén usuario SOL y clave
   - Genera credenciales API
   - Configura en Settings de la app

3. **WhatsApp Bot**:
   - Se configura automáticamente
   - Conecta escaneando QR desde Settings

---

## 📱 URLs de tu Aplicación

Después del deploy, tendrás:

- **Frontend:** `https://sevem-frontend-production-xxxx.railway.app`
- **Backend API:** `https://sevem-backend-production-xxxx.railway.app`
- **MongoDB:** Conexión interna (Railway)

---

## ⚡ Comandos Útiles

```bash
# Ver estructura del proyecto
ls -R

# Verificar archivos de configuración
cat railway.json
cat server/nixpacks.toml
cat client/nixpacks.toml

# Ver variables de ejemplo
cat server/.env.example
cat client/.env.example

# Subir cambios a GitHub (después del deploy inicial)
git add .
git commit -m "Update: descripción de cambios"
git push
# Railway desplegará automáticamente
```

---

## 🆘 Ayuda Rápida

### Problema: "No puedo conectarme al backend"
✅ Verifica que `VITE_API_URL` apunte al backend correcto  
✅ Verifica que `CLIENT_URL` en el backend apunte al frontend correcto

### Problema: "Error de MongoDB"
✅ Verifica que `MONGODB_URI` esté correcta  
✅ Verifica que el servicio MongoDB esté corriendo (verde en Railway)

### Problema: "Build failed"
✅ Verifica que `Root Directory` esté correcto (`/server` o `/client`)  
✅ Revisa los logs en Railway → pestaña "Deployments"

---

## 📞 Soporte

- 📖 **Guía Completa:** `DEPLOY_RAILWAY.md`
- 🔗 **Google Calendar:** `GOOGLE_CALENDAR_SETUP.md`
- 💬 **Railway Docs:** https://docs.railway.app/
- 🐛 **Issues:** https://github.com/tu-usuario/sevem-platform/issues

---

## 🎉 ¡Todo Listo!

Tu proyecto SEVEM Platform está 100% preparado para deploy.  
Sigue `DEPLOY_RAILWAY.md` para instrucciones detalladas.

**¡Éxito con tu plataforma! 🚀**
