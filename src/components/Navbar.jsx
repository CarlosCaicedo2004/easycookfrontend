import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiLogout } from '../services/api'

const links = [
  {label:'Inicio',to:'/home'},
  {label:'Mis recetas',to:'/agregar-receta'},
  {label:'Historial',to:'/history'}
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await apiLogout(user?.id) } catch {}
    logout()
    navigate('/login')
  }

  const initials = user?.nombre?.slice(0,2).toUpperCase() || 'EC'

  return (
    <nav className="bg-white border-b border-gray-100 px-10 flex items-center justify-between h-14 sticky top-0 z-50">
      <Link to="/home" className="text-lg font-bold text-verde tracking-tight">🌿 EasyCook</Link>
      <div className="flex gap-7">
        {links.map(l => (
          <Link key={l.to+l.label} to={l.to} className={`text-sm transition-colors ${pathname===l.to?'text-verde font-semibold border-b-2 border-verde pb-0.5':'text-gray-400 hover:text-verde'}`}>{l.label}</Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="text-xs text-gray-400 hidden lg:block">{user.nombre}</span>}
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center text-white text-xs font-semibold cursor-pointer">{initials}</div>
          <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg py-2 w-36 hidden group-hover:block z-50">
            {user?.role==='admin'&&<div className="px-4 py-1.5 text-xs text-naranja font-medium">👑 Admin</div>}
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-400 transition">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
