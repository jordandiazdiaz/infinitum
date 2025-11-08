import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layout
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard
import Dashboard from './pages/Dashboard'

// Clients
import ClientList from './pages/clients/ClientList'
import ClientDetail from './pages/clients/ClientDetail'
import ClientCreate from './pages/clients/ClientCreate'

// Events
import EventList from './pages/events/EventList'
import EventDetail from './pages/events/EventDetail'
import EventCreate from './pages/events/EventCreate'
import Calendar from './pages/events/Calendar'

// Quotations
import QuotationList from './pages/quotations/QuotationList'
import QuotationDetail from './pages/quotations/QuotationDetail'
import QuotationCreate from './pages/quotations/QuotationCreate'

// Invoices
import InvoiceList from './pages/invoices/InvoiceList'
import InvoiceDetail from './pages/invoices/InvoiceDetail'
import InvoiceCreate from './pages/invoices/InvoiceCreate'
import AccountsReceivable from './pages/invoices/AccountsReceivable'

// Chatbot
import ChatbotDashboard from './pages/chatbot/ChatbotDashboard'
import ConversationList from './pages/chatbot/ConversationList'
import ConversationDetail from './pages/chatbot/ConversationDetail'

// Settings
import Settings from './pages/Settings'
import Profile from './pages/Profile'

// Reports
import Reports from './pages/Reports'

// Google Calendar Callback
import GoogleCallback from './pages/GoogleCallback'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
      </Route>

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Clients */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientCreate />} />
        <Route path="/clients/:id" element={<ClientDetail />} />

        {/* Events */}
        <Route path="/events" element={<EventList />} />
        <Route path="/events/new" element={<EventCreate />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/calendar" element={<Calendar />} />

        {/* Quotations */}
        <Route path="/quotations" element={<QuotationList />} />
        <Route path="/quotations/new" element={<QuotationCreate />} />
        <Route path="/quotations/:id" element={<QuotationDetail />} />

        {/* Invoices */}
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<InvoiceCreate />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/accounts-receivable" element={<AccountsReceivable />} />

        {/* Chatbot */}
        <Route path="/chatbot" element={<ChatbotDashboard />} />
        <Route path="/chatbot/conversations" element={<ConversationList />} />
        <Route path="/chatbot/conversations/:id" element={<ConversationDetail />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />

        {/* Settings & Profile */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Google Calendar Callback (public route) */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch All - 404 */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
            <a href="/dashboard" className="btn btn-primary">
              Volver al Dashboard
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App
