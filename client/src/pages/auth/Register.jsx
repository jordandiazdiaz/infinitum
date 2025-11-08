import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'wedding-planner',
    company: {
      name: '',
      ruc: '',
      phone: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('company.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        company: { ...prev.company, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const { confirmPassword, ...dataToSend } = formData
    const result = await register(dataToSend)

    if (result.success) {
      toast.success('Registro exitoso')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Error al registrarse')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
        <p className="text-gray-600">Únete a Infinitum y transforma tus eventos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Juan Pérez"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input pl-10"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="input pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="md:col-span-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Negocio
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="wedding-planner">Wedding Planner</option>
              <option value="event-planner">Event Planner</option>
              <option value="user">Otro</option>
            </select>
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company.name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBriefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="company.name"
                name="company.name"
                type="text"
                value={formData.company.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Mi Empresa"
              />
            </div>
          </div>

          {/* RUC */}
          <div>
            <label htmlFor="company.ruc" className="block text-sm font-medium text-gray-700 mb-2">
              RUC (opcional)
            </label>
            <input
              id="company.ruc"
              name="company.ruc"
              type="text"
              value={formData.company.ruc}
              onChange={handleChange}
              className="input"
              placeholder="20XXXXXXXXX"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label htmlFor="company.phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de Empresa
            </label>
            <input
              id="company.phone"
              name="company.phone"
              type="tel"
              value={formData.company.phone}
              onChange={handleChange}
              className="input"
              placeholder="+51 999 999 999"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            Acepto los{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Política de Privacidad
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
