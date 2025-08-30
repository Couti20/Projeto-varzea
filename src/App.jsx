import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Club pages
import ClubTeam from './pages/Club/ClubTeam'

// Athlete pages
import AthleteProfile from './pages/Athlete/AthleteProfile'
import AthleteInvites from './pages/Athlete/AthleteInvites'

// Organization pages
import OrganizationChampionships from './pages/Organization/OrganizationChampionships'

// Championship pages
import Championships from './pages/Championship/Championships'
import ChampionshipDetail from './pages/Championship/ChampionshipDetail'

function App() {
  const { user, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Club routes */}
        <Route path="/club/team" element={
          <ProtectedRoute requiredType="club">
            <ClubTeam />
          </ProtectedRoute>
        } />

        {/* Athlete routes */}
        <Route path="/athlete/profile" element={
          <ProtectedRoute requiredType="athlete">
            <AthleteProfile />
          </ProtectedRoute>
        } />
        <Route path="/athlete/invites" element={
          <ProtectedRoute requiredType="athlete">
            <AthleteInvites />
          </ProtectedRoute>
        } />

        {/* Organization routes */}
        <Route path="/organization/championships" element={
          <ProtectedRoute requiredType="organization">
            <OrganizationChampionships />
          </ProtectedRoute>
        } />

        {/* Championship routes */}
        <Route path="/championships" element={
          <ProtectedRoute>
            <Championships />
          </ProtectedRoute>
        } />
        <Route path="/championships/:id" element={
          <ProtectedRoute>
            <ChampionshipDetail />
          </ProtectedRoute>
        } />

        {/* Default redirects */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />
          } 
        />
        
        {/* Catch all - redirect to dashboard or login */}
        <Route 
          path="*" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Layout>
  )
}

export default App