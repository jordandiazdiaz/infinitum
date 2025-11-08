# 🔧 Fix: Railway Domain Configuration

## ❌ Problema Actual

El frontend no puede conectarse al backend porque las URLs no están configuradas correctamente.

## ✅ Configuración Correcta

Tu proyecto debe tener **2 servicios separados** en Railway, cada uno con su **propio dominio único**.

### Servicio 1: Backend (Server)

**Root Directory**: `/server`

**Dominio actual**: `modest-youth-production-1da3.up.railway.app`

**Variables de Entorno**:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://jordandiaz2016_db_user:k8ZrRctoGWc355Qy@cluster0.xidtqpz.mongodb.net/?appName=Cluster0
JWT_SECRET=cambia-este-secret-por-un-string-super-largo-y-aleatorio-123456789
JWT_EXPIRE=30d
CLIENT_URL=https://infinitum-production-e5a2.up.railway.app
FRONTEND_URL=https://infinitum-production-e5a2.up.railway.app
```

### Servicio 2: Frontend (Client)

**Root Directory**: `/client`

**Dominio actual**: `infinitum-production-e5a2.up.railway.app`

**Variables de Entorno** (DEBE SER ACTUALIZADA):
```env
VITE_API_URL=https://modest-youth-production-1da3.up.railway.app
```

⚠️ **NOTA**: NO agregues el puerto `:5000` en la URL. Railway maneja esto automáticamente.

---

## 🔍 Cómo Verificar en Railway

### Paso 1: Identifica tus Servicios

1. Ve a tu proyecto en Railway: https://railway.app/
2. Deberías ver **2 servicios** (ignorando MongoDB):
   - Uno con Root Directory = `/server` (Backend)
   - Uno con Root Directory = `/client` (Frontend)

### Paso 2: Verifica el Dominio del Backend

1. Haz clic en el servicio **Backend** (el que tiene Root Directory `/server`)
2. Ve a **Settings** → **Networking**
3. Verifica que tenga un dominio generado
4. Debería ser algo como: `modest-youth-production-1da3.up.railway.app`
5. **Si NO tiene dominio**, haz clic en **"Generate Domain"**
6. **Copia este dominio** (lo necesitarás en el siguiente paso)

### Paso 3: Verifica el Dominio del Frontend

1. Haz clic en el servicio **Frontend** (el que tiene Root Directory `/client`)
2. Ve a **Settings** → **Networking**
3. Verifica que tenga un dominio generado
4. Debería ser: `infinitum-production-e5a2.up.railway.app`

---

## 🛠️ Cómo Actualizar VITE_API_URL

### En Railway Dashboard:

1. Ve al servicio **Frontend** (Root Directory `/client`)
2. Haz clic en la pestaña **"Variables"**
3. Busca la variable `VITE_API_URL`
4. **Actualízala** con el dominio del backend:
   ```
   VITE_API_URL=https://modest-youth-production-1da3.up.railway.app
   ```
   ⚠️ **SIN el puerto :5000**
5. Haz clic en **"Save"** o presiona Enter
6. Railway automáticamente **redesplegará** el frontend

---

## ✅ Verificar que Funciona

Una vez actualizada la variable:

1. Espera a que el frontend se redespliegue (1-3 minutos)
2. Ve a la pestaña **"Deployments"** del frontend
3. Espera a que el status sea **"Success"** ✅
4. Abre tu app en el navegador: `https://infinitum-production-e5a2.up.railway.app`
5. Abre la **Consola del Navegador** (F12 → Console)
6. Intenta **registrar un usuario**
7. En la pestaña **"Network"** de la consola, verifica que las peticiones vayan a:
   ```
   https://modest-youth-production-1da3.up.railway.app/api/auth/register
   ```

---

## 🆘 Solución de Problemas

### Problema: "El backend no tiene dominio"

**Solución**:
1. Ve al servicio Backend en Railway
2. Settings → Networking
3. Haz clic en **"Generate Domain"**
4. Railway generará una URL automáticamente
5. Copia esa URL y actualiza `VITE_API_URL` en el frontend

### Problema: "Ambos servicios tienen el mismo dominio"

**Esto NO debería pasar**. Cada servicio debe tener su propio dominio único.

**Solución**:
1. Elimina el dominio de uno de los servicios
2. Genera un nuevo dominio
3. Asegúrate de que sean diferentes

### Problema: "Sigo viendo 404"

**Solución**:
1. Verifica que `VITE_API_URL` esté correcta (sin puerto :5000)
2. Verifica que el backend esté corriendo:
   - Abre `https://modest-youth-production-1da3.up.railway.app` en el navegador
   - Deberías ver el JSON: `{"message":"🎉 SEVEM API - Transforma tus eventos sociales",...}`
3. Limpia la caché del navegador (Ctrl + Shift + R)
4. Verifica los logs del backend en Railway → Backend → Logs

---

## 📸 Checklist Final

- [ ] Backend tiene su propio dominio único
- [ ] Frontend tiene su propio dominio único
- [ ] Backend variable `CLIENT_URL` = dominio del frontend
- [ ] Backend variable `FRONTEND_URL` = dominio del frontend
- [ ] Frontend variable `VITE_API_URL` = dominio del backend (SIN :5000)
- [ ] Ambos servicios muestran "Success" en Deployments
- [ ] Backend responde JSON cuando abres su URL en navegador
- [ ] Frontend carga correctamente
- [ ] Puedes registrar un usuario sin errores 404

---

## 🎯 Resumen Rápido

**Tu configuración correcta debe ser:**

```
Frontend (infinitum-production-e5a2.up.railway.app)
   ↓ hace peticiones a ↓
Backend (modest-youth-production-1da3.up.railway.app)
   ↓ se conecta a ↓
MongoDB Atlas (cluster0.xidtqpz.mongodb.net)
```

**Variables críticas**:
- Frontend: `VITE_API_URL=https://modest-youth-production-1da3.up.railway.app`
- Backend: `CLIENT_URL=https://infinitum-production-e5a2.up.railway.app`
- Backend: `MONGODB_URI=mongodb+srv://jordandiaz2016_db_user:k8ZrRctoGWc355Qy@cluster0.xidtqpz.mongodb.net/?appName=Cluster0`

---

**¡Después de estos pasos tu app debería funcionar correctamente! 🚀**
