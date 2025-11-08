import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import quotationService from '../../services/quotationService'
import clientService from '../../services/clientService'
import { toast } from 'react-toastify'

const QuotationCreate = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    client: '',
    title: '',
    description: '',
    eventDate: '',
    numberOfGuests: 0,
    items: [
      {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0
      }
    ],
    discount: 0,
    tax: 18,
    validUntil: '',
    terms: 'Válido por 15 días. Se requiere adelanto del 50% para confirmar la reserva.',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClients()
    // Set default valid until date (15 days from now)
    const validDate = new Date()
    validDate.setDate(validDate.getDate() + 15)
    setFormData(prev => ({
      ...prev,
      validUntil: validDate.toISOString().split('T')[0]
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
          name: '',
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
      await quotationService.createQuotation(formData)
      toast.success('Cotización creada correctamente')
      navigate('/quotations')
    } catch (error) {
      toast.error('Error al crear cotización')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/quotations" className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Cotización</h1>
          <p className="text-gray-600 mt-1">Crea una nueva cotización para tu cliente</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="card-header">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
                    {client.firstName} {client.lastName} - {client.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Cotización *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Cotización para Boda"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[100px]"
                placeholder="Descripción breve del evento"
              />
            </div>

            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Evento
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Invitados
              </label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
                Válido hasta *
              </label>
              <input
                type="date"
                id="validUntil"
                name="validUntil"
                value={formData.validUntil}
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
            <h3 className="text-xl font-semibold">Items de la Cotización</h3>
            <button type="button" onClick={addItem} className="btn btn-outline inline-flex items-center justify-center">
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
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar item"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="input"
                      placeholder="Nombre del servicio"
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
                      Desc. %
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

                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="input"
                      placeholder="Descripción adicional"
                    />
                  </div>

                  <div className="md:col-span-6 text-right">
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

        {/* Terms and Notes */}
        <div className="card">
          <h3 className="card-header">Términos y Condiciones</h3>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            className="input min-h-[120px]"
            placeholder="Términos y condiciones de la cotización"
          />
        </div>

        <div className="card">
          <h3 className="card-header">Notas Adicionales</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Notas adicionales para el cliente"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-4">
          <Link to="/quotations" className="btn btn-outline inline-flex items-center justify-center">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <FiSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Cotización'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QuotationCreate
