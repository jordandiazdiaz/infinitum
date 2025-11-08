import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      // Si hay un error, notificar a la ventana padre y cerrar
      if (window.opener) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_ERROR', error },
          window.location.origin
        )
        window.close()
      } else {
        navigate('/settings')
      }
      return
    }

    if (code) {
      // Si hay código, enviarlo a la ventana padre
      if (window.opener) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_SUCCESS', code },
          window.location.origin
        )
        window.close()
      } else {
        navigate('/settings')
      }
    }
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autorización de Google Calendar...</p>
      </div>
    </div>
  )
}

export default GoogleCallback
