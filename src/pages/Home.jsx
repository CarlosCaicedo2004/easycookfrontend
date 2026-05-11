import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiGetRecetas, apiBuscarPorTiempo, apiBuscarPorTipo } from '../services/api'

const COLORES = ['#C8E6C0','#FFF9C4','#FFCCBC','#D1C4E9','#BBDEFB','#F8BBD9','#B2DFDB']
const EMOJIS = ['🍝','🥗','🍜','🥘','🍲','🥙','🫔','🍛','🥚','🥦']
const filtros = ['Todas','Desayuno','Almuerzo','Cena','Snack','Postre']

function colorFor(i) { return COLORES[i % COLORES.length] }
function emojiFor(r) {
  if (!r.ingredientes?.length) return EMOJIS[0]
  const ing = r.ingredientes[0].toLowerCase()
  const map = { huevo:'🥚', pollo:'🍗', arroz:'🍚', pasta:'🍝', tomate:'🍅', brocoli:'🥦', carne:'🥩', pescado:'🐟', papa:'🥔', zanahoria:'🥕' }
  for (const [k, v] of Object.entries(map)) if (ing.includes(k)) return v
  return EMOJIS[r.nombre?.length % EMOJIS.length] || '🍽'
}

export default function Home() {
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [filtro, setFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargar() }, [filtro])

  const cargar = async () => {
    setCargando(true)
    try {
      let data
      if (filtro === 'Todas') data = await apiGetRecetas()
      else data = await apiBuscarPorTipo(filtro)
      setRecetas(Array.isArray(data) ? data : [])
    } catch { setRecetas([]) }
    finally { setCargando(false) }
  }

  const buscar = async () => {
    if (!busqueda.trim()) return cargar()
    setCargando(true)
    try {
      const data = await apiBuscarPorTiempo(busqueda) 
      setRecetas(Array.isArray(data) ? data : [])
    } catch { setRecetas([]) }
    finally { setCargando(false) }
  }

  const recetasDelDia = recetas.slice(0, 4)
  const populares = recetas.slice(4, 8)

  return (
    <div className="min-h-screen bg-crema">
      <Navbar />
      <div className="bg-verde px-12 py-10 flex items-center justify-between">
        <div>
          <p className="text-verde-claro text-sm mb-1">¡Hola! 👋</p>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">¿Qué cocinamos<br/>hoy?</h1>
          <div className="flex rounded-xl overflow-hidden w-[420px]">
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscar()} placeholder="Busca por nombre o ingrediente..." className="flex-1 px-5 py-3.5 text-sm text-carbon outline-none" />
            <button onClick={buscar} className="bg-naranja text-white px-5 text-sm font-semibold hover:bg-naranja/90 transition">Buscar</button>
          </div>
        </div>
        <div className="flex gap-4">
          {[['1,240','Recetas'],['4.8★','Promedio'],['15 min','Avg. tiempo']].map(([n,l]) => (
            <div key={l} className="bg-white/10 rounded-xl px-5 py-4 text-center">
              <div className="text-2xl font-bold text-white">{n}</div>
              <div className="text-verde-claro text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-12 py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          {filtros.map(f => (
            <button key={f} onClick={() => setFiltro(f)} className={`px-4 py-2 rounded-full border text-xs transition ${filtro === f ? 'bg-verde text-white border-verde font-medium' : 'bg-white border-gray-200 text-gray-500 hover:border-verde hover:text-verde'}`}>{f}</button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-carbon">Recetas {filtro !== 'Todas' ? `de ${filtro}` : 'del día'}</h2>
          <button onClick={() => navigate('/ingredientes')} className="text-sm text-verde font-medium hover:underline">Ver todas →</button>
        </div>

        {cargando ? (
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />)}
          </div>
        ) : recetasDelDia.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No hay recetas disponibles aún.</div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mb-10">
            {recetasDelDia.map((r, i) => (
              <div key={r._id} onClick={() => navigate(`/receta/${r._id}`)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="h-28 flex items-center justify-center text-4xl" style={{ background: colorFor(i) }}>{emojiFor(r)}</div>
                <div className="p-4">
                  <span className="inline-block bg-verde-suave text-verde text-[10px] font-medium px-2.5 py-1 rounded-full mb-2">{r.tiempo_preparacion} min</span>
                  <p className="text-sm font-semibold text-carbon leading-tight mb-2 line-clamp-2">{r.nombre}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{r.tipo}</span>
                    <span>{r.ingredientes?.length} ing.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {populares.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-carbon">Más recetas</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {populares.map((r, i) => (
                <div key={r._id} onClick={() => navigate(`/receta/${r._id}`)} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: colorFor(i+4) }}>{emojiFor(r)}</div>
                  <div>
                    <p className="text-sm font-semibold text-carbon mb-0.5 line-clamp-1">{r.nombre}</p>
                    <p className="text-xs text-gray-400">{r.tiempo_preparacion} min · {r.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div onClick={() => navigate('/agregar-receta')} className="mt-8 bg-verde-suave border border-verde/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-verde-menta transition">
          <div>
            <p className="font-semibold text-verde mb-1">¿Tienes una receta especial?</p>
            <p className="text-sm text-verde/70">Compártela con la comunidad y podría aparecer en EasyCook.</p>
          </div>
          <button className="bg-verde text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-verde-claro transition">Sugerir receta →</button>
        </div>
      </div>
    </div>
  )
}
