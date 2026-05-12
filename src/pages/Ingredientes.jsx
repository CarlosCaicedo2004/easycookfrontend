import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiBuscarPorIngrediente } from '../services/api'

const ingredientesDisponibles = [
  {id:1,nombre:'Zanahoria',icono:'🥕',categoria:'Verduras'},{id:2,nombre:'Cebolla',icono:'🧅',categoria:'Verduras'},
  {id:3,nombre:'Papa',icono:'🥔',categoria:'Verduras'},{id:4,nombre:'Brócoli',icono:'🥦',categoria:'Verduras'},
  {id:5,nombre:'Tomate',icono:'🍅',categoria:'Verduras'},{id:6,nombre:'Maíz',icono:'🌽',categoria:'Verduras'},
  {id:7,nombre:'Ajo',icono:'🧄',categoria:'Verduras'},{id:8,nombre:'Pimentón',icono:'🫑',categoria:'Verduras'},
  {id:9,nombre:'Lechuga',icono:'🥬',categoria:'Verduras'},{id:10,nombre:'Berenjena',icono:'🍆',categoria:'Verduras'},
  {id:11,nombre:'Pollo',icono:'🍗',categoria:'Proteínas'},{id:12,nombre:'Huevo',icono:'🥚',categoria:'Proteínas'},
  {id:13,nombre:'Atún',icono:'🐟',categoria:'Proteínas'},{id:14,nombre:'Carne molida',icono:'🥩',categoria:'Proteínas'},
  {id:15,nombre:'Queso',icono:'🧀',categoria:'Lácteos'},{id:16,nombre:'Leche',icono:'🥛',categoria:'Lácteos'},
  {id:17,nombre:'Yogur',icono:'🫙',categoria:'Lácteos'},{id:18,nombre:'Arroz',icono:'🌾',categoria:'Granos'},
  {id:19,nombre:'Pasta',icono:'🍝',categoria:'Granos'},{id:20,nombre:'Lenteja',icono:'🫘',categoria:'Granos'},
  {id:21,nombre:'Limón',icono:'🍋',categoria:'Frutas'},{id:22,nombre:'Aguacate',icono:'🥑',categoria:'Frutas'},
]
const categorias = ['Verduras','Proteínas','Lácteos','Granos','Frutas']
const catIconos = {Verduras:'🥦',Proteínas:'🍗',Lácteos:'🧀',Granos:'🌾',Frutas:'🍋'}
const COLORES = ['#C8E6C0','#FFF9C4','#FFCCBC','#D1C4E9','#BBDEFB','#F8BBD9','#B2DFDB']

function colorFor(i) { return COLORES[i % COLORES.length] }

export default function Ingredientes() {
  const [seleccionados, setSeleccionados] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Verduras')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(false)
  const [recetasResultado, setRecetasResultado] = useState([])
  const [mostrandoResultados, setMostrandoResultados] = useState(false)
  const navigate = useNavigate()

  const toggle = id => setSeleccionados(p => p.includes(id)?p.filter(i=>i!==id):[...p,id])
  const filtrados = ingredientesDisponibles.filter(i=>i.categoria===categoriaActiva&&i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  const nombresSeleccionados = ingredientesDisponibles.filter(i=>seleccionados.includes(i.id))

  const buscarRecetas = async () => {
    if (seleccionados.length === 0) return
    setCargando(true)
    try {
      const ingredientesNombres = nombresSeleccionados.map(ing => ing.nombre.toLowerCase())
      const recetas = await apiBuscarPorIngrediente(ingredientesNombres)
      setRecetasResultado(Array.isArray(recetas) ? recetas : [])
      setMostrandoResultados(true)
    } catch { alert('Error al buscar recetas. Verifica que el backend esté corriendo.') }
    finally { setCargando(false) }
  }

  return (
    <div className="min-h-screen bg-crema flex flex-col">
      <Navbar/>
      <div className="flex flex-1">
        <aside className="w-52 bg-white border-r border-gray-100 p-5 flex-shrink-0">
          <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-4">Categorías</p>
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition ${categoriaActiva===cat?'bg-verde-suave text-verde font-medium':'text-gray-500 hover:bg-gray-50'}`}>
              <span>{catIconos[cat]}</span>{cat}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-carbon">¿Qué tienes en casa?</h1>
            <input placeholder="Buscar ingrediente..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-verde w-52 bg-white"/>
          </div>
          <p className="text-gray-400 text-sm mb-6">Selecciona los ingredientes que tienes disponibles.</p>
          <div className="grid grid-cols-5 gap-3">
            {filtrados.map(ing => {
              const sel = seleccionados.includes(ing.id)
              return (
                <button key={ing.id} onClick={() => toggle(ing.id)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${sel?'border-verde bg-verde-suave':'border-gray-200 bg-white hover:border-verde/40'}`}>
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">{ing.icono}</div>
                  <span className={`text-xs text-center leading-tight ${sel?'text-verde font-medium':'text-gray-500'}`}>{ing.nombre}</span>
                  {sel&&<div className="w-4 h-4 rounded-full bg-verde flex items-center justify-center"><span className="text-white text-[9px] font-bold">✓</span></div>}
                </button>
              )
            })}
          </div>
        </main>
      </div>
      <div className="bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-400">Seleccionados:</span>
          {nombresSeleccionados.length===0?<span className="text-sm text-gray-300 italic">Ninguno aún</span>:
            nombresSeleccionados.map(n=><span key={n.id} className="bg-verde-suave text-verde text-xs font-medium px-3 py-1.5 rounded-full">{n.nombre}</span>)}
        </div>
        <button onClick={buscarRecetas} disabled={seleccionados.length===0||cargando} className="bg-verde text-white rounded-xl px-7 py-3 text-sm font-semibold hover:bg-verde-claro transition disabled:opacity-40">
          {cargando?'Buscando...':'Encontrar recetas →'}
        </button>
      </div>

      {mostrandoResultados && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-carbon">Recetas encontradas ({recetasResultado.length})</h2>
              <button onClick={() => setMostrandoResultados(false)} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">×</button>
            </div>
            
            {cargando ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Buscando...</p>
              </div>
            ) : recetasResultado.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No encontramos recetas con esos ingredientes. ¡Prueba otros!</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {recetasResultado.map((r, i) => (
                  <button key={r._id} onClick={() => { navigate(`/receta/${r._id}`); setMostrandoResultados(false); }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all text-left">
                    <div className="h-28 flex items-center justify-center text-5xl" style={{background: colorFor(i)}}>🍽</div>
                    <div className="p-4">
                      <h3 className="font-semibold text-carbon text-sm mb-2 line-clamp-2">{r.nombre}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">{r.tipo}</span>
                        <span className="bg-verde-suave text-verde text-[10px] font-medium px-2.5 py-1 rounded-full">⏱ {r.tiempo_preparacion} min</span>
                      </div>
                      <p className="text-xs text-gray-400">{r.ingredientes?.length || 0} ingredientes</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
