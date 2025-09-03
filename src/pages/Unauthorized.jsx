const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
      <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
    </div>
  )
}
export default Unauthorized
