import { useAuth } from '../../context/AuthContext'

const OrganizationChampionships = () => {
  const { user } = useAuth()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meus Campeonatos</h1>
      <p>Campeonatos de {user.name}</p>
    </div>
  )
}

export default OrganizationChampionships