// src/services/discoveryService.js - SERVIÇO COMPLETO

// Dados mock para demonstração - substitua por API real
const mockAthletes = [
  {
    id: 1,
    name: "Pedro Santos",
    position: "Meio-campo",
    age: 25,
    location: { lat: -23.5505, lng: -46.6333 },
    distance: 2.5,
    club: { id: 1, name: "Corinthians Várzea" },
    profileImage: "/api/placeholder/60/60",
    status: "free",
    type: "athlete"
  },
  {
    id: 2,
    name: "Carlos Lima",
    position: "Atacante", 
    age: 28,
    location: { lat: -23.5489, lng: -46.6388 },
    distance: 1.8,
    club: { id: 2, name: "Palmeiras FC" },
    profileImage: "/api/placeholder/60/60",
    status: "active",
    type: "athlete"
  },
  {
    id: 3,
    name: "João Silva",
    position: "Zagueiro",
    age: 30,
    location: { lat: -23.5525, lng: -46.6417 },
    distance: 3.2,
    club: null,
    profileImage: "/api/placeholder/60/60",
    status: "free",
    type: "athlete"
  },
  {
    id: 4,
    name: "Rafael Costa",
    position: "Goleiro",
    age: 26,
    location: { lat: -23.5530, lng: -46.6350 },
    distance: 1.2,
    club: { id: 3, name: "Santos Amador" },
    profileImage: "/api/placeholder/60/60",
    status: "active",
    type: "athlete"
  },
  {
    id: 5,
    name: "Lucas Ferreira",
    position: "Lateral",
    age: 24,
    location: { lat: -23.5480, lng: -46.6400 },
    distance: 4.1,
    club: null,
    profileImage: "/api/placeholder/60/60",
    status: "free",
    type: "athlete"
  }
];

const mockTeams = [
  {
    id: 1,
    name: "Flamengo Várzea",
    location: { lat: -23.5505, lng: -46.6333 },
    distance: 1.5,
    activeMembers: 18,
    recruiting: true,
    description: "Time competitivo da região central",
    founded: "2020",
    achievements: ["Campeão Municipal 2023"],
    logo: "/api/placeholder/60/60",
    type: "club"
  },
  {
    id: 2,
    name: "Unidos da Vila",
    location: { lat: -23.5489, lng: -46.6388 },
    distance: 2.8,
    activeMembers: 22,
    recruiting: false,
    description: "Time tradicional do bairro",
    founded: "2018",
    achievements: ["Vice-campeão Regional 2024"],
    logo: "/api/placeholder/60/60",
    type: "club"
  },
  {
    id: 3,
    name: "Estrela do Norte",
    location: { lat: -23.5525, lng: -46.6417 },
    distance: 4.1,
    activeMembers: 15,
    recruiting: true,
    description: "Foco no desenvolvimento de jovens talentos",
    founded: "2019",
    achievements: ["3º lugar Copa Amadora 2023"],
    logo: "/api/placeholder/60/60",
    type: "club"
  },
  {
    id: 4,
    name: "Tigres FC",
    location: { lat: -23.5550, lng: -46.6300 },
    distance: 3.7,
    activeMembers: 20,
    recruiting: true,
    description: "Time com tradição na região metropolitana",
    founded: "2017",
    achievements: ["Campeão da Liga Local 2022", "Finalista Copa Regional 2023"],
    logo: "/api/placeholder/60/60",
    type: "club"
  }
];

// Função para calcular distância entre coordenadas
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Função para formatar distância
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

export const discoveryService = {
  // Buscar atletas e times próximos por geolocalização
  searchNearby: async ({ latitude, longitude, radius = 10 }) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Calcular distâncias e filtrar por raio
      const nearbyAthletes = mockAthletes
        .map(athlete => ({
          ...athlete,
          distance: calculateDistance(latitude, longitude, athlete.location.lat, athlete.location.lng)
        }))
        .filter(athlete => athlete.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .map(athlete => ({
          ...athlete,
          distance: formatDistance(athlete.distance)
        }));

      const nearbyTeams = mockTeams
        .map(team => ({
          ...team,
          distance: calculateDistance(latitude, longitude, team.location.lat, team.location.lng)
        }))
        .filter(team => team.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .map(team => ({
          ...team,
          distance: formatDistance(team.distance)
        }));

      return {
        athletes: nearbyAthletes,
        teams: nearbyTeams
      };
    } catch (error) {
      console.error('Erro na busca por localização:', error);
      throw new Error('Erro ao buscar atletas e times próximos');
    }
  },

  // Buscar atletas com filtros avançados
  searchAthletes: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let results = [...mockAthletes];

      // Filtrar por nome
      if (filters.name) {
        results = results.filter(athlete => 
          athlete.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filtrar por posição
      if (filters.position) {
        results = results.filter(athlete => 
          athlete.position.toLowerCase().includes(filters.position.toLowerCase())
        );
      }

      // Filtrar por status
      if (filters.status) {
        results = results.filter(athlete => athlete.status === filters.status);
      }

      // Filtrar por idade
      if (filters.minAge) {
        results = results.filter(athlete => athlete.age >= parseInt(filters.minAge));
      }
      if (filters.maxAge) {
        results = results.filter(athlete => athlete.age <= parseInt(filters.maxAge));
      }

      return results;
    } catch (error) {
      console.error('Erro na busca de atletas:', error);
      throw new Error('Erro ao buscar atletas');
    }
  },

  // Buscar times com filtros
  searchTeams: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let results = [...mockTeams];

      // Filtrar por nome
      if (filters.name) {
        results = results.filter(team => 
          team.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filtrar apenas times recrutando
      if (filters.recruiting) {
        results = results.filter(team => team.recruiting);
      }

      // Filtrar por número mínimo de membros
      if (filters.minMembers) {
        results = results.filter(team => team.activeMembers >= parseInt(filters.minMembers));
      }

      return results;
    } catch (error) {
      console.error('Erro na busca de times:', error);
      throw new Error('Erro ao buscar times');
    }
  },

  // Obter detalhes completos de um atleta
  getAthleteDetails: async (athleteId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const athlete = mockAthletes.find(a => a.id === parseInt(athleteId));
      if (!athlete) throw new Error('Atleta não encontrado');
      
      return {
        ...athlete,
        stats: {
          gamesPlayed: Math.floor(Math.random() * 50) + 10,
          goals: Math.floor(Math.random() * 20) + 1,
          assists: Math.floor(Math.random() * 15) + 1,
          yellowCards: Math.floor(Math.random() * 5),
          redCards: Math.floor(Math.random() * 2)
        },
        recentActivity: [
          athlete.club ? `Último jogo pelo ${athlete.club.name}` : "Atleta livre buscando oportunidades",
          "Participou do treino na última semana",
          "Avaliado como destaque na posição",
          "Disponível para testes e entrevistas"
        ],
        contactInfo: {
          whatsapp: "(11) 99999-0000",
          email: `${athlete.name.toLowerCase().replace(' ', '.')}@email.com`
        }
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do atleta:', error);
      throw new Error('Erro ao carregar detalhes do atleta');
    }
  },

  // Obter detalhes completos de um time
  getTeamDetails: async (teamId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const team = mockTeams.find(t => t.id === parseInt(teamId));
      if (!team) throw new Error('Time não encontrado');
      
      // Simular jogadores do time
      const teamPlayers = mockAthletes
        .filter(a => a.club?.id === team.id)
        .slice(0, 8);
      
      return {
        ...team,
        players: teamPlayers,
        stats: {
          wins: Math.floor(Math.random() * 20) + 5,
          draws: Math.floor(Math.random() * 10) + 2,
          losses: Math.floor(Math.random() * 15) + 3,
          goalsFor: Math.floor(Math.random() * 50) + 20,
          goalsAgainst: Math.floor(Math.random() * 40) + 15
        },
        recentMatches: [
          { opponent: "Palmeiras FC", result: "2-1", date: "15/01/2025", venue: "Campo Central" },
          { opponent: "São Paulo Várzea", result: "0-0", date: "08/01/2025", venue: "Campo do Bairro" },
          { opponent: "Santos Amador", result: "3-2", date: "01/01/2025", venue: "Estádio Municipal" }
        ],
        trainingSchedule: {
          days: ["Terça", "Quinta", "Sábado"],
          time: "19:00",
          location: "Campo de Treinamento"
        },
        contactInfo: {
          phone: "(11) 98888-0000",
          email: `contato@${team.name.toLowerCase().replace(' ', '')}.com`,
          address: "Região Central - São Paulo, SP"
        }
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do time:', error);
      throw new Error('Erro ao carregar detalhes do time');
    }
  },

  // Enviar mensagem para atleta ou time (simulado)
  sendMessage: async (recipientId, recipientType, message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Simular envio de mensagem
      return {
        success: true,
        messageId: Date.now(),
        sentAt: new Date().toISOString(),
        message: `Mensagem enviada para ${recipientType}: ${message}`
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Erro ao enviar mensagem');
    }
  },

  // Enviar convite para atleta (simulado)
  sendInvite: async (athleteId, teamId, message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const athlete = mockAthletes.find(a => a.id === parseInt(athleteId));
      const team = mockTeams.find(t => t.id === parseInt(teamId));
      
      if (!athlete || !team) {
        throw new Error('Atleta ou time não encontrado');
      }
      
      return {
        success: true,
        inviteId: Date.now(),
        sentAt: new Date().toISOString(),
        message: `Convite enviado para ${athlete.name} do time ${team.name}`
      };
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      throw new Error('Erro ao enviar convite');
    }
  }
};