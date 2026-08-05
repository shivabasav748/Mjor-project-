import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ThemeProvider } from './lib/ThemeContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Companies from './pages/Companies'
import Overview from './pages/Overview'
import Chat from './pages/Chat'
import Market from './pages/Market'
import Dashboard from './pages/Dashboard'
import Growth from './pages/Growth'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading VentureIQ…</p>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected */}
      <Route path="/companies"                              element={<PrivateRoute><Companies /></PrivateRoute>} />
      <Route path="/companies/:companyId"                   element={<PrivateRoute><Overview /></PrivateRoute>} />
      <Route path="/companies/:companyId/chat"              element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/companies/:companyId/market"            element={<PrivateRoute><Market /></PrivateRoute>} />
      <Route path="/companies/:companyId/dashboard"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/companies/:companyId/growth"            element={<PrivateRoute><Growth /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
