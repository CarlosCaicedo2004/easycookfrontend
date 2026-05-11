import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiCrearReceta } from '../services/api'
import { useAuth } from '../context/AuthContext'

const tipos = ['Desayuno','Almuerzo','Cena','Snack','Postre','Bebida']

export default function AgregarReceta() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ nombre:'', tipo:'Desayuno', tiempo_preparacion:'', descripcion:'', porciones:'' })
  const [ingredientes, setIngredientes] = useState(['',''])
  const [pasos, setPasos] = useState(['',''])
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const setF = (k,v) => setForm(f=>({...f,[k]:v}))
  const setIng = (i,v) => setIngredientes(p=>p.map((x,idx)=>idx===i?v:x))
  const setPaso = (i,v) => setPasos(p=>p.map((x,idx)=>idx===i?v:x))

  const enviar = async () => {
    if (!user) { navigate('/login'); return }
    if (!form.nombre || !form.tiempo_preparacion) { setError('Nombre y tiempo son obligatorios'); return }
    setEnviando(true)
    setError('')
    try {
      await apiCrearReceta({
        nombre: form.nombre,
        tipo: form.tipo,
        tiempo_preparacion: Number(form.tiempo_preparacion),
        ingredientes: ingredientes.filter(Boolean),
        pasos: pasos.filter(Boolean),
        descripcion: form.descripcion,
        porciones: Number(form.porciones) || 2,
      })
      setEnviado(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-crema"><Navbar/>
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-gray-400">Debes iniciar sesión para sugerir recetas.</p>
        <button onClick={() => navigate('/login')} className="bg-verde text-white rounded-xl px-6 py-3 text-sm font-semibold">Iniciar sesión</button>
      </div>
    </div>
  )

  if (enviado) return (
    <div className="min-h-screen bg-crema"><Navbar/>
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-carbon">¡Receta enviada!</h2>
        <p className="text-gray-400 text-sm text-center max-w-md">Tu sugerencia fue recibida. El equipo de EasyCook la revisará pronto.</p>
        <button onClick={() => navigate('/home')} className="bg-verde text-white rounded-xl px-8 py-3 text-sm font-semibold hover:bg-verde-claro transition mt-4">Volver al inicio</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-crema">
      <Navbar/>
      <div className="bg-verde px-12 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Comparte tu receta con la comunidad</h1>
          <p className="text-verde-claro text-sm">Nuestro equipo la revisará y, si es aprobada, aparecerá en EasyCook.</p>
        </div>
        <div className="bg-white/15 text-verde-menta text-xs font-medium px-4 py-2 rounded-full">⏳ Revisión pendiente</div>
      </div>

      <div className="flex min-h-[calc(100vh-180px)]">
        <main className="flex-1 p-8 border-r border-gray-100">
          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nombre de la receta <span className="text-naranja">*</span></label>
            <input value={form.nombre} onChange={e=>setF('nombre',e.target.value)} placeholder="Ej: Ajiaco bogotano" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition"/>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tiempo (minutos) <span className="text-naranja">*</span></label>
              <input type="number" value={form.tiempo_preparacion} onChange={e=>setF('tiempo_preparacion',e.target.value)} placeholder="Ej: 30" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Porciones</label>
              <input type="number" value={form.porciones} onChange={e=>setF('porciones',e.target.value)} placeholder="Ej: 4" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition"/>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tipo</label>
            <select value={form.tipo} onChange={e=>setF('tipo',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-verde transition">
              {tipos.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Descripción</label>
            <textarea value={form.descripcion} onChange={e=>setF('descripcion',e.target.value)} rows={2} placeholder="Describe brevemente tu receta..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-verde resize-none transition"/>
          </div>

          <div className="h-px bg-gray-100 my-6"/>

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-3 block">Ingredientes <span className="text-naranja">*</span></label>
            <div className="flex flex-col gap-2.5 mb-3">
              {ingredientes.map((ing,i) => (
                <div key={i} className="flex gap-2">
                  <input value={ing} onChange={e=>setIng(i,e.target.value)} placeholder={`Ingrediente ${i+1}`} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-verde transition"/>
                  <button onClick={() => setIngredientes(p=>p.filter((_,idx)=>idx!==i))} className="w-9 h-9 rounded-full border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setIngredientes(p=>[...p,''])} className="flex items-center gap-2 text-sm text-verde hover:text-verde-claro transition">
              <div className="w-6 h-6 rounded-full bg-verde-suave flex items-center justify-center text-verde font-bold">+</div>
              Agregar ingrediente
            </button>
          </div>

          <div className="h-px bg-gray-100 my-6"/>

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-500 mb-3 block">Pasos de preparación</label>
            <div className="flex flex-col gap-3 mb-3">
              {pasos.map((paso,i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-verde-suave text-verde flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-2">{i+1}</div>
                  <input value={paso} onChange={e=>setPaso(i,e.target.value)} placeholder={`Paso ${i+1}...`} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-verde transition"/>
                  <button onClick={() => setPasos(p=>p.filter((_,idx)=>idx!==i))} className="w-8 h-8 rounded-full border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition mt-1">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setPasos(p=>[...p,''])} className="flex items-center gap-2 text-sm text-verde hover:text-verde-claro transition">
              <div className="w-6 h-6 rounded-full bg-verde-suave flex items-center justify-center text-verde font-bold">+</div>
              Agregar paso
            </button>
          </div>
        </main>

        <aside className="w-72 bg-white p-6 flex-shrink-0">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">⏳ Pendiente de revisión</div>
          <p className="text-sm font-bold text-carbon mb-4">¿Cómo funciona?</p>
          <div className="bg-orange-50 border border-naranja/20 rounded-2xl p-4 mb-4">
            {[{l:'Envías la receta',done:true},{l:'Revisión del equipo',active:true},{l:'Aprobación',pending:true},{l:'¡La comunidad la disfruta!',pending:true}].map((s,i)=>(
              <div key={i}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${s.done?'bg-verde-suave text-verde':s.active?'bg-naranja-claro text-naranja border border-naranja':'bg-gray-100 text-gray-300'}`}>{s.done?'✓':i+1}</div>
                  <span className={`text-xs ${s.done?'text-verde font-medium':s.active?'text-carbon font-medium':'text-gray-300'}`}>{s.l}</span>
                </div>
                {i<3&&<div className="w-px h-3 bg-gray-200 ml-2.5 my-0.5"/>}
              </div>
            ))}
          </div>
          <div className="bg-verde-suave rounded-xl p-4 mb-3">
            <div className="text-lg mb-1">💡</div>
            <p className="text-xs text-verde leading-relaxed">Cuantos más detalles incluyas, más rápido será aprobada tu receta.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 mb-1">Sesión activa</p>
            <p className="text-sm font-medium text-carbon">{user?.nombre}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </aside>
      </div>

      <div className="bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between sticky bottom-0">
        <div className="text-xs text-gray-400">Los campos con <span className="text-naranja">*</span> son obligatorios</div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/home')} className="border border-gray-200 text-gray-500 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={enviar} disabled={!form.nombre||!form.tiempo_preparacion||enviando} className="bg-verde text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-verde-claro transition disabled:opacity-40">
            {enviando?'Enviando...':'Enviar sugerencia →'}
          </button>
        </div>
      </div>
    </div>
  )
}
