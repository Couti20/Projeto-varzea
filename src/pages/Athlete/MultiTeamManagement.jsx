import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMultiTeamManagement, useMultiTeamStats } from '../../hooks/useMultiTeamManagement';
import { Card } from '../../components/ui';
import { toast } from 'react-hot-toast';

const MultiTeamManagement = () => {
  const { user } = useAuth(); // CORRIGIDO: usar estrutura real
  const [showLeaveModal, setShowLeaveModal] = useState(null);
  
  // CORRIGIDO: Usar hooks integrados
  const {
    teams,
    athlete,
    isLoading,
    error,
    leaveTeam,
    isLeavingTeam
  } = useMultiTeamManagement(user.id);

  const stats = useMultiTeamStats(user.id);

  const handleLeaveTeam = async (team) => {
    try {
      await leaveTeam(team.teamId);
      setShowLeaveModal(null);
    } catch (error) {
      console.error('Erro ao sair do time:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      free: 'bg-gray-100 text-gray-800' // CORRIGIDO: usar status do projeto
    };
    
    const labels = {
      active: 'Ativo',
      pending: 'Pendente', 
      free: 'Livre' // CORRIGIDO
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Meus Times</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Meus Times</h3>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <p className="text-gray-600">Erro ao carregar seus times</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Tentar novamente
          </button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Meus Times</h3>
          <div className="text-sm text-gray-500">
            {stats.totalTeams} time{stats.totalTeams !== 1 ? 's' : ''} • {stats.activeTeams} ativo{stats.activeTeams !== 1 ? 's' : ''}
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">⚽</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum time encontrado
            </h4>
            <p className="text-gray-500 mb-4">
              Você ainda não faz parte de nenhum time. Que tal explorar os times disponíveis?
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Descobrir Times
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.teamId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={team.logo} 
                      alt={`Logo ${team.teamName}`}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{team.teamName}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        {getStatusBadge(team.status)}
                        <span className="text-sm text-gray-500">
                          Função: {team.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          Desde: {new Date(team.joinDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      {team.nextMatch && (
                        <div className="mt-2 text-sm">
                          <span className="text-blue-600">🏆 Próximo jogo: {team.nextMatch}</span>
                        </div>
                      )}
                      
                      {team.currentChampionship && (
                        <div className="mt-1 text-sm">
                          <span className="text-green-600">🏆 {team.currentChampionship}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm">
                      Ver Time
                    </button>
                    <button 
                      onClick={() => setShowLeaveModal(team)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded text-sm"
                      disabled={isLeavingTeam}
                    >
                      {isLeavingTeam ? 'Saindo...' : 'Sair'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de Confirmação */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Saída
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja sair do time <strong>{showLeaveModal.teamName}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLeaveModal(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLeavingTeam}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleLeaveTeam(showLeaveModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isLeavingTeam}
              >
                {isLeavingTeam ? 'Saindo...' : 'Confirmar Saída'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiTeamManagement;