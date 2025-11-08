# Configuración de Google Calendar para SEVEM

Esta guía te ayudará a configurar la integración con Google Calendar para sincronizar automáticamente los eventos creados en SEVEM con Google Calendar.

## Requisitos Previos

- Una cuenta de Google
- Acceso al [Google Cloud Console](https://console.cloud.google.com/)

## Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el menú desplegable de proyectos en la parte superior
3. Haz clic en **"Nuevo Proyecto"**
4. Dale un nombre al proyecto (ej: "SEVEM Platform")
5. Haz clic en **"Crear"**

## Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google Calendar API"**
3. Haz clic en **"Google Calendar API"**
4. Haz clic en **"Habilitar"**

## Paso 3: Configurar Pantalla de Consentimiento OAuth

1. En el menú lateral, ve a **"APIs y servicios" > "Pantalla de consentimiento de OAuth"**
2. Selecciona **"Externo"** como tipo de usuario
3. Haz clic en **"Crear"**
4. Completa la información requerida:
   - **Nombre de la aplicación**: SEVEM Platform
   - **Correo electrónico de asistencia**: tu-email@ejemplo.com
   - **Correo electrónico de contacto del desarrollador**: tu-email@ejemplo.com
5. Haz clic en **"Guardar y continuar"**
6. En la sección de **"Permisos"**, haz clic en **"Agregar o quitar permisos"**
7. Busca y selecciona los siguientes permisos:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
8. Haz clic en **"Actualizar"**
9. Haz clic en **"Guardar y continuar"**
10. En **"Usuarios de prueba"**, agrega los correos de las cuentas que podrán conectar Google Calendar (si tu app está en modo desarrollo)
11. Haz clic en **"Guardar y continuar"**

## Paso 4: Crear Credenciales OAuth 2.0

1. En el menú lateral, ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"Crear credenciales" > "ID de cliente de OAuth 2.0"**
3. Selecciona **"Aplicación web"** como tipo de aplicación
4. Dale un nombre (ej: "SEVEM Web Client")
5. En **"Orígenes de JavaScript autorizados"**, agrega:
   ```
   http://localhost:5173
   ```
6. En **"URI de redirección autorizados"**, agrega:
   ```
   http://localhost:5173/auth/google/callback
   ```
7. Haz clic en **"Crear"**
8. Se mostrará un diálogo con tu **Client ID** y **Client Secret**. ¡Guárdalos en un lugar seguro!

## Paso 5: Configurar Variables de Entorno

1. Abre el archivo `/server/.env`
2. Actualiza las siguientes variables con las credenciales que obtuviste:

```env
# Google Calendar
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

3. Guarda el archivo

## Paso 6: Reiniciar el Servidor

Reinicia el servidor backend para que tome las nuevas variables de entorno:

```bash
cd server
npm run dev
```

## Paso 7: Conectar Google Calendar desde la Aplicación

1. Inicia sesión en SEVEM
2. Ve a **Configuración** (icono de engranaje)
3. Selecciona la pestaña **"Google Calendar"**
4. Haz clic en **"Conectar con Google Calendar"**
5. Se abrirá una ventana emergente de Google
6. Selecciona tu cuenta de Google
7. Acepta los permisos solicitados
8. La ventana se cerrará automáticamente y verás el mensaje de éxito

## Uso

Una vez conectado, todos los eventos que crees en SEVEM se sincronizarán automáticamente con tu Google Calendar. También podrás:

- Ver eventos en tu Google Calendar
- Recibir notificaciones de Google para tus eventos
- Mantener sincronizados los cambios en tiempo real

## Producción

Cuando despliegues la aplicación en producción, recuerda:

1. Actualizar las URIs autorizadas en Google Cloud Console con tu dominio de producción:
   ```
   https://tu-dominio.com
   https://tu-dominio.com/auth/google/callback
   ```

2. Actualizar las variables de entorno en tu servidor de producción:
   ```env
   GOOGLE_REDIRECT_URI=https://tu-dominio.com/auth/google/callback
   ```

3. Publicar tu aplicación OAuth (sacarla del modo de prueba) en Google Cloud Console

## Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que la URI de redirección en Google Cloud Console coincida exactamente con `GOOGLE_REDIRECT_URI` en tu archivo .env
- Asegúrate de incluir el protocolo (http:// o https://)

### Error: "access_denied"
- Verifica que hayas agregado tu cuenta de Google como usuario de prueba
- Asegúrate de haber aceptado todos los permisos solicitados

### No se abre la ventana emergente
- Verifica que tu navegador no esté bloqueando ventanas emergentes
- Intenta desactivar extensiones que puedan bloquear ventanas emergentes

## Recursos Adicionales

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 para aplicaciones web](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Cloud Console](https://console.cloud.google.com/)
