import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiGetReceta, apiGetValoracionesPorReceta, apiCrearValoracion } from '../services/api'
import { useAuth } from '../context/AuthContext'

const COLORES = ['#C8E6C0','#FFF9C4','#FFCCBC','#D1C4E9','#BBDEFB']
function colorFor(s='') { return COLORES[s.length % COLORES.length] }

function Estrellas({ valor, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange&&onChange(i)} onMouseEnter={() => onChange&&setHover(i)} onMouseLeave={() => onChange&&setHover(0)} className={`text-2xl transition-transform ${onChange?'cursor-pointer hover:scale-110':'cursor-default'}`}>
          <span className={(hover||valor)>=i?'text-dorado':'text-gray-200'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function Valoraciones() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [receta, setReceta] = useState(null)
  const [valoraciones, setValoraciones] = useState([])
  const [miRating, setMiRating] = useState(0)
  const [miTexto, setMiTexto] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [miValoracion, setMiValoracion] = useState(null) // Detectar si ya valoró

  useEffect(() => {
    Promise.all([apiGetReceta(id), apiGetValoracionesPorReceta(id)])
      .then(([r, v]) => { 
        setReceta(r)
        const vals = Array.isArray(v) ? v : []
        setValoraciones(vals)
        
        // Detectar si el usuario actual ya tiene una valoración
        if (user) {
          const miVal = vals.find(val => val.usuario_id?._id === user.id || val.usuario_id === user.id)
          if (miVal) {
            setMiValoracion(miVal)
            setMiRating(miVal.puntuacion)
            setMiTexto(miVal.comentario)
          }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [id, user])

  const promedio = valoraciones.length ? (valoraciones.reduce((a,v)=>a+v.puntuacion,0)/valoraciones.length).toFixed(1) : '—'

  const enviarResena = async () => {
    if (!miRating || !miTexto.trim() || !user) return
    setEnviando(true)
    try {
      const nueva = await apiCrearValoracion(id, miRating, miTexto)
      
      if (miValoracion) {
        // Actualizar la valoración existente en la lista
        setValoraciones(prev => prev.map(v => v._id === nueva._id ? nueva : v))
      } else {
        // Agregar nueva valoración
        setValoraciones(prev => [nueva, ...prev])
      }
      
      setEnviado(true)
      setMiValoracion(nueva)
      setTimeout(() => setEnviado(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) return <div className="min-h-screen bg-crema"><Navbar/><div className="flex items-center justify-center h-96 text-gray-400">Cargando...</div></div>

  return (
    <div className="min-h-screen bg-crema">
      <Navbar/>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <button onClick={() => navigate('/home')} className="hover:text-verde">Inicio</button>
          <span>/</span>
          {receta && <button onClick={() => navigate(`/receta/${id}`)} className="hover:text-verde">{receta.nombre}</button>}
          <span>/</span>
          <span className="text-carbon">Valoraciones</span>
        </div>

        <h1 className="text-2xl font-bold text-carbon mb-8">Valoraciones y opiniones</h1>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex gap-10 mb-8">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <div className="text-6xl font-bold text-carbon leading-none mb-2">{promedio}</div>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(i=><span key={i} className={`text-xl ${i<=Math.round(promedio)?'text-dorado':'text-gray-200'}`}>★</span>)}
            </div>
            <div className="text-xs text-gray-400">{valoraciones.length} reseñas</div>
          </div>

          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[5,4,3,2,1].map(e => {
              const cnt = valoraciones.filter(v=>v.puntuacion===e).length
              return (
                <div key={e} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-7 text-right">{e}★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-dorado rounded-full" style={{width:`${valoraciones.length?(cnt/valoraciones.length)*100:0}%`}}/>
                  </div>
                  <span className="text-xs text-gray-300 w-6">{cnt}</span>
                </div>
              )
            })}
          </div>

          <div className="flex-1 border-l border-gray-100 pl-10">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <p className="text-sm text-gray-400 text-center">Inicia sesión para dejar tu reseña</p>
                <button onClick={() => navigate('/login')} className="bg-verde text-white rounded-xl px-5 py-2 text-sm font-medium">Iniciar sesión</button>
              </div>
            ) : enviado ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="text-4xl">🎉</div>
                <p className="font-semibold text-carbon">¡{miValoracion ? 'Reseña actualizada!' : 'Gracias por tu reseña!'}</p>
                <button onClick={() => { setEnviado(false); setMiRating(0); setMiTexto(''); setMiValoracion(null) }} className="text-sm text-verde font-medium hover:underline">Escribir otra reseña</button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-carbon mb-3">{miValoracion ? '✏️ Edita tu opinión' : 'Deja tu opinión'}</p>
                {miValoracion && <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg mb-3 inline-block">Ya valoraste esta receta</p>}
                <div className="mb-4">
                  <Estrellas valor={miRating} onChange={setMiRating}/>
                  {miRating>0&&<p className="text-xs text-gray-400 mt-1">{['','Muy mala','Mala','Regular','Buena','Excelente'][miRating]}</p>}
                </div>
                <textarea value={miTexto} onChange={e=>setMiTexto(e.target.value)} placeholder="Cuéntanos cómo te quedó la receta..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-carbon bg-gray-50 outline-none focus:border-verde resize-none transition"/>
                <button onClick={enviarResena} disabled={!miRating||!miTexto.trim()||enviando} className="mt-3 bg-verde text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-verde-claro transition disabled:opacity-40">
                  {enviando ? 'Enviando...' : miValoracion ? '✏️ Actualizar reseña' : 'Publicar reseña'}
                </button>
              </>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold text-carbon mb-4">Comentarios ({valoraciones.length})</h2>
        <div className="flex flex-col gap-4 mb-14">
          {valoraciones.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sé el primero en valorar esta receta.</p>
          ) : valoraciones.map((c, idx) => {
            const esElMio = user && (c.usuario_id?._id === user.id || c.usuario_id === user.id)
            return (
              <div key={c._id||idx} className={`rounded-2xl border p-6 transition ${esElMio ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:colorFor(c.usuario_id?.nombre||'')}}>
                    {(c.usuario_id?.nombre||'U').slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-carbon">{c.usuario_id?.nombre||'Usuario'}</p>
                      {esElMio && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Tu reseña</span>}
                    </div>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><span key={i} className={`text-sm ${i<=c.puntuacion?'text-dorado':'text-gray-200'}`}>★</span>)}</div>
                  </div>
                  <span className="text-xs text-gray-300">{new Date(c.createdAt||Date.now()).toLocaleDateString('es-CO')}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{c.comentario}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => navigate('/home')} className="border border-gray-200 text-gray-500 rounded-xl px-8 py-3 text-sm font-medium hover:bg-gray-50 transition">← Volver al inicio</button>
        </div>
      </div>
    </div>
  )
}
