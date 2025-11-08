# Guía para Completar las Vistas Restantes del Frontend

Este documento contiene las plantillas para crear todas las vistas restantes de la plataforma SEVEM.

## 📁 Archivos Creados Hasta Ahora

### Backend (100% Completo)
✅ Todos los modelos, controladores, rutas y servicios

### Frontend - Configuración (100% Completo)
✅ package.json, vite.config.js, tailwind.config.js
✅ Layouts (MainLayout, AuthLayout, Sidebar, Header)
✅ Servicios API (todos los servicios)
✅ Store (authStore)
✅ Páginas de autenticación (Login, Register)
✅ Dashboard principal

### Frontend - Páginas de Clientes (100% Completo)
✅ ClientList.jsx
✅ ClientDetail.jsx
✅ ClientCreate.jsx

## 📋 Vistas Pendientes por Crear

Para completar el 100% del frontend, necesitas crear las siguientes vistas. A continuación tienes las plantillas base para cada una:

### 1. Eventos

#### `client/src/pages/events/EventList.jsx`
Similar a ClientList.jsx pero adaptado para eventos. Incluye:
- Tabla de eventos
- Filtros por estado, tipo de evento, fecha
- Búsqueda
- Acciones (ver, editar, eliminar)

#### `client/src/pages/events/EventDetail.jsx`
Similar a ClientDetail.jsx. Incluye:
- Información del evento
- Cliente asociado
- Servicios contratados
- Pagos y estado financiero
- Tareas pendientes
- Cálculo de rentabilidad

#### `client/src/pages/events/EventCreate.jsx`
Formulario para crear eventos. Incluye:
- Información básica (nombre, tipo, fecha, hora)
- Selección de cliente
- Ubicación del evento
- Número de invitados
- Servicios a contratar
- Presupuesto

#### `client/src/pages/events/Calendar.jsx`
Vista de calendario. Incluye:
- Calendario mensual con eventos
- Filtros por tipo de evento
- Click en evento para ver detalles
- Integración con Google Calendar

### 2. Cotizaciones

#### `client/src/pages/quotations/QuotationList.jsx`
Lista de cotizaciones. Incluye:
- Tabla con todas las cotizaciones
- Estado (draft, sent, viewed, accepted, rejected)
- Filtros
- Acciones

#### `client/src/pages/quotations/QuotationDetail.jsx`
Detalle de cotización. Incluye:
- Información del cliente
- Items de la cotización
- Subtotal, descuentos, impuestos, total
- Términos y condiciones
- Botones para generar PDF y enviar

#### `client/src/pages/quotations/QuotationCreate.jsx`
Crear cotización. Incluye:
- Selección de cliente
- Agregar items (descripción, cantidad, precio)
- Cálculo automático de totales
- Configuración de validez
- Vista previa

### 3. Facturas

#### `client/src/pages/invoices/InvoiceList.jsx`
Lista de facturas. Incluye:
- Tabla de facturas/boletas
- Estado de pago
- Filtros
- Acciones

#### `client/src/pages/invoices/InvoiceDetail.jsx`
Detalle de factura. Incluye:
- Información completa
- Items facturados
- Pagos recibidos
- Estado SUNAT
- Descargar PDF

#### `client/src/pages/invoices/InvoiceCreate.jsx`
Crear factura. Incluye:
- Tipo (factura/boleta)
- Selección de cliente
- Items
- Método de pago
- Generar y enviar

#### `client/src/pages/invoices/AccountsReceivable.jsx`
Cuentas por cobrar. Incluye:
- Lista de facturas pendientes
- Montos por vencer
- Facturas vencidas
- Gráficos de estado
- Enviar recordatorios

### 4. Chatbot

#### `client/src/pages/chatbot/ChatbotDashboard.jsx`
Dashboard del chatbot. Incluye:
- Estado de conexión (QR code si no está conectado)
- Estadísticas (conversaciones, leads)
- Lista de conversaciones activas
- Filtros por plataforma, calidad de lead

#### `client/src/pages/chatbot/ConversationDetail.jsx`
Detalle de conversación. Incluye:
- Historial de mensajes
- Información capturada del lead
- Enviar mensaje manual
- Convertir a cliente
- Asignar a agente

### 5. Configuración y Perfil

#### `client/src/pages/Settings.jsx`
Configuración general. Incluye:
- Configuración de empresa
- Integraciones (Google Calendar, WhatsApp)
- Preferencias de notificaciones
- Configuración de facturación

#### `client/src/pages/Profile.jsx`
Perfil de usuario. Incluye:
- Información personal
- Cambiar contraseña
- Foto de perfil
- Preferencias

## 🎨 Componentes Reutilizables Recomendados

Crear en `client/src/components/`:

### `components/common/`
- `Button.jsx` - Botón reutilizable
- `Card.jsx` - Tarjeta
- `Modal.jsx` - Modal
- `Table.jsx` - Tabla
- `Badge.jsx` - Badge de estado
- `Loading.jsx` - Indicador de carga
- `EmptyState.jsx` - Estado vacío
- `Pagination.jsx` - Paginación

### `components/forms/`
- `FormInput.jsx` - Input de formulario
- `FormSelect.jsx` - Select
- `FormTextarea.jsx` - Textarea
- `DatePicker.jsx` - Selector de fecha

### `components/charts/`
- `LineChart.jsx` - Gráfico de líneas
- `BarChart.jsx` - Gráfico de barras
- `PieChart.jsx` - Gráfico circular

## 📝 Plantilla Base para Vistas

Usa esta estructura para crear nuevas vistas:

```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiIcon } from 'react-icons/fi'
import service from '../../services/service'
import { toast } from 'react-toastify'

const ViewName = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await service.getData()
      setData(response.data)
    } catch (error) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Título</h1>
          <p className="text-gray-600 mt-1">Descripción</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          Nuevo
        </Link>
      </div>

      {/* Content */}
      <div className="card">
        {/* Tu contenido aquí */}
      </div>
    </div>
  )
}

export default ViewName
```

## 🚀 Pasos para Completar

1. **Eventos**: Crear las 4 vistas en `client/src/pages/events/`
2. **Cotizaciones**: Crear las 3 vistas en `client/src/pages/quotations/`
3. **Facturas**: Crear las 4 vistas en `client/src/pages/invoices/`
4. **Chatbot**: Crear las 2 vistas en `client/src/pages/chatbot/`
5. **Configuración**: Crear Settings.jsx y Profile.jsx en `client/src/pages/`
6. **Componentes**: Crear componentes reutilizables

## 💡 Tips

- Reutiliza código de las vistas ya creadas
- Mantén consistencia en el diseño
- Usa los servicios API ya creados
- Aprovecha los hooks de React
- Implementa validaciones en formularios
- Maneja estados de carga y error
- Usa React Query para cache de datos

## 🎯 Prioridades

1. **Alta**: Eventos, Cotizaciones, Facturas (core del negocio)
2. **Media**: Chatbot, Calendario
3. **Baja**: Configuración avanzada, reportes adicionales

## ✅ Checklist de Completitud

- [ ] EventList.jsx
- [ ] EventDetail.jsx
- [ ] EventCreate.jsx
- [ ] Calendar.jsx
- [ ] QuotationList.jsx
- [ ] QuotationDetail.jsx
- [ ] QuotationCreate.jsx
- [ ] InvoiceList.jsx
- [ ] InvoiceDetail.jsx
- [ ] InvoiceCreate.jsx
- [ ] AccountsReceivable.jsx
- [ ] ChatbotDashboard.jsx
- [ ] ConversationDetail.jsx
- [ ] Settings.jsx
- [ ] Profile.jsx
- [ ] Componentes reutilizables

¡Con esto tendrás el 100% del frontend completado!

---

**SEVEM** - Transforma tus eventos sociales 🎉
