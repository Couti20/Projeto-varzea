import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚽</span>
              <span className="text-xl font-bold text-primary-600">
                Futebol de Várzea
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Futebol de <span className="text-primary-600">Várzea</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A plataforma completa para organizar campeonatos, gerenciar times e 
            acompanhar estatísticas do futebol de várzea.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Agora
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que você precisa para organizar seu futebol
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão de Times
              </h3>
              <p className="text-gray-600">
                Gerencie seu elenco, envie convites para atletas e 
                mantenha tudo organizado em um só lugar.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campeonatos
              </h3>
              <p className="text-gray-600">
                Crie campeonatos, gere tabelas automaticamente e 
                acompanhe classificações em tempo real.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Estatísticas
              </h3>
              <p className="text-gray-600">
                Rankings de artilheiros, estatísticas de times e 
                histórico completo de todos os jogos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Para todos os tipos de usuário
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atletas</h3>
              <p className="text-gray-600">
                Receba convites de clubes, gerencie seu perfil e 
                acompanhe suas estatísticas pessoais.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏟️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clubes</h3>
              <p className="text-gray-600">
                Monte seu time, convide atletas e participe de 
                campeonatos organizados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Organizações</h3>
              <p className="text-gray-600">
                Organize campeonatos, gerencie inscrições e 
                acompanhe resultados em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se à comunidade do futebol de várzea e organize seus campeonatos hoje mesmo!
          </p>
          
          <Link to="/register">
            <Button size="lg">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">⚽</span>
              <span className="text-xl font-bold">Futebol de Várzea</span>
            </div>
            <p className="text-gray-400">
              A plataforma completa para o futebol de várzea brasileiro.
            </p>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
              <p>&copy; 2025 Futebol de Várzea. Feito com ❤️ para a comunidade.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home