import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiLogin, apiRegistrar } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      if (modo === 'login') {
        const data = await apiLogin(form.email, form.password)
        login(data.user, data.token, data.refreshToken)
        navigate('/home')
      } else {
        await apiRegistrar(form.nombre, form.email, form.password)
        setModo('login')
        setError('✅ Cuenta creada. Ahora inicia sesión.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-center px-16 bg-verde flex-1">
        <div className="text-4xl mb-3">🌿</div>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">EasyCook</h1>
        <p className="text-verde-claro text-lg leading-relaxed max-w-sm mb-12">
          Recetas deliciosas adaptadas a tu tiempo y a lo que tienes en casa.
        </p>
        <div className="bg-verde-claro/20 rounded-2xl p-5 max-w-sm">
          <div className="text-3xl mb-2">⏱</div>
          <p className="text-verde-menta text-sm leading-relaxed">
            Selecciona ingredientes, elige tu tiempo disponible y cocina algo increíble en minutos.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-10 lg:px-16 bg-white w-full lg:w-[420px] lg:flex-none">
        <div className="lg:hidden text-center mb-8">
          <div className="text-4xl mb-1">🌿</div>
          <h1 className="text-3xl font-bold text-verde">EasyCook</h1>
        </div>
        <h2 className="text-2xl font-bold text-carbon mb-1">
          {modo === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {modo === 'login' ? 'Ingresa a tu cuenta para continuar' : 'Regístrate gratis en EasyCook'}
        </p>
        {error && (
          <div className={`text-xs px-4 py-3 rounded-xl mb-4 ${error.startsWith('✅') ? 'bg-verde-suave text-verde' : 'bg-red-50 text-red-500'}`}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modo === 'registro' && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Nombre</label>
              <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Correo electrónico</label>
            <input type="email" placeholder="tucorreo@email.com" value={form.email} onChange={e => set('email', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Contraseña</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-verde focus:ring-2 focus:ring-verde/10 transition" />
          </div>
          {modo === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-verde font-medium hover:underline">¿Olvidaste tu contraseña?</button>
            </div>
          )}
          <button type="submit" disabled={cargando} className="w-full bg-verde text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-verde-claro transition disabled:opacity-60">
            {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-6">
          {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError('') }} className="text-verde font-medium hover:underline">
            {modo === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
