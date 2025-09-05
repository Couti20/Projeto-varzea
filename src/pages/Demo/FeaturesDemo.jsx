// src/pages/Demo/FeaturesDemo.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Users, 
  Bell,
  BarChart3,
  Download,
  Eye,
  Trophy,
  Building2,
  ArrowRight
} from 'lucide-react'
import { Card, Button } from '../../components/ui'

const FeaturesDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Funcionalidades Avançadas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra todas as novas funcionalidades implementadas no sistema de futebol de várzea
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Perfis Públicos */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Perfis Públicos
            </h3>
            <p className="text-gray-600 mb-6">
              Navegue pelos perfis de atletas e clubes com estatísticas detalhadas e filtros avançados.
            </p>
            <div className="space-y-3">
              <Link to="/athletes">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Atletas
                </Button>
              </Link>
              <Link to="/clubs">
                <Button variant="outline" className="w-full">
                  <Building2 className="w-4 h-4 mr-2" />
                  Ver Clubes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Geolocalização */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Geolocalização
            </h3>
            <p className="text-gray-600 mb-6">
              Encontre atletas, clubes e locais de jogo próximos à sua localização com mapas interativos.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Busca por proximidade
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Mapas interativos
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Locais de jogo
              </div>
            </div>
          </Card>

          {/* Notificações */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Bell className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Notificações
            </h3>
            <p className="text-gray-600 mb-6">
              Sistema avançado de notificações em tempo real com categorização e histórico completo.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Tempo real
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Categorizadas
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Push ready
              </div>
            </div>
          </Card>

          {/* Analytics */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics Avançado
            </h3>
            <p className="text-gray-600 mb-6">
              Análises detalhadas de performance com comparações temporais e rankings.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Métricas detalhadas
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Tendências temporais
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Rankings
              </div>
            </div>
          </Card>

          {/* Backup e Export */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Download className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Backup & Export
            </h3>
            <p className="text-gray-600 mb-6">
              Sistema completo de backup automático e exportação em múltiplos formatos.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Múltiplos formatos
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Backup automático
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Progress tracking
              </div>
            </div>
          </Card>

          {/* Campeonatos */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Campeonatos
            </h3>
            <p className="text-gray-600 mb-6">
              Visualização pública de todos os campeonatos com filtros e acompanhamento em tempo real.
            </p>
            <Link to="/championships">
              <Button className="w-full">
                Ver Campeonatos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Explore Todas as Funcionalidades
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Navegue pelo sistema e descubra como o futebol de várzea ficou mais moderno e conectado.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/athletes">
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Explorar Atletas
              </Button>
            </Link>
            <Link to="/clubs">
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Explorar Clubes
              </Button>
            </Link>
            <Link to="/championships">
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Ver Campeonatos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Funcionalidades Principais</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Responsivo</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
              <div className="text-gray-600">Atualizações</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">PWA</div>
              <div className="text-gray-600">Ready</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default FeaturesDemo