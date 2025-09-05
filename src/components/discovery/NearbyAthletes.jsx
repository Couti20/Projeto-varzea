// src/components/discovery/NearbyAthletes.jsx - COMPONENTE COMPLETO

import React, { useState } from 'react';
import { MapPin, MessageCircle, Phone, Mail, X } from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { Card } from '../ui';
import { toast } from 'react-hot-toast';

const NearbyAthletes = ({ athletes, loading }) => {
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (athleteId) => {
    setLoadingDetails(true);
    try {
      const details = await discoveryService.getAthleteDetails(athleteId);
      setSelectedAthlete(details);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do atleta');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleContact = (athlete) => {
    toast.success(`Iniciando conversa com ${athlete.name}`);
  };

  const handleInvite = (athlete) => {
    toast.success(`Convite enviado para ${athlete.name}`);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Atletas Próximos</h3>
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
          👤 Atletas Próximos ({athletes.length})
        </h3>
        
        {athletes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">🚶‍♂️</div>
            <p className="text-gray-500 mb-2">Nenhum atleta encontrado na região</p>
            <p className="text-sm text-gray-400">
              Tente aumentar o raio de busca ou ativar sua localização
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {athletes.map(athlete => (
              <div key={athlete.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={athlete.profileImage} 
                      alt={athlete.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{athlete.name}</h4>
                      <p className="text-sm text-gray-600">{athlete.position} • {athlete.age} anos</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {athlete.distance}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          athlete.status === 'free' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {athlete.status === 'free' ? 'Disponível' : 'Em time'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(athlete.id)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm"
                    >
                      Ver Perfil
                    </button>
                    <button 
                      onClick={() => handleContact(athlete)}
                      className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-200 rounded text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Status do Atleta */}
                {athlete.club ? (
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Time atual:</span> {athlete.club.name}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-green-600">
                    <span className="font-medium">🆓 Atleta livre e disponível</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de Detalhes do Atleta */}
      {selectedAthlete && (
        <AthleteDetailsModal 
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
          loading={loadingDetails}
          onContact={handleContact}
          onInvite={handleInvite}
        />
      )}
    </>
  );
};

// Modal de Detalhes do Atleta
const AthleteDetailsModal = ({ athlete, onClose, loading, onContact, onInvite }) => {
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
      <Card className="max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex items-center space-x-4">
            <img 
              src={athlete.profileImage} 
              alt={athlete.name}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{athlete.name}</h3>
              <p className="text-gray-600">{athlete.position} • {athlete.age} anos</p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{athlete.distance} de distância</span>
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

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Status Atual */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Status Atual</h4>
            {athlete.club ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">
                  ⚽ Jogando pelo {athlete.club.name}
                </span>
              </div>
            ) : (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-green-800">
                  🆓 Atleta livre e disponível para propostas
                </span>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Estatísticas</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{athlete.stats?.gamesPlayed || 0}</div>
                <div className="text-sm text-gray-600">Jogos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{athlete.stats?.goals || 0}</div>
                <div className="text-sm text-gray-600">Gols</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{athlete.stats?.assists || 0}</div>
                <div className="text-sm text-gray-600">Assistências</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{athlete.stats?.yellowCards || 0}</div>
                <div className="text-sm text-gray-600">Amarelos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{athlete.stats?.redCards || 0}</div>
                <div className="text-sm text-gray-600">Vermelhos</div>
              </div>
            </div>
          </div>

          {/* Atividade Recente */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Atividade Recente</h4>
            <div className="space-y-2">
              {athlete.recentActivity?.map((activity, index) => (
                <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  • {activity}
                </div>
              )) || (
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  • Sem atividade recente registrada
                </div>
              )}
            </div>
          </div>

          {/* Informações de Contato (se disponível) */}
          {athlete.contactInfo && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contato</h4>
              <div className="space-y-2">
                {athlete.contactInfo.whatsapp && (
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{athlete.contactInfo.whatsapp}</span>
                  </div>
                )}
                {athlete.contactInfo.email && (
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{athlete.contactInfo.email}</span>
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
            onClick={() => onContact(athlete)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Mensagem</span>
          </button>
          <button 
            onClick={() => onInvite(athlete)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Convidar para Time
          </button>
        </div>
      </Card>
    </div>
  );
};

export default NearbyAthletes;