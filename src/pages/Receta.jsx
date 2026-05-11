import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiGetReceta } from '../services/api'
import { useAuth } from '../context/AuthContext'

const COLORES = ['#C8E6C0','#FFF9C4','#FFCCBC','#D1C4E9','#BBDEFB']
const EMOJIS = ['🍝','🥗','🍜','🥘','🍲','🥚','🥦','🍗']
function colorFor(s='') { return COLORES[s.length % COLORES.length] }
function emojiFor(r) {
  if (!r?.ingredientes?.length) return '🍽'
  const ing = r.ingredientes[0].toLowerCase()
  const map = {huevo:'🥚',pollo:'🍗',arroz:'🍚',pasta:'🍝',tomate:'🍅',brocoli:'🥦',carne:'🥩',papa:'🥔',zanahoria:'🥕'}
  for (const [k,v] of Object.entries(map)) if (ing.includes(k)) return v
  return EMOJIS[r.nombre?.length % EMOJIS.length] || '🍽'
}

export default function Receta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [receta, setReceta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [pasoActual, setPasoActual] = useState(0)
  const [ingChecked, setIngChecked] = useState([])
  const [segundos, setSegundos] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const [guardada, setGuardada] = useState(false)

  useEffect(() => {
    apiGetReceta(id, user?.id)
      .then(data => { setReceta(data); setSegundos((data.tiempo_preparacion || 30) * 60) })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  useEffect(() => {
    if (!corriendo) return
    const t = setInterval(() => setSegundos(s => { if(s<=0){setCorriendo(false);return 0} return s-1 }), 1000)
    return () => clearInterval(t)
  }, [corriendo])

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const toggleIng = i => setIngChecked(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i])

  if (cargando) return <div className="min-h-screen bg-crema"><Navbar/><div className="flex items-center justify-center h-96 text-gray-400">Cargando receta...</div></div>
  if (error || !receta) return <div className="min-h-screen bg-crema"><Navbar/><div className="flex flex-col items-center justify-center h-96 gap-4"><p className="text-gray-400">{error || 'Receta no encontrada'}</p><button onClick={() => navigate('/home')} className="text-verde text-sm hover:underline">← Volver al inicio</button></div></div>

  const pasos = receta.pasos?.length ? receta.pasos : ['Prepara todos los ingredientes.','Cocina siguiendo tu instinto.','¡Sirve y disfruta!']
  const ingredientes = receta.ingredientes || []

  return (
    <div className="min-h-screen bg-crema">
      <Navbar/>
      <div className="flex min-h-[calc(100vh-56px)]">
        <main className="flex-1 p-8 border-r border-gray-100">
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-verde-suave text-verde text-xs font-medium px-3 py-1.5 rounded-full">⏱ {receta.tiempo_preparacion} minutos</span>
            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">{receta.tipo}</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon mb-3 leading-tight">{receta.nombre}</h1>
          <div className="flex gap-5 mb-6 text-sm text-gray-400">
            <span>🧄 {ingredientes.length} ingredientes</span>
            {receta.autor_id?.nombre && <span>👤 {receta.autor_id.nombre}</span>}
            <button onClick={() => navigate(`/valoraciones/${receta._id}`)} className="hover:text-verde transition">⭐ Ver valoraciones</button>
          </div>
          <div className="w-full h-56 rounded-2xl flex items-center justify-center text-6xl mb-8 relative" style={{background: colorFor(receta.nombre)}}>
            {emojiFor(receta)}
            <div className="absolute bottom-3 right-3 bg-verde text-white text-xs font-medium px-3 py-1.5 rounded-lg">Tu receta de hoy</div>
          </div>
          <h2 className="text-lg font-bold text-carbon mb-5 pb-3 border-b border-gray-100">Paso a paso</h2>
          <div className="flex flex-col gap-4 mb-6">
            {pasos.map((paso, i) => {
              const hecho = i < pasoActual, actual = i === pasoActual
              return (
                <div key={i} onClick={() => setPasoActual(actual ? i+1 : i)} className="flex gap-4 items-start cursor-pointer">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition ${hecho?'bg-verde-suave text-verde':actual?'bg-naranja text-white':'bg-gray-100 text-gray-400'}`}>{hecho?'✓':i+1}</div>
                  <p className={`text-sm leading-relaxed transition ${hecho?'text-gray-300 line-through':actual?'text-carbon font-medium':'text-gray-400'}`}>{paso}</p>
                </div>
              )
            })}
          </div>
          <button onClick={() => navigate(`/valoraciones/${receta._id}`)} className="mt-4 bg-verde text-white rounded-xl px-8 py-3 text-sm font-semibold hover:bg-verde-claro transition">Terminar y valorar receta →</button>
        </main>

        <aside className="w-72 p-6 bg-white flex-shrink-0">
          <div className="bg-orange-50 border border-naranja/30 rounded-xl p-4 text-center mb-5">
            <p className="text-xs font-medium text-naranja mb-1">Tiempo restante</p>
            <p className="text-4xl font-bold text-carbon tracking-tight mb-3">{fmt(segundos)}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setCorriendo(!corriendo)} className="bg-naranja text-white rounded-lg px-4 py-1.5 text-xs font-semibold">{corriendo?'Pausar':'Iniciar'}</button>
              <button onClick={() => {setSegundos((receta.tiempo_preparacion||30)*60);setCorriendo(false)}} className="border border-gray-200 text-gray-400 rounded-lg px-3 py-1.5 text-xs">Reset</button>
            </div>
          </div>
          <h3 className="text-sm font-bold text-carbon mb-3">Ingredientes</h3>
          <div className="flex flex-col gap-2.5 mb-5">
            {ingredientes.map((ing, i) => (
              <div key={i} onClick={() => toggleIng(i)} className="flex items-center gap-3 cursor-pointer">
                <span className="text-xl">🥄</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${ingChecked.includes(i)?'line-through text-gray-300':'text-carbon'}`}>{ing}</p>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${ingChecked.includes(i)?'bg-verde border-verde':'border-gray-200'}`}>
                  {ingChecked.includes(i)&&<span className="text-white text-[9px] font-bold">✓</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progreso</span><span>{pasoActual}/{pasos.length} pasos</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-verde rounded-full transition-all" style={{width:`${(pasoActual/pasos.length)*100}%`}}/>
            </div>
          </div>
          <button onClick={() => setGuardada(!guardada)} className={`w-full rounded-xl py-3 text-sm font-semibold mb-2 transition ${guardada?'bg-verde-suave text-verde':'bg-verde text-white hover:bg-verde-claro'}`}>
            {guardada?'✓ Guardada':'Guardar receta'}
          </button>
          <button className="w-full border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition">Compartir</button>
        </aside>
      </div>
    </div>
  )
}
