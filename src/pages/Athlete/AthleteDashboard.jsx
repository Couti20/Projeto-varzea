import { Link } from 'react-router-dom';
import MultiTeamManagement from './MultiTeamManagement';

const AthleteDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Atleta</h1>
      
      {/* Seção de Navegação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link 
          to="/athlete/teams"
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">⚽</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Meus Times</h3>
              <p className="text-sm text-gray-600">Gerenciar vínculos</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/athlete/championships"
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-lg">🏆</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Campeonatos</h3>
              <p className="text-sm text-gray-600">Explorar competições</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/athlete/discover"
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">🌍</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Descobrir</h3>
              <p className="text-sm text-gray-600">Encontrar próximos</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Componente de Múltiplos Times */}
      <MultiTeamManagement />

      {/* Seção de Estatísticas (opcional) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Minhas Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Jogos Disputados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Gols Marcados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-gray-600">Assistências</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Cartões Amarelos</div>
          </div>
        </div>
      </div>

      {/* Próximos Jogos (opcional) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Próximos Jogos</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-center">Nenhum jogo agendado</p>
        </div>
      </div>
    </div>
  );
};

export default AthleteDashboard;