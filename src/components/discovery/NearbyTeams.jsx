// src/components/discovery/NearbyTeams.jsx - COMPONENTE COMPLETO

import React, { useState } from 'react';
import { MapPin, Users, Trophy, Calendar, Phone, Mail, X } from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { Card } from '../ui';
import { toast } from 'react-hot-toast';

const NearbyTeams = ({ teams, loading }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (teamId) => {
    setLoadingDetails(true);
    try {
      const details = await discoveryService.getTeamDetails(teamId);
      setSelectedTeam(details);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do time');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleApply = (team) => {
    toast.success(`Candidatura enviada para ${team.name}`);
  };

  const handleFollow = (team) => {
    toast.success(`Agora você está seguindo ${team.name}`);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Times Próximos</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          ⚽ Times Próximos ({teams.length})
        </h3>
        
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">🏟️</div>
            <p className="text-gray-500 mb-2">Nenhum time encontrado na região</p>
            <p className="text-sm text-gray-400">
              Tente aumentar o raio de busca ou ativar sua localização
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{team.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{team.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {team.distance}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          {team.activeMembers} membros
                        </div>
                        {team.recruiting && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Recrutando
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(team.id)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm"
                    >
                      Ver Time
                    </button>
                    {team.recruiting && (
                      <button 
                        onClick={() => handleApply(team)}
                        className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-200 rounded text-sm"
                      >
                        Candidatar
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Fundado:</span> {team.founded} • 
                  <span className="font-medium ml-2">Conquistas:</span> {team.achievements?.join(', ') || 'Nenhuma'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de Detalhes do Time */}
      {selectedTeam && (
        <TeamDetailsModal 
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          loading={loadingDetails}
          onApply={handleApply}
          onFollow={handleFollow}
        />
      )}
    </>
  );
};

// Modal de Detalhes do Time
const TeamDetailsModal = ({ team, onClose, loading, onApply, onFollow }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6 max-w-md mx-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex items-center space-x-4">
            <img 
              src={team.logo} 
              alt={team.name}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
              <p className="text-gray-600">{team.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {team.distance} de distância
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {team.activeMembers} membros ativos
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Fundado em {team.founded}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Estatísticas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Estatísticas da Temporada</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{team.stats?.wins || 0}</div>
                <div className="text-sm text-gray-600">Vitórias</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{team.stats?.draws || 0}</div>
                <div className="text-sm text-gray-600">Empates</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{team.stats?.losses || 0}</div>
                <div className="text-sm text-gray-600">Derrotas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {team.stats ? (
                    team.stats.goalsFor - team.stats.goalsAgainst > 0 ? '+' : ''
                  ) : ''}
                  {team.stats ? team.stats.goalsFor - team.stats.goalsAgainst : 0}
                </div>
                <div className="text-sm text-gray-600">Saldo</div>
              </div>
            </div>
          </div>

          {/* Jogadores */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Alguns Jogadores</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {team.players?.length > 0 ? team.players.map(player => (
                <div key={player.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={player.profileImage} 
                    alt={player.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.position}</div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                  Informações dos jogadores não disponíveis
                </div>
              )}
            </div>
          </div>

          {/* Conquistas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Conquistas</h4>
            <div className="space-y-2">
              {team.achievements?.length > 0 ? team.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm p-2 bg-yellow-50 rounded">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{achievement}</span>
                </div>
              )) : (
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                  Nenhuma conquista registrada ainda
                </div>
              )}
            </div>
          </div>

          {/* Jogos Recentes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Jogos Recentes</h4>
            <div className="space-y-2">
              {team.recentMatches?.length > 0 ? team.recentMatches.map((match, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">vs {match.opponent}</span>
                  <span className={`text-sm font-medium ${
                    match.result.includes('vs') ? 'text-gray-500' :
                    parseInt(match.result.split('-')[0]) > parseInt(match.result.split('-')[1]) 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {match.result}
                  </span>
                  <span className="text-xs text-gray-500">{match.date}</span>
                </div>
              )) : (
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                  Nenhum jogo recente registrado
                </div>
              )}
            </div>
          </div>

          {/* Horários de Treino */}
          {team.trainingSchedule && (
            <div className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Treinos</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Dias:</span>
                    <p className="text-blue-700">{team.trainingSchedule.days.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Horário:</span>
                    <p className="text-blue-700">{team.trainingSchedule.time}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Local:</span>
                    <p className="text-blue-700">{team.trainingSchedule.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações de Contato */}
          {team.contactInfo && (
            <div className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Contato</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {team.contactInfo.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{team.contactInfo.phone}</span>
                  </div>
                )}
                {team.contactInfo.email && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{team.contactInfo.email}</span>
                  </div>
                )}
                {team.contactInfo.address && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{team.contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Fechar
          </button>
          <button 
            onClick={() => onFollow(team)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Seguir Time
          </button>
          {team.recruiting && (
            <button 
              onClick={() => onApply(team)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Candidatar-se
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NearbyTeams;