// src/hooks/useAnalytics.js
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { apiClient } from '../services/api'

// Hook principal para analytics
export const useAnalytics = (entityType, entityId, timeRange = '30d') => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  // Métricas gerais
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['analytics', 'metrics', entityType, entityId, dateRange],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/${entityType}/${entityId}/metrics`, {
        params: { ...dateRange }
      })
      return response.data
    },
    enabled: !!entityType && !!entityId,
    staleTime: 5 * 60 * 1000
  })

  // Dados de tendência
  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics', 'trends', entityType, entityId, dateRange],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/${entityType}/${entityId}/trends`, {
        params: { ...dateRange }
      })
      return response.data
    },
    enabled: !!entityType && !!entityId,
    staleTime: 5 * 60 * 1000
  })

  // Comparação com período anterior
  const { data: comparison } = useQuery({
    queryKey: ['analytics', 'comparison', entityType, entityId, dateRange],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/${entityType}/${entityId}/comparison`, {
        params: { ...dateRange }
      })
      return response.data
    },
    enabled: !!entityType && !!entityId,
    staleTime: 10 * 60 * 1000
  })

  // Performance rankings
  const { data: rankings } = useQuery({
    queryKey: ['analytics', 'rankings', entityType, dateRange],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/${entityType}/rankings`, {
        params: { ...dateRange }
      })
      return response.data
    },
    enabled: !!entityType,
    staleTime: 15 * 60 * 1000
  })

  return {
    metrics,
    trends,
    comparison,
    rankings,
    dateRange,
    setDateRange,
    isLoading: metricsLoading || trendsLoading
  }
}

// Hook para analytics de atletas
export const useAthleteAnalytics = (athleteId) => {
  const baseAnalytics = useAnalytics('athlete', athleteId)
  
  // Estatísticas específicas do atleta
  const { data: performanceData } = useQuery({
    queryKey: ['athlete-analytics', athleteId, 'performance'],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/athlete/${athleteId}/performance`)
      return response.data
    },
    enabled: !!athleteId
  })

  const processedMetrics = useMemo(() => {
    if (!baseAnalytics.metrics) return null

    const { metrics } = baseAnalytics
    return {
      overall: {
        goals: metrics.totalGoals || 0,
        assists: metrics.totalAssists || 0,
        matches: metrics.totalMatches || 0,
        averageRating: metrics.averageRating || 0,
        minutesPlayed: metrics.minutesPlayed || 0
      },
      efficiency: {
        goalsPerMatch: metrics.totalMatches > 0 ? (metrics.totalGoals / metrics.totalMatches).toFixed(2) : '0.00',
        assistsPerMatch: metrics.totalMatches > 0 ? (metrics.totalAssists / metrics.totalMatches).toFixed(2) : '0.00',
        goalInvolvement: ((metrics.totalGoals + metrics.totalAssists) / Math.max(metrics.totalMatches, 1)).toFixed(2),
        minutesPerGoal: metrics.totalGoals > 0 ? Math.round(metrics.minutesPlayed / metrics.totalGoals) : 0
      },
      disciplinary: {
        yellowCards: metrics.yellowCards || 0,
        redCards: metrics.redCards || 0,
        foulsCommitted: metrics.foulsCommitted || 0
      }
    }
  }, [baseAnalytics.metrics])

  return {
    ...baseAnalytics,
    performanceData,
    processedMetrics
  }
}

// Hook para analytics de clubes
export const useClubAnalytics = (clubId) => {
  const baseAnalytics = useAnalytics('club', clubId)
  
  const processedMetrics = useMemo(() => {
    if (!baseAnalytics.metrics) return null

    const { metrics } = baseAnalytics
    return {
      results: {
        wins: metrics.wins || 0,
        draws: metrics.draws || 0,
        losses: metrics.losses || 0,
        winPercentage: metrics.totalMatches > 0 ? ((metrics.wins / metrics.totalMatches) * 100).toFixed(1) : '0.0'
      },
      goals: {
        scored: metrics.goalsFor || 0,
        conceded: metrics.goalsAgainst || 0,
        difference: (metrics.goalsFor || 0) - (metrics.goalsAgainst || 0),
        averageScored: metrics.totalMatches > 0 ? (metrics.goalsFor / metrics.totalMatches).toFixed(2) : '0.00',
        averageConceded: metrics.totalMatches > 0 ? (metrics.goalsAgainst / metrics.totalMatches).toFixed(2) : '0.00'
      },
      squad: {
        totalPlayers: metrics.totalPlayers || 0,
        averageAge: metrics.averageAge || 0,
        topScorer: metrics.topScorer || null,
        topAssist: metrics.topAssist || null
      }
    }
  }, [baseAnalytics.metrics])

  return {
    ...baseAnalytics,
    processedMetrics
  }
}

// Hook para analytics de campeonatos
export const useChampionshipAnalytics = (championshipId) => {
  const baseAnalytics = useAnalytics('championship', championshipId)
  
  const processedMetrics = useMemo(() => {
    if (!baseAnalytics.metrics) return null

    const { metrics } = baseAnalytics
    return {
      overview: {
        totalTeams: metrics.totalTeams || 0,
        totalMatches: metrics.totalMatches || 0,
        matchesPlayed: metrics.matchesPlayed || 0,
        matchesRemaining: (metrics.totalMatches || 0) - (metrics.matchesPlayed || 0),
        completionPercentage: metrics.totalMatches > 0 ? ((metrics.matchesPlayed / metrics.totalMatches) * 100).toFixed(1) : '0.0'
      },
      participation: {
        totalGoals: metrics.totalGoals || 0,
        averageGoalsPerMatch: metrics.matchesPlayed > 0 ? (metrics.totalGoals / metrics.matchesPlayed).toFixed(2) : '0.00',
        topScorer: metrics.topScorer || null,
        topScoringTeam: metrics.topScoringTeam || null
      },
      engagement: {
        totalViews: metrics.totalViews || 0,
        averageViewsPerMatch: metrics.matchesPlayed > 0 ? Math.round(metrics.totalViews / metrics.matchesPlayed) : 0
      }
    }
  }, [baseAnalytics.metrics])

  return {
    ...baseAnalytics,
    processedMetrics
  }
}

// Componente de Dashboard de Analytics
export const AnalyticsDashboard = ({ 
  entityType, 
  entityId, 
  title = "Analytics Dashboard" 
}) => {
  const analytics = useAnalytics(entityType, entityId)
  const [selectedTab, setSelectedTab] = useState('overview')

  if (analytics.isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'trends', label: 'Tendências' },
    { id: 'comparison', label: 'Comparação' },
    { id: 'rankings', label: 'Rankings' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <DateRangePicker
            startDate={analytics.dateRange.start}
            endDate={analytics.dateRange.end}
            onStartDateChange={(date) => analytics.setDateRange(prev => ({ ...prev, start: date }))}
            onEndDateChange={(date) => analytics.setDateRange(prev => ({ ...prev, end: date }))}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {selectedTab === 'overview' && (
          <OverviewTab metrics={analytics.metrics} entityType={entityType} />
        )}
        {selectedTab === 'trends' && (
          <TrendsTab trends={analytics.trends} />
        )}
        {selectedTab === 'comparison' && (
          <ComparisonTab comparison={analytics.comparison} />
        )}
        {selectedTab === 'rankings' && (
          <RankingsTab rankings={analytics.rankings} entityType={entityType} />
        )}
      </div>
    </div>
  )
}

// Componente da aba Overview
const OverviewTab = ({ metrics, entityType }) => {
  if (!metrics) return <div>Carregando métricas...</div>

  const getMetricsCards = () => {
    switch (entityType) {
      case 'athlete':
        return [
          { title: 'Gols', value: metrics.totalGoals || 0, change: '+5%', changeType: 'positive' },
          { title: 'Assistências', value: metrics.totalAssists || 0, change: '+12%', changeType: 'positive' },
          { title: 'Jogos', value: metrics.totalMatches || 0, change: '+2%', changeType: 'positive' },
          { title: 'Média', value: (metrics.averageRating || 0).toFixed(1), change: '+0.3', changeType: 'positive' }
        ]
      case 'club':
        return [
          { title: 'Vitórias', value: metrics.wins || 0, change: '+15%', changeType: 'positive' },
          { title: 'Empates', value: metrics.draws || 0, change: '-5%', changeType: 'negative' },
          { title: 'Derrotas', value: metrics.losses || 0, change: '-10%', changeType: 'positive' },
          { title: 'Atletas', value: metrics.totalPlayers || 0, change: '+2', changeType: 'positive' }
        ]
      case 'championship':
        return [
          { title: 'Times', value: metrics.totalTeams || 0 },
          { title: 'Jogos', value: `${metrics.matchesPlayed || 0}/${metrics.totalMatches || 0}` },
          { title: 'Gols', value: metrics.totalGoals || 0, change: '+25%', changeType: 'positive' },
          { title: 'Média/Jogo', value: ((metrics.totalGoals || 0) / Math.max(metrics.matchesPlayed || 1, 1)).toFixed(1) }
        ]
      default:
        return []
    }
  }

  const metricsCards = getMetricsCards()

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => (
          <AdvancedStatsCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
          />
        ))}
      </div>

      {/* Additional Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance ao Longo do Tempo
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Gráfico de performance será exibido aqui</p>
              <p className="text-sm">(Integração com Recharts)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Distribuição por Categoria
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🥧</div>
              <p>Gráfico de pizza será exibido aqui</p>
              <p className="text-sm">(Integração com Recharts)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente da aba Trends
const TrendsTab = ({ trends }) => {
  if (!trends) return <div>Carregando tendências...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tendências de Performance
        </h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-xl mb-2">Gráfico de Tendências</p>
            <p>Visualização das tendências ao longo do tempo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente da aba Comparison
const ComparisonTab = ({ comparison }) => {
  if (!comparison) return <div>Carregando comparações...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Comparação com Período Anterior
        </h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl mb-2">Análise Comparativa</p>
            <p>Comparação entre períodos selecionados</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente da aba Rankings
const RankingsTab = ({ rankings, entityType }) => {
  if (!rankings) return <div>Carregando rankings...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Rankings e Posições
        </h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-xl mb-2">Tabela de Rankings</p>
            <p>Posicionamento comparativo</p>
          </div>
        </div>
      </div>
    </div>
  )
}