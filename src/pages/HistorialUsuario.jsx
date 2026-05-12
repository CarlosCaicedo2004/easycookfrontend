import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetHistorial } from '../services/api'
import Navbar from '../components/Navbar'

export default function HistorialUsuario() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchHistorial = async () => {
      try {
        const data = await apiGetHistorial(user.id)
        setHistorial(data)
      } catch (err) {
        setError('Error al cargar el historial')
      } finally {
        setLoading(false)
      }
    }

    fetchHistorial()
  }, [user, navigate])

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="flex justify-center items-center h-64">Cargando...</div></div>

  if (error) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="flex justify-center items-center h-64 text-red-500">{error}</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Historial de Recetas</h1>
        {historial.length === 0 ? (
          <p className="text-gray-500">No has visto ninguna receta aún.</p>
        ) : (
          <div className="space-y-4">
            {historial.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div>
                  <Link to={`/receta/${item.receta._id}`} className="text-lg font-semibold text-verde hover:underline">
                    {item.receta.nombre}
                  </Link>
                  <p className="text-sm text-gray-500">Visto el {new Date(item.fecha_vista).toLocaleDateString()}{item.autor ? ` por ${item.autor.nombre}` : ''}</p>
                </div>
                <Link to={`/receta/${item.receta._id}`} className="text-verde hover:text-verde-dark font-medium">
                  Ver receta →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}