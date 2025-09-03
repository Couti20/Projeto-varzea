// src/components/championship/AdvancedSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Settings, 
  Users, 
  Trophy, 
  Clock, 
  Shield, 
  DollarSign,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui';
import { toast } from 'react-hot-toast';

const AdvancedSettings = ({ 
  championship, 
  onSave, 
  onCancel,
  isLoading = false 
}) => {
  const [settings, setSettings] = useState({
    // Configurações básicas
    name: '',
    description: '',
    maxTeams: 16,
    registrationFee: 0,
    registrationDeadline: '',
    
    // Configurações de pontuação
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    
    // Configurações de jogo
    matchDuration: 90,
    matchPeriods: 2,
    intervalDuration: 15,
    extraTime: false,
    substitutions: 3,
    
    // Configurações disciplinares
    yellowCardLimit: 2,
    redCardSuspension: 1,
    
    // Configurações de classificação
    tiebreakers: ['points', 'wins', 'goalDifference', 'goalsFor'],
    
    // Configurações de times
    minPlayers: 11,
    maxPlayers: 23,
    
    // Configurações de local e horário
    defaultVenue: '',
    defaultMatchTime: '15:00',
    daysBetweenRounds: 7,
    
    // Configurações de premiação
    hasAwards: false,
    firstPlaceAward: 0,
    secondPlaceAward: 0,
    thirdPlaceAward: 0,
    topScorerAward: 0,
    
    // Configurações avançadas
    allowPublicView: true,
    requirePaymentBeforePlay: true,
    autoGenerateFixtures: false,
    sendNotifications: true,
    allowLiveScore: true,
    
    // Regras customizadas
    customRules: [],
    
    // Configurações de mídia
    allowPhotos: true,
    allowLiveStream: false,
    
    // Configurações de contato
    organizerName: '',
    organizerPhone: '',
    organizerEmail: ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Carregar configurações do campeonato
  useEffect(() => {
    if (championship) {
      const championshipSettings = {
        name: championship.name || '',
        description: championship.description || '',
        maxTeams: championship.maxTeams || 16,
        registrationFee: championship.registrationFee || 0,
        registrationDeadline: championship.registrationDeadline || '',
        
        // Carregar configurações existentes ou usar padrões
        ...championship.settings,
        
        // Configurações específicas
        organizerName: championship.organizerName || '',
        organizerPhone: championship.organizerPhone || '',
        organizerEmail: championship.organizerEmail || ''
      };
      
      setSettings(championshipSettings);
    }
  }, [championship]);

  // Detectar mudanças
  useEffect(() => {
    setHasChanges(true);
  }, [settings]);

  // Atualizar configuração
  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      
      // Suporte para propriedades aninhadas
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  // Validar configurações
  const validateSettings = () => {
    const errors = {};
    
    if (!settings.name || settings.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (settings.maxTeams < 2) {
      errors.maxTeams = 'Deve permitir pelo menos 2 times';
    }
    
    if (settings.registrationFee < 0) {
      errors.registrationFee = 'Taxa não pode ser negativa';
    }
    
    if (settings.pointsWin <= settings.pointsDraw) {
      errors.pointsWin = 'Pontos por vitória devem ser maiores que por empate';
    }
    
    if (settings.matchDuration < 1 || settings.matchDuration > 200) {
      errors.matchDuration = 'Duração deve estar entre 1 e 200 minutos';
    }
    
    if (settings.minPlayers < 7 || settings.minPlayers > settings.maxPlayers) {
      errors.minPlayers = 'Mínimo de jogadores inválido';
    }
    
    if (settings.maxPlayers > 30) {
      errors.maxPlayers = 'Máximo de jogadores não pode exceder 30';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Salvar configurações
  const handleSave = async () => {
    if (!validateSettings()) {
      toast.error('Corrija os erros antes de salvar');
      return;
    }

    try {
      await onSave(settings);
      setHasChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  // Resetar configurações
  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações?')) {
      setSettings({
        ...settings,
        pointsWin: 3,
        pointsDraw: 1,
        pointsLoss: 0,
        matchDuration: 90,
        matchPeriods: 2,
        intervalDuration: 15,
        yellowCardLimit: 2,
        redCardSuspension: 1,
        minPlayers: 11,
        maxPlayers: 23
      });
      toast.info('Configurações resetadas');
    }
  };

  // Adicionar regra customizada
  const addCustomRule = () => {
    const rule = prompt('Digite a nova regra:');
    if (rule) {
      updateSetting('customRules', [...settings.customRules, {
        id: Date.now(),
        text: rule,
        priority: 'normal'
      }]);
    }
  };

  // Remover regra customizada
  const removeCustomRule = (ruleId) => {
    updateSetting('customRules', settings.customRules.filter(r => r.id !== ruleId));
  };

  const tabs = [
    { id: 'basic', label: 'Básico', icon: Settings },
    { id: 'scoring', label: 'Pontuação', icon: Trophy },
    { id: 'match', label: 'Jogos', icon: Clock },
    { id: 'teams', label: 'Times', icon: Users },
    { id: 'discipline', label: 'Disciplina', icon: Shield },
    { id: 'awards', label: 'Premiação', icon: DollarSign },
    { id: 'advanced', label: 'Avançado', icon: Settings }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Configurações Avançadas
            </h2>
            <p className="text-gray-600 mt-1">
              Personalize completamente seu campeonato
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Alterações não salvas</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mt-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tab: Básico */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Campeonato *
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Times
                </label>
                <input
                  type="number"
                  min="2"
                  max="64"
                  value={settings.maxTeams}
                  onChange={(e) => updateSetting('maxTeams', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.maxTeams ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.maxTeams && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.maxTeams}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxa de Inscrição (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.registrationFee}
                  onChange={(e) => updateSetting('registrationFee', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.registrationFee ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo de Inscrição
                </label>
                <input
                  type="datetime-local"
                  value={settings.registrationDeadline}
                  onChange={(e) => updateSetting('registrationDeadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                rows={4}
                value={settings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Descreva seu campeonato..."
              />
            </div>

            {/* Organizador */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Organizador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={settings.organizerName}
                    onChange={(e) => updateSetting('organizerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={settings.organizerPhone}
                    onChange={(e) => updateSetting('organizerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.organizerEmail}
                    onChange={(e) => updateSetting('organizerEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Pontuação */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Sistema de Pontuação</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Configure quantos pontos cada time ganha por resultado
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pontos por Vitória
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.pointsWin}
                  onChange={(e) => updateSetting('pointsWin', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.pointsWin ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.pointsWin && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.pointsWin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pontos por Empate
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.pointsDraw}
                  onChange={(e) => updateSetting('pointsDraw', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pontos por Derrota
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.pointsLoss}
                  onChange={(e) => updateSetting('pointsLoss', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Critérios de desempate */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Critérios de Desempate
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ordem de prioridade para desempatar times com mesma pontuação
              </p>
              
              <div className="space-y-2">
                {[
                  { id: 'points', label: 'Pontos' },
                  { id: 'wins', label: 'Vitórias' },
                  { id: 'goalDifference', label: 'Saldo de Gols' },
                  { id: 'goalsFor', label: 'Gols Marcados' },
                  { id: 'goalsAgainst', label: 'Gols Sofridos' },
                  { id: 'headToHead', label: 'Confronto Direto' }
                ].map((criteria, index) => (
                  <div key={criteria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{index + 1}º - {criteria.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Jogos */}
        {activeTab === 'match' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração do Jogo (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={settings.matchDuration}
                  onChange={(e) => updateSetting('matchDuration', parseInt(e.target.value) || 90)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.matchDuration ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.matchDuration && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.matchDuration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Períodos
                </label>
                <select
                  value={settings.matchPeriods}
                  onChange={(e) => updateSetting('matchPeriods', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1 Tempo</option>
                  <option value={2}>2 Tempos</option>
                  <option value={4}>4 Quartos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração do Intervalo (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.intervalDuration}
                  onChange={(e) => updateSetting('intervalDuration', parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Substituições Permitidas
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={settings.substitutions}
                  onChange={(e) => updateSetting('substitutions', parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Padrão
                </label>
                <input
                  type="text"
                  value={settings.defaultVenue}
                  onChange={(e) => updateSetting('defaultVenue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Campo do Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário Padrão
                </label>
                <input
                  type="time"
                  value={settings.defaultMatchTime}
                  onChange={(e) => updateSetting('defaultMatchTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Configurações extras */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="extraTime"
                  checked={settings.extraTime}
                  onChange={(e) => updateSetting('extraTime', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="extraTime" className="ml-2 block text-sm text-gray-900">
                  Permitir Tempo Extra (mata-mata)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowLiveScore"
                  checked={settings.allowLiveScore}
                  onChange={(e) => updateSetting('allowLiveScore', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="allowLiveScore" className="ml-2 block text-sm text-gray-900">
                  Permitir Atualizações de Placar ao Vivo
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Times */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mínimo de Jogadores
                </label>
                <input
                  type="number"
                  min="7"
                  max="30"
                  value={settings.minPlayers}
                  onChange={(e) => updateSetting('minPlayers', parseInt(e.target.value) || 11)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.minPlayers ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.minPlayers && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.minPlayers}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Jogadores
                </label>
                <input
                  type="number"
                  min="11"
                  max="30"
                  value={settings.maxPlayers}
                  onChange={(e) => updateSetting('maxPlayers', parseInt(e.target.value) || 23)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.maxPlayers ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.maxPlayers && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.maxPlayers}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requirePaymentBeforePlay"
                  checked={settings.requirePaymentBeforePlay}
                  onChange={(e) => updateSetting('requirePaymentBeforePlay', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="requirePaymentBeforePlay" className="ml-2 block text-sm text-gray-900">
                  Exigir pagamento antes de jogar
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Disciplina */}
        {activeTab === 'discipline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de Cartões Amarelos
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.yellowCardLimit}
                  onChange={(e) => updateSetting('yellowCardLimit', parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número de cartões para suspensão automática
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jogos de Suspensão (Cartão Vermelho)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.redCardSuspension}
                  onChange={(e) => updateSetting('redCardSuspension', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Premiação */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasAwards"
                checked={settings.hasAwards}
                onChange={(e) => updateSetting('hasAwards', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="hasAwards" className="block text-sm font-medium text-gray-900">
                Este campeonato tem premiação
              </label>
            </div>

            {settings.hasAwards && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1º Lugar (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.firstPlaceAward}
                      onChange={(e) => updateSetting('firstPlaceAward', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      2º Lugar (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.secondPlaceAward}
                      onChange={(e) => updateSetting('secondPlaceAward', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3º Lugar (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.thirdPlaceAward}
                      onChange={(e) => updateSetting('thirdPlaceAward', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artilheiro (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.topScorerAward}
                      onChange={(e) => updateSetting('topScorerAward', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm">
                    <strong>Total em Premiação:</strong> R$ {(
                      (settings.firstPlaceAward || 0) +
                      (settings.secondPlaceAward || 0) +
                      (settings.thirdPlaceAward || 0) +
                      (settings.topScorerAward || 0)
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Avançado */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Configurações de visibilidade */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Visibilidade e Acesso
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowPublicView"
                    checked={settings.allowPublicView}
                    onChange={(e) => updateSetting('allowPublicView', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowPublicView" className="ml-2 block text-sm text-gray-900">
                    Permitir visualização pública (sem necessidade de login)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendNotifications"
                    checked={settings.sendNotifications}
                    onChange={(e) => updateSetting('sendNotifications', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendNotifications" className="ml-2 block text-sm text-gray-900">
                    Enviar notificações automáticas
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de automação */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Automação
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoGenerateFixtures"
                    checked={settings.autoGenerateFixtures}
                    onChange={(e) => updateSetting('autoGenerateFixtures', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoGenerateFixtures" className="ml-2 block text-sm text-gray-900">
                    Gerar tabela de jogos automaticamente
                  </label>
                </div>
              </div>
            </div>

            {/* Regras customizadas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Regras Customizadas
              </h3>
              <div className="space-y-3">
                {settings.customRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{rule.text}</span>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => removeCustomRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addCustomRule}
                  className="w-full"
                >
                  Adicionar Regra
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resetar</span>
            </Button>
            
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {Object.keys(validationErrors).length > 0 && (
              <span className="text-sm text-red-600">
                {Object.keys(validationErrors).length} erro(s) encontrado(s)
              </span>
            )}

            <Button
              onClick={handleSave}
              disabled={isLoading || Object.keys(validationErrors).length > 0}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Salvar Configurações</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;