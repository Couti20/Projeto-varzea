// src/context/ChampionshipsContext.jsx
import React, { createContext, useContext, useState } from 'react'

const ChampionshipsContext = createContext()

export const useChampionships = () => {
  const context = useContext(ChampionshipsContext)
  if (!context) {
    throw new Error('useChampionships deve ser usado dentro de ChampionshipsProvider')
  }
  return context
}

export const ChampionshipsProvider = ({ children }) => {
  const [championships, setChampionships] = useState([
    {
      id: 1,
      name: "Copa Várzea 2024",
      description: "Campeonato de futebol amador da região metropolitana.",
      startDate: "2024-12-15",
      endDate: "2025-02-20",
      registrationDeadline: "2024-12-01",
      registrationFee: 15000,
      feeDeadline: "2024-12-10",
      format: "groups_knockout",
      location: "Campo Central do Bairro Vila Nova",
      organizerName: "Associação Esportiva Vila Nova",
      groups: [
        { id: 1, name: "Grupo A", teams: 4, classifyCount: 2 },
        { id: 2, name: "Grupo B", teams: 4, classifyCount: 2 }
      ],
      awards: {
        firstPlace: 300000,
        secondPlace: 150000,
        thirdPlace: 75000,
        total: 525000
      },
      rules: {
        general: [
          "Cada time deve ter no mínimo 11 jogadores e máximo 18 jogadores",
          "Todos os jogadores devem ser maiores de 18 anos"
        ],
        payment: [
          "Taxa de inscrição deve ser paga até a data limite",
          "Times inadimplentes não poderão participar"
        ]
      },
      status: "open", // open → inscrições, active → em andamento, completed → finalizado
      createdAt: "2024-11-01",
      organizerId: 1
    },
    {
      id: 2,
      name: "Torneio Relâmpago",
      description: "Competição rápida de fim de semana com formato eliminatório direto.",
      startDate: "2024-12-08",
      endDate: "2024-12-08",
      registrationDeadline: "2024-12-05",
      registrationFee: 8000,
      feeDeadline: "2024-12-06",
      format: "knockout_only",
      location: "Quadra Poliesportiva Central",
      organizerName: "Clube da Bola",
      groups: [],
      awards: {
        firstPlace: 50000,
        secondPlace: 20000,
        thirdPlace: 10000,
        total: 80000
      },
      status: "open",
      createdAt: "2024-11-15",
      organizerId: 1
    }
  ])

  const [nextId, setNextId] = useState(3)

  // CRUD
  const addChampionship = (championshipData) => {
    const newChampionship = {
      id: nextId,
      ...championshipData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft"
    }
    setChampionships(prev => [...prev, newChampionship])
    setNextId(prev => prev + 1)
    return newChampionship
  }

  const getChampionshipById = (id) =>
    championships.find(championship => championship.id === id)

  const updateChampionship = (id, updatedData) => {
    setChampionships(prev =>
      prev.map(championship =>
        championship.id === id
          ? { ...championship, ...updatedData, updatedAt: new Date().toISOString() }
          : championship
      )
    )
    return true
  }

  const deleteChampionship = (id) => {
    setChampionships(prev => prev.filter(c => c.id !== id))
    return true
  }

  // Confirmar início do campeonato (vai para "em andamento")
  const startChampionship = (id) => {
    updateChampionship(id, { status: "active" })
  }

  // Finalizar campeonato
  const completeChampionship = (id) => {
    updateChampionship(id, { status: "completed" })
  }

  // Filtros
  const getChampionshipsByStatus = (status) =>
    championships.filter(c => c.status === status)

  const value = {
    championships,
    addChampionship,
    getChampionshipById,
    updateChampionship,
    deleteChampionship,
    getChampionshipsByStatus,
    startChampionship,
    completeChampionship
  }

  return (
    <ChampionshipsContext.Provider value={value}>
      {children}
    </ChampionshipsContext.Provider>
  )
}
