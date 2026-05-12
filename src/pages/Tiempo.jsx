import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiBuscarPorTiempo } from '../services/api'

const opciones = [10, 15, 30, 45, 60, 90]

export default function Tiempo() {
  const [minutos, setMinutos] = useState(30)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const porcentaje = Math.round((minutos / 90) * 100)
  const circunferencia = 2 * Math.PI * 80
  const offset = circunferencia - (porcentaje / 100) * circunferencia

  const buscarRecetas = async () => {
    setCargando(true)
    try {
      const recetas = await apiBuscarPorTiempo(minutos)
      if (recetas.length > 0) {
        navigate(`/receta/${recetas[0]._id}`)
      } else {
        alert('No encontramos recetas para ese tiempo. ¡Prueba con más minutos!')
      }
    } catch (err) {
      alert('Error al buscar recetas. Verifica que el backend esté corriendo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-crema">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-carbon mb-2 text-center">
          ¿Cuánto tiempo tienes para cocinar?
        </h1>
        <p className="text-gray-400 text-sm text-center mb-12">
          Te mostraremos recetas que puedes preparar en ese tiempo o menos.
        </p>

        {/* Cronómetro SVG */}
        <div className="relative w-52 h-52 mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="none" stroke="#E0DDD8" strokeWidth="8" />
            <circle
              cx="90" cy="90" r="80"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-carbon leading-none tracking-tight">
              {minutos}
            </span>
            <span className="text-sm text-gray-400 mt-1">minutos</span>
          </div>
        </div>

        {/* Chips rápidos */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => setMinutos(op)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition ${
                minutos === op
                  ? 'bg-verde text-white border-verde'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-verde hover:text-verde'
              }`}
            >
              {op < 60 ? `${op} min` : op === 60 ? '1 hora' : '+1 hora'}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="w-full max-w-md mb-10">
          <input
            type="range"
            min={5}
            max={90}
            step={5}
            value={minutos}
            onChange={(e) => setMinutos(Number(e.target.value))}
            className="w-full accent-verde h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-2">
            <span>5 min</span>
            <span>45 min</span>
            <span>90 min</span>
          </div>
        </div>

        <button
          onClick={buscarRecetas}
          disabled={cargando}
          className="bg-verde text-white rounded-xl px-14 py-4 text-sm font-semibold hover:bg-verde-claro transition disabled:opacity-60"
        >
          {cargando ? 'Buscando...' : 'Continuar →'}
        </button>

        <p className="text-xs text-gray-300 mt-5">
          Puedes cambiar el tiempo más adelante
        </p>
      </div>
    </div>
  )
}
