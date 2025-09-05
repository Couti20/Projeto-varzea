// src/components/discovery/TeamSearch.jsx - COMPONENTE COMPLETO

import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Star, MapPin, Calendar } from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { Card } from '../ui';
import { toast } from 'react-hot-toast';

const TeamSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    recruiting: false,
    minMembers: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2 || Object.values(filters).some(f => f !== '' && f !== false)) {
      searchTeams();
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  const searchTeams = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        name: searchTerm,
        ...filters
      };
      
      const teamResults = await discoveryService.searchTeams(searchFilters);
      setResults(teamResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar times');
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
      recruiting: false,
      minMembers: ''
    });
    setSearchTerm('');
  };

  const handleViewTeam = (team) => {
    // Em produção, navegar para página do time
    toast.success(`Visualizando time ${team.name}`);
  };

  const handleApply = (team) => {
    // Em produção, abrir modal de candidatura
    toast.success(`Candidatura enviada para ${team.name}`);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          🔍 Buscar Times
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
          placeholder="Digite o nome do time..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filtros Expandidos */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recruiting"
                checked={filters.recruiting}
                onChange={(e) => handleFilterChange('recruiting', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="recruiting" className="text-sm font-medium text-gray-700">
                Apenas times recrutando
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mín. de Membros
              </label>
              <input
                type="number"
                placeholder="10"
                value={filters.minMembers}
                onChange={(e) => handleFilterChange('minMembers', e.target.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {results.length} time{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(team => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 mb-3">
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{team.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{team.description}</p>
                        </div>
                        {team.recruiting && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full ml-2 flex-shrink-0">
                            Recrutando
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Informações do Time */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Membros:</span>
                      </div>
                      <span className="font-medium">{team.activeMembers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Fundado:</span>
                      </div>
                      <span className="font-medium">{team.founded}</span>
                    </div>
                    
                    {team.distance && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>Distância:</span>
                        </div>
                        <span className="font-medium">{team.distance}</span>
                      </div>
                    )}
                    
                    {team.achievements?.length > 0 && (
                      <div className="flex items-start justify-between text-sm">
                        <span className="text-gray-600">Conquistas:</span>
                        <span className="font-medium text-right flex-1 ml-2">
                          {team.achievements.slice(0, 2).join(', ')}
                          {team.achievements.length > 2 && ` +${team.achievements.length - 2}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Ações */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewTeam(team)}
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
                    
                    {/* Rating simulado */}
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">
                        {(Math.random() * 2 + 3).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchTerm.length >= 2 || Object.values(filters).some(f => f !== '' && f !== false) ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum time encontrado com os critérios especificados</p>
            <p className="text-sm text-gray-400 mt-2">
              Tente ajustar os filtros ou buscar por outro nome
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Digite pelo menos 2 caracteres ou use os filtros para buscar times</p>
            <p className="text-sm text-gray-400 mt-2">
              Encontre times que estão recrutando ou filtre por características específicas
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TeamSearch;