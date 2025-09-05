import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Users, Star } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { discoveryService } from '../../services/discoveryService';
import { DashboardLayout } from '../../components/layout/Layout'; // CORRIGIDO: usar layout existente
import { Card } from '../../components/ui'; // CORRIGIDO: usar componente existente
// import NearbyAthletes from '../../components/discovery/NearbyAthletes';
// import NearbyTeams from '../../components/discovery/NearbyTeams';
// import AthleteSearch from '../../components/discovery/AthleteSearch';
// import TeamSearch from '../../components/discovery/TeamSearch';
import { toast } from 'react-hot-toast';




// ❌ REMOVA estas linhas temporariamente:
// import NearbyAthletes from '../../components/discovery/NearbyAthletes';
// import NearbyTeams from '../../components/discovery/NearbyTeams';
// import AthleteSearch from '../../components/discovery/AthleteSearch';
// import TeamSearch from '../../components/discovery/TeamSearch';

// ✅ ADICIONE estes componentes placeholder:
const NearbyAthletes = ({ athletes, loading }) => (
  <div className="bg-white rounded-lg border p-6">
    <h3 className="font-medium mb-4">👤 Atletas Próximos ({athletes.length})</h3>
    {loading ? (
      <p>Carregando...</p>
    ) : (
      <p className="text-gray-500">
        {athletes.length} atletas encontrados (componente em desenvolvimento)
      </p>
    )}
  </div>
);

const NearbyTeams = ({ teams, loading }) => (
  <div className="bg-white rounded-lg border p-6">
    <h3 className="font-medium mb-4">⚽ Times Próximos ({teams.length})</h3>
    {loading ? (
      <p>Carregando...</p>
    ) : (
      <p className="text-gray-500">
        {teams.length} times encontrados (componente em desenvolvimento)
      </p>
    )}
  </div>
);

const AthleteSearch = () => (
  <div className="bg-white rounded-lg border p-6">
    <h3 className="font-medium mb-4">🔍 Buscar Atletas</h3>
    <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
  </div>
);

const TeamSearch = () => (
  <div className="bg-white rounded-lg border p-6">
    <h3 className="font-medium mb-4">🔍 Buscar Times</h3>
    <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
  </div>
);









const SocialDiscovery = () => {
  const { location, error, loading: geoLoading, getCurrentLocation } = useGeolocation();
  const [searchResults, setSearchResults] = useState({ athletes: [], teams: [] });
  const [searchMode, setSearchMode] = useState('nearby');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location && searchMode === 'nearby') {
      searchNearby();
    }
  }, [location, searchMode]);

  const searchNearby = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const results = await discoveryService.searchNearby({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar atletas e times próximos');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = () => {
    getCurrentLocation();
    if (error) {
      toast.error('Erro ao obter localização: ' + error);
    }
  };

  const searchModes = [
    { 
      id: 'nearby', 
      label: '📍 Próximos', 
      desc: 'Baseado na sua localização',
      requiresLocation: true
    },
    { 
      id: 'athletes', 
      label: '👤 Atletas', 
      desc: 'Buscar outros atletas',
      requiresLocation: false
    },
    { 
      id: 'teams', 
      label: '⚽ Times', 
      desc: 'Buscar times disponíveis',
      requiresLocation: false
    }
  ];

  return (
    <DashboardLayout 
      title="Descobrir"
      subtitle="Encontre atletas e times próximos a você"
    >
      <div className="space-y-6">
        {/* Header com botão de localização */}
        <div className="flex justify-end">
          <button
            onClick={handleLocationRequest}
            disabled={geoLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{geoLoading ? 'Obtendo...' : 'Usar Minha Localização'}</span>
          </button>
        </div>

        {/* Status da Localização */}
        {location && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Localização ativa</span>
              <span className="text-green-600 text-sm">
                (Precisão: {Math.round(location.accuracy)}m)
              </span>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-800">{error}</span>
            </div>
          </Card>
        )}

        {/* Modos de Busca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSearchMode(mode.id)}
              disabled={mode.requiresLocation && !location}
              className={`p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                searchMode === mode.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{mode.label}</div>
              <div className="text-sm text-gray-500 mt-1">{mode.desc}</div>
              {mode.requiresLocation && !location && (
                <div className="text-xs text-yellow-600 mt-2">
                  📍 Requer localização
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {searchMode === 'nearby' && location && (
            <>
              <NearbyAthletes 
                athletes={searchResults.athletes} 
                loading={loading}
              />
              <NearbyTeams 
                teams={searchResults.teams} 
                loading={loading}
              />
            </>
          )}
          
          {searchMode === 'athletes' && (
            <div className="lg:col-span-2">
              <AthleteSearch />
            </div>
          )}
          
          {searchMode === 'teams' && (
            <div className="lg:col-span-2">
              <TeamSearch />
            </div>
          )}

          {searchMode === 'nearby' && !location && (
            <div className="lg:col-span-2">
              <Card className="p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Localização necessária
                </h3>
                <p className="text-gray-600 mb-4">
                  Para encontrar atletas e times próximos, precisamos acessar sua localização
                </p>
                <button
                  onClick={handleLocationRequest}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Permitir Acesso à Localização
                </button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialDiscovery;