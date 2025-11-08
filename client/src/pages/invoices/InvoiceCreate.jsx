import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import invoiceService from '../../services/invoiceService'
import clientService from '../../services/clientService'
import eventService from '../../services/eventService'
import { toast } from 'react-toastify'

const InvoiceCreate = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    client: '',
    event: '',
    invoiceType: 'factura',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0
      }
    ],
    discount: 0,
    tax: 18,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    paymentTerms: '15 días'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClients()
    loadEvents()
    // Set default due date (15 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 15)
    setFormData(prev => ({
      ...prev,
      dueDate: dueDate.toISOString().split('T')[0]
    }))
  }, [])

  const loadClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 })
      setClients(response.data)
    } catch (error) {
      toast.error('Error al cargar clientes')
    }
  }

  const loadEvents = async () => {
    try {
      const response = await eventService.getEvents({ limit: 100 })
      setEvents(response.data)
    } catch (error) {
      toast.error('Error al cargar eventos')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0
        }
      ]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('Debe haber al menos un item')
      return
    }
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice
    const discountAmount = (subtotal * item.discount) / 100
    return subtotal - discountAmount
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = (subtotal * formData.discount) / 100
    const subtotalWithDiscount = subtotal - discountAmount
    const taxAmount = (subtotalWithDiscount * formData.tax) / 100
    return subtotalWithDiscount + taxAmount
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await invoiceService.createInvoice(formData)
      toast.success('Factura creada correctamente')
      navigate('/invoices')
    } catch (error) {
      toast.error('Error al crear factura')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/invoices" className="text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Factura/Boleta</h1>
          <p className="text-gray-600 mt-1">Crea un nuevo comprobante electrónico</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="card-header">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="invoiceType" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <select
                id="invoiceType"
                name="invoiceType"
                value={formData.invoiceType}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="factura">Factura</option>
                <option value="boleta">Boleta</option>
              </select>
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName} - {client.documentNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
                Evento (Opcional)
              </label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="input"
              >
                <option value="">Sin evento asociado</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.name} - {event.eventType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones de Pago
              </label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="input"
              >
                <option value="Inmediato">Pago Inmediato</option>
                <option value="7 días">7 días</option>
                <option value="15 días">15 días</option>
                <option value="30 días">30 días</option>
                <option value="45 días">45 días</option>
                <option value="60 días">60 días</option>
              </select>
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Emisión *
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Items del Comprobante</h3>
            <button type="button" onClick={addItem} className="btn btn-outline">
              <FiPlus className="w-4 h-4 mr-2" />
              Agregar Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="input"
                      placeholder="Descripción del producto o servicio"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="input"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Unit. *
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="input"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descuento %
                    </label>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="input"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div className="md:col-span-4 text-right">
                    <span className="text-sm text-gray-600">Total del item: </span>
                    <span className="text-lg font-bold text-gray-900">
                      S/ {calculateItemTotal(item).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="card">
          <h3 className="card-header">Totales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                Descuento General %
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-2">
                IGV %
              </label>
              <input
                type="number"
                id="tax"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">S/ {calculateSubtotal().toLocaleString()}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento ({formData.discount}%):</span>
                    <span className="font-medium text-red-600">
                      - S/ {((calculateSubtotal() * formData.discount) / 100).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IGV ({formData.tax}%):</span>
                  <span className="font-medium text-gray-900">
                    S/ {(((calculateSubtotal() * (100 - formData.discount)) / 100) * formData.tax / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-primary-600">S/ {calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h3 className="card-header">Notas Adicionales</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Notas adicionales para el comprobante (opcional)"
          />
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Importante</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Asegúrate de que los datos del cliente sean correctos antes de crear el comprobante</li>
                  <li>Las facturas requieren RUC y razón social válidos</li>
                  <li>Las boletas pueden emitirse con DNI</li>
                  <li>El comprobante será enviado automáticamente a SUNAT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link to="/invoices" className="btn btn-outline">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <FiSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Crear Comprobante'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InvoiceCreate
