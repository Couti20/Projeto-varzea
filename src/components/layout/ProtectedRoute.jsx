import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente para exibir uma tela de carregamento padronizada
const LoadingScreen = ({ message = "Carregando..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      {/* Spinner animado (requer CSS para a animação) */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

/**
 * Componente principal para proteger rotas.
 * Ele gerencia o estado de carregamento, a autenticação e a verificação de papéis (tipos de usuário).
 * @param {object} props
 * @param {React.ReactNode} props.children - O componente a ser renderizado se o acesso for permitido.
 * @param {string | null} [props.requiredRole=null] - O papel/tipo de usuário necessário para acessar a rota (ex: 'atleta', 'clube').
 * @param {string} [props.unauthorizedPath='/'] - Para onde redirecionar se o usuário não tiver o papel correto.
 */
const ProtectedRoute = ({ children, requiredRole = null, unauthorizedPath = '/' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Exibe a tela de carregamento enquanto o estado de autenticação é verificado.
  if (loading) {
    return <LoadingScreen message="Verificando acesso..." />;
  }

  // 2. Se não houver usuário logado, redireciona para a página de login.
  // Guarda a página atual para redirecionar de volta após o login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se um papel específico é necessário e o usuário não tem esse papel, redireciona.
  if (requiredRole && user.papel !== requiredRole) {
    // Redireciona para uma página de "não autorizado" ou para o dashboard principal.
    return <Navigate to={unauthorizedPath} replace />;
  }

  // 4. Se todas as verificações passarem, renderiza o componente filho.
  return children;
};

/**
 * Componente para rotas públicas que não devem ser acessadas por usuários logados.
 * Ex: Páginas de login e registro.
 * @param {object} props
 * @param {React.ReactNode} props.children - O componente da rota pública.
 * @param {string} [props.redirectTo='/dashboard'] - Para onde redirecionar se o usuário já estiver logado.
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Se o usuário já está logado, redireciona para o dashboard.
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};


// --- Componentes Específicos por Papel (Opcional, mas recomendado) ---
// Simplificam o uso do ProtectedRoute no seu roteador.

export const AthleteRoute = ({ children }) => (
  <ProtectedRoute requiredRole="atleta">
    {children}
  </ProtectedRoute>
);

export const ClubRoute = ({ children }) => (
  <ProtectedRoute requiredRole="clube">
    {children}
  </ProtectedRoute>
);

export const OrganizationRoute = ({ children }) => (
  <ProtectedRoute requiredRole="organizacao">
    {children}
  </ProtectedRoute>
);


export default ProtectedRoute;
