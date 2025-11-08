# 🚀 Guía de Deploy SEVEM en Railway.app

Esta guía te llevará paso a paso para desplegar tu plataforma SEVEM en Railway.app de forma completamente gratuita (con $5 de crédito mensual).

## 📋 Requisitos Previos

- [ ] Cuenta de GitHub
- [ ] Cuenta de Railway.app (puedes crearla con GitHub)
- [ ] Código del proyecto subido a GitHub

---

## Parte 1: Preparar el Proyecto para Deploy

### Paso 1.1: Crear Repositorio en GitHub

```bash
cd /Users/jordandiaz/Downloads/sevem-platform

# Inicializar git (si aún no lo has hecho)
git init

# Crear archivo .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.production.local

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
*.log
npm-debug.log*
*.log.*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# WhatsApp session data
.wwebjs_auth/
.wwebjs_cache/

# Temporary files
tmp/
temp/
EOF

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - SEVEM Platform ready for deployment"

# Crear repositorio en GitHub y conectarlo
# Ve a https://github.com/new y crea un nuevo repositorio llamado "sevem-platform"
# Luego ejecuta:
git remote add origin https://github.com/TU-USUARIO/sevem-platform.git
git branch -M main
git push -u origin main
```

---

## Parte 2: Deploy en Railway.app

### Paso 2.1: Crear Cuenta en Railway

1. Ve a [Railway.app](https://railway.app/)
2. Haz clic en **"Start a New Project"** o **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway para acceder a tus repositorios

### Paso 2.2: Crear Nuevo Proyecto

1. Una vez en el dashboard, haz clic en **"New Project"**
2. Se abrirá un menú con opciones

---

## Parte 3: Configurar Base de Datos MongoDB

### Paso 3.1: Agregar MongoDB

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"Database"**
3. Selecciona **"Add MongoDB"**
4. Railway creará automáticamente una instancia de MongoDB
5. Espera unos segundos mientras se aprovisiona

### Paso 3.2: Obtener URL de Conexión

1. Haz clic en el servicio **"MongoDB"** que acabas de crear
2. Ve a la pestaña **"Connect"** o **"Variables"**
3. Copia la variable **MONGO_URL** (se ve algo así: `mongodb://mongo:xxxx@containers-us-west-xxx.railway.app:7491`)
4. Guárdala en un lugar seguro, la necesitarás pronto

---

## Parte 4: Deploy del Backend (Servidor)

### Paso 4.1: Agregar Servicio Backend

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona tu repositorio **"sevem-platform"**
4. Railway detectará que tienes múltiples servicios

### Paso 4.2: Configurar Root Directory

1. Una vez agregado el servicio, haz clic en él
2. Ve a **"Settings"**
3. Busca la sección **"Root Directory"**
4. Escribe: `/server`
5. Haz clic en el ícono de guardar

### Paso 4.3: Configurar Variables de Entorno

1. En el servicio del backend, ve a la pestaña **"Variables"**
2. Haz clic en **"+ New Variable"** o **"Raw Editor"**
3. Agrega las siguientes variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongo:xxxx@containers-us-west-xxx.railway.app:7491
JWT_SECRET=sevem-super-secret-key-CAMBIA-ESTO-POR-ALGO-MUY-SEGURO-12345
JWT_EXPIRE=30d
CLIENT_URL=${{RAILWAY_STATIC_URL}}
FRONTEND_URL=${{RAILWAY_STATIC_URL}}
```

**Notas importantes:**
- Reemplaza `MONGODB_URI` con la URL que copiaste en el Paso 3.2
- Cambia `JWT_SECRET` por algo muy seguro y aleatorio
- `${{RAILWAY_STATIC_URL}}` es una variable mágica de Railway que se reemplazará automáticamente

### Paso 4.4: Configurar Email (SMTP) - Opcional pero Recomendado

Si quieres que las notificaciones por email funcionen, agrega:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password-de-gmail
FROM_EMAIL=noreply@sevem.com
FROM_NAME=SEVEM Platform
```

**Para obtener App Password de Gmail:**
1. Ve a [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Selecciona "Mail" y tu dispositivo
3. Copia la contraseña de 16 caracteres generada

### Paso 4.5: Configurar SUNAT (Cuando tengas las credenciales)

Cuando obtengas tus credenciales de SUNAT, agrega:

```env
SUNAT_USER=tu-usuario-sol
SUNAT_PASSWORD=tu-clave-sol
SUNAT_CLIENT_ID=tu-client-id
SUNAT_CLIENT_SECRET=tu-client-secret
SUNAT_ENVIRONMENT=production
```

### Paso 4.6: Deploy del Backend

1. Guarda todas las variables
2. Railway automáticamente iniciará el deploy
3. Ve a la pestaña **"Deployments"** para ver el progreso
4. Espera a que el status sea **"Success"** ✅ (toma ~2-5 minutos)

### Paso 4.7: Obtener URL del Backend

1. Ve a la pestaña **"Settings"**
2. Busca la sección **"Networking"** o **"Domains"**
3. Haz clic en **"Generate Domain"**
4. Railway generará una URL como: `sevem-backend-production-xxxx.up.railway.app`
5. **Copia esta URL**, la necesitarás para el frontend

---

## Parte 5: Deploy del Frontend (Cliente)

### Paso 5.1: Agregar Servicio Frontend

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona tu repositorio **"sevem-platform"** nuevamente
4. Railway lo agregará como un nuevo servicio

### Paso 5.2: Configurar Root Directory

1. Haz clic en el nuevo servicio
2. Ve a **"Settings"**
3. Busca **"Root Directory"**
4. Escribe: `/client`
5. Guarda

### Paso 5.3: Configurar Variables de Entorno

1. Ve a la pestaña **"Variables"**
2. Agrega la siguiente variable:

```env
VITE_API_URL=https://sevem-backend-production-xxxx.up.railway.app
```

**Importante:** Reemplaza con la URL del backend que copiaste en el Paso 4.7

### Paso 5.4: Deploy del Frontend

1. Guarda la variable
2. Railway iniciará el build automáticamente
3. Ve a **"Deployments"** para ver el progreso
4. Espera a que el status sea **"Success"** ✅ (~3-7 minutos)

### Paso 5.5: Generar Dominio del Frontend

1. Ve a **"Settings"**
2. En **"Networking"** o **"Domains"**
3. Haz clic en **"Generate Domain"**
4. Railway generará una URL como: `sevem-frontend-production-xxxx.up.railway.app`
5. **Esta es la URL de tu aplicación** 🎉

---

## Parte 6: Actualizar URLs Cruzadas

### Paso 6.1: Actualizar Backend con URL del Frontend

1. Ve al servicio **Backend**
2. Ve a **"Variables"**
3. Actualiza las variables:

```env
CLIENT_URL=https://sevem-frontend-production-xxxx.up.railway.app
FRONTEND_URL=https://sevem-frontend-production-xxxx.up.railway.app
```

4. Guarda (Railway redesplegará automáticamente)

### Paso 6.2: Actualizar CORS (Importante para Seguridad)

El backend ya está configurado para usar la variable `FRONTEND_URL`, así que con el paso anterior ya está listo.

---

## Parte 7: Configuraciones Adicionales

### Paso 7.1: Configurar Google Calendar (Opcional)

Si quieres usar Google Calendar:

1. Sigue la guía en `GOOGLE_CALENDAR_SETUP.md`
2. Obtén tus credenciales de Google Cloud Console
3. En el servicio **Backend**, agrega las variables:

```env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=https://sevem-frontend-production-xxxx.up.railway.app/auth/google/callback
```

4. En Google Cloud Console, agrega la URI de redirección autorizada:
   - `https://sevem-frontend-production-xxxx.up.railway.app/auth/google/callback`

### Paso 7.2: Monitorear Recursos y Costos

1. En el dashboard principal del proyecto, verás el uso de recursos
2. Railway te da **$5 de crédito gratis** por mes
3. Con tu tráfico inicial, esto debería ser suficiente
4. Puedes ver el uso en tiempo real en la pestaña **"Usage"**

---

## Parte 8: Verificar que Todo Funciona

### Checklist de Verificación ✅

1. **Accede a tu aplicación:**
   - Abre `https://sevem-frontend-production-xxxx.up.railway.app`
   - Deberías ver la página de login

2. **Crea una cuenta:**
   - Haz clic en "Registrarse"
   - Crea tu primer usuario
   - Verifica que puedas iniciar sesión

3. **Prueba el Dashboard:**
   - Verifica que el dashboard cargue correctamente
   - Verifica que las estadísticas se muestren

4. **Prueba crear un cliente:**
   - Ve a "Clientes" → "Nuevo Cliente"
   - Crea un cliente de prueba
   - Verifica que se guarde correctamente

5. **Revisa los logs:**
   - En Railway, ve a cada servicio
   - Haz clic en la pestaña **"Logs"**
   - Verifica que no haya errores críticos

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución:**
1. Verifica que la variable `MONGODB_URI` sea correcta
2. Asegúrate de que el servicio MongoDB esté corriendo (verde)
3. Revisa los logs del backend

### Error: "CORS blocked" o "Network Error"

**Solución:**
1. Verifica que `CLIENT_URL` y `FRONTEND_URL` estén configuradas correctamente
2. Asegúrate de que la URL no tenga `/` al final
3. Verifica que `VITE_API_URL` en el frontend sea correcta

### Error: "Application crashed"

**Solución:**
1. Ve a **"Logs"** del servicio que falló
2. Lee el error específico
3. Verifica que todas las variables de entorno estén configuradas
4. Verifica que el `Root Directory` sea correcto

### El frontend carga pero no se conecta al backend

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Verifica que las llamadas API vayan a la URL correcta
4. Verifica que `VITE_API_URL` esté correcta

---

## 📊 Monitoreo y Mantenimiento

### Ver Logs en Tiempo Real

```bash
# Desde Railway dashboard:
1. Haz clic en el servicio (Backend o Frontend)
2. Ve a la pestaña "Logs"
3. Los logs se actualizan en tiempo real
```

### Redesplegar Manualmente

```bash
# Opción 1: Desde GitHub
git add .
git commit -m "Update"
git push

# Railway desplegará automáticamente

# Opción 2: Desde Railway Dashboard
1. Ve al servicio
2. Pestaña "Deployments"
3. Haz clic en los tres puntos del último deployment
4. Selecciona "Redeploy"
```

### Rollback a Versión Anterior

```bash
1. Ve al servicio
2. Pestaña "Deployments"
3. Encuentra el deployment que funcionaba
4. Haz clic en los tres puntos
5. Selecciona "Redeploy"
```

---

## 💰 Optimización de Costos

### Reducir Uso de Recursos

1. **Reducir replicas:**
   - Settings → Scale → 1 replica

2. **Sleep Mode (solo para dev):**
   - Settings → Enable Sleep Mode
   - ⚠️ La app se dormirá después de 30 min sin uso

3. **Usar MongoDB Atlas Gratis en vez de Railway MongoDB:**
   - Regístrate en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crea cluster gratuito (512MB)
   - Actualiza `MONGODB_URI` con la nueva URL
   - Elimina el servicio MongoDB de Railway

---

## 🎉 ¡Felicidades!

Tu plataforma SEVEM ahora está **desplegada y accesible públicamente**.

### Próximos Pasos Recomendados:

1. **Dominio Personalizado:**
   - Compra un dominio (ej: sevem.pe)
   - En Railway Settings → Add Custom Domain
   - Configura DNS según las instrucciones

2. **Analytics:**
   - Agrega Google Analytics
   - Monitorea uso de la aplicación

3. **Backups de Base de Datos:**
   - Configura backups automáticos en MongoDB
   - Railway Pro incluye backups automáticos

4. **Certificado SSL:**
   - Railway incluye SSL gratuito automático
   - No necesitas configurar nada

---

## 📞 Soporte

### Recursos Útiles:

- [Documentación de Railway](https://docs.railway.app/)
- [Comunidad de Railway Discord](https://discord.gg/railway)
- [Status de Railway](https://status.railway.app/)

### URLs de tu Proyecto:

- **Frontend:** https://sevem-frontend-production-xxxx.up.railway.app
- **Backend:** https://sevem-backend-production-xxxx.up.railway.app
- **MongoDB:** (conexión interna)

---

**¡Éxito con tu plataforma SEVEM! 🎊**
