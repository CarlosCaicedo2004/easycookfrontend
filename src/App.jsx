import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Tiempo from './pages/Tiempo'
import Ingredientes from './pages/Ingredientes'
import Receta from './pages/Receta'
import Valoraciones from './pages/Valoraciones'
import AgregarReceta from './pages/AgregarReceta'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tiempo" element={<Tiempo />} />
      <Route path="/ingredientes" element={<Ingredientes />} />
      <Route path="/receta/:id" element={<Receta />} />
      <Route path="/valoraciones/:id" element={<Valoraciones />} />
      <Route path="/agregar-receta" element={<AgregarReceta />} />
    </Routes>
  )
}
