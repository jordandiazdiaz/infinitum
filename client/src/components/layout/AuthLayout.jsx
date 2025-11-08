import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary-600 mb-2">Infinitum</h1>
          <p className="text-gray-600 font-medium">Transforma tus eventos sociales</p>
        </div>

        {/* Auth Form */}
        <Outlet />

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>&copy; 2025 Infinitum. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
