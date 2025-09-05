// src/App.jsx - VERSÃO ATUALIZADA E CORRIGIDA
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ChampionshipsProvider } from './context/ChampionshipsContext'

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
import ClubDashboard from './pages/Club/ClubDashboard'

// Athlete pages - EXISTENTES
import AthleteProfile from './pages/Athlete/AthleteProfile'
import AthleteInvites from './pages/Athlete/AthleteInvites'
import AthleteDashboard from './pages/Athlete/AthleteDashboard'

// Athlete pages - NOVAS FUNCIONALIDADES
import MultiTeamManagement from './pages/Athlete/MultiTeamManagement'
import ChampionshipExplorer from './pages/Athlete/ChampionshipExplorer'
import SocialDiscovery from './pages/Athlete/SocialDiscovery'

// Organization pages - ATUALIZADAS
import OrganizationChampionships from './pages/Organization/OrganizationChampionships'
import OrganizationAdvancedDashboard from './pages/Organization/OrganizationAdvancedDashboard'
import CreateChampionship from './pages/Organization/CreateChampionship'
import ChampionshipManage from './pages/Organization/ChampionshipManage'
import ChampionshipTeamsManagement from './pages/Organization/ChampionshipTeamsManagement'
import ChampionshipTables from './pages/Organization/ChampionshipTables'
import ChampionshipResults from './pages/Organization/ChampionshipResults'
import ChampionshipReports from './pages/Organization/ChampionshipReports'
import UnifiedChampionshipDashboard from './pages/Organization/UnifiedChampionshipDashboard'

// Championship pages (visualização pública)
import Championships from './pages/Championship/Championships'
import ChampionshipDetail from './pages/Championship/ChampionshipDetail'
import ChampionshipPublicView from './pages/Championship/ChampionshipView'

// Error pages
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

function App() {
  const { user, loading } = useAuth()

  // Enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <ChampionshipsProvider>
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

          {/* Public championship views */}
          <Route path="/championships" element={<Championships />} />
          <Route path="/championships/:id" element={<ChampionshipPublicView />} />
          <Route path="/championships/:id/standings" element={<ChampionshipPublicView />} />
          <Route path="/championships/:id/matches" element={<ChampionshipPublicView />} />
          <Route path="/championships/:id/stats" element={<ChampionshipPublicView />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Club routes */}
          <Route
            path="/club/*"
            element={
              <ProtectedRoute requiredType="club" unauthorizedPath="/dashboard">
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ClubDashboard />} />
                  <Route path="team" element={<ClubTeam />} />
                  <Route path="profile" element={<Navigate to="/dashboard" />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Athlete routes - EXPANDIDAS COM NOVAS FUNCIONALIDADES */}
          <Route
            path="/athlete/*"
            element={
              <ProtectedRoute requiredType="athlete" unauthorizedPath="/dashboard">
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  
                  {/* Páginas existentes */}
                  <Route path="dashboard" element={<AthleteDashboard />} />
                  <Route path="profile" element={<AthleteProfile />} />
                  <Route path="invites" element={<AthleteInvites />} />
                  
                  {/* NOVAS FUNCIONALIDADES - Módulo Expandido */}
                  <Route path="teams" element={<MultiTeamManagement />} />
                  <Route path="championships" element={<ChampionshipExplorer />} />
                  <Route path="discover" element={<SocialDiscovery />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Organization routes - COMPLETAS */}
          <Route
            path="/organization/*"
            element={
              <ProtectedRoute requiredType="organization" unauthorizedPath="/dashboard">
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  
                  {/* Dashboard principal da organização */}
                  <Route path="dashboard" element={<OrganizationAdvancedDashboard />} />
                  
                  {/* Gerenciamento de campeonatos */}
                  <Route path="championships" element={<OrganizationChampionships />} />
                  <Route path="championships/create" element={<CreateChampionship />} />
                  
                  {/* Rotas específicas de campeonato */}
                  <Route path="championships/:id" element={<UnifiedChampionshipDashboard />} />
                  <Route path="championships/:id/dashboard" element={<UnifiedChampionshipDashboard />} />
                  <Route path="championships/:id/manage" element={<ChampionshipManage />} />
                  <Route path="championships/:id/teams" element={<ChampionshipTeamsManagement />} />
                  <Route path="championships/:id/tables" element={<ChampionshipTables />} />
                  <Route path="championships/:id/results" element={<ChampionshipResults />} />
                  <Route path="championships/:id/reports" element={<ChampionshipReports />} />
                  
                  {/* Redirecionamentos para compatibilidade */}
                  <Route path="championships/:id/view" element={<Navigate to="/organization/championships/:id" replace />} />
                  <Route path="championships/:id/matches" element={<Navigate to="/organization/championships/:id/results" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Error routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />

          {/* Root redirect */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />
            } 
          />

          {/* 404 - deve ser a última rota */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ChampionshipsProvider>
  )
}

export default App