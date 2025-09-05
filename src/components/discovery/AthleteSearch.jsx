// src/components/discovery/AthleteSearch.jsx - COMPONENTE COMPLETO

import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, MapPin } from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { Card } from '../ui';
import { toast } from 'react-hot-toast';

const AthleteSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: '',
    status: '',
    minAge: '',
    maxAge: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2 || Object.values(filters).some(f => f !== '')) {
      searchAthletes();
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  const searchAthletes = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        name: searchTerm,
        ...filters
      };
      
      const athleteResults = await discoveryService.searchAthletes(searchFilters);
      setResults(athleteResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar atletas');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      position: '',
      status: '',
      minAge: '',
      maxAge: ''
    });
    setSearchTerm('');
  };

  const handleViewProfile = (athlete) => {
    // Em produção, navegar para perfil do atleta
    toast.success(`Visualizando perfil de ${athlete.name}`);
  };

  const handleContact = (athlete) => {
    // Em produção, abrir modal de contato
    toast.success(`Entrando em contato com ${athlete.name}`);
  };

  const positions = [
    'Goleiro', 'Zagueiro', 'Lateral Direito', 'Lateral Esquerdo', 
    'Volante', 'Meio-campo', 'Meia Atacante', 'Ponta Direita',
    'Ponta Esquerda', 'Centroavante', 'Atacante'
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          🔍 Buscar Atletas
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Digite o nome do atleta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filtros Expandidos */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição
              </label>
              <select
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todas</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="free">Disponível</option>
                <option value="active">Em time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade Mín.
              </label>
              <input
                type="number"
                placeholder="18"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade Máx.
              </label>
              <input
                type="number"
                placeholder="35"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div>
        {loading ? (
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
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {results.length} atleta{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </div>
            
            {results.map(athlete => (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          athlete.status === 'free' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {athlete.status === 'free' ? 'Disponível' : 'Em time'}
                        </span>
                        {athlete.club && (
                          <span className="text-xs text-gray-500">
                            Time: {athlete.club.name}
                          </span>
                        )}
                        {athlete.distance && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {athlete.distance}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewProfile(athlete)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm"
                    >
                      Ver Perfil
                    </button>
                    <button 
                      onClick={() => handleContact(athlete)}
                      className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-200 rounded text-sm"
                    >
                      Contatar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm.length >= 2 || Object.values(filters).some(f => f !== '') ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum atleta encontrado com os critérios especificados</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Digite pelo menos 2 caracteres ou use os filtros para buscar atletas</p>
            <p className="text-sm text-gray-400 mt-2">
              Procure por nome, posição ou use os filtros avançados
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AthleteSearch;