// src/components/championship/MatchGeneration.jsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Shuffle, AlertCircle, CheckCircle, Users, Trophy } from 'lucide-react';
import { useMatchGenerator, calculateMatchStatistics } from '../../utils/matchGenerator';
import { Button } from '../ui';

const MatchGeneration = ({ championship, teams, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [venues, setVenues] = useState(['']);
  const [startDate, setStartDate] = useState('');
  const [matchTime, setMatchTime] = useState('15:00');
  const [daysBetweenMatches, setDaysBetweenMatches] = useState(7);

  const { generateMatches } = useMatchGenerator();

  // Adicionar novo campo
  const addVenue = () => {
    setVenues([...venues, '']);
  };

  // Atualizar campo
  const updateVenue = (index, value) => {
    const newVenues = [...venues];
    newVenues[index] = value;
    setVenues(newVenues);
  };

  // Remover campo
  const removeVenue = (index) => {
    if (venues.length > 1) {
      setVenues(venues.filter((_, i) => i !== index));
    }
  };

  // Gerar prévia dos jogos
  const handleGeneratePreview = () => {
    try {
      setIsGenerating(true);
      
      // Gerar jogos baseado no formato do campeonato
      const matches = generateMatches(teams, championship.format);
      
      // Adicionar datas e locais se fornecidos
      const matchesWithSchedule = addScheduleToMatches(matches);
      
      setGeneratedMatches(matchesWithSchedule);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Erro ao gerar prévia:', error);
      alert('Erro ao gerar jogos: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Adicionar cronograma aos jogos
  const addScheduleToMatches = (matches) => {
    if (!startDate) return matches;

    const scheduledMatches = [...matches];
    const availableVenues = venues.filter(v => v.trim());
    let currentDate = new Date(startDate);
    let venueIndex = 0;

    scheduledMatches.forEach((match, index) => {
      // Definir data
      match.date = new Date(currentDate).toISOString();
      
      // Definir horário
      const matchDate = new Date(currentDate);
      const [hours, minutes] = matchTime.split(':');
      matchDate.setHours(parseInt(hours), parseInt(minutes));
      match.date = matchDate.toISOString();
      
      // Definir local se disponível
      if (availableVenues.length > 0) {
        match.venue = availableVenues[venueIndex % availableVenues.length];
        venueIndex++;
      }

      // Avançar data conforme configuração
      if ((index + 1) % getRoundsPerDay() === 0) {
        currentDate.setDate(currentDate.getDate() + daysBetweenMatches);
      }
    });

    return scheduledMatches;
  };

  // Calcular quantos jogos por dia
  const getRoundsPerDay = () => {
    const availableVenues = venues.filter(v => v.trim()).length;
    return Math.max(1, availableVenues);
  };

  // Confirmar e salvar jogos
  const handleConfirmGeneration = () => {
    onGenerate(generatedMatches);
    setShowPreview(false);
    setGeneratedMatches(null);
  };

  // Resetar preview
  const handleReset = () => {
    setShowPreview(false);
    setGeneratedMatches(null);
  };

  if (showPreview && generatedMatches) {
    const stats = calculateMatchStatistics(generatedMatches);
    
    return (
      <div className="space-y-6">
        {/* Cabeçalho da Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">
                Prévia dos Jogos Gerados
              </h3>
            </div>
            <div className="text-sm text-blue-700">
              {stats.totalMatches} jogos criados
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{stats.totalMatches}</div>
            <div className="text-sm text-gray-600">Total de Jogos</div>
          </div>
          
          {championship.format === 'league' && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{stats.rounds[1] || 0}</div>
              <div className="text-sm text-gray-600">Jogos por Turno</div>
            </div>
          )}
          
          {championship.format === 'knockout' && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(stats.phases).length}
              </div>
              <div className="text-sm text-gray-600">Fases</div>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{teams.length}</div>
            <div className="text-sm text-gray-600">Times</div>
          </div>
          
          {startDate && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">
                {Math.ceil(stats.totalMatches / getRoundsPerDay())}
              </div>
              <div className="text-sm text-gray-600">Dias de Jogos</div>
            </div>
          )}
        </div>

        {/* Lista de Jogos */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h4 className="font-medium text-gray-900">Cronograma de Jogos</h4>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {generatedMatches.map((match, index) => (
              <div 
                key={match.id} 
                className={`p-4 border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium text-sm text-gray-500">
                        {championship.format === 'knockout' && match.phase && (
                          <span className="text-purple-600">{match.phase} - </span>
                        )}
                        {championship.format === 'mixed' && match.group && (
                          <span className="text-blue-600">Grupo {match.group} - </span>
                        )}
                        Jogo #{match.id}
                      </div>
                    </div>
                    
                    <div className="mt-1">
                      <span className="font-medium text-gray-900">
                        {match.homeTeam?.name || 'Time A'} 
                      </span>
                      <span className="text-gray-500 mx-2">vs</span>
                      <span className="font-medium text-gray-900">
                        {match.awayTeam?.name || 'Time B'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    {match.date && (
                      <div className="flex items-center justify-end space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(match.date).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(match.date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    {match.venue && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{match.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Gerar Novamente</span>
          </Button>
          
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Voltar
            </Button>
            <Button 
              onClick={handleConfirmGeneration}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar e Criar Jogos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Validações */}
      <div className="space-y-3">
        {teams.length < 2 && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>É necessário pelo menos 2 times para gerar jogos.</span>
          </div>
        )}
        
        {championship.format === 'knockout' && !isPowerOfTwo(teams.length) && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>
              Para mata-mata, recomendamos {getNextPowerOfTwo(teams.length)} times. 
              Atual: {teams.length} times.
            </span>
          </div>
        )}

        {teams.length > 32 && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>
              Muitos times podem resultar em muitos jogos. 
              Considere dividir em grupos.
            </span>
          </div>
        )}
      </div>

      {/* Informações do Campeonato */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Configuração do Campeonato</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Formato:</span>
            <div className="font-medium capitalize">{championship.format}</div>
          </div>
          <div>
            <span className="text-gray-600">Times:</span>
            <div className="font-medium">{teams.length}</div>
          </div>
          <div>
            <span className="text-gray-600">Jogos estimados:</span>
            <div className="font-medium">
              {getEstimatedMatches(teams.length, championship.format)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Duração estimada:</span>
            <div className="font-medium">
              {getEstimatedDuration(teams.length, championship.format)} semanas
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Cronograma */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          Configurações de Cronograma (Opcional)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Horário Padrão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário Padrão
            </label>
            <input
              type="time"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Intervalor entre Rodadas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias entre Rodadas
            </label>
            <select
              value={daysBetweenMatches}
              onChange={(e) => setDaysBetweenMatches(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={1}>1 dia</option>
              <option value={2}>2 dias</option>
              <option value={3}>3 dias</option>
              <option value={7}>1 semana</option>
              <option value={14}>2 semanas</option>
            </select>
          </div>
        </div>

        {/* Locais */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locais de Jogos
          </label>
          <div className="space-y-2">
            {venues.map((venue, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Local ${index + 1} (ex: Campo do Bairro)`}
                  value={venue}
                  onChange={(e) => updateVenue(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {venues.length > 1 && (
                  <button
                    onClick={() => removeVenue(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={addVenue}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700"
          >
            + Adicionar Local
          </button>
        </div>
      </div>

      {/* Botão de Gerar */}
      <div className="flex justify-center">
        <Button
          onClick={handleGeneratePreview}
          disabled={teams.length < 2 || isGenerating}
          size="lg"
          className="flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5" />
              <span>Gerar Prévia dos Jogos</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Funções utilitárias
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

const getNextPowerOfTwo = (n) => {
  let power = 1;
  while (power < n) power *= 2;
  return power;
};

const getEstimatedMatches = (teams, format) => {
  switch (format) {
    case 'league':
      return teams * (teams - 1); // Ida e volta
    case 'knockout':
      return Math.max(0, (getNextPowerOfTwo(teams) * 2) - 2);
    case 'mixed':
      const groupMatches = Math.floor(teams / 4) * 6; // 4 times por grupo, 6 jogos
      const knockoutMatches = 14; // Estimativa para 16 classificados
      return groupMatches + knockoutMatches;
    default:
      return 0;
  }
};

const getEstimatedDuration = (teams, format) => {
  const matches = getEstimatedMatches(teams, format);
  const matchesPerWeek = 4; // Estimativa
  return Math.ceil(matches / matchesPerWeek);
};

export default MatchGeneration;